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
                A full-stack deploy has two pieces: (1) the <strong>frontend</strong> — static files on a CDN or static host; (2) the <strong>backend</strong> — your API on a server or serverless platform. Each needs its own URL, env vars, and (for the backend) a production database.
            </LectureCallout>

            <LectureP>
                <LectureTip tip="Hosts static sites and serverless functions. Great for React/Vite: connect your repo, it builds and deploys on every push to main. Free tier is generous.">Vercel</LectureTip> is the default choice for React/Vite frontends. <LectureTip tip="Hosts backends, databases, and workers. Simple CLI and dashboard; free tier for small projects.">Railway</LectureTip> (or Render, Fly.io) is a common choice for FastAPI/Node backends. Both support env vars and custom domains.
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

            <LectureCallout type="info">
                In Vercel: <strong>New Project → Import repo → set <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> in Environment Variables → Deploy.</strong> Vite bakes env vars starting with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_</code> into the bundle at build time, so the value in Vercel is what production uses.
            </LectureCallout>

            <LectureSubHeading title="CORS for production" />
            <LectureP>
                Your backend must allow requests from the frontend's production origin. Add the Vercel URL to <LectureTerm>CORS</LectureTerm> origins — otherwise the browser blocks all API calls from the deployed frontend.
            </LectureP>
            <CodeBlock
                language="python"
                title="main.py — CORS for production frontend"
                lines={[
                    'from fastapi.middleware.cors import CORSMiddleware',
                    '',
                    'app.add_middleware(',
                    '    CORSMiddleware,',
                    '    allow_origins=[',
                    '        "http://localhost:5173",           # local Vite dev',
                    '        "https://your-app.vercel.app",      # production frontend',
                    '    ],',
                    '    allow_credentials=True,',
                    '    allow_methods=["*"],',
                    '    allow_headers=["*"],',
                    ')',
                ]}
            />

            <LectureSectionHeading number="03" title="Deploying the Backend (Railway)" />

            <LectureP>
                With Railway: connect the repo, set the start command, and add env vars (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code>). Railway gives you a public URL — use that as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> in Vercel so the frontend points to the live API.
            </LectureP>

            <LectureSubHeading title="Start command and Procfile" />
            <TerminalBlock
                title="bash — start command for production"
                lines={[
                    { comment: 'bind to 0.0.0.0 so the host can route external traffic to your app', cmd: 'uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}' },
                ]}
            />
            <CodeBlock
                language="text"
                title="Procfile (optional — some hosts read this)"
                lines={[
                    'web: uvicorn main:app --host 0.0.0.0 --port $PORT',
                ]}
            />

            <LectureCallout type="info">
                In Railway: <strong>New Project → Deploy from GitHub → select repo → set Root Directory if backend is in a subfolder → add env vars → Deploy.</strong> Copy the generated URL and set it as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> in Vercel.
            </LectureCallout>

            <LectureCallout type="warning">
                Never commit production secrets. Use the host's environment configuration for <LectureTip code tip="JWT secret, DB URL, API keys — set in Vercel/Railway dashboard, not in code.">JWT_SECRET</LectureTip>, database URLs, and API keys. Document required env var names in the README — never values.
            </LectureCallout>

            <LectureSectionHeading number="04" title="What Can Go Wrong" />

            <LectureCallout type="warning">
                <strong>Frontend still calling localhost.</strong> If your app works locally but fails in production, check that <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> is set in Vercel and that you're using it (not a hardcoded <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">http://localhost:8000</code>) in your fetch calls.
            </LectureCallout>

            <LectureCallout type="warning">
                <strong>CORS errors.</strong> The browser blocks cross-origin requests unless the backend explicitly allows them. Add your Vercel URL to the CORS origins list and redeploy the backend.
            </LectureCallout>

            <LectureCallout type="warning">
                <strong>502 / 503 — backend crashed.</strong> Check the host's logs. Common causes: app not binding to <LectureTip code tip="0.0.0.0 tells the server to listen on all network interfaces — required in production so the host's reverse proxy can reach your app. Using 127.0.0.1 (localhost) only listens on the local interface.">0.0.0.0</LectureTip>, missing dependency, or a startup error (bad import, missing env var).
            </LectureCallout>

            <LectureCallout type="tip">
                <strong>Env var missing?</strong> Double-check that names match exactly (case-sensitive) and that they're set in the right project (frontend vars in Vercel, backend vars in Railway). The host's logs usually show the error.
            </LectureCallout>

            
        </LectureLayout>
    );
}
