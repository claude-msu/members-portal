// supabase/functions/process-start-automation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const GITHUB_ORG_PAT = Deno.env.get('GITHUB_ORG_PAT')!
const GITHUB_ORG = Deno.env.get('GITHUB_ORG')!
const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================================================
// GITHUB HELPERS
// ============================================================================

async function ensureGitHubTeam(name: string, description: string): Promise<string> {
  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  // Try to create team
  const res = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/teams`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      description: description,
      privacy: 'closed',
    })
  })

  const data = await res.json()

  // Success or already exists - both are fine
  if (res.ok || data.errors?.some((e) => e.code === 'already_exists')) {
    return data.slug || slug
  }

  throw new Error(`Failed to create GitHub Team: ${JSON.stringify(data)}`)
}

async function addGitHubTeamMember(
  teamSlug: string,
  username: string,
  role: 'member' | 'maintainer'
): Promise<void> {
  const res = await fetch(
    `https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}/memberships/${username}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_ORG_PAT}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role })
    }
  )

  // Idempotent - PUT will create or update
  if (!res.ok) {
    const data = await res.json()
    console.warn(`Failed to add ${username} to team ${teamSlug}:`, data)
  }
}

async function ensureGitHubRepo(
  name: string,
  description: string,
  teamSlug: string
): Promise<string> {
  const repoUrl = `https://github.com/${GITHUB_ORG}/${name}`

  // Check if repo exists first
  const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${name}`, {
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  })

  if (checkRes.ok) {
    // Repo exists, just ensure team has access
    await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}/repos/${GITHUB_ORG}/${name}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_ORG_PAT}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: 'push' })
      }
    )

    return repoUrl
  }

  // Repo doesn't exist, create it
  const res = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      description: description,
      private: true,
      auto_init: true,
    })
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(`Failed to create repo: ${JSON.stringify(data)}`)
  }

  // Add Team Permission
  await fetch(
    `https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}/repos/${GITHUB_ORG}/${name}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_ORG_PAT}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permission: 'push' })
    }
  )

  // Protect Main Branch (best effort - might fail if no commits yet)
  try {
    await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${name}/branches/main/protection`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_ORG_PAT}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        required_status_checks: null,
        enforce_admins: false,
        required_pull_request_reviews: {
          dismiss_stale_reviews: true,
          required_approving_review_count: 1,
        },
        restrictions: null
      })
    })
  } catch (e) {
    console.warn(`Branch protection failed for ${name} (may not have commits yet):`, e)
  }

  return repoUrl
}

// ============================================================================
// SLACK HELPERS
// ============================================================================

async function ensureSlackChannel(name: string): Promise<string> {
  const channelName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 80)

  // Try to create channel
  const res = await fetch('https://slack.com/api/conversations.create', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: channelName, is_private: false })
  })

  const data = await res.json()

  // Success - return channel ID
  if (data.ok) return data.channel.id

  // Already exists - find it
  if (data.error === 'name_taken') {
    // List channels to find it (paginate if needed)
    const listRes = await fetch('https://slack.com/api/conversations.list?limit=1000', {
      headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` }
    })
    const listData = await listRes.json()

    if (listData.ok) {
      const existingChannel = listData.channels?.find((c) => c.name === channelName)
      if (existingChannel) {
        return existingChannel.id
      }
    }
  }

  throw new Error(`Slack channel error: ${data.error}`)
}

async function getSlackUserIds(
  emails: string[],
  supabase
): Promise<string[]> {
  const ids: string[] = []

  for (const email of emails) {
    try {
      const res = await fetch(
        `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(email)}`,
        { headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` } }
      )
      const data = await res.json()

      if (data.ok && data.user?.id) {
        const slackUserId = data.user.id
        ids.push(slackUserId)

        // Save Slack user ID to profile (idempotent - only updates if null)
        try {
          await supabase
            .from('profiles')
            .update({ slack_user_id: slackUserId })
            .eq('email', email)
            .is('slack_user_id', null)
        } catch (saveError) {
          console.warn(`Failed to save Slack ID for ${email}:`, saveError)
        }
      }
    } catch (e) {
      console.warn(`Slack lookup failed for ${email}:`, e)
    }
  }

  return ids
}

async function inviteToSlackChannel(channelId: string, userIds: string[]): Promise<void> {
  if (!channelId || userIds.length === 0) return

  // Invite users (idempotent - already_in_channel is not an error)
  const res = await fetch('https://slack.com/api/conversations.invite', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel: channelId, users: userIds.join(',') })
  })

  const data = await res.json()
  if (!data.ok && data.error !== 'already_in_channel') {
    console.warn('Failed to invite users to Slack channel:', data.error)
  }
}

async function postSlackMessage(channelId: string, text: string): Promise<void> {
  // Best effort - don't throw on failure
  try {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: channelId, text })
    })
  } catch (e) {
    console.warn('Failed to post welcome message:', e)
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const today = new Date().toISOString().split('T')[0]

    interface AutomationResult {
      type: 'project' | 'class'
      name: string
      status?: string
      error?: string
    }
    const results: AutomationResult[] = []

    // Fetch Projects and Classes that need processing
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        id, name, repository_name, slack_channel_id,
        semesters!inner(code, start_date)
      `)
      .lte('semesters.start_date', today)
      .is('slack_channel_id', null) // Only process if not already done

    if (projectsError) throw projectsError

    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select(`
        id, name, slack_channel_id,
        semesters!inner(code, start_date)
      `)
      .lte('semesters.start_date', today)
      .is('slack_channel_id', null) // Only process if not already done

    if (classesError) throw classesError

    // ========================================================================
    // PROCESS PROJECTS
    // ========================================================================
    for (const project of projects || []) {
      try {
        const { data: members } = await supabase
          .from('project_members')
          .select('user_id, role, profiles!inner(github_username, email, full_name)')
          .eq('project_id', project.id)

        if (!members?.length) {
          results.push({ type: 'project', name: project.name, error: 'No members' })
          continue
        }

        // Lead is optional - if exists with GitHub, they get maintainer permissions
        const lead = members.find(m => m.role === 'lead')

        if (!lead) {
          console.warn(`Project ${project.name} has no lead assigned`)
        } else if (!lead.profiles.github_username) {
          console.warn(`Project ${project.name} lead has no GitHub username`)
        }

        // A. GitHub Setup (all idempotent)
        const teamSlug = await ensureGitHubTeam(
          `${project.name}-${project.semesters.code}`,
          `Team for ${project.name}`
        )

        // Add Lead as maintainer (if exists and has GitHub username)
        if (lead?.profiles.github_username) {
          await addGitHubTeamMember(teamSlug, lead.profiles.github_username, 'maintainer')
        }

        // Add all other members with GitHub usernames
        const membersWithGitHub = members.filter(m => m.profiles.github_username)

        if (membersWithGitHub.length === 0 && !lead?.profiles.github_username) {
          console.warn(`Project ${project.name} has no members with GitHub usernames - team will be empty`)
        }

        for (const m of members) {
          // Skip lead (already added as maintainer) or members without GitHub
          if (m.user_id === lead?.user_id || !m.profiles.github_username) continue

          await addGitHubTeamMember(teamSlug, m.profiles.github_username, 'member')
        }

        // Create/ensure repo exists
        const repoUrl = await ensureGitHubRepo(project.repository_name, project.name, teamSlug)

        // B. Slack Setup (idempotent)
        const channelId = await ensureSlackChannel(`project-${project.name}`)

        // Invite members to Slack
        const emails = members.map(m => m.profiles.email)
        const slackIds = await getSlackUserIds(emails, supabase)
        await inviteToSlackChannel(channelId, slackIds)

        // Post welcome message (best effort)
        await postSlackMessage(
          channelId,
          `🚀 Welcome to ${project.name}!\n\nGitHub: ${repoUrl}\n\nLet's build! 💪`
        )

        // C. Update database - LAST STEP (marks as complete)
        // Only update slack_channel_id - repository_name already exists
        const { error: updateError } = await supabase
          .from('projects')
          .update({ slack_channel_id: channelId })
          .eq('id', project.id)

        if (updateError) {
          throw new Error(`Failed to update database: ${updateError.message}`)
        }

        results.push({ type: 'project', name: project.name, status: 'success' })

      } catch (err) {
        console.error(`Error processing project ${project.name}:`, err)
        results.push({ type: 'project', name: project.name, error: err.message })
        // NO ROLLBACK - let next run fix it via idempotency
      }
    }

    // ========================================================================
    // PROCESS CLASSES
    // ========================================================================
    for (const cls of classes || []) {
      try {
        const { data: members } = await supabase
          .from('class_enrollments')
          .select('user_id, role, profiles!inner(email, full_name)')
          .eq('class_id', cls.id)

        if (!members?.length) {
          results.push({ type: 'class', name: cls.name, error: 'No members' })
          continue
        }

        // A. Slack Setup (idempotent)
        const channelId = await ensureSlackChannel(`class-${cls.name}-${cls.semesters.code}`)

        // Invite members
        const emails = members.map(m => m.profiles.email)
        const slackIds = await getSlackUserIds(emails, supabase)
        await inviteToSlackChannel(channelId, slackIds)

        // Welcome message (best effort)
        const teacher = members.find(m => m.role === 'teacher')
        await postSlackMessage(
          channelId,
          `📚 Welcome to ${cls.name}!\n\n${teacher ? `Instructor: ${teacher.profiles.full_name}` : ''}`
        )

        // B. Update database - LAST STEP (marks as complete)
        const { error: updateError } = await supabase
          .from('classes')
          .update({ slack_channel_id: channelId })
          .eq('id', cls.id)

        if (updateError) {
          throw new Error(`Failed to update database: ${updateError.message}`)
        }

        results.push({ type: 'class', name: cls.name, status: 'success' })

      } catch (err) {
        console.error(`Error processing class ${cls.name}:`, err)
        results.push({ type: 'class', name: cls.name, error: err.message })
        // NO ROLLBACK - let next run fix it via idempotency
      }
    }

    return new Response(JSON.stringify({ processed: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Critical automation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})