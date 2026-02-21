// supabase/functions/process-application-update/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { Resend } from 'npm:resend'


const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SLACK_JOIN_LINK = Deno.env.get('SLACK_JOIN_LINK')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationUpdatePayload {
    application_id: string
    status: 'accepted' | 'rejected'
    reviewer_id: string
}

// ============================================================================
// EMAIL HELPER FUNCTIONS
// ============================================================================

async function sendDecisionEmail(
    email: string,
    fullName: string,
    applicationType: string,
    boardPosition: string | null,
    status: 'accepted' | 'rejected',
    hasSlackAccount: boolean,
): Promise<void> {
    const subject = getEmailSubject(applicationType, boardPosition)
    const html = getEmailHtml(
        fullName,
        applicationType,
        boardPosition,
        status,
        hasSlackAccount,
    )

    const resend = new Resend(RESEND_API_KEY)

    try {
        await resend.emails.send({
            from: 'Claude Builder Club <noreply@claudemsu.dev>',
            to: email,
            subject: subject,
            html: html
        })
    } catch (error) {
        console.warn(`Email sending failed for ${email}:`, error)
    }
}

function getEmailSubject(
    type: string,
    position: string | null,
): string {
    switch (type) {
        case 'board':
            return `Board Application Update - ${position || 'Board Member'}`
        case 'project':
            return 'Project Application Update'
        case 'class':
            return 'Class Application Update'
        default:
            return 'Application Update'
    }
}

function getEmailHtml(
    fullName: string,
    applicationType: string,
    boardPosition: string | null,
    status: 'accepted' | 'rejected',
    hasSlackAccount: boolean,
): string {
    const target = getApplicationTarget(applicationType, boardPosition)
    const accepted = status === 'accepted'

    // Smart Slack messaging based on state
    let slackSection = ''
    let slackButton = ''

    if (accepted) {
        if (hasSlackAccount) {
            // Has Slack account, channel will be created when semester starts
            slackSection = `<li style="margin: 10px 0;"><strong>Slack:</strong> You'll be added to the ${applicationType} channel when the semester starts!</li>`
        } else {
            // Needs to join Slack workspace first
            slackSection = `<li style="margin: 10px 0;"><strong>Join Slack:</strong> This is where we communicate. Please join using your <b>@msu.edu</b> university email.</li>`
        }

        // Show join button only if they don't have Slack account
        if (!hasSlackAccount && SLACK_JOIN_LINK) {
            slackButton = `<div style="text-align: center; margin: 25px 0;">
                 <a href="${SLACK_JOIN_LINK}"
                    style="display: inline-block; background: #4A154B; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
                   Join Slack Workspace
                 </a>
               </div>`
        }
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f9fafb; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">

    <!-- Logo Header -->
    <div style="text-align: center; padding: 40px 30px 30px 30px;">
      <img src="https://claudemsu.dev/claude-logo.png" alt="Claude Builder Club" style="height: 60px; width: auto;">
      <h2 style="margin: 20px 0 0 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">
        Application Update
      </h2>
    </div>

    <!-- Content -->
    <div style="padding: 0 40px 40px 40px;">
      <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0;">
        Hi ${fullName},
      </p>

      ${accepted
            ? `<p style="font-size: 16px; color: #4b5563; margin: 0 0 30px 0;">
          We're excited to inform you that your application to <strong>${target}</strong> has been accepted!
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Next Steps:</h3>
          <ul style="padding-left: 20px; margin: 0; color: #4b5563;">
            ${slackSection}
            <li style="margin: 8px 0;">Log in to the members portal to access your dashboard</li>
            <li style="margin: 8px 0;">Attend our next meeting to meet the team</li>
          </ul>
        </div>

        ${slackButton}

        <div style="text-align: center; margin: 35px 0;">
          <a href="https://claudemsu.dev/dashboard"
             style="display: inline-block; background-color: rgb(223, 115, 83); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
            Go to Dashboard
          </a>
        </div>`
            : `<p style="font-size: 16px; color: #4b5563; margin: 0 0 30px 0;">
          Thank you for your application to <strong>${target}</strong>. After careful review, we've decided not to move forward at this time.
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Stay Involved:</h3>
          <ul style="padding-left: 20px; margin: 0; color: #4b5563;">
            <li style="margin: 8px 0;">We encourage you to stay active in Claude Builder Club events</li>
            <li style="margin: 8px 0;">You're welcome to apply again in a future semester</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="https://claudemsu.dev/applications"
             style="display: inline-block; background-color: rgb(223, 115, 83); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
            View Applications
          </a>
        </div>`
        }

      <!-- Divider -->
      <div style="border-top: 1px solid #e5e7eb; margin: 35px 0;"></div>

      <!-- Help Section -->
      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        Need help? Email us at
        <a href="mailto:RSO.claudemsu@msu.edu" style="color: rgb(223, 115, 83); text-decoration: none;">rso.claudemsu@msu.edu</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 14px; color: #6b7280; font-weight: 500;">
        Claude Builder Club @ MSU
      </p>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #9ca3af;">
        Building the future with AI, one project at a time.
      </p>
    </div>

  </div>
</body>
</html>
  `
}

function getApplicationTarget(type: string, position: string | null): string {
    switch (type) {
        case 'board':
            return position || 'Board Position'
        case 'project':
            return 'the project'
        case 'class':
            return 'the class'
        default:
            return 'Claude Builder Club'
    }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Track what we've changed for rollback
    const rollbackActions: (() => Promise<void>)[] = []

    try {
        const payload: ApplicationUpdatePayload = await req.json()

        // ========================================================================
        // STEP 1: Load application and profile data
        // ========================================================================
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', payload.application_id)
            .single()

        if (appError || !application) {
            throw new Error(`Application not found: ${appError?.message ?? 'no_row'}`)
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email, full_name, slack_user_id')
            .eq('id', application.user_id)
            .single()

        if (profileError || !profile) {
            throw new Error(`Profile not found: ${profileError?.message ?? 'no_row'}`)
        }

        const userEmail = profile.email
        const userName = profile.full_name || application.full_name
        const hasSlackAccount = !!profile.slack_user_id

        // Save original values for rollback
        const originalStatus = application.status
        const originalReviewedBy = application.reviewed_by
        const originalReviewedAt = application.reviewed_at

        // ========================================================================
        // STEP 2: Update application status (CRITICAL - must succeed)
        // ========================================================================
        const { error: updateError } = await supabase
            .from('applications')
            .update({
                status: payload.status,
                reviewed_by: payload.reviewer_id,
                reviewed_at: new Date().toISOString(),
            })
            .eq('id', payload.application_id)

        if (updateError) {
            throw new Error(`Failed to update application: ${updateError.message}`)
        }

        // Add rollback for application status
        rollbackActions.push(async () => {
            await supabase
                .from('applications')
                .update({
                    status: originalStatus,
                    reviewed_by: originalReviewedBy,
                    reviewed_at: originalReviewedAt,
                })
                .eq('id', payload.application_id)
        })

        // ========================================================================
        // STEP 3: For ACCEPTED applications only - upgrade role if needed
        // ========================================================================

        if (payload.status === 'accepted') {
            const { data: currentRole } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', application.user_id)
                .single()

            const isProspect = currentRole?.role === 'prospect'
            const needsRoleUpgrade =
                isProspect &&
                (application.application_type === 'project' || application.application_type === 'class')

            if (needsRoleUpgrade) {
                const { error: roleError } = await supabase
                    .from('user_roles')
                    .update({ role: 'member' })
                    .eq('user_id', application.user_id)

                if (roleError) {
                    throw new Error(`Failed to upgrade role: ${roleError.message}`)
                }

                // Add rollback for role upgrade
                rollbackActions.push(async () => {
                    await supabase
                        .from('user_roles')
                        .update({ role: 'prospect' })
                        .eq('user_id', application.user_id)
                })
            }

            // ======================================================================
            // STEP 4: Add to project/class (CRITICAL - must succeed)
            // ======================================================================

            if (application.application_type === 'project' && application.project_id) {
                const { error: memberError } = await supabase
                    .from('project_members')
                    .insert({
                        project_id: application.project_id,
                        user_id: application.user_id,
                        role: application.project_role || 'member'
                    })

                if (memberError) {
                    throw new Error(`Failed to add to project: ${memberError.message}`)
                }

                // Add rollback for project membership
                rollbackActions.push(async () => {
                    await supabase
                        .from('project_members')
                        .delete()
                        .eq('project_id', application.project_id)
                        .eq('user_id', application.user_id)
                })

            }

            if (application.application_type === 'class' && application.class_id) {
                const { error: enrollError } = await supabase
                    .from('class_enrollments')
                    .insert({
                        class_id: application.class_id,
                        user_id: application.user_id,
                        role: application.class_role || 'student'
                    })

                if (enrollError) {
                    throw new Error(`Failed to enroll in class: ${enrollError.message}`)
                }

                // Add rollback for class enrollment
                rollbackActions.push(async () => {
                    await supabase
                        .from('class_enrollments')
                        .delete()
                        .eq('class_id', application.class_id)
                        .eq('user_id', application.user_id)
                })

            }

        }

        // ========================================================================
        // STEP 5: Send decision email (non-critical - don't throw on failure)
        // ========================================================================
        try {
            await sendDecisionEmail(
                userEmail,
                userName,
                application.application_type,
                application.board_position,
                payload.status,
                hasSlackAccount
            )
        } catch (emailError) {
            console.warn('⚠️ Email sending failed:', emailError)
        }

        // ========================================================================
        // SUCCESS - Clear rollback actions
        // ========================================================================

        return new Response(
            JSON.stringify({
                success: true,
                message: `Application ${payload.status} successfully`,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        // ========================================================================
        // ERROR - Execute all rollback actions
        // ========================================================================
        console.error('Error during application update:', error)

        for (const rollback of rollbackActions.reverse()) {
            try {
                await rollback()
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError)
            }
        }

        return new Response(
            JSON.stringify({
                error: error.message || 'Failed to process application update'
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})