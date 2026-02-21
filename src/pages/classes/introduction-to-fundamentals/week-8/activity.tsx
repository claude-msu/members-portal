import { useNavigate } from 'react-router-dom';
import { Workflow } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week8Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={8}
                session="Activity"
                title="Sprint Simulation & Project Showcase"
                description="Close out your GitHub Project board, demo your full-stack web app as a sprint review demo, retrospective, and walk through what you would build in the next sprint."
                icon={<Workflow className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
            />

            <LectureCallout type="info">
                Your deliverable for this activity is your full-stack project from Weeks 2–5, not a previous standalone project. Make sure it is running before the session starts.
            </LectureCallout>

            {/* ── 01 SET UP GITHUB PROJECTS ────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Set Up Your Project Board" />

            <ActivityChallenge
                number="1.1"
                title="Create the GitHub Project"
                description="Get your board live before writing a single story."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Go to your chosen project's GitHub repo → <strong>Projects</strong> tab → <strong>New project</strong> → choose <strong>Board</strong> layout</ActivityTask>
                    <ActivityTask>Rename the default columns to: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Backlog</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Sprint</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">In Progress</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">In Review</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Done</code></ActivityTask>
                    <ActivityTask>Add a custom number field called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Points</code> for story point estimates</ActivityTask>
                    <ActivityTask>Add a custom single-select field called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Type</code> with options: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Feature</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Bug</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Chore</code></ActivityTask>
                    <ActivityTask>Create a Milestone called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Sprint 1</code> with a due date two weeks from today (Settings → Milestones)</ActivityTask>
                </div>

                <ActivityHint label="linking the project to your repo">
                    When creating the project from the repo's Projects tab, it's automatically linked. If you created it from your profile, go to the project settings → Linked repositories and add your repo. This lets you add issues directly to the board.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 02 DEFINE EPICS ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Define Epics & Write User Stories" />

            <ActivityChallenge
                number="2.1"
                title="Map Out Two Epics"
                description="Epics are large bodies of work that group related stories. Start broad, then break down."
            >
                <LectureP>
                    Create two GitHub Issues that serve as your epics. Use the label <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">epic</code> (create the label if it doesn't exist). Epics don't get story points — they're containers for stories.
                </LectureP>
                <div className="mt-4 space-y-1">
                    <ActivityTask><strong>Task Tracker epics (pick two):</strong> "User Authentication," "Task Filtering & Search," "Team Collaboration," "Mobile Responsive Design"</ActivityTask>
                    <ActivityTask><strong>Notes API epics (pick two):</strong> "User Management," "Note Organization (tags/folders)," "Search & Full-Text Index," "API Rate Limiting & Security"</ActivityTask>
                    <ActivityTask><strong>Library System epics (pick two):</strong> "Member Management," "Overdue & Fine Tracking," "Catalog Search," "Notification System"</ActivityTask>
                    <ActivityTask>In each epic issue body, write 2–3 sentences describing the scope and why it matters to users</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.2"
                title="Write 8 User Stories"
                description="4 stories per epic. Each as a GitHub Issue in the Backlog column."
            >
                <LectureP>
                    Create 8 GitHub Issues — 4 under each epic. Each issue must follow the format and include acceptance criteria:
                </LectureP>
                <div className="mt-4 space-y-1">
                    <ActivityTask>Title: one-line summary of the feature (not a task — a user outcome)</ActivityTask>
                    <ActivityTask>Body: full user story — <em>"As a [user], I want [goal] so that [reason]"</em></ActivityTask>
                    <ActivityTask>Acceptance criteria: 2–4 bullet points defining exactly when this story is "done"</ActivityTask>
                    <ActivityTask>Assign a story point estimate (Points field): 1, 2, 3, 5, or 8</ActivityTask>
                    <ActivityTask>Set the Type field to Feature, Bug, or Chore as appropriate</ActivityTask>
                    <ActivityTask>Add each issue to the Backlog column of your project board</ActivityTask>
                </div>

                <ActivityHint label="what makes a good story vs a bad one">
                    Bad: "Fix the login page." (a task, not a user outcome). Good: "As a returning user, I want to stay logged in across browser sessions so that I don't have to authenticate every time I open the app." The difference: who benefits, what they get, why it matters. If you can't fill in all three, the story isn't ready.
                </ActivityHint>
                <ActivityHint label="sizing with story points">
                    Use 1 for trivial (update a label, add a field). Use 2–3 for standard features (one UI component + one API endpoint). Use 5 for complex features requiring multiple components or significant design work. Use 8 sparingly — if it's 8 points, it should probably be broken into two stories. Never estimate in hours; always in relative complexity.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 03 SPRINT PLANNING ──────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Sprint Planning" />

            <ActivityChallenge
                number="3.1"
                title="Run Sprint Planning"
                description="Pull stories into the sprint and define your sprint goal."
            >
                <LectureP>
                    Sprint planning answers two questions: <em>What can we deliver this sprint?</em> and <em>How will we do it?</em> Your velocity (capacity) for a one-person sprint is roughly 8–12 points.
                </LectureP>
                <div className="mt-4 space-y-1">
                    <ActivityTask>Select stories from the Backlog that total 8–12 points — start with the highest priority (most valuable to users)</ActivityTask>
                    <ActivityTask>Move the selected stories to the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Sprint</code> column and assign them to the Sprint 1 milestone</ActivityTask>
                    <ActivityTask>Write a sprint goal: one sentence describing what users will be able to do after this sprint that they can't do now. Add it to the milestone description</ActivityTask>
                    <ActivityTask>For each story in the sprint, break it into implementation tasks as GitHub issue comments (not separate issues): "Add POST /login endpoint," "Implement JWT token generation," "Add auth middleware to protected routes"</ActivityTask>
                </div>

                <ActivityHint label="ordering the backlog">
                    Prioritize by value and dependency. Ask: which stories unlock others? Which deliver the most user value with the least effort? A simple framework: High value + Low effort = do first. Low value + High effort = do last or cut entirely.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 04 SET UP CI ─────────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="CI Pipeline & Branch Protection" />

            <ActivityChallenge
                number="4.1"
                title="Wire Up Your CI Pipeline"
                description="No code merges unless the pipeline is green."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/workflows/ci.yml</code> in your project's repo</ActivityTask>
                    <ActivityTask>The pipeline must run on push to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code> and on all pull requests targeting <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                    <ActivityTask><strong>For TypeScript projects (Task Tracker):</strong> install dependencies with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm ci</code>, then run type check, lint, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run build</code></ActivityTask>
                    <ActivityTask><strong>For Python projects (Notes API):</strong> install with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pip install -r requirements.txt</code>, run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ruff check .</code> for linting</ActivityTask>
                    <ActivityTask>Push the workflow file and confirm the pipeline runs in the Actions tab — fix any issues until it's green on <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                </div>

                <ActivityHint label="ruff for Python linting">
                    <code className="bg-muted px-1 rounded">pip install ruff</code> then add <code className="bg-muted px-1 rounded">ruff check .</code> to your workflow. Ruff is an extremely fast Python linter written in Rust — it replaces flake8, pylint, and isort in one tool.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.2"
                title="Enable Branch Protection"
                description="Enforce the pipeline — make it impossible to merge broken code."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Go to repo Settings → Branches → Add branch protection rule for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                    <ActivityTask>Enable: <em>Require a pull request before merging</em></ActivityTask>
                    <ActivityTask>Enable: <em>Require status checks to pass before merging</em> — add your CI job as a required check</ActivityTask>
                    <ActivityTask>Enable: <em>Require branches to be up to date before merging</em></ActivityTask>
                    <ActivityTask>Test it: create a branch, make a change that breaks the build (intentional typo), open a PR, and confirm the merge button is blocked until CI passes</ActivityTask>
                </div>
            </ActivityChallenge>

            {/* ── 05 EXECUTE THE SPRINT ────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Execute the Sprint" />

            <ActivityChallenge
                number="5.1"
                title="Ship at Least Two Stories"
                description="Complete the full development cycle — branch, code, PR, review, merge, done."
            >
                <LectureP>
                    For each story you complete, follow this exact workflow — no shortcuts:
                </LectureP>
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create a branch named <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">feature/issue-{'{number}'}-short-description</code> off <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                    <ActivityTask>Implement the feature. Commit with a descriptive message — not "fix" or "changes." Format: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">feat: add search endpoint with title filter (#42)</code></ActivityTask>
                    <ActivityTask>Open a pull request. Write a description: what changed, why, and how to verify it works</ActivityTask>
                    <ActivityTask>In the PR description, write <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Closes #{'{issue number}'}</code> to link it to the story</ActivityTask>
                    <ActivityTask>Wait for CI to pass — if it fails, fix it before requesting review</ActivityTask>
                    <ActivityTask>If working with a partner: request their review. If solo: self-review by reading the diff critically as if you were someone else, then approve and merge</ActivityTask>
                    <ActivityTask>After merge, confirm the linked issue auto-closed and the card moved to Done on the board</ActivityTask>
                </div>

                <ActivityHint label="conventional commit format">
                    Industry standard commit prefixes: <code className="bg-muted px-1 rounded">feat:</code> new feature, <code className="bg-muted px-1 rounded">fix:</code> bug fix, <code className="bg-muted px-1 rounded">chore:</code> tooling/config, <code className="bg-muted px-1 rounded">docs:</code> documentation, <code className="bg-muted px-1 rounded">test:</code> adding tests, <code className="bg-muted px-1 rounded">refactor:</code> code restructuring with no behavior change. Consistent prefixes make git log actually readable.
                </ActivityHint>
                <ActivityHint label="auto-closing issues with PR keywords">
                    GitHub recognizes these keywords in PR descriptions to auto-close issues on merge: <code className="bg-muted px-1 rounded">Closes</code>, <code className="bg-muted px-1 rounded">Fixes</code>, <code className="bg-muted px-1 rounded">Resolves</code> followed by <code className="bg-muted px-1 rounded">#issue-number</code>. The issue closes when the PR merges into the default branch — not when the PR is opened.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 06 WRITE TESTS ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Add Tests" />

            <ActivityChallenge
                number="6.1"
                title="Write Tests for One Story"
                description="Apply TDD retroactively — write the tests that should have come first."
            >
                <LectureP>
                    Pick one of the stories you shipped and write tests for its core logic. Tests go in a separate PR — this is intentional. Seeing the untested behavior first then writing tests that pin it down is a common pattern when adding tests to existing code.
                </LectureP>
                <div className="mt-4 space-y-1">
                    <ActivityTask><strong>TypeScript:</strong> install Vitest (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install -D vitest</code>), add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">test: vitest</code> to package.json scripts, write at least 3 tests for the feature's pure logic</ActivityTask>
                    <ActivityTask><strong>Python:</strong> use pytest (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pip install pytest</code>), create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">test_feature.py</code>, write at least 3 tests covering the happy path, an edge case, and an error case</ActivityTask>
                    <ActivityTask>Add the test command to your CI pipeline — the pipeline should now fail if tests fail</ActivityTask>
                    <ActivityTask>Make sure all 3 tests pass before opening the PR</ActivityTask>
                    <ActivityTask>In the PR description, note which acceptance criteria each test covers</ActivityTask>
                </div>

                <ActivityHint label="what to test for a search feature">
                    For a search endpoint: (1) searching with a valid query returns matching results, (2) searching with a query that matches nothing returns an empty list (not an error), (3) searching with an empty string returns all items or a sensible default. These three cases — happy path, empty result, edge case — cover most search implementations.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 07 RETROSPECTIVE ─────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Sprint Retrospective" />

            <ActivityChallenge
                number="7.1"
                title="Run the Retrospective"
                description="Reflect on the sprint and produce concrete action items — not vague intentions."
            >
                <LectureP>
                    Create a new GitHub Issue titled <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Sprint 1 Retrospective</code> with label <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">retrospective</code>. Use this as the written record.
                </LectureP>
                <div className="mt-4 space-y-1">
                    <ActivityTask>Record your sprint metrics: how many points planned, how many completed, which stories carried over and why</ActivityTask>
                    <ActivityTask>Write at least 2 items for each category: <em>Start</em> (things to begin doing), <em>Stop</em> (things that aren't working), <em>Continue</em> (things that are working)</ActivityTask>
                    <ActivityTask>For each Stop and Start item, write one concrete action: not "write more tests" but "every PR must include at least one test for the new behavior before requesting review"</ActivityTask>
                    <ActivityTask>Assess the sprint goal: did you achieve what you set out to achieve? If not, what was the actual blocker?</ActivityTask>
                    <ActivityTask>Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Sprint 2</code> milestone and move any uncompleted Sprint 1 stories to the Backlog — don't automatically move them to Sprint 2 without re-evaluating priority</ActivityTask>
                </div>

                <ActivityHint label="if you completed everything">
                    That's either great execution or under-planning. Look at your estimates: were the stories actually the point value you assigned? If a 5-point story took 45 minutes, your velocity calibration is off — adjust your estimates going forward. The goal is accuracy, not sandbagging.
                </ActivityHint>
                <ActivityHint label="if you completed nothing">
                    That's a signal, not a failure. Common causes: stories were too large (should have been broken up further), blocked on external dependencies not accounted for in planning, or the estimate methodology was off. The retrospective is specifically for diagnosing this — write it down honestly.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── BONUS ────────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Bonus Challenges" />

            <ActivityChallenge
                number="★"
                title="Sprint 2 — Keep Going"
                description="Run the full cycle again with improvements from your retrospective."
            >
                <LectureP>
                    Take your Sprint 1 retrospective action items seriously. Apply them in Sprint 2 planning. Compare your velocity — did you ship more points or fewer? Were your estimates more accurate? A team that improves sprint-over-sprint is executing agile correctly.
                </LectureP>
            </ActivityChallenge>

            <ActivityChallenge
                number="★"
                title="Pair on a Story"
                description="Collaborate with a classmate using a real PR review workflow."
            >
                <LectureP>
                    Pick one story and implement it with a classmate: one person writes the code, the other reviews it. The reviewer must leave at least three substantive comments — questions, suggestions, or required changes. The author responds to every comment before merging. This is what professional code review actually looks like.
                </LectureP>
            </ActivityChallenge>

            <ActivityChallenge
                number="★"
                title="Burndown Chart"
                description="Track your sprint progress visually, day by day."
            >
                <LectureP>
                    Each day of your sprint, record how many story points remain in a simple spreadsheet (Google Sheets or GitHub wiki). Plot actual vs. ideal remaining points. After the sprint, look at the shape: a smooth decline means consistent progress; a cliff at the end means you rushed. Add the chart image to your retrospective issue.
                </LectureP>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'CI/CD, TDD & Engineering Culture',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/lecture-2'),
                }}
                next={{
                    label: 'Introduction to Fundamentals',
                    onClick: () => navigate('/classes/introduction-to-fundamentals'),
                }}
            />
        </LectureLayout>
    );
}