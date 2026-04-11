import { Trophy } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureTip,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { CodeBlock } from '@/components/ui/code-block';

export default function Week12Lecture1() {
    return (
        <LectureLayout>
            <LectureHeader
                week={12}
                session="Lecture 1"
                title="README, Docs & Open Source Habits"
                description="How to write a README that makes your project understandable and runnable. Docs, contributing guidelines, and habits that scale when others join."
                icon={<Trophy className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="Why the README Matters" />

            <LectureP>
                The <LectureTerm>README</LectureTerm> is the first thing anyone sees when they open your repo — including future you in six months. A good README answers: What is this? How do I run it? What do I need? How do I test it? Where is it deployed? For a portfolio project, it's also your pitch: a recruiter or teammate should understand the project and believe you built it in one read.
            </LectureP>

            <LectureCallout type="info">
                Write for a stranger. Assume they have no context. If they can clone the repo, copy <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env.example</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code>, fill in values, install, and run — you've won.
            </LectureCallout>

            <LectureP>
                <LectureTip tip="A template for .env listing variable names and a short description, with no real secrets. Commit it; users copy to .env and fill in.">.env.example</LectureTip> is a best practice: list every env var the app needs with a one-line comment. Never put real values in .env.example — it's committed to the repo.
            </LectureP>

            <LectureSectionHeading number="02" title="Structure of a Good README" />

            <LectureP>
                <strong className="text-foreground">1. Title and one-liner</strong> — project name and a single sentence describing what it does.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">2. Screenshots or demo link</strong> — a picture or link to the live app.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">3. Tech stack</strong> — frontend, backend, DB, host.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">4. Prerequisites</strong> — Node 20, Python 3.11, etc.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">5. Installation / Running locally</strong> — clone, install, env setup, run.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">6. Testing</strong> — command(s) to run tests.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">7. Deployment</strong> — where it's hosted and which env vars to set (names only).
            </LectureP>
            <LectureP>
                <strong className="text-foreground">8. Optional</strong> — API overview, contributing guidelines, license.
            </LectureP>

            <LectureCallout type="warning">
                A stale README is worse than a short one — it sends people down the wrong path. When you add an env var, update the README <em>and</em> .env.example. When you change the run command, update the README.
            </LectureCallout>

            <LectureSectionHeading number="03" title="A README You Can Copy" />

            <LectureP>
                Copy this into your repo and fill in the placeholders. Every section is something a stranger (or future you) needs.
            </LectureP>

            <CodeBlock
                copyable
                language="markdown"
                title="README.md — copy and fill in"
                lines={[
                    '# My Project',
                    '',
                    'A short one-line description: what does this app do and for whom?',
                    '',
                    '- **Live app:** [https://my-app.vercel.app](https://my-app.vercel.app)',
                    '- **API docs:** [https://my-api.railway.app/docs](https://my-api.railway.app/docs)',
                    '',
                    '## Tech stack',
                    '',
                    '- Frontend: React, Vite, Tailwind',
                    '- Backend: FastAPI, Python 3.11',
                    '- Database: PostgreSQL (Railway)',
                    '- Hosting: Vercel (frontend), Railway (backend + DB)',
                    '',
                    '## Prerequisites',
                    '',
                    '- Node.js 20+',
                    '- Python 3.11+',
                    '- npm',
                    '',
                    '## Running locally',
                    '',
                    '```bash',
                    'git clone https://github.com/yourusername/my-project.git',
                    'cd my-project',
                    'cp .env.example .env',
                    '# Edit .env and fill in the values (see section below)',
                    'npm install',
                    'npm run dev',
                    '```',
                    '',
                    'The frontend runs at `http://localhost:5173`.',
                    'The backend runs at `http://localhost:8000`.',
                    '',
                    '## Environment variables',
                    '',
                    'Copy `.env.example` to `.env` and set:',
                    '',
                    '| Variable       | Description                    |',
                    '|----------------|--------------------------------|',
                    '| `VITE_API_URL` | Backend URL (frontend .env)    |',
                    '| `JWT_SECRET`   | Secret for signing tokens      |',
                    '| `DATABASE_URL` | PostgreSQL connection string   |',
                    '',
                    'Never commit `.env` or real secrets.',
                    '',
                    '## Testing',
                    '',
                    '```bash',
                    'npm run test',
                    '```',
                    '',
                    'Backend tests (from `backend` folder):',
                    '',
                    '```bash',
                    'cd backend && pytest',
                    '```',
                    '',
                    '## Deployment',
                    '',
                    '- Frontend: Vercel (connected to `main`; set `VITE_API_URL`).',
                    '- Backend: Railway (set `JWT_SECRET`, `DATABASE_URL`).',
                    '- See host docs for env var details; do not put production values in this repo.',
                ]}
            />

            <LectureCallout type="tip">
                Replace every placeholder (project name, URLs, stack, commands) with your real values. The env vars table should match your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env.example</code> exactly — one source of truth.
            </LectureCallout>

            <LectureSectionHeading number="04" title=".env.example in Practice" />

            <LectureP>
                Your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env.example</code> should list every variable the app reads from the environment, with a comment explaining what it's for. Anyone cloning the repo copies it to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> and fills in real values.
            </LectureP>

            <CodeBlock
                language="text"
                title=".env.example"
                lines={[
                    '# Frontend (Vite) — used at build time',
                    'VITE_API_URL=http://localhost:8000',
                    '',
                    '# Backend — never commit real values',
                    'JWT_SECRET=your-secret-at-least-32-chars',
                    'DATABASE_URL=postgresql://user:password@host:5432/dbname',
                ]}
            />

            <TerminalBlock
                title="bash — first-time setup (follow along)"
                lines={[
                    { comment: 'clone the repo', cmd: 'git clone https://github.com/yourusername/my-project.git && cd my-project' },
                    { comment: 'copy env template and edit with your values', cmd: 'cp .env.example .env' },
                    { comment: 'install frontend deps', cmd: 'npm install' },
                    { comment: 'run frontend dev server', cmd: 'npm run dev' },
                ]}
            />

            <LectureP>
                After <LectureTip code tip="Copy file. cp .env.example .env then edit .env with real values; never commit .env.">cp .env.example .env</LectureTip>, open <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> in your editor and replace placeholders. For local dev, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> is usually <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">http://localhost:8000</code>; for production the build uses the URL you set in Vercel.
            </LectureP>

            <LectureSectionHeading number="05" title="Docs and Open Source Habits" />

            <LectureP>
                For a solo or small-team project, the README is usually enough. If the API is large, add an "API" section or link to OpenAPI/Swagger. <LectureTerm>Contributing guidelines</LectureTerm> (CONTRIBUTING.md) matter when you accept pull requests: how to run tests, how to submit a PR, code style. Writing as if someone will contribute forces you to document the workflow — and that someone might be you later.
            </LectureP>

            <LectureSubHeading title="Badges" />
            <LectureP>
                GitHub READMEs support badges — small status indicators at the top of the file that show build status, coverage, license, etc. They signal that the project is active and well-maintained.
            </LectureP>
            <CodeBlock
                language="markdown"
                title="README badges — add near the top"
                lines={[
                    '![CI](https://github.com/yourusername/my-project/actions/workflows/ci.yml/badge.svg)',
                    '![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)',
                    '',
                    '<!-- shields.io has badges for coverage, version, deploy status, etc. -->',
                    '<!-- Browse: https://shields.io -->',
                ]}
            />

            <LectureSubHeading title="License" />
            <LectureP>
                If others might use or fork your code, add a license file. <LectureTerm>MIT</LectureTerm> is the most common for open-source projects — it lets anyone use your code with attribution. GitHub's "Add file" button has a license picker that generates the file for you, or create one manually.
            </LectureP>
            <TerminalBlock
                title="bash — add a license file"
                lines={[
                    { comment: 'create an MIT license (fill in year and name)', cmd: 'curl -sL https://choosealicense.com/licenses/mit/ | head -21 > LICENSE' },
                    { comment: 'or just create the file and paste from choosealicense.com', cmd: 'touch LICENSE' },
                ]}
            />

            <LectureSubHeading title="Quick README checklist" />
            <ul className="list-disc pl-6 py-2 space-y-1.5 text-sm text-muted-foreground [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-border">
                <li>Title and one sentence description</li>
                <li>Live demo link and/or screenshot</li>
                <li>Tech stack (frontend, backend, DB, hosting)</li>
                <li>Prerequisites (Node, Python versions)</li>
                <li>Exact commands: clone, <code>cp .env.example .env</code>, install, run</li>
                <li>Test commands (<code>npm run test</code>, <code>pytest</code>, etc.)</li>
                <li>Env vars table matching .env.example (names only, no values)</li>
                <li>Deployment section (where it lives, which env vars to set on the host)</li>
                <li>Badge(s) for CI status and/or license</li>
            </ul>

            <LectureCallout type="tip">
                Your fundamentals project README is part of your portfolio. Spend time this week making it crisp: someone who clones the repo should be able to run and test the app, and a reader should understand what you built and how.
            </LectureCallout>


        </LectureLayout>
    );
}
