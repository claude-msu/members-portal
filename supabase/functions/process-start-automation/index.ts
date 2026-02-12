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

  if (res.ok) return data.slug

  if (data.errors?.some((e) => e.code === 'already_exists')) {
    return slug
  }

  throw new Error(`Failed to create GitHub Team: ${JSON.stringify(data)}`)
}

async function deleteGitHubTeam(teamSlug: string): Promise<void> {
  await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  })
}

async function addGitHubTeamMember(
  teamSlug: string,
  username: string,
  role: 'member' | 'maintainer'
): Promise<void> {
  await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}/memberships/${username}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role })
  })
}

async function ensureGitHubRepo(
  name: string,
  description: string,
  teamSlug: string
): Promise<string> {
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

  const data = await res.json()

  if (!res.ok && !data.errors?.some((e) => e.message === 'name already exists on this account')) {
    throw new Error(`Failed to create Repo: ${JSON.stringify(data)}`)
  }

  // Add Team Permission (Push access)
  await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}/repos/${GITHUB_ORG}/${name}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ permission: 'push' })
  })

  // Protect Main Branch
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

  return `https://github.com/${GITHUB_ORG}/${name}`
}

async function deleteGitHubRepo(name: string): Promise<void> {
  await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${name}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  })
}

// ============================================================================
// SLACK HELPERS
// ============================================================================

async function createSlackChannel(name: string): Promise<string> {
  const channelName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 80)

  const res = await fetch('https://slack.com/api/conversations.create', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: channelName, is_private: false })
  })

  const data = await res.json()

  if (data.ok) return data.channel.id

  throw new Error(`Slack Create Channel Error: ${data.error}`)
}

async function archiveSlackChannel(channelId: string): Promise<void> {
  await fetch('https://slack.com/api/conversations.archive', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel: channelId })
  })
}

async function getSlackUserIds(
  emails: string[],
  supabase: any
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

        // Save Slack user ID to profile for future use
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
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel: channelId, text })
  })
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

    // Fetch Projects and Classes
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        id, name, repository_name, slack_channel_id,
        semesters!inner(code, start_date)
      `)
      .lte('semesters.start_date', today)
      .is('slack_channel_id', null)

    if (projectsError) throw projectsError

    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select(`
        id, name, slack_channel_id,
        semesters!inner(code, start_date)
      `)
      .lte('semesters.start_date', today)
      .is('slack_channel_id', null)

    if (classesError) throw classesError

    // ========================================================================
    // PROCESS PROJECTS
    // ========================================================================
    for (const project of projects || []) {
      const rollbackActions: (() => Promise<void>)[] = []

      try {
        const { data: members } = await supabase
          .from('project_members')
          .select('user_id, role, profiles!inner(github_username, email, full_name)')
          .eq('project_id', project.id)

        if (!members?.length) {
          results.push({ type: 'project', name: project.name, error: 'No members' })
          continue
        }

        const lead = members.find(m => m.role === 'lead')
        if (!lead?.profiles.github_username) {
          results.push({ type: 'project', name: project.name, error: 'No Lead/GitHub' })
          continue
        }

        // A. GitHub Setup
        const teamSlug = await ensureGitHubTeam(
          `${project.name}-${project.semesters.code}`,
          `Team for ${project.name}`
        )

        rollbackActions.push(async () => {
          await deleteGitHubTeam(teamSlug)
        })

        // Add Lead
        await addGitHubTeamMember(teamSlug, lead.profiles.github_username, 'maintainer')

        // Add Members
        for (const m of members) {
          if (m.user_id !== lead.user_id && m.profiles.github_username) {
            await addGitHubTeamMember(teamSlug, m.profiles.github_username, 'member')
          }
        }

        // Create Repo & Protect
        const repoUrl = await ensureGitHubRepo(project.repository_name, project.name, teamSlug)

        rollbackActions.push(async () => {
          await deleteGitHubRepo(project.repository_name)
        })

        // B. Slack Setup
        const channelId = await createSlackChannel(`project-${project.name}`)

        rollbackActions.push(async () => {
          await archiveSlackChannel(channelId)
        })

        // Save channel ID and repo URL to DB
        const { error: updateError } = await supabase
          .from('projects')
          .update({ slack_channel_id: channelId, repository_url: repoUrl })
          .eq('id', project.id)

        if (updateError) throw updateError

        rollbackActions.push(async () => {
          await supabase
            .from('projects')
            .update({ slack_channel_id: null, repository_url: null })
            .eq('id', project.id)
        })

        // Invite Members to Slack
        const emails = members.map(m => m.profiles.email)
        const slackIds = await getSlackUserIds(emails, supabase)
        await inviteToSlackChannel(channelId, slackIds)

        // Welcome Message
        await postSlackMessage(channelId, `🚀 Welcome to ${project.name}!\n\nGitHub: ${repoUrl}\n\nLet's build! 💪`)

        results.push({ type: 'project', name: project.name, status: 'success' })

      } catch (err) {
        console.error(`Error processing project ${project.name}:`, err)

        // Execute rollbacks for this project
        for (const rollback of rollbackActions.reverse()) {
          try {
            await rollback()
          } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError)
          }
        }

        results.push({ type: 'project', name: project.name, error: err.message })
      }
    }

    // ========================================================================
    // PROCESS CLASSES
    // ========================================================================
    for (const cls of classes || []) {
      const rollbackActions: (() => Promise<void>)[] = []

      try {
        const { data: members } = await supabase
          .from('class_enrollments')
          .select('user_id, role, profiles!inner(email, full_name)')
          .eq('class_id', cls.id)

        if (!members?.length) {
          results.push({ type: 'class', name: cls.name, error: 'No members' })
          continue
        }

        // A. Slack Setup
        const channelId = await createSlackChannel(`class-${cls.name}-${cls.semesters.code}`)

        rollbackActions.push(async () => {
          await archiveSlackChannel(channelId)
        })

        // Save channel ID to DB
        const { error: updateError } = await supabase
          .from('classes')
          .update({ slack_channel_id: channelId })
          .eq('id', cls.id)

        if (updateError) throw updateError

        rollbackActions.push(async () => {
          await supabase
            .from('classes')
            .update({ slack_channel_id: null })
            .eq('id', cls.id)
        })

        // B. Invite & Welcome
        const emails = members.map(m => m.profiles.email)
        const slackIds = await getSlackUserIds(emails, supabase)
        await inviteToSlackChannel(channelId, slackIds)

        const teacher = members.find(m => m.role === 'teacher')
        await postSlackMessage(
          channelId,
          `📚 Welcome to ${cls.name}!\n\n${teacher ? `Instructor: ${teacher.profiles.full_name}` : ''}`
        )

        results.push({ type: 'class', name: cls.name, status: 'success' })

      } catch (err) {
        console.error(`Error processing class ${cls.name}:`, err)

        // Execute rollbacks for this class
        for (const rollback of rollbackActions.reverse()) {
          try {
            await rollback()
          } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError)
          }
        }

        results.push({ type: 'class', name: cls.name, error: err.message })
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