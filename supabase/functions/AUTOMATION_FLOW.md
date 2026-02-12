# Smart Slack Channel Auto-Add System

## Overview

This system intelligently handles Slack workspace and channel invitations based on the state of projects/classes when users are accepted.

## The Complete Workflow

### Scenario 1: Project/Class Hasn't Started Yet (Normal Flow)

**Timeline:**
1. **User applies** → Gets accepted by board
2. **`process-application-update` runs:**
   - Adds user to project_members/class_enrollments
   - Checks if project/class has `slack_channel_id` → **NO** (not started)
   - Email sent: "Join Slack workspace, you'll be added to channel when semester starts"
3. **User joins Slack** via invite link (anytime before start)
4. **Semester start date arrives** → `process-start-automation` cron runs:
   - Creates Slack channel for project/class
   - Looks up ALL member emails via `users.lookupByEmail`
   - **Saves Slack user IDs to profiles** (NEW!)
   - Adds all members to the channel
   - Posts welcome message

### Scenario 2: Project/Class Already Started (Late Acceptance)

**Timeline:**
1. **User applies** → Gets accepted by board
2. **`process-application-update` runs:**
   - Adds user to project_members/class_enrollments
   - Checks if project/class has `slack_channel_id` → **YES** (already started!)
   - **Smart Logic Kicks In:**
     - If user has `slack_user_id` in profile → Add to channel immediately ✅
     - If user doesn't have `slack_user_id`:
       - Look it up via `users.lookupByEmail`
       - Save it to their profile
       - Add them to channel immediately ✅
   - Email sent: "You've been added to the Slack channel!" (or "join workspace first if you haven't")

## Key Enhancements

### 1. Enhanced `process-application-update`

**New Features:**
- ✅ Checks if project/class has active Slack channel
- ✅ Looks up Slack user ID if not already saved
- ✅ Saves Slack user ID to profile
- ✅ Immediately adds user to channel (no waiting!)
- ✅ Smart email messaging based on state

**New Slack Helper Functions:**
```typescript
async function lookupSlackUserIdByEmail(email: string): Promise<string | null>
async function addUserToSlackChannel(slackUserId: string, channelId: string): Promise<boolean>
```

**Smart Email Logic:**
- `addedToChannel=true` → "You've been added to the channel!"
- `hasSlackAccount=true` → "You'll be added when semester starts"
- `hasSlackAccount=false` → "Join Slack workspace first"

### 2. Enhanced `process-start-automation`

**New Features:**
- ✅ **Saves Slack user IDs to profiles** when looking them up
- ✅ Only processes projects/classes without `slack_channel_id` (prevents re-processing)
- ✅ Persistent Slack ID storage for future use

**Modified Function:**
```typescript
async function getSlackUserIds(
  emails: string[],
  supabase: any // Now takes supabase client
): Promise<string[]>
```

Now updates profiles:
```typescript
await supabase
  .from('profiles')
  .update({ slack_user_id: slackUserId })
  .eq('email', email)
  .is('slack_user_id', null) // Only update if not already set
```

## Benefits

### For Users
- **Immediate access** to Slack channels when joining late
- **No waiting** for next cron run
- **Clear communication** about Slack status in emails
- **Seamless experience** whether project started or not

### For System
- **Slack user IDs persisted** for reuse
- **No duplicate work** - checks if already processed
- **Graceful handling** of all edge cases
- **Audit trail** via console logs

## Edge Cases Handled

### 1. User Not on Slack Yet
- Email shows "Join Slack workspace" button
- When they join, ID will be looked up on next action
- Channel invite waits until they join

### 2. Slack API Lookup Fails
- Non-critical - logs warning but doesn't fail acceptance
- User can still join manually via Slack
- Will be picked up by next cron run if they join workspace

### 3. User Already in Channel
- Slack API returns `already_in_channel` error
- We handle gracefully and log success
- No disruption to user

### 4. Multiple Acceptances (Rare)
- Slack user ID save uses `is('slack_user_id', null)` filter
- Won't overwrite existing IDs
- Idempotent operations

## Environment Variables Required

Add to your Supabase Edge Function secrets:

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_JOIN_LINK=https://join.slack.com/t/your-workspace/...
```

### Slack Bot Token Scopes Needed

- `users:read` - For `users.lookupByEmail`
- `users:read.email` - For email lookup
- `conversations:read` - For channel operations
- `conversations:write` - For creating channels
- `chat:write` - For posting messages
- `groups:write` - For managing channel members

## Database Schema Requirements

Ensure `profiles` table has:
```sql
slack_user_id TEXT NULL
```

Ensure `projects` and `classes` tables have:
```sql
slack_channel_id TEXT NULL
```

## Testing Checklist

- [ ] Accept user to project that hasn't started → Check email says "will be added"
- [ ] Accept user to project that HAS started → Check email says "added to channel"
- [ ] Accept user without Slack account → Check email shows join button
- [ ] Accept user with Slack account → Check no join button
- [ ] Run cron → Check Slack IDs saved to profiles
- [ ] Check user actually added to Slack channel
- [ ] Check console logs for detailed flow
- [ ] Test with user not on Slack yet
- [ ] Test with Slack API failure (mock)

## Monitoring

Key log messages to watch for:
- `✅ Saved Slack user ID for [email]`
- `✅ Added user [id] to channel [channel_id]`
- `🔍 Project/Class has active channel: [id]`
- `⚠️ Could not find Slack account for [email]`

## Rollback Safety

The `process-application-update` function includes rollback for:
- Application status changes
- Role upgrades
- Project/class membership

Slack operations are **non-critical** and won't trigger rollbacks if they fail.

## Future Enhancements

Possible improvements:
- **Retry logic** for failed Slack lookups
- **Batch Slack invites** for multiple users
- **Slack notification** to project lead when new member added
- **Dashboard indicator** showing Slack connection status
- **Manual "Sync Slack ID" button** for users