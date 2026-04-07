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
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';

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
                <LectureTerm>Production</LectureTerm> is where real users hit your app — a live URL, real data, and (hopefully) uptime and security. It's different from "running on my laptop": the server is someone else's machine, environment variables come from the host's config (not your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> file), and you don't get to SSH in and tweak things by hand. Deploying means building your app and running it on that environment so it's reachable 24/7.
            </LectureP>
            <LectureP>
                For a typical full-stack app you'll have two pieces to deploy: (1) the <strong className="text-foreground">frontend</strong> — static files (HTML, JS, CSS) or a server-rendered app, often on a CDN or static host; (2) the <strong className="text-foreground">backend</strong> — your API and any workers, running on a server or serverless. Each needs its own URL, env vars, and (for the backend) a production-grade database when you're ready.
            </LectureP>

            <LectureCallout type="info">
                <LectureTermWithTip tip="Hosts static sites and serverless functions. Great for React/Vite: connect your repo, it builds and deploys on every push to main. Free tier is generous.">Vercel</LectureTermWithTip> is the default choice for React/Vite frontends: connect GitHub, set build command and output directory, and you get a URL. <LectureTermWithTip tip="Hosts backends, databases, and workers. Simple CLI and dashboard; free tier for small projects.">Railway</LectureTermWithTip> (or Render, Fly.io) is a common choice for FastAPI/Node backends. Both support env vars and custom domains.
            </LectureCallout>

            <LectureSectionHeading number="02" title="Deploying the Frontend (Vercel)" />

            <LectureP>
                Connect your GitHub repo to Vercel. It will detect Vite/React and set build command (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run build</code>) and output (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">dist</code>). Every push to main triggers a new build and deploy. Your app will need to know the backend URL: set it as an env var (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code>) in Vercel's project settings so the frontend can call the real API in production.
            </LectureP>
            <LectureSubHeading title="Steps to follow" />
            <TerminalBlock
                title="bash — before you connect to Vercel"
                lines={[
                    { comment: 'ensure build works locally with production API URL', cmd: 'VITE_API_URL=https://your-api.railway.app npm run build' },
                    { comment: 'run the built app locally to verify', cmd: 'npm run preview' },
                ]}
            />
            <LectureP>
                In Vercel: New Project → Import your repo → set <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> in Environment Variables (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">https://your-backend.railway.app</code>) → Deploy. Vite bakes <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> into the bundle at build time, so the value in Vercel is what production uses.
            </LectureP>
            <LectureSubHeading title="CORS" />
            <LectureP>
                Your backend must allow requests from the frontend's production origin. Configure <LectureTerm>CORS</LectureTerm> (e.g. in FastAPI add the Vercel URL to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">CORSMiddleware</code> origins). Otherwise the browser will block API calls from the deployed frontend to the deployed backend.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    main.py — CORS for production frontend
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",           # local Vite dev
        "https://your-app.vercel.app",      # production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
`}
                </pre>
            </div>

            <LectureSectionHeading number="03" title="Deploying the Backend (Railway)" />

            <LectureP>
                With Railway (or similar): connect the repo or deploy from CLI. Set the start command (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">uvicorn main:app --host 0.0.0.0</code> for FastAPI). Add env vars in the dashboard: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code> (Week 11 Lecture 2 covers production DB). Railway gives you a public URL; use that as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> (or equivalent) in the frontend so the UI points to the live API.
            </LectureP>
            <LectureSubHeading title="Start command and Procfile" />
            <LectureP>
                Railway (and Render, Fly.io) need to know how to start your app. For a FastAPI app, the start command is:
            </LectureP>
            <TerminalBlock
                title="bash — run backend the way production will"
                lines={[
                    { comment: 'bind to 0.0.0.0 so the host can forward external traffic', cmd: 'uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}' },
                ]}
            />
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    Procfile (optional — some hosts use this)
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`web: uvicorn main:app --host 0.0.0.0 --port $PORT
`}
                </pre>
            </div>
            <LectureP>
                In Railway: New Project → Deploy from GitHub → select repo and root (or backend folder) → set Root Directory if your backend is in a subfolder → add env vars <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code> → Deploy. Copy the generated URL and set it as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> in Vercel.
            </LectureP>
            <LectureCallout type="warning">
                Never commit production secrets. Use the host's environment configuration for <LectureTip tip="JWT secret, DB URL, API keys — set in Vercel/Railway dashboard, not in code.">JWT_SECRET</LectureTip>, database URLs, and any API keys. Document which env vars are required in the README (names only, no values).
            </LectureCallout>

            <LectureSectionHeading number="04" title="What Can Go Wrong" />

            <LectureP>
                Common issues: (1) Frontend still calling <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">localhost</code> — fix by using the env var for API base URL. (2) CORS errors — add the frontend origin to the backend. (3) 502/503 — backend crashed or not listening on <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">0.0.0.0</code>. (4) Env var missing — double-check names and that they're set in the right project (frontend vs backend). Check the host's logs; they usually show the error.
            </LectureP>


        </LectureLayout>
    );
}
