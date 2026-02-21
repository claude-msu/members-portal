import { useNavigate } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';

// ── PR workflow diagram ──────────────────────────────────────────────────────
const PRWorkflow = () => (
    <div className="my-8 rounded-xl border border-border bg-muted/30 p-5">
        <div className="flex flex-wrap items-center gap-2 justify-center text-xs">
            {[
                { label: 'Branch', sub: 'git checkout -b feature/x', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                { label: '→', sub: '', color: 'text-muted-foreground', bg: '' },
                { label: 'Code', sub: 'edit, commit', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20' },
                { label: '→', sub: '', color: 'text-muted-foreground', bg: '' },
                { label: 'Push', sub: 'git push origin feature/x', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                { label: '→', sub: '', color: 'text-muted-foreground', bg: '' },
                { label: 'Open PR', sub: 'GitHub UI', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20' },
                { label: '→', sub: '', color: 'text-muted-foreground', bg: '' },
                { label: 'Review', sub: 'approve / request changes', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20' },
                { label: '→', sub: '', color: 'text-muted-foreground', bg: '' },
                { label: 'Merge', sub: 'main gets the code', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
            ].map((step, i) => (
                <div key={i} className={step.bg ? `rounded-lg border border-border px-3 py-2 ${step.bg}` : 'px-1'}>
                    <span className={`font-semibold ${step.color}`}>{step.label}</span>
                    {step.sub && <p className="text-muted-foreground mt-0.5 font-mono">{step.sub}</p>}
                </div>
            ))}
        </div>
    </div>
);

// ── Kanban board ──────────────────────────────────────────────────────────────
const KanbanBoard = () => {
    const columns = [
        { title: 'Backlog', color: 'text-muted-foreground', bg: 'bg-muted/30', cards: ['Add dark mode', 'Export to CSV'] },
        { title: 'In Progress', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', cards: ['User auth', 'Dashboard'] },
        { title: 'In Review', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20', cards: ['Login bug fix'] },
        { title: 'Done', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', cards: ['Scaffolding', 'CI setup'] },
    ];
    return (
        <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {columns.map((col) => (
                <div key={col.title} className={`rounded-xl border border-border ${col.bg} p-3`}>
                    <p className={`text-xs font-bold mb-2 ${col.color}`}>{col.title}</p>
                    <div className="space-y-2">
                        {col.cards.map((card) => (
                            <div key={card} className="rounded-lg border border-border bg-card px-2.5 py-2">
                                <p className="text-xs text-foreground">{card}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function Week2Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={2}
                session="Lecture 2"
                title="GitHub, Agile & Project Management"
                description="Pull requests, GitHub Projects, issues, and the Agile workflow that connects them. This is how every team in industry tracks work from idea to shipped feature."
                icon={<GitBranch className="h-4 w-4" />}
            />

            {/* ── 01 FROM GIT TO COLLABORATION ───────────────────────────────── */}
            <LectureSectionHeading number="01" title="From Git to Collaboration" />

            <LectureP>
                You now know how to branch, commit, and merge locally. In practice, teams don't merge by running <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git merge</code> on each other's branches. They use <LectureTerm>pull requests</LectureTerm> (PRs): you push your branch to GitHub, open a PR to propose merging it into <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>, someone reviews your code, and then the merge happens. The PR is the unit of review and the audit trail for every change.
            </LectureP>
            <LectureP>
                Pull requests connect Git (the mechanics) to how work actually gets done: an issue describes what to build, a branch holds the code, and the PR ties them together so that when the PR merges, the issue closes and the board updates. That loop — idea → issue → branch → PR → merge → done — is the Agile workflow in practice.
            </LectureP>

            <LectureCallout type="info">
                "Pull request" and "merge request" (GitLab) mean the same thing: a request to merge your branch into the target branch, with a discussion thread and optional required approvals. GitHub calls them PRs; GitLab calls them MRs.
            </LectureCallout>

            {/* ── 02 THE PULL REQUEST WORKFLOW ────────────────────────────────── */}
            <LectureSectionHeading number="02" title="The Pull Request Workflow" />

            <PRWorkflow />

            <LectureP>
                After you push your branch, go to your repo on GitHub. You'll often see a yellow banner: "feature/add-login had recent pushes" with a button <strong className="text-foreground">Compare & pull request</strong>. Click it. Add a title and a description: what does this PR do? Why? How can a reviewer test it? Link the issue it addresses with "Closes #42" so GitHub auto-closes the issue when the PR merges.
            </LectureP>

            <LectureSubHeading title="What to put in a PR description" />
            <LectureP>
                Good PR descriptions save reviewers time and leave a record for the future. Include: a short summary of the change, what problem it solves, how to test it (steps or a checklist), and any screenshots or notes for reviewers. In industry, PR templates (stored in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/PULL_REQUEST_TEMPLATE.md</code>) standardize this so every PR has the same structure.
            </LectureP>

            <LectureCallout type="tip">
                Write "Closes #123" or "Fixes #123" in the PR description. When the PR is merged, GitHub automatically closes that issue and moves it to Done on your project board. No manual dragging required — the board stays in sync with the code.
            </LectureCallout>

            <LectureSubHeading title="Review and merge" />
            <LectureP>
                Reviewers comment on specific lines or the whole PR. They can approve, request changes, or suggest edits. Once the branch is approved (and any required checks pass, e.g. CI), someone merges the PR. GitHub offers merge options: create a merge commit, squash all commits into one, or rebase. Teams usually choose one and stick to it so history is consistent.
            </LectureP>

            <LectureCallout type="warning">
                Don't merge your own PR without review unless your team explicitly allows it. The whole point is a second set of eyes — catching bugs, suggesting cleaner approaches, and sharing context. Skipping review is a common source of regressions and technical debt.
            </LectureCallout>

            {/* ── 03 ISSUES AS THE SOURCE OF WORK ──────────────────────────────── */}
            <LectureSectionHeading number="03" title="Issues as the Source of Work" />

            <LectureP>
                Every piece of work should start as an <LectureTerm>issue</LectureTerm>: a bug report, a feature request, or a task. Issues live in the <LectureTerm>backlog</LectureTerm> until the team decides to do them. When you're ready to work on something, you assign yourself (or get it assigned), create a branch, and when you open a PR you link it to the issue. That way the issue tracks the work from "to do" to "in progress" to "done."
            </LectureP>
            <LectureP>
                Issues don't have to be huge. "Add a README section for setup" is a valid issue. "Fix typo in login error message" is too. The goal is traceability: every change is tied to a reason, and every reason is visible in the backlog and on the board.
            </LectureP>

            <LectureCallout type="tip">
                Use issue templates (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/ISSUE_TEMPLATE/bug_report.md</code>) so reporters fill in the right fields: steps to reproduce, expected vs actual behavior, environment. It keeps issues actionable instead of vague.
            </LectureCallout>

            {/* ── 04 AGILE IN ONE PAGE ───────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Agile in One Page" />

            <LectureP>
                <LectureTerm>Agile</LectureTerm> means shipping small increments, getting feedback, and adapting. Instead of planning a whole product upfront and building it in one shot (waterfall), teams work in short cycles: pick a chunk of work from the backlog, build it, ship it, learn from it, then repeat. The backlog is the ordered list of everything that might get built; the current cycle (sprint or just "in progress") is what the team is doing now.
            </LectureP>
            <LectureP>
                Two common ways to run this: <LectureTerm>Scrum</LectureTerm> (fixed-length sprints, e.g. 2 weeks, with planning and retro at the boundaries) and <LectureTerm>Kanban</LectureTerm> (continuous flow with a board and optional WIP limits). Many teams mix both: a board with columns like Backlog → In Progress → In Review → Done, and optional time-boxed sprints for planning and demos.
            </LectureP>

            <KanbanBoard />

            <LectureCallout type="info">
                The backlog is never "finished" — it's a living list. New ideas and bugs get added; priorities change. The sprint (or current work) is a commitment: we will finish these items by the end of the cycle. That tension — infinite backlog, finite sprint — is what keeps agile focused.
            </LectureCallout>

            {/* ── 05 GITHUB PROJECTS ─────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="GitHub Projects — Your Board in the Repo" />

            <LectureP>
                <LectureTerm>GitHub Projects</LectureTerm> gives you a board (Kanban or table view) tied directly to your repo. Create a project from the repo's Projects tab, add columns like Backlog, In Progress, In Review, Done, and add your issues as cards. When you open a PR that "Closes #5," the issue card can move to Done automatically. No separate Jira or Trello — the board lives next to the code.
            </LectureP>
            <LectureP>
                For this course, you'll create a GitHub Project for your capstone repo, add issues for the work you plan in Weeks 3–5, and ship every deliverable via a PR that closes an issue. By the end you'll have a real workflow: idea → issue → branch → PR → review → merge → done.
            </LectureP>

            <div className="my-6 space-y-2">
                {[
                    { step: '1', title: 'Create a Project', desc: 'Repo → Projects → New project. Choose Board. Add columns: Backlog, Sprint, In Progress, In Review, Done.' },
                    { step: '2', title: 'Add issues', desc: 'Create issues for each feature or task. Add them to the project so they show as cards in Backlog.' },
                    { step: '3', title: 'Move work into the sprint', desc: 'Drag issues from Backlog into Sprint or In Progress when you start them.' },
                    { step: '4', title: 'Open PRs that close issues', desc: 'In the PR description write "Closes #N". When the PR merges, the issue closes and the card moves to Done.' },
                ].map((item) => (
                    <div key={item.step} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                        <span className="text-xl font-black text-primary/70 shrink-0">{item.step}</span>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <LectureCallout type="tip">
                Use labels on issues (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bug</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">feature</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">good first issue</code>) so you can filter the board and reports. Milestones (e.g. "Sprint 1") group issues by time so you can see sprint scope and progress at a glance.
            </LectureCallout>

            {/* ── 06 WHAT YOU WILL DO IN THE ACTIVITY ─────────────────────────── */}
            <LectureSectionHeading number="06" title="What You'll Do in the Activity" />

            <LectureP>
                The Week 2 activity is <strong className="text-foreground">Project Kickoff</strong>: choose your project domain, create the repo, set up a GitHub Project board, write issues for the work you'll do in Weeks 3–5, and open your first PR. From here on, every deliverable in the course ships through this board — same as in industry.
            </LectureP>

            <LectureFooterNav
                prev={{
                    label: 'Version Control with Git',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-2/lecture-1'),
                }}
                next={{
                    label: 'Project Kickoff',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-2/activity'),
                }}
            />
        </LectureLayout>
    );
}
