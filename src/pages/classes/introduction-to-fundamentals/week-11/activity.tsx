import { Rocket } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';
import { TerminalBlock } from '@/components/ui/terminal-block';

export default function Week11Activity() {
    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                    week={11}
                    session="Activity"
                    title="Ship Your Project"
                    description="Deploy your fundamentals project end-to-end. Document your deployment steps and env vars (without secrets) in your README. Demo the live app."
                    icon={<Rocket className="h-4 w-4" />}
                />

                <LectureCallout type="info">
                    Deploy both frontend and backend so your project is live on the internet. Use Vercel (or similar) for the frontend and Railway (or similar) for the backend. Document how you did it so a stranger could reproduce the deploy.
                </LectureCallout>

                <LectureSectionHeading number="01" title="Deploy Backend" />

                <ActivityChallenge
                    number="1.1"
                    title="Backend live"
                    description="API reachable at a public URL."
                >
                    <div className="space-y-1">
                        <ActivityTask>Deploy your backend (e.g. FastAPI) to Railway, Render, or another host</ActivityTask>
                        <ActivityTask>Set all required env vars (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code>, etc.) in the host's dashboard</ActivityTask>
                        <ActivityTask>Run migrations if you use a production database (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">alembic upgrade head</code> or equivalent)</ActivityTask>
                        <ActivityTask>Confirm the API root (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code>) is reachable in the browser</ActivityTask>
                    </div>
                    <ActivityHint label="Railway quickstart">
                        New Project → Deploy from GitHub → select repo → set Root Directory if backend is in a subfolder → add env vars → Deploy. Copy the generated URL for the frontend.
                    </ActivityHint>
                </ActivityChallenge>

                <LectureSectionHeading number="02" title="Deploy Frontend" />

                <ActivityChallenge
                    number="2.1"
                    title="Frontend live"
                    description="UI points to production API."
                >
                    <div className="space-y-1">
                        <ActivityTask>Deploy your frontend (e.g. Vite/React) to Vercel or similar; ensure build succeeds</ActivityTask>
                        <ActivityTask>Set <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> (or equivalent) as an env var pointing to your deployed backend URL</ActivityTask>
                        <ActivityTask>Configure CORS on the backend to allow the frontend's production origin</ActivityTask>
                        <ActivityTask>Open the live frontend URL and verify the full flow: login, load data, create/edit</ActivityTask>
                    </div>
                    <ActivityHint label="CORS not working?">
                        Add your Vercel URL (e.g. <code className="bg-muted px-1 rounded text-xs">https://your-app.vercel.app</code>) to the <code className="bg-muted px-1 rounded text-xs">allow_origins</code> list in your backend's CORS middleware, then redeploy the backend. The browser blocks requests if the origin isn't listed.
                    </ActivityHint>
                </ActivityChallenge>

                <LectureP>
                    After both deploys, run a quick smoke test from the terminal:
                </LectureP>
                <TerminalBlock
                    title="bash — smoke test the live app"
                    lines={[
                        { comment: 'backend health check', cmd: 'curl -s -o /dev/null -w "%{http_code}" https://your-api.railway.app/docs' },
                        { comment: 'test login (if you have auth)', cmd: 'curl -X POST https://your-api.railway.app/login -d "username=test@test.com&password=secret"' },
                        { comment: 'frontend loads', cmd: 'curl -s -o /dev/null -w "%{http_code}" https://your-app.vercel.app' },
                    ]}
                />

                <LectureSectionHeading number="03" title="Documentation" />

                <ActivityChallenge
                    number="3.1"
                    title="README and demo"
                    description="Docs and a quick demo."
                >
                    <div className="space-y-1">
                        <ActivityTask>Add a "Deployment" section to the README: list required env vars (names only, no values) and how you deployed (e.g. "Frontend: Vercel, Backend: Railway")</ActivityTask>
                        <ActivityTask>Add the live URLs (frontend and backend) to the README so reviewers can open the app</ActivityTask>
                        <ActivityTask>Verify that a stranger could reproduce the deploy from your README alone</ActivityTask>
                        <ActivityTask>Be ready to give a one-minute demo: open the live app, show login (if applicable) and one main feature</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureSectionHeading number="04" title="Ship It" />

                <LectureP>
                    Deployment is a feature — track it on your project board like any other.
                </LectureP>

                <ActivityChallenge
                    number="4.1"
                    title="Close the deployment issue"
                    description="Track deployment on your project board."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create a GitHub issue titled "Deploy project to production" with acceptance criteria (backend URL live, frontend URL live, CORS configured, README updated)</ActivityTask>
                        <ActivityTask>Open a PR from your deployment branch that includes <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Closes #N</code> in the description</ActivityTask>
                        <ActivityTask>Merge the PR and verify the issue is automatically closed</ActivityTask>
                        <ActivityTask>Move the card to "Done" on your project board</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureCallout type="tip">
                    Bring your live URLs to Coworking. Open the app in incognito and walk through the full flow — login, main feature, data persistence. A classmate or instructor can review your deployment, check the project board, and sanity-check that no secrets are exposed in the frontend bundle or repo.
                </LectureCallout>

                
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
