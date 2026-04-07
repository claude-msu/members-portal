import { Workflow } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';

const SPRINT_THEMES = [
    { week: 6, theme: 'Containers', issues: ['Dockerfile for backend', 'docker-compose for local run', 'Document run instructions'] },
    { week: 7, theme: 'Backend', issues: ['FastAPI app with 3+ endpoints', 'SQLite storage', 'Redis caching (optional)', 'Docker Compose'] },
    { week: 8, theme: 'Testing & CI/CD', issues: ['Unit/integration tests', 'GitHub Actions workflow', 'README: how to run tests'] },
    { week: 9, theme: 'Frontend', issues: ['React app with 3+ views', 'Tailwind styling', 'Fetch from API', 'Full-stack flow working'] },
    { week: 10, theme: 'Auth', issues: ['Login/signup endpoint', 'JWT or sessions', 'Protected route (API + UI)'] },
    { week: 11, theme: 'Deployment', issues: ['Deploy backend (e.g. Railway)', 'Deploy frontend (e.g. Vercel)', 'README: env vars and URLs'] },
];

export default function Week5Lecture2() {
    return (
        <LectureLayout>
            <LectureHeader
                week={5}
                session="Lecture 2"
                title="Backlog Design & Issue Writing"
                description="How to write issues that map to real deliverables: Containers, Backend, Testing, Frontend, Auth, Deployment. One sprint per theme — you create the full roadmap now so execution is just 'pull the next issue.'"
                icon={<Workflow className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="One Sprint Per Week, One Theme Per Sprint" />

            <LectureP>
                In this course, each week after Sprint Planning is a <LectureTerm>sprint</LectureTerm>: a single theme (Containers, Backend, Testing, Frontend, Auth, Deployment). You are not doing "Sprint 1" then "Sprint 2" as separate review ceremonies — you set up <strong className="text-foreground">all</strong> sprint issues in advance. When you start Week 6, you pull the Containers issues; when you start Week 7, you pull the Backend issues; and so on. The board is your roadmap.
            </LectureP>
            <LectureCallout type="info">
                Writing the full backlog now means you never have to "plan the next sprint" mid-course. You already know what each week ships. Execution is just: open the board, pick an issue for this week's theme, build it, open a PR, close the issue.
            </LectureCallout>

            <LectureSectionHeading number="02" title="Map Issues to Course Weeks" />

            <LectureP>
                Each of the next six weeks has a clear deliverable. Turn those deliverables into 2–4 GitHub issues per week. Use the table below as a template — adapt the issue titles and acceptance criteria to your project domain.
            </LectureP>

            <div className="my-6 space-y-3">
                {SPRINT_THEMES.map((s) => (
                    <div key={s.week} className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="px-4 py-2.5 bg-muted/50 border-b border-border flex items-center gap-2">
                            <span className="text-xs font-black text-primary">Week {s.week}</span>
                            <span className="text-xs font-semibold text-foreground">{s.theme}</span>
                        </div>
                        <div className="px-4 py-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Example issues</p>
                            <ul className="space-y-1">
                                {s.issues.map((issue) => (
                                    <li key={issue} className="flex items-start gap-2 text-xs text-foreground">
                                        <span className="text-muted-foreground shrink-0">•</span>
                                        <span>{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <LectureSectionHeading number="03" title="Acceptance Criteria" />

            <LectureP>
                Every issue should have <LectureTerm>acceptance criteria</LectureTerm>: a short list of conditions that must be true for the issue to be "done." "Backend has 3 endpoints" is vague. "GET /items returns 200 and JSON array; POST /items accepts body and returns 201; README documents how to run the API" is testable. Write 2–4 criteria per issue so you know when to close it and move the card to Done.
            </LectureP>
            <LectureSubHeading title="Link PRs to issues" />
            <LectureP>
                When you open a pull request, put <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Closes #42</code> in the PR description (replace 42 with the issue number). When the PR merges, GitHub will close the issue and move the card on your board automatically. Your board stays in sync with reality.
            </LectureP>
            <LectureCallout type="tip">
                You can create a Milestone per week (e.g. "Week 6 — Containers") and assign issues to it. The milestone progress bar becomes a quick view of how much of that week's work is done.
            </LectureCallout>

            
        </LectureLayout>
    );
}
