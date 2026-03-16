import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week11Activity() {
    const navigate = useNavigate();

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
                        <ActivityTask>Set all required env vars (JWT_SECRET, DATABASE_URL if you use a production DB, etc.) in the host's dashboard</ActivityTask>
                        <ActivityTask>Confirm the API root (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code>) is reachable in the browser and that at least one endpoint works (e.g. health or GET list)</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureSectionHeading number="02" title="Deploy Frontend" />

                <ActivityChallenge
                    number="2.1"
                    title="Frontend live"
                    description="UI points to production API."
                >
                    <div className="space-y-1">
                        <ActivityTask>Deploy your frontend (e.g. Vite/React) to Vercel or similar; ensure build succeeds</ActivityTask>
                        <ActivityTask>Set the production API URL as an env var (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code>) so the app calls your deployed backend, not localhost</ActivityTask>
                        <ActivityTask>Configure CORS on the backend to allow the frontend's production origin</ActivityTask>
                        <ActivityTask>Open the live frontend URL and verify you can use the app (login if you have it, load data, etc.)</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureSectionHeading number="03" title="Documentation" />

                <ActivityChallenge
                    number="3.1"
                    title="README and demo"
                    description="Docs and a quick demo."
                >
                    <div className="space-y-1">
                        <ActivityTask>In the README, add a "Deployment" or "Production" section: list the required env vars (names only, no values), and briefly how you deployed (e.g. "Frontend: Vercel, Backend: Railway")</ActivityTask>
                        <ActivityTask>Add the live URLs (frontend and backend) to the README so reviewers can open the app</ActivityTask>
                        <ActivityTask>Be ready to give a one-minute demo: open the live app, show login (if applicable) and one main feature</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureFooterNav
                    prev={{
                        label: 'Databases & Persistence in Production',
                        onClick: () => navigate('/classes/introduction-to-fundamentals/week-11/lecture-2'),
                    }}
                    next={{
                        label: 'README, Docs & Open Source Habits',
                        onClick: () => navigate('/classes/introduction-to-fundamentals/week-12/lecture-1'),
                    }}
                />
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
