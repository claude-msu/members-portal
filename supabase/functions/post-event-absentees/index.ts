import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================================================
// ENV
// ============================================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN')!

// Channel name to post reports to (no # prefix).
// Override via: supabase secrets set SLACK_ADMIN_CHANNEL_NAME=your-channel
const SLACK_ADMIN_CHANNEL_NAME = Deno.env.get('SLACK_ADMIN_CHANNEL_NAME') ?? 'admin-board'

// Same timestamp format as process-start-automation (Postgres-friendly).
function toPgTimestamp(d: Date): string {
    return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '+00')
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================================================
// TYPES
// ============================================================================

interface Absentee {
    user_id: string
    full_name: string
    email: string
    slack_user_id: string | null
}

interface EventRow {
    id: string
    name: string
    event_date: string
    rsvp_required: boolean
    allowed_roles: string[]
}

// ============================================================================
// SLACK — CHANNEL LOOKUP
// Looks up channel ID by name at runtime. No stored ID needed — survives
// channel deletion/recreation. Hard failure if not found.
// ============================================================================

async function lookupChannelIdByName(name: string): Promise<string> {
    const normalized = name.replace(/^#/, '').toLowerCase()

    // Try public channels first, then private
    for (const types of ['public_channel', 'private_channel']) {
        let cursor: string | undefined

        do {
            const params = new URLSearchParams({ types, limit: '200', exclude_archived: 'true' })
            if (cursor) params.set('cursor', cursor)

            const res = await fetch(`https://slack.com/api/conversations.list?${params}`, {
                headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
            })
            const data = await res.json()

            if (!data.ok) {
                if (data.error === 'missing_scope') {
                    throw new Error(`Slack bot missing scope for conversations.list (${types}): add channels:read and/or groups:read`)
                }
                console.warn(`conversations.list failed (${types}): ${data.error}`)
                break
            }

            const match = data.channels?.find((c) => c.name === normalized)
            if (match) return match.id

            cursor = data.response_metadata?.next_cursor
        } while (cursor)
    }

    throw new Error(
        `Slack channel "#${normalized}" not found. ` +
        `Ensure the bot is a member of that channel and has channels:read / groups:read scopes.`
    )
}

// ============================================================================
// SLACK — MESSAGING
// Hard failure: throws if Slack rejects the post.
// ============================================================================

async function postSlackMessage(channelId: string, text: string, blocks?: object[]): Promise<void> {
    const body: Record<string, unknown> = { channel: channelId, text }
    if (blocks) body.blocks = blocks

    const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!data.ok) throw new Error(`Slack chat.postMessage failed: ${data.error}`)
}

// ============================================================================
// SLACK — USER LOOKUP & PROFILE SAVE
// Same pattern as process-start-automation: lookup by email, then persist to profiles.
// ============================================================================

async function lookupSlackUserId(email: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(email)}`,
            { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
        )
        const data = await res.json()
        if (data.ok && data.user?.id) return data.user.id
    } catch (e) {
        console.warn(`Slack lookup failed for ${email}:`, e)
    }
    return null
}

async function saveSlackUserId(
    supabase: ReturnType<typeof createClient>,
    email: string,
    slackUserId: string
): Promise<void> {
    try {
        await supabase
            .from('profiles')
            .update({ slack_user_id: slackUserId })
            .eq('email', email)
            .is('slack_user_id', null)
    } catch (e) {
        console.warn(`Failed to save Slack ID for ${email}:`, e)
    }
}

/** Fills in slack_user_id for absentees who don't have it: lookup by email and save to profiles. */
async function enrichAbsenteesWithSlackIds(
    supabase: ReturnType<typeof createClient>,
    absentees: Absentee[]
): Promise<Absentee[]> {
    const enriched: Absentee[] = []
    for (const a of absentees) {
        if (a.slack_user_id) {
            enriched.push(a)
            continue
        }
        if (!a.email) {
            enriched.push(a)
            continue
        }
        const slackId = await lookupSlackUserId(a.email)
        if (slackId) {
            await saveSlackUserId(supabase, a.email, slackId)
            enriched.push({ ...a, slack_user_id: slackId })
        } else {
            enriched.push(a)
        }
    }
    return enriched
}

// ============================================================================
// SLACK — MENTION FORMATTING
// <@USLACKID> is clickable in any channel even without membership.
// Falls back to name + email for users who haven't linked Slack.
// ============================================================================

function formatMention(a: Absentee): string {
    return a.slack_user_id
        ? `<@${a.slack_user_id}>`
        : `*${a.full_name}* (${a.email} — no Slack linked)`
}

// ============================================================================
// EVENT TIME WINDOW
// We only care about events in the last 24 hours (event_date between now-24h and now).
// ============================================================================

function getLast24HoursRange(): { rangeStart: string; rangeEnd: string } {
    const now = new Date()
    const rangeStart = toPgTimestamp(new Date(now.getTime() - 24 * 60 * 60 * 1000))
    const rangeEnd = toPgTimestamp(now)
    return { rangeStart, rangeEnd }
}

// ============================================================================
// ABSENTEE QUERIES
// Both throw on DB errors — callers decide hard vs soft based on context.
// ============================================================================

async function getRsvpAbsentees(
    supabase: ReturnType<typeof createClient>,
    eventId: string
): Promise<Absentee[]> {
    const { data, error } = await supabase
        .from('event_attendance')
        .select('user_id, profiles!inner(full_name, email, slack_user_id)')
        .eq('event_id', eventId)
        .not('rsvped_at', 'is', null)
        .is('attended_at', null)

    if (error) throw new Error(`RSVP absentee query failed: ${error.message}`)

    return (data ?? []).map((row) => ({
        user_id: row.user_id,
        full_name: row.profiles.full_name,
        email: row.profiles.email,
        slack_user_id: row.profiles.slack_user_id,
    }))
}

async function getGeneralAbsentees(
    supabase: ReturnType<typeof createClient>,
    eventId: string,
    allowedRoles: string[]
): Promise<Absentee[]> {
    // user_roles.user_id references auth.users, not profiles — no direct FK, so two queries.
    const { data: eligibleRows, error: eligibleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', allowedRoles)

    if (eligibleError) throw new Error(`Eligible users query failed: ${eligibleError.message}`)

    const eligibleIds = (eligibleRows ?? []).map((r) => r.user_id)
    if (eligibleIds.length === 0) return []

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, slack_user_id')
        .in('id', eligibleIds)

    if (profilesError) throw new Error(`Profiles query failed: ${profilesError.message}`)

    type ProfileSlice = { full_name: string; email: string; slack_user_id: string | null }
    const profileByUserId = new Map<string, ProfileSlice>(
        (profilesData ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email, slack_user_id: p.slack_user_id }])
    )

    const { data: attended, error: attendedError } = await supabase
        .from('event_attendance')
        .select('user_id')
        .eq('event_id', eventId)
        .not('attended_at', 'is', null)

    if (attendedError) throw new Error(`Attendance query failed: ${attendedError.message}`)

    const attendedIds = new Set((attended ?? []).map((a) => a.user_id))

    return eligibleIds
        .filter((user_id) => !attendedIds.has(user_id))
        .map((user_id) => {
            const p = profileByUserId.get(user_id)
            if (!p) return null
            return { user_id, full_name: p.full_name, email: p.email, slack_user_id: p.slack_user_id }
        })
        .filter((a): a is Absentee => a !== null)
}

// ============================================================================
// MESSAGE BUILDER
// ============================================================================

function buildMessage(event: EventRow, absentees: Absentee[], totalAttended: number) {
    const dateStr = new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
    })

    const absenteeLabel = event.rsvp_required
        ? `RSVPed but didn't attend (${absentees.length})`
        : `Didn't attend (${absentees.length} of ${totalAttended + absentees.length} eligible)`

    const fallbackText = `📋 Attendance Report: ${event.name} — ${absentees.length} absent`

    const blocks: object[] = [
        {
            type: 'header',
            text: { type: 'plain_text', text: `📋 Attendance Report: ${event.name}`, emoji: true },
        },
        {
            type: 'section',
            fields: [
                { type: 'mrkdwn', text: `*Date:*\n${dateStr}` },
                { type: 'mrkdwn', text: `*Type:*\n${event.rsvp_required ? 'RSVP-required' : 'Open event'}` },
                { type: 'mrkdwn', text: `*Attended:*\n${totalAttended}` },
                { type: 'mrkdwn', text: `*Absent:*\n${absentees.length}` },
            ],
        },
        { type: 'divider' },
        {
            type: 'section',
            text: { type: 'mrkdwn', text: `*${absenteeLabel}:*` },
        },
    ]

    if (absentees.length === 0) {
        blocks.push({
            type: 'section',
            text: { type: 'mrkdwn', text: '✅ Everyone showed up! No absentees.' },
        })
    } else {
        // Slack block text limit is 3000 chars — chunk list into groups of 20
        for (let i = 0; i < absentees.length; i += 20) {
            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: absentees.slice(i, i + 20).map(a => `- ${formatMention(a)}`).join('\n'),
                },
            })
        }
        const absenteeEmailsCsv = absentees.map(a => a.email).filter(Boolean).join(',');
        if (absenteeEmailsCsv.length > 0) {
            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Emails for quick contact (copy as CSV):*\n\`\`\`\n${absenteeEmailsCsv}\n\`\`\``,
                },
            });
        }
        blocks.push({
            type: 'context',
            elements: [{
                type: 'mrkdwn',
                text: 'Click any mention to open their Slack profile and send a DM.',
            }],
        })
    }

    return { fallbackText, blocks }
}

// ============================================================================
// PROCESS ONE EVENT
// Gets absentees, builds Slack message, posts. Soft-fail: returns status so we can continue with others.
// ============================================================================

type ProcessedEvent = { type: 'event'; name: string; status: 'success' | 'error'; errors?: string[] }

async function processEvent(
    supabase: ReturnType<typeof createClient>,
    event: EventRow,
    adminChannelId: string
): Promise<ProcessedEvent> {
    try {
        let absentees = event.rsvp_required
            ? await getRsvpAbsentees(supabase, event.id)
            : await getGeneralAbsentees(supabase, event.id, event.allowed_roles)

        absentees = await enrichAbsenteesWithSlackIds(supabase, absentees)

        const { count: attendedCount } = await supabase
            .from('event_attendance')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .not('attended_at', 'is', null)

        const { fallbackText, blocks } = buildMessage(event, absentees, attendedCount ?? 0)
        await postSlackMessage(adminChannelId, fallbackText, blocks)

        return { type: 'event', name: event.name, status: 'success' }
    } catch (err) {
        console.warn(`Attendance report failed for "${event.name}": ${err.message}`)
        return { type: 'event', name: event.name, status: 'error', errors: [err.message] }
    }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const adminChannelId = await lookupChannelIdByName(SLACK_ADMIN_CHANNEL_NAME)

        const { rangeStart, rangeEnd } = getLast24HoursRange()
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('id, name, event_date, rsvp_required, allowed_roles')
            .gte('event_date', rangeStart)
            .lte('event_date', rangeEnd)

        if (eventsError) throw new Error(`Failed to query events: ${eventsError.message}`)

        const eventList = events ?? []
        const results: ProcessedEvent[] = []
        for (const event of eventList) {
            const result = await processEvent(supabase, event, adminChannelId)
            results.push(result)
        }

        const failCount = results.filter((r) => r.status === 'error').length
        if (failCount > 0) {
            console.warn(`post-event-absentees: ${failCount}/${results.length} events failed`)
        }

        return new Response(JSON.stringify({ processed: results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error(`post-event-absentees: ${err.message}`)
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})