// supabase/functions/process-application-acceptance/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationAcceptedPayload {
    application_id: string
    user_id: string
    application_type: 'board' | 'project' | 'class'
    board_position?: string
    project_id?: string
    class_id?: string
    user_email: string
    user_name: string
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: ApplicationAcceptedPayload = await req.json()
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        console.log('Processing accepted application:', payload)

        // Step 1: Check current role and upgrade if prospect
        const { data: currentRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', payload.user_id)
            .single()

        if (currentRole?.role === 'prospect') {
            const { error: roleError } = await supabase
                .from('user_roles')
                .update({ role: 'member' })
                .eq('user_id', payload.user_id)

            if (roleError) throw new Error(`Failed to upgrade role: ${roleError.message}`)
            console.log('✅ Upgraded prospect to member')
        }

        // Step 2: Add user to project/class if applicable
        if (payload.application_type === 'project' && payload.project_id) {
            const { data: application } = await supabase
                .from('applications')
                .select('project_role')
                .eq('id', payload.application_id)
                .single()

            const { error: memberError } = await supabase
                .from('project_members')
                .insert({
                    project_id: payload.project_id,
                    user_id: payload.user_id,
                    role: application?.project_role || 'member'
                })

            if (memberError) throw new Error(`Failed to add to project: ${memberError.message}`)
            console.log('✅ Added user to project')
        }

        if (payload.application_type === 'class' && payload.class_id) {
            const { data: application } = await supabase
                .from('applications')
                .select('class_role')
                .eq('id', payload.application_id)
                .single()

            const { error: enrollError } = await supabase
                .from('class_enrollments')
                .insert({
                    class_id: payload.class_id,
                    user_id: payload.user_id,
                    role: application?.class_role || 'student'
                })

            if (enrollError) throw new Error(`Failed to enroll in class: ${enrollError.message}`)
            console.log('✅ Enrolled user in class')
        }

        // Step 3: Send Slack invitation
        try {
            const slackResponse = await fetch('https://slack.com/api/admin.users.invite', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    team_id: Deno.env.get('SLACK_TEAM_ID'),
                    email: payload.user_email,
                    real_name: payload.user_name,
                    resend: true
                })
            })

            const slackData = await slackResponse.json()
            if (!slackData.ok) {
                console.warn('⚠️ Slack invitation failed:', slackData.error)
            } else {
                console.log('✅ Sent Slack invitation')
            }
        } catch (slackError) {
            console.warn('⚠️ Slack invitation error:', slackError)
        }

        // Step 4: Send acceptance email
        const emailSubject = getEmailSubject(payload.application_type, payload.board_position)
        const emailHtml = getEmailHtml(payload)

        try {
            const emailResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Claude Builder Club <noreply@claudemsu.org>',
                    to: payload.user_email,
                    subject: emailSubject,
                    html: emailHtml
                })
            })

            if (!emailResponse.ok) {
                console.warn('⚠️ Email sending failed')
            } else {
                console.log('✅ Sent acceptance email')
            }
        } catch (emailError) {
            console.warn('⚠️ Email error:', emailError)
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Application acceptance processed successfully',
                upgraded_role: currentRole?.role === 'prospect'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error processing application acceptance:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

function getEmailSubject(type: string, position?: string): string {
    switch (type) {
        case 'board':
            return `🎉 Welcome to the Board - ${position || 'Board Member'}`
        case 'project':
            return '🎉 Project Application Accepted!'
        case 'class':
            return '🎉 Class Application Accepted!'
        default:
            return '🎉 Application Accepted!'
    }
}

function getEmailHtml(payload: ApplicationAcceptedPayload): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Accepted</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-top: 0;">Hi ${payload.user_name},</p>

    <p style="font-size: 16px;">
      We're excited to inform you that your application to
      <strong>${getApplicationTarget(payload)}</strong>
      has been accepted!
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0; color: #FF6B35;">Next Steps:</h3>
      <ul style="padding-left: 20px;">
        <li style="margin: 10px 0;">Check your email for a Slack invitation to join our community</li>
        <li style="margin: 10px 0;">Log in to the members portal to access your dashboard</li>
        <li style="margin: 10px 0;">Attend our next meeting to meet the team</li>
        ${payload.application_type === 'project' || payload.application_type === 'class'
            ? '<li style="margin: 10px 0;">You\'ll be added to the project/class channel when it starts</li>'
            : ''}
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://members.claudemsu.org/dashboard"
         style="display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Go to Dashboard
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      Questions? Reply to this email or reach out on Slack!<br>
      <strong>Claude Builder Club @ MSU</strong>
    </p>
  </div>
</body>
</html>
  `
}

function getApplicationTarget(payload: ApplicationAcceptedPayload): string {
    switch (payload.application_type) {
        case 'board':
            return payload.board_position || 'Board Position'
        case 'project':
            return 'the project'
        case 'class':
            return 'the class'
        default:
            return 'Claude Builder Club'
    }
}