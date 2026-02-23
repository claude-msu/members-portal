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
    const { data: eligible, error: eligibleError } = await supabase
        .from('user_roles')
        .select('user_id, profiles!inner(full_name, email, slack_user_id)')
        .in('role', allowedRoles)

    if (eligibleError) throw new Error(`Eligible users query failed: ${eligibleError.message}`)

    const { data: attended, error: attendedError } = await supabase
        .from('event_attendance')
        .select('user_id')
        .eq('event_id', eventId)
        .not('attended_at', 'is', null)

    if (attendedError) throw new Error(`Attendance query failed: ${attendedError.message}`)

    const attendedIds = new Set((attended ?? []).map((a) => a.user_id))

    return (eligible ?? [])
        .filter((row) => !attendedIds.has(row.user_id))
        .map((row) => ({
            user_id: row.user_id,
            full_name: row.profiles.full_name,
            email: row.profiles.email,
            slack_user_id: row.profiles.slack_user_id,
        }))
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

    const fallbackText = `📋 Absentee Report: ${event.name} — ${absentees.length} absent`

    const blocks: object[] = [
        {
            type: 'header',
            text: { type: 'plain_text', text: `📋 Absentee Report: ${event.name}`, emoji: true },
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
        const absenteeEmails = absentees.map(a => a.email).filter(Boolean).join(', ');
        if (absenteeEmails.length > 0) {
            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Emails for quick contact:*\n\`${absenteeEmails}\``,
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
// PROCESS SINGLE EVENT
// Soft-fail wrapper — errors become { status: 'error' } entries in batch results.
// ============================================================================

async function processEvent(
    supabase: ReturnType<typeof createClient>,
    event: EventRow,
    adminChannelId: string
): Promise<{ event_id: string; event_name: string; status: 'success' | 'error'; error?: string }> {
    try {
        const absentees = event.rsvp_required
            ? await getRsvpAbsentees(supabase, event.id)
            : await getGeneralAbsentees(supabase, event.id, event.allowed_roles)

        const { count: attendedCount } = await supabase
            .from('event_attendance')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .not('attended_at', 'is', null)

        const { fallbackText, blocks } = buildMessage(event, absentees, attendedCount ?? 0)
        await postSlackMessage(adminChannelId, fallbackText, blocks)

        return { event_id: event.id, event_name: event.name, status: 'success' }
    } catch (err) {
        console.warn(`Absentee report failed for "${event.name}": ${err.message}`)
        return { event_id: event.id, event_name: event.name, status: 'error', error: err.message }
    }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        // ── Parse body (optional) ──────────────────────────────────────────────
        let body: { event_id?: string } = {}
        try { body = await req.json() } catch { /* no body = batch mode */ }

        // ── Resolve admin channel — hard failure if not found ──────────────────
        const adminChannelId = await lookupChannelIdByName(SLACK_ADMIN_CHANNEL_NAME)

        // ── SINGLE MODE: explicit event_id from portal ─────────────────────────
        if (body.event_id) {
            const { data: event, error: eventError } = await supabase
                .from('events')
                .select('id, name, event_date, rsvp_required, allowed_roles')
                .eq('id', body.event_id)
                .single()

            if (eventError || !event) {
                return new Response(
                    JSON.stringify({ error: `Event not found: ${eventError?.message ?? 'unknown'}` }),
                    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            const result = await processEvent(supabase, event, adminChannelId)
            return new Response(JSON.stringify(result), {
                status: result.status === 'success' ? 200 : 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // ── BATCH MODE: cron — all events from yesterday (UTC) ─────────────────
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)
        const yesterday = new Date(today)
        yesterday.setUTCDate(today.getUTCDate() - 1)

        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('id, name, event_date, rsvp_required, allowed_roles')
            .gte('event_date', yesterday.toISOString())
            .lt('event_date', today.toISOString())

        if (eventsError) throw new Error(`Failed to query yesterday's events: ${eventsError.message}`)

        if (!events?.length) {
            return new Response(
                JSON.stringify({ processed: [], message: 'No events yesterday.' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const results = await Promise.all(
            events.map(event => processEvent(supabase, event, adminChannelId))
        )

        const failCount = results.filter(r => r.status === 'error').length
        if (failCount > 0) {
            console.warn(`Batch absentee report: ${failCount}/${results.length} events failed — see individual errors in response`)
        }

        return new Response(
            JSON.stringify({ processed: results }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (err) {
        // Only unrecoverable errors reach here: auth failures, DB down, channel not found
        console.error(`post-event-absentees: ${err.message}`)
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})