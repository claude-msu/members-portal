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
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';

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

            {/* ── 01 WHY THE README MATTERS ───────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Why the README Matters" />

            <LectureP>
                The <LectureTerm>README</LectureTerm> is the first thing anyone sees when they open your repo — including future you in six months. A good README answers: What is this? How do I run it? What do I need (dependencies, env vars)? How do I test it? Where is it deployed? That's the minimum. For a portfolio project, it's also your pitch: a recruiter or teammate should understand the project and believe you built it in one read.
            </LectureP>
            <LectureP>
                Write for a stranger. Assume they have no context. "Clone the repo, copy <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env.example</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code>, fill in the values, run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run dev</code>." If they can get the app running from that, you've won.
            </LectureP>

            <LectureCallout type="info">
                <LectureTermWithTip tip="A template for .env listing variable names and a short description, with no real secrets. Commit it; users copy to .env and fill in.">.env.example</LectureTermWithTip> is a best practice: list every env var the app needs with a one-line comment (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET=  # secret for signing tokens</code>). Never put real values in .env.example.
            </LectureCallout>

            {/* ── 02 STRUCTURE OF A GOOD README ───────────────────────────────── */}
            <LectureSectionHeading number="02" title="Structure of a Good README" />

            <LectureP>
                Typical sections, in order: (1) <strong className="text-foreground">Title and one-liner</strong> — project name and a single sentence describing what it does. (2) <strong className="text-foreground">Screenshots or demo link</strong> — a picture or link to the live app. (3) <strong className="text-foreground">Tech stack</strong> — frontend, backend, DB, host. (4) <strong className="text-foreground">Prerequisites</strong> — Node 20, Python 3.11, etc. (5) <strong className="text-foreground">Installation / Running locally</strong> — clone, install, env setup, run. (6) <strong className="text-foreground">Testing</strong> — command(s) to run tests. (7) <strong className="text-foreground">Deployment</strong> — where it's hosted and which env vars are needed (names only). (8) Optional: API overview, contributing, license.
            </LectureP>
            <LectureSubHeading title="Keep it up to date" />
            <LectureP>
                When you add an env var, update the README and .env.example. When you change the run command, update the README. A stale README is worse than a short one — it sends people down the wrong path.
            </LectureP>

            {/* ── 03 A README YOU CAN COPY ────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="A README You Can Copy" />

            <LectureP>
                Below is a minimal README that fits most full-stack projects. Copy it into your repo and fill in the placeholders. Every section is something a stranger (or future you) needs.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    README.md
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`# My Project

A short one-line description: what does this app do and for whom?

- **Live app:** [https://my-app.vercel.app](https://my-app.vercel.app)
- **API docs:** [https://my-api.railway.app/docs](https://my-api.railway.app/docs)

## Tech stack

- Frontend: React, Vite, Tailwind
- Backend: FastAPI, Python 3.11
- Database: PostgreSQL (Railway)
- Hosting: Vercel (frontend), Railway (backend + DB)

## Prerequisites

- Node.js 20+
- Python 3.11+
- npm

## Running locally

\`\`\`bash
git clone https://github.com/yourusername/my-project.git
cd my-project
cp .env.example .env
# Edit .env and fill in the values (see section below)
npm install
npm run dev
\`\`\`

The frontend runs at \`http://localhost:5173\`. The backend runs at \`http://localhost:8000\` (start it separately from the \`backend\` folder or see monorepo instructions).

## Environment variables

Copy \`.env.example\` to \`.env\` and set:

| Variable       | Description                    |
|----------------|--------------------------------|
| \`VITE_API_URL\` | Backend URL (frontend .env)   |
| \`JWT_SECRET\`   | Secret for signing tokens     |
| \`DATABASE_URL\` | PostgreSQL connection string  |

Never commit \`.env\` or real secrets.

## Testing

\`\`\`bash
npm run test
\`\`\`

Backend tests (from \`backend\` folder):

\`\`\`bash
cd backend && pytest
\`\`\`

## Deployment

- Frontend: Vercel (connected to \`main\`; set \`VITE_API_URL\` in project settings).
- Backend: Railway (set \`JWT_SECRET\`, \`DATABASE_URL\` in dashboard).
- See host docs for env var names; do not put production values in this repo.
`}
                </pre>
            </div>

            <LectureCallout type="tip">
                Replace every placeholder (project name, URLs, stack, commands) with your real values. The table of env vars should match your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env.example</code> file exactly so there's one source of truth.
            </LectureCallout>

            {/* ── 04 .env.example IN PRACTICE ────────────────────────────────── */}
            <LectureSectionHeading number="04" title=".env.example in Practice" />

            <LectureP>
                Your <LectureTermWithTip tip="Commit this file; it lists every variable name and a short comment. No real secrets.">.env.example</LectureTermWithTip> should list every variable the app reads from the environment, with a comment explaining what it's for. Anyone cloning the repo copies it to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> and fills in real values locally.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    .env.example
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`# Frontend (Vite) — used at build time
VITE_API_URL=http://localhost:8000

# Backend — never commit real values
JWT_SECRET=your-secret-at-least-32-chars
DATABASE_URL=postgresql://user:password@host:5432/dbname
`}
                </pre>
            </div>

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
                After <LectureTip tip="Copy file. cp .env.example .env then edit .env with real values; never commit .env.">cp .env.example .env</LectureTip>, open <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> in your editor and replace placeholders. For local dev, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> is usually <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">http://localhost:8000</code>; for production the build uses the URL you set in Vercel.
            </LectureP>

            {/* ── 05 DOCS AND OPEN SOURCE HABITS ───────────────────────────────── */}
            <LectureSectionHeading number="05" title="Docs and Open Source Habits" />

            <LectureP>
                For a solo or small-team project, the README is usually enough. If the API is large, add an "API" section or link to OpenAPI/Swagger. <LectureTerm>Contributing guidelines</LectureTerm> (CONTRIBUTING.md) matter when you accept pull requests: how to run tests, how to submit a PR, code style. Even if you're not open-sourcing yet, writing as if someone will contribute forces you to document the workflow — and that someone might be you later.
            </LectureP>
            <LectureP>
                Habits that scale: (1) One clear way to run the app and run tests. (2) Env vars documented and provided via .env.example. (3) Changelog or release notes for bigger projects. (4) License file (MIT, Apache, etc.) if others might use or fork the code.
            </LectureP>

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
            </ul>

            <LectureCallout type="tip">
                Your fundamentals project README is part of your portfolio. Spend time this week making it crisp: someone who clones the repo should be able to run and test the app, and a reader should understand what you built and how.
            </LectureCallout>


        </LectureLayout>
    );
}
