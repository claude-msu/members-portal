import { Workflow } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
} from '@/components/ui/lecture-typography';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';

export default function Week5Activity() {
    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                    week={5}
                    session="Activity"
                    title="Set Up Your Entire Sprint Roadmap"
                    description="Create issues on your GitHub Project board for all remaining sprints: Week 6 (Containers), Week 7 (Backend), Week 8 (Testing & CI/CD), Week 9 (Frontend), Week 10 (Auth), Week 11 (Deployment). Each sprint gets 2–4 issues that match that week's deliverables. From here on you just pull issues and ship."
                    icon={<Workflow className="h-4 w-4" />}
                />

                <LectureCallout type="info">
                    You already have a repo and GitHub Project board from Week 4 (Project Kickoff). This activity is about populating the board with issues for <strong className="text-foreground">every</strong> remaining week — so when you start Week 6, you're just pulling the Containers issues; when you start Week 7, the Backend issues; and so on. No mid-course sprint planning needed.
                </LectureCallout>

                <LectureSectionHeading number="01" title="Create Issues for Each Sprint Theme" />

                <ActivityChallenge
                    number="1.1"
                    title="Week 6 — Containers"
                    description="2–4 issues for Docker/containerization week."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create issues such as: Dockerfile for backend (or stub), docker-compose for local run, document how to build and run with Docker</ActivityTask>
                        <ActivityTask>Add acceptance criteria to each issue so you know when it's done</ActivityTask>
                        <ActivityTask>Optionally create a Milestone "Week 6 — Containers" and assign these issues to it</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.2"
                    title="Week 7 — Backend"
                    description="2–4 issues for FastAPI, SQLite, Docker Compose."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create issues for: FastAPI app with 3+ endpoints, SQLite storage, optional Redis/caching, Docker Compose wiring</ActivityTask>
                        <ActivityTask>Tailor titles and criteria to your project domain (e.g. "GET/POST /recipes", "SQLite schema for recipes")</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.3"
                    title="Week 8 — Testing & CI/CD"
                    description="2–4 issues for tests and GitHub Actions."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create issues for: unit or integration tests (backend and/or frontend), GitHub Actions workflow that runs tests, README section on how to run tests</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.4"
                    title="Week 9 — Frontend"
                    description="2–4 issues for React, Tailwind, API connection."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create issues for: React app with 3+ views, Tailwind styling, fetch from your API, full-stack flow working end to end</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.5"
                    title="Week 10 — Auth"
                    description="2–4 issues for login and protected routes."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create issues for: login/signup endpoint, JWT or session handling, at least one protected API route and one protected frontend route</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.6"
                    title="Week 11 — Deployment"
                    description="2–4 issues for production deploy."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create issues for: deploy backend (e.g. Railway), deploy frontend (e.g. Vercel), README with env vars (names only) and live URLs</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureCallout type="tip">
                    You don't have to complete every issue in the week it's assigned — the board is a roadmap. But having the issues written now means you always know what "done" looks like for each week, and you can close issues with PRs as you go. From Week 6 on, execution is: pull an issue → build → PR → close issue → repeat.
                </LectureCallout>

                
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
