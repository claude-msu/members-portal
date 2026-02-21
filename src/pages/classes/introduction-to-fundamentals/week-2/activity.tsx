import { useNavigate } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week2Activity() {
    const navigate = useNavigate();

    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                week={2}
                session="Activity"
                title="Project Kickoff"
                description="This is where your project starts. Choose your domain, scaffold the repo, set up your GitHub Project board with issues for the next three weeks, and open your first PR."
                icon={<GitBranch className="h-4 w-4" />}
            />

            {/* ── 01 CHOOSE YOUR DOMAIN ───────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Choose Your Domain" />

            <LectureP>
                This project runs Weeks 2–5. By the end you will have a live full-stack web app. Choose one domain now and commit — you are building this all the way through.
            </LectureP>

            {/* Domain selection grid */}
            <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    { num: 1, name: 'Recipe Book', desc: 'Save, browse, and search your personal recipe collection.' },
                    { num: 2, name: 'Study Planner', desc: 'Track courses, assignments, and upcoming deadlines.' },
                    { num: 3, name: 'Expense Tracker', desc: 'Log expenses by category and view spending history.' },
                    { num: 4, name: 'Event Board', desc: 'Create events, browse upcoming ones, and RSVP.' },
                    { num: 5, name: 'Habit Tracker', desc: 'Define habits, log daily completions, and track streaks.' },
                    { num: 6, name: 'Trivia Game', desc: 'Build question banks, play rounds, and track a live leaderboard.' },
                    { num: 7, name: 'Movie Recommender', desc: 'Rate watched movies and get recommendations based on your taste.' },
                ].map((domain) => (
                    <div
                        key={domain.num}
                        className="rounded-xl border border-border bg-card p-4"
                    >
                        <p className="font-semibold text-sm text-foreground">{domain.num}. {domain.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{domain.desc}</p>
                    </div>
                ))}
            </div>

            <LectureCallout type="warning">
                Pick something you would actually want to use. You are going to be inside this codebase for four weeks. Apathy is the main reason projects don't get finished.
            </LectureCallout>

            {/* ── 02 SCAFFOLD YOUR REPOSITORY ─────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Scaffold Your Repository" />

            <ActivityChallenge
                number="2.1"
                title="Create the Repo"
                description="Start with the foundation — a GitHub repo with a README."
            >
                <div className="space-y-1">
                    <ActivityTask>Create a new public GitHub repo named after your project domain (<span title="A naming convention where words are lowercase and separated by hyphens. Example: my-project-name. Common for repo names and URLs.">kebab-case</span>)</ActivityTask>
                    <ActivityTask>Clone it locally</ActivityTask>
                    <ActivityTask>Create a README.md with: project name, your chosen domain, and a 2–3 sentence description of what it will do when finished</ActivityTask>
                    <ActivityTask>Commit and push</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.2"
                title="Set Up Your Folder Structure"
                description="Create the directories that will hold your backend and frontend code."
            >
                <div className="space-y-1">
                    <ActivityTask>Create two folders at the root: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/backend</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/frontend</code></ActivityTask>
                    <ActivityTask>Inside <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/backend</code> create a placeholder main.py with a single comment: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border"># Week 4 — FastAPI backend goes here</code></ActivityTask>
                    <ActivityTask>Inside <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/frontend</code> create a placeholder index.html with a comment: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">&lt;!-- Week 5 — React frontend goes here --&gt;</code></ActivityTask>
                    <ActivityTask>Commit with message: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">chore: scaffold project structure</code></ActivityTask>
                </div>

                <TerminalBlock
                    title="bash — your-project"
                    lines={[
                        { cmd: 'mkdir backend frontend' },
                        { cmd: 'echo "# Week 4 — FastAPI backend goes here" > backend/main.py' },
                        { cmd: 'echo "<!-- Week 5 — React frontend goes here -->" > frontend/index.html' },
                        { cmd: 'git add . && git commit -m "chore: scaffold project structure"' },
                    ]}
                />
            </ActivityChallenge>

            {/* ── 03 SET UP YOUR GITHUB PROJECT BOARD ──────────────────────────── */}
            <LectureSectionHeading number="03" title="Set Up Your GitHub Project Board" />

            <LectureP>
                Every deliverable for this project ships as a pull request that closes a GitHub issue. Set your board up now and you will not have to think about process again — just work.
            </LectureP>

            <ActivityChallenge
                number="3.1"
                title="Create the Board"
                description="Get your Kanban board ready to track work."
            >
                <div className="space-y-1">
                    <ActivityTask>Go to your GitHub repo → <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Projects</code> → <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">New Project</code></ActivityTask>
                    <ActivityTask>Choose the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Board</code> template (Kanban)</ActivityTask>
                    <ActivityTask>Name it after your project</ActivityTask>
                    <ActivityTask>Add three columns: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Backlog</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">In Progress</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Done</code></ActivityTask>
                </div>

                <LectureCallout type="info">
                    <span title="A workflow management method where work items move across columns representing their current status. Originated at Toyota in the 1950s as a manufacturing scheduling system.">Kanban</span> keeps you focused. You never ask "what should I work on?" — you just move the next thing from Backlog to In Progress.
                </LectureCallout>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="Write Your Issues"
                description="Create the three issues that will track your Weeks 3–5 work."
            >
                <div className="space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Issue 1</code> title: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">feat: containerize backend stub</code> — body: "Write a Dockerfile for the backend stub provided in Week 3. Mount a volume for data persistence. Verify the container runs."</ActivityTask>
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Issue 2</code> title: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">feat: build FastAPI backend</code> — body: "Implement the FastAPI backend with 3+ endpoints, SQLite storage, and a Redis caching layer running via Docker Compose."</ActivityTask>
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Issue 3</code> title: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">feat: build React frontend</code> — body: "Build the React + Tailwind frontend with 3+ views connected to the live API."</ActivityTask>
                    <ActivityTask>Add all three issues to your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Backlog</code> column</ActivityTask>
                </div>

                <LectureCallout type="tip">
                    Write issues like you are writing them for a teammate who has no context. Clear title, clear acceptance criteria. You will thank yourself in three weeks.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 04 OPEN YOUR FIRST PULL REQUEST ─────────────────────────────── */}
            <LectureSectionHeading number="04" title="Open Your First Pull Request" />

            <ActivityChallenge
                number="4.1"
                title="Branch, Push, and PR"
                description="Practice the Git workflow you'll use for every feature."
            >
                <div className="space-y-1">
                    <ActivityTask>Create a new branch: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git checkout -b feat/project-scaffold</code></ActivityTask>
                    <ActivityTask>Make one small change (add your name to the README)</ActivityTask>
                    <ActivityTask>Commit: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git add . && git commit -m "chore: add my name to README"</code></ActivityTask>
                    <ActivityTask>Push the branch: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git push origin feat/project-scaffold</code></ActivityTask>
                    <ActivityTask>Open a pull request from that branch into <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                    <ActivityTask>In the PR description write: what your project does, which domain you chose, and link all three issues using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Closes #1, Closes #2, Closes #3</code></ActivityTask>
                </div>

                <ActivityHint label="why not push to main directly">
                    In industry, nobody pushes to main directly. All changes go through pull requests so they can be reviewed, discussed, and reverted if needed. You are building this habit now.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.2"
                title="Verify Your Setup"
                description="Confirm everything is in place."
            >
                <div className="space-y-1">
                    <ActivityTask>Confirm your GitHub Project board shows 3 issues in Backlog</ActivityTask>
                    <ActivityTask>Confirm your PR is open against <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                    <ActivityTask>Confirm your repo has a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend/</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">frontend/</code> folder</ActivityTask>
                    <ActivityTask>Share your PR link in the club Slack — this is how your progress gets tracked each week</ActivityTask>
                </div>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'GitHub, Agile & Project Management',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-2/lecture-2'),
                }}
                next={{
                    label: 'Package Managers & Environments',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/lecture-1'),
                }}
            />
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
