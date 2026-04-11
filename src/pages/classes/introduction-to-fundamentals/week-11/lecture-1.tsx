import { Rocket } from 'lucide-react';
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

export default function Week11Lecture1() {
    return (
        <LectureLayout>
            <LectureHeader
                week={11}
                session="Lecture 1"
                title="Vercel, Railway & What Production Means"
                description="Deploy your fundamentals project: frontend on Vercel, backend on Railway (or similar), env vars, and what 'production' actually means for config, secrets, and domains."
                icon={<Rocket className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="What Production Means" />

            <LectureP>
                <LectureTerm>Production</LectureTerm> is where real users hit your app — a live URL, real data, and (hopefully) uptime and security. The server is someone else's machine, environment variables come from the host's config (not your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> file), and you don't SSH in and tweak things by hand.
            </LectureP>

            <LectureCallout type="info">
                A full-stack deploy has two pieces: (1) the <strong>frontend</strong> — static files served from a <LectureTip tip="Content Delivery Network — a global network of servers that caches and serves your static files from the location nearest to the user. Vercel, Netlify, and CloudFront all use CDNs under the hood.">CDN</LectureTip>; (2) the <strong>backend</strong> — your API running on a server or serverless platform. Each needs its own URL, env vars, and (for the backend) a production database.
            </LectureCallout>

            <LectureP>
                <LectureTip tip="Hosts static sites and serverless functions. Great for React/Vite: connect your repo, it builds and deploys on every push to main. Free tier is generous.">Vercel</LectureTip> is the default choice for React/Vite frontends. <LectureTip tip="Hosts backends, databases, and workers. Simple CLI and dashboard; free tier for small projects.">Railway</LectureTip> (or Render, Fly.io) is a common choice for FastAPI/Node backends. Both support env vars, automatic deploys from GitHub, and custom domains.
            </LectureP>

            <LectureSectionHeading number="02" title="Deploying the Frontend (Vercel)" />

            <LectureP>
                Connect your GitHub repo to Vercel. It detects Vite/React and sets the build command (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run build</code>) and output dir (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">dist</code>). Every push to main triggers a new deploy.
            </LectureP>

            <TerminalBlock
                title="bash — verify the build works locally first"
                lines={[
                    { comment: 'build with production API URL', cmd: 'VITE_API_URL=https://your-api.railway.app npm run build' },
                    { comment: 'preview the built app', cmd: 'npm run preview' },
                ]}
            />

            <LectureSubHeading title="Environment variables in Vite" />
            <LectureP>
                Vite bakes env vars starting with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_</code> into the bundle at build time. In your code, access them via <LectureTip code tip="Vite's way of exposing env vars to client code. Only vars prefixed with VITE_ are included. They're replaced with literal values at build time — changing the value requires a rebuild.">import.meta.env</LectureTip>. The value set in Vercel's dashboard is what production uses.
            </LectureP>
            <CodeBlock
                language="typescript"
                title="src/config.ts — centralize your API base URL"
                lines={[
                    'export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";',
                    '',
                    '// Use it everywhere instead of hardcoding:',
                    '// fetch(API_URL + "/notes", { ... })',
                ]}
            />

            <LectureCallout type="info">
                In Vercel: <strong>New Project → Import repo → Environment Variables → add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> → Deploy.</strong> If you change the value later, you need to redeploy (trigger a new build) for it to take effect.
            </LectureCallout>

            <LectureSubHeading title="Preview deployments" />
            <LectureP>
                Vercel automatically creates a <LectureTip tip="A temporary deployment built from a pull request branch. It gets its own unique URL so you (or a reviewer) can test changes before merging to main. The preview URL appears as a comment on the PR.">preview deployment</LectureTip> for every pull request — a unique URL where you can test changes before merging. This ties directly into the CI workflow from Week 8: your tests run in GitHub Actions <em>and</em> Vercel builds a live preview for visual review.
            </LectureP>

            <LectureSectionHeading number="03" title="CORS for Production" />

            <LectureP>
                Your backend must allow requests from the frontend's production origin. Add the Vercel URL to <LectureTerm>CORS</LectureTerm> origins — otherwise the browser blocks all API calls from the deployed frontend.
            </LectureP>
            <CodeBlock
                language="python"
                title="main.py — CORS for production frontend"
                lines={[
                    'import os',
                    'from fastapi.middleware.cors import CORSMiddleware',
                    '',
                    'FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")',
                    '',
                    'app.add_middleware(',
                    '    CORSMiddleware,',
                    '    allow_origins=[',
                    '        "http://localhost:5173",   # local Vite dev',
                    '        FRONTEND_URL,               # production frontend',
                    '    ],',
                    '    allow_credentials=True,',
                    '    allow_methods=["*"],',
                    '    allow_headers=["*"],',
                    ')',
                ]}
            />
            <LectureCallout type="tip">
                Reading the frontend URL from an env var (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">FRONTEND_URL</code>) is better than hardcoding it. Set it in Railway's dashboard so you only change it in one place if you switch domains.
            </LectureCallout>

            <LectureSectionHeading number="04" title="Deploying the Backend (Railway)" />

            <LectureP>
                With Railway: connect the repo, set the start command, and add env vars (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">FRONTEND_URL</code>). Railway gives you a public URL — use that as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> in Vercel so the frontend points to the live API.
            </LectureP>

            <LectureSubHeading title="Start command and Procfile" />
            <TerminalBlock
                title="bash — start command for production"
                lines={[
                    { comment: 'bind to 0.0.0.0 so the host can route external traffic', cmd: 'uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}' },
                ]}
            />
            <CodeBlock
                language="text"
                title="Procfile (optional — some hosts read this)"
                lines={[
                    'web: uvicorn main:app --host 0.0.0.0 --port $PORT',
                ]}
            />

            <LectureSubHeading title="What Railway needs to find" />
            <LectureP>
                Railway auto-detects your project type from files in the repo. For Python, it looks for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">requirements.txt</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Dockerfile</code>. Make sure your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">requirements.txt</code> is up to date — Railway runs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pip install -r requirements.txt</code> during the build.
            </LectureP>
            <TerminalBlock
                title="bash — freeze your dependencies before deploying"
                lines={[
                    { comment: 'generate requirements.txt from your current env', cmd: 'pip freeze > requirements.txt' },
                ]}
            />

            <LectureCallout type="info">
                In Railway: <strong>New Project → Deploy from GitHub → select repo → set Root Directory if backend is in a subfolder → add env vars → Deploy.</strong> Copy the generated URL and set it as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> in Vercel.
            </LectureCallout>

            <LectureSubHeading title="The .env.example pattern" />
            <LectureP>
                Document every env var your app needs in a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env.example</code> file. Commit this file to the repo (it has no real values). Anyone deploying — including Railway — can see exactly which variables to set.
            </LectureP>
            <CodeBlock
                language="text"
                title=".env.example — commit this, not .env"
                lines={[
                    '# Backend',
                    'JWT_SECRET=your-secret-here',
                    'DATABASE_URL=postgresql://user:password@host:5432/dbname',
                    'FRONTEND_URL=https://your-app.vercel.app',
                    '',
                    '# Frontend (Vite)',
                    'VITE_API_URL=https://your-api.railway.app',
                ]}
            />

            <LectureCallout type="warning">
                Never commit production secrets. Use the host's dashboard for real values. The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env.example</code> file shows <em>which</em> variables exist with placeholder values. Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code> so real values never reach the repo.
            </LectureCallout>

            <LectureSectionHeading number="05" title="HTTPS and Custom Domains" />

            <LectureP>
                Both Vercel and Railway provide HTTPS automatically on their default domains (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">your-app.vercel.app</code>). You don't need to configure SSL certificates. If you add a custom domain later, both platforms handle certificate provisioning for you.
            </LectureP>
            <LectureCallout type="info">
                <strong>Always use HTTPS in production.</strong> It encrypts traffic between the browser and server, protecting passwords, tokens, and user data in transit. Your JWT auth from Week 10 relies on this — without HTTPS, tokens travel in plain text.
            </LectureCallout>

            <LectureSectionHeading number="06" title="What Can Go Wrong" />

            <LectureCallout type="warning">
                <strong>Frontend still calling localhost.</strong> Check that <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> is set in Vercel and that your code uses <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">import.meta.env.VITE_API_URL</code> — not a hardcoded URL. Remember: changing the env var requires a redeploy.
            </LectureCallout>

            <LectureCallout type="warning">
                <strong>CORS errors.</strong> The browser blocks cross-origin requests unless the backend explicitly allows the origin. Add your Vercel URL to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">allow_origins</code> and redeploy the backend.
            </LectureCallout>

            <LectureCallout type="warning">
                <strong>502 / 503 — backend crashed.</strong> Check the host's logs. Common causes: app not binding to <LectureTip code tip="0.0.0.0 tells the server to listen on all network interfaces — required in production so the host's reverse proxy can reach your app. Using 127.0.0.1 (localhost) only listens on the local interface.">0.0.0.0</LectureTip>, missing dependency in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">requirements.txt</code>, or a startup error (bad import, missing env var).
            </LectureCallout>

            <LectureCallout type="tip">
                <strong>Env var missing?</strong> Names are case-sensitive. Double-check they're set in the right project (frontend vars in Vercel, backend vars in Railway). Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">railway logs</code> or check the dashboard to see the actual error.
            </LectureCallout>

            <TerminalBlock
                title="bash — checking Railway logs"
                lines={[
                    { comment: 'install Railway CLI', cmd: 'npm i -g @railway/cli' },
                    { comment: 'link to your project', cmd: 'railway link' },
                    { comment: 'tail live logs', cmd: 'railway logs' },
                ]}
            />

            
        </LectureLayout>
    );
}
