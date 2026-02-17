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
// DERIVATION HELPERS
// ============================================================================

function deriveTeamSlug(projectName: string, semesterCode: string): string {
  const teamName = `${projectName} (${semesterCode})`

  // Replace any sequence of non-alphanumeric characters with a single hyphen, and remove leading/trailing hyphens
  return teamName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function deriveTeamName(projectName: string, semesterCode: string): string {
  return `${projectName} (${semesterCode})`
}

function deriveProjectUrl(githubProjectId: number): string {
  return `https://github.com/orgs/${GITHUB_ORG}/projects/${githubProjectId}`
}

function deriveTeamUrl(teamSlug: string): string {
  return `https://github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}`
}

// ============================================================================
// GITHUB TEAM HELPERS
// ============================================================================

async function findGitHubTeam(teamSlug: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}`, {
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  })

  return res.ok
}

async function createGitHubTeam(name: string, description: string): Promise<string> {
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

  // Success
  if (res.ok) {
    return data.slug
  }

  // Team already exists - derive slug and continue
  if (res.status === 422 && data.errors?.some((e) => e.message?.includes('unique'))) {
    return name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  }

  throw new Error(`Failed to create GitHub Team: ${JSON.stringify(data)}`)
}

async function ensureGitHubTeam(teamSlug: string, name: string, description: string): Promise<void> {
  const exists = await findGitHubTeam(teamSlug)
  if (exists) return

  await createGitHubTeam(name, description)
}

async function getGitHubTeamMembers(teamSlug: string): Promise<Map<string, 'member' | 'maintainer'>> {
  const members = new Map<string, 'member' | 'maintainer'>()

  const res = await fetch(
    `https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}/members?per_page=100`,
    {
      headers: {
        'Authorization': `token ${GITHUB_ORG_PAT}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    }
  )

  if (!res.ok) return members

  const data = await res.json()

  // Get membership details for each member to determine role
  for (const member of data) {
    try {
      const membershipRes = await fetch(
        `https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}/memberships/${member.login}`,
        {
          headers: {
            'Authorization': `token ${GITHUB_ORG_PAT}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      )

      if (membershipRes.ok) {
        const membershipData = await membershipRes.json()
        members.set(member.login, membershipData.role)
      }
    } catch (e) {
      console.warn(`Failed to get membership for ${member.login}:`, e)
    }
  }

  return members
}

async function syncGitHubTeamMember(
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

  if (!res.ok) {
    const data = await res.json()
    throw new Error(`Failed to sync ${username} to team ${teamSlug}: ${JSON.stringify(data)}`)
  }
}

// ============================================================================
// GITHUB PROJECT HELPERS
// ============================================================================

async function getOrgNodeId(): Promise<string> {
  const res = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}`, {
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  })

  if (!res.ok) throw new Error('Failed to fetch org info')

  const data = await res.json()
  return data.node_id
}

async function findGitHubProjectByNumber(
  projectNumber: number,
  orgNodeId: string
): Promise<boolean> {
  const query = `
    query($orgId: ID!, $number: Int!) {
      node(id: $orgId) {
        ... on Organization {
          projectV2(number: $number) {
            id
            number
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${GITHUB_ORG_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { orgId: orgNodeId, number: projectNumber }
    })
  })

  const data = await res.json()
  return !!data.data?.node?.projectV2
}

async function findGitHubProjectByTitle(
  title: string,
  orgNodeId: string
): Promise<number | null> {
  const query = `
    query($orgId: ID!) {
      node(id: $orgId) {
        ... on Organization {
          projectsV2(first: 100) {
            nodes {
              number
              title
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${GITHUB_ORG_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { orgId: orgNodeId }
    })
  })

  const data = await res.json()

  if (data.data?.node?.projectsV2?.nodes) {
    const match = data.data.node.projectsV2.nodes.find(
      (p) => p.title === title
    )

    if (match) return match.number
  }

  return null
}

async function createGitHubProject(
  title: string,
  orgNodeId: string
): Promise<number> {
  const mutation = `
    mutation($ownerId: ID!, $title: String!) {
      createProjectV2(input: {ownerId: $ownerId, title: $title}) {
        projectV2 {
          number
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${GITHUB_ORG_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables: { ownerId: orgNodeId, title }
    })
  })

  const data = await res.json()

  if (data.errors) {
    throw new Error(`Failed to create GitHub Project: ${JSON.stringify(data.errors)}`)
  }

  return data.data.createProjectV2.projectV2.number
}

async function ensureGitHubProject(
  title: string,
  existingProjectId: number | null,
  orgNodeId: string
): Promise<number> {
  // Check if stored project ID is still valid
  if (existingProjectId && await findGitHubProjectByNumber(existingProjectId, orgNodeId)) {
    return existingProjectId
  }

  // Search for project by title
  const foundProjectId = await findGitHubProjectByTitle(title, orgNodeId)
  if (foundProjectId) return foundProjectId

  // Create new project
  return await createGitHubProject(title, orgNodeId)
}

// ============================================================================
// GITHUB PROJECT-TEAM LINKING
// ============================================================================

async function getTeamNodeId(teamSlug: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/teams/${teamSlug}`, {
    headers: {
      'Authorization': `token ${GITHUB_ORG_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.node_id
}

async function linkTeamToProject(
  projectNumber: number,
  teamSlug: string,
  orgNodeId: string
): Promise<void> {
  // Get team node ID
  const teamNodeId = await getTeamNodeId(teamSlug)
  if (!teamNodeId) {
    console.warn(`Could not find team ${teamSlug} to link to project`)
    return
  }

  // Get project node ID from number
  const projectQuery = `
    query($orgId: ID!, $number: Int!) {
      node(id: $orgId) {
        ... on Organization {
          projectV2(number: $number) {
            id
          }
        }
      }
    }
  `

  const projectRes = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${GITHUB_ORG_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: projectQuery,
      variables: { orgId: orgNodeId, number: projectNumber }
    })
  })

  const projectData = await projectRes.json()
  const projectNodeId = projectData.data?.node?.projectV2?.id

  if (!projectNodeId) {
    throw new Error(`Could not find project ${projectNumber} to link team`)
  }

  // Link team to project with ADMIN access
  const linkMutation = `
    mutation($projectId: ID!, $teamId: ID!) {
      updateProjectV2Collaborators(
        input: {
          projectId: $projectId
          collaborators: [
            {
              teamId: $teamId
              role: ADMIN
            }
          ]
        }
      ) {
        __typename
      }
    }
  `

  const linkRes = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${GITHUB_ORG_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: linkMutation,
      variables: {
        projectId: projectNodeId,
        teamId: teamNodeId
      }
    })
  })

  const linkData = await linkRes.json()

  if (linkData.errors) {
    throw new Error(`Failed to link team to project: ${JSON.stringify(linkData.errors)}`)
  }
}

// ============================================================================
// SLACK HELPERS
// ============================================================================

async function findSlackChannel(channelId: string): Promise<boolean> {
  if (!channelId) return false

  const res = await fetch(`https://slack.com/api/conversations.info?channel=${channelId}`, {
    headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` }
  })

  const data = await res.json()
  return data.ok
}

async function createSlackChannel(name: string): Promise<string> {
  // Convert the given name to a Slack-compatible channel name following a similar pattern to the team slug:
  // - Lowercase all characters
  // - Replace all sequences of non-alphanumeric characters with a single hyphen
  // - Remove leading/trailing hyphens
  // - Remove all ampersands (&)
  // - Collapse multiple consecutive hyphens to a single hyphen
  // - Truncate to 80 characters
  const channelName = name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 80)

  const res = await fetch('https://slack.com/api/conversations.create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: channelName, is_private: false })
  })

  const data = await res.json()

  if (data.ok) return data.channel.id

  if (data.error === 'name_taken') {
    const listRes = await fetch('https://slack.com/api/conversations.list?limit=1000', {
      headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` }
    })
    const listData = await listRes.json()

    if (listData.ok) {
      const existing = listData.channels?.find((c) => c.name === channelName)
      if (existing) return existing.id
    }
  }

  throw new Error(`Failed to create Slack channel: ${data.error}`)
}

async function ensureSlackChannel(name: string, existingChannelId: string | null): Promise<string> {
  // Check if existing channel ID is still valid
  if (existingChannelId && await findSlackChannel(existingChannelId)) {
    return existingChannelId
  }

  // Create or find channel
  return await createSlackChannel(name)
}

async function getSlackChannelMembers(channelId: string): Promise<Set<string>> {
  const members = new Set<string>()

  const res = await fetch(
    `https://slack.com/api/conversations.members?channel=${channelId}&limit=1000`,
    { headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` } }
  )

  const data = await res.json()

  if (data.ok && data.members) {
    for (const memberId of data.members) {
      members.add(memberId)
    }
  }

  return members
}

async function lookupSlackUserId(email: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(email)}`,
      { headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` } }
    )
    const data = await res.json()

    if (data.ok && data.user?.id) {
      return data.user.id
    }
  } catch (e) {
    console.warn(`Slack lookup failed for ${email}:`, e)
  }

  return null
}

async function syncSlackChannelMember(
  channelId: string,
  userId: string
): Promise<void> {
  const res = await fetch('https://slack.com/api/conversations.invite', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel: channelId,
      users: userId
    })
  })

  const data = await res.json()

  if (!data.ok && data.error !== 'already_in_channel') {
    throw new Error(`Failed to add user to Slack: ${data.error}`)
  }
}

async function postSlackMessage(channelId: string, text: string): Promise<void> {
  try {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ channel: channelId, text })
    })
  } catch (e) {
    console.warn('Failed to post message:', e)
  }
}

// ============================================================================
// PROFILE HELPERS
// ============================================================================

async function saveSlackUserId(
  supabase,
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

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const now = new Date()
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d{3}Z$/, '+00')

    interface AutomationResult {
      type: 'project' | 'class'
      name: string
      status: 'success' | 'partial' | 'error'
      errors?: string[]
    }
    const results: AutomationResult[] = []

    // Get org node ID once for all GraphQL operations
    const orgNodeId = await getOrgNodeId()

    // ========================================================================
    // FETCH PROJECTS AND CLASSES
    // ========================================================================

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        id, name, github_project_id, slack_channel_id,
        semesters!inner(code, start_date)
      `)
      .lte('semesters.start_date', now)

    if (projectsError) throw projectsError

    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select(`
        id, name, slack_channel_id,
        semesters!inner(code, start_date)
      `)
      .lte('semesters.start_date', now)

    if (classesError) throw classesError

    // ========================================================================
    // PROCESS PROJECTS
    // ========================================================================

    for (const project of projects || []) {
      const errors: string[] = []

      try {
        // Fetch members
        const { data: members } = await supabase
          .from('project_members')
          .select('user_id, role, profiles!inner(github_username, email, full_name, slack_user_id)')
          .eq('project_id', project.id)

        if (!members?.length) {
          results.push({
            type: 'project',
            name: project.name,
            status: 'error',
            errors: ['No members found']
          })
          continue
        }

        // Derive team slug and name
        const teamSlug = deriveTeamSlug(project.name, project.semesters.code)
        const teamName = deriveTeamName(project.name, project.semesters.code)

        // STEP 1: Ensure GitHub Team exists
        try {
          await ensureGitHubTeam(teamSlug, teamName, `Team for ${project.name}`)
        } catch (err) {
          errors.push(`GitHub Team creation: ${err.message}`)
        }

        // STEP 2: Ensure GitHub Project exists
        let githubProjectId = project.github_project_id

        // STEP 3: Sync GitHub Team Members
        try {
          const existingMembers = await getGitHubTeamMembers(teamSlug)

          for (const m of members) {
            if (!m.profiles.github_username) continue;

            try {
              const desiredRole: 'member' | 'maintainer' = m.role === 'lead' ? 'maintainer' : 'member'
              const currentRole = existingMembers.get(m.profiles.github_username)

              // Add or update if role changed or not in team yet
              if (!currentRole || currentRole !== desiredRole) {
                await syncGitHubTeamMember(teamSlug, m.profiles.github_username, desiredRole)
              }
            } catch (err) {
              // Soft fail - log but continue processing other members
              errors.push(`GitHub member ${m.profiles.github_username}: ${err.message}`)
            }
          }

          try {
            githubProjectId = await ensureGitHubProject(
              project.name,
              project.github_project_id,
              orgNodeId
            )

            // Update database if changed
            if (githubProjectId !== project.github_project_id) {
              await supabase
                .from('projects')
                .update({ github_project_id: githubProjectId })
                .eq('id', project.id)
            }
          } catch (err) {
            errors.push(`GitHub Project: ${err.message}`)
          }
        } catch (err) {
          errors.push(`GitHub member sync: ${err.message}`)
        }

        // STEP 4: Link Team to Project
        if (githubProjectId) {
          try {
            await linkTeamToProject(githubProjectId, teamSlug, orgNodeId)
          } catch (err) {
            errors.push(`Link team to project: ${err.message}`)
          }
        }

        // STEP 5: Ensure Slack Channel exists
        let channelId = project.slack_channel_id
        let isNewChannel = false
        try {
          const channelName = `project-${project.name}`
          const newChannelId = await ensureSlackChannel(channelName, project.slack_channel_id)

          isNewChannel = newChannelId !== project.slack_channel_id
          channelId = newChannelId

          // Update database if changed
          if (isNewChannel) {
            await supabase
              .from('projects')
              .update({ slack_channel_id: channelId })
              .eq('id', project.id)
          }
        } catch (err) {
          errors.push(`Slack Channel: ${err.message}`)
        }

        // STEP 6: Sync Slack Channel Members
        if (channelId) {
          try {
            const existingMembers = await getSlackChannelMembers(channelId)

            for (const m of members) {
              try {
                let slackUserId = m.profiles.slack_user_id

                // Lookup if not cached
                if (!slackUserId) {
                  slackUserId = await lookupSlackUserId(m.profiles.email)
                  if (slackUserId) {
                    await saveSlackUserId(supabase, m.profiles.email, slackUserId)
                  }
                }

                // Add to channel if found and not already in
                if (slackUserId && !existingMembers.has(slackUserId)) {
                  await syncSlackChannelMember(channelId, slackUserId)
                }
              } catch (err) {
                errors.push(`Slack member ${m.profiles.email}: ${err.message}`)
              }
            }

            // Post welcome message only for new channels
            if (isNewChannel && githubProjectId) {
              const projectUrl = deriveProjectUrl(githubProjectId)
              const teamUrl = deriveTeamUrl(teamSlug)

              await postSlackMessage(
                channelId,
                `🚀 Welcome to ${project.name}!\n\n` +
                `GitHub Project: ${projectUrl}\n` +
                `GitHub Team: ${teamUrl}\n\n` +
                `Create your repos and link them to the project board!`
              )
            }
          } catch (err) {
            errors.push(`Slack member sync: ${err.message}`)
          }
        }

        // Determine overall status
        const status = errors.length === 0 ? 'success' : 'partial'
        results.push({
          type: 'project',
          name: project.name,
          status,
          ...(errors.length > 0 && { errors })
        })

      } catch (err) {
        console.error(`Critical error processing project ${project.name}:`, err)
        results.push({
          type: 'project',
          name: project.name,
          status: 'error',
          errors: [err.message]
        })
      }
    }

    // ========================================================================
    // PROCESS CLASSES
    // ========================================================================

    for (const cls of classes || []) {
      const errors: string[] = []

      try {
        // Fetch members
        const { data: members } = await supabase
          .from('class_enrollments')
          .select('user_id, role, profiles!inner(email, full_name, slack_user_id)')
          .eq('class_id', cls.id)

        if (!members?.length) {
          results.push({
            type: 'class',
            name: cls.name,
            status: 'error',
            errors: ['No members found']
          })
          continue
        }

        // STEP 1: Ensure Slack Channel exists
        let channelId = cls.slack_channel_id
        let isNewChannel = false
        try {
          const channelName = `class-${cls.name}-${cls.semesters.code}`
          const newChannelId = await ensureSlackChannel(channelName, cls.slack_channel_id)

          isNewChannel = newChannelId !== cls.slack_channel_id
          channelId = newChannelId

          // Update database if changed
          if (isNewChannel) {
            await supabase
              .from('classes')
              .update({ slack_channel_id: channelId })
              .eq('id', cls.id)
          }
        } catch (err) {
          errors.push(`Slack Channel: ${err.message}`)
        }

        // STEP 2: Sync Slack Channel Members
        if (channelId) {
          try {
            const existingMembers = await getSlackChannelMembers(channelId)

            for (const m of members) {
              try {
                let slackUserId = m.profiles.slack_user_id

                // Lookup if not cached
                if (!slackUserId) {
                  slackUserId = await lookupSlackUserId(m.profiles.email)
                  if (slackUserId) {
                    await saveSlackUserId(supabase, m.profiles.email, slackUserId)
                  }
                }

                // Add to channel if found and not already in
                if (slackUserId && !existingMembers.has(slackUserId)) {
                  await syncSlackChannelMember(channelId, slackUserId)
                }
              } catch (err) {
                errors.push(`Slack member ${m.profiles.email}: ${err.message}`)
              }
            }

            // Post welcome message only for new channels
            if (isNewChannel) {
              const teacher = members.find(m => m.role === 'teacher')
              await postSlackMessage(
                channelId,
                `📚 Welcome to ${cls.name}!\n\n` +
                `${teacher ? `Instructor: ${teacher.profiles.full_name}` : ''}`
              )
            }
          } catch (err) {
            errors.push(`Slack member sync: ${err.message}`)
          }
        }

        // Determine overall status
        const status = errors.length === 0 ? 'success' : 'partial'
        results.push({
          type: 'class',
          name: cls.name,
          status,
          ...(errors.length > 0 && { errors })
        })

      } catch (err) {
        console.error(`Critical error processing class ${cls.name}:`, err)
        results.push({
          type: 'class',
          name: cls.name,
          status: 'error',
          errors: [err.message]
        })
      }
    }

    // ========================================================================
    // RETURN RESULTS
    // ========================================================================

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