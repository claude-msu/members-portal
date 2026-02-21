import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';

export default function Week5Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={5}
                session="Activity"
                title="Build Your Frontend"
                description="Your API is live. Now build the interface — React components, Tailwind styling, and real data flowing from your backend. By the end of this session you have a complete full-stack app you built from scratch."
                icon={<Globe className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
            />

            <LectureCallout type="info">
                Your backend must be running locally (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose up</code> in your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend/</code> folder) before starting this activity. All data in the UI comes from the live API.
            </LectureCallout>

            {/* ── 01 SCAFFOLD THE FRONTEND ────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Scaffold the Frontend" />

            <ActivityChallenge
                number="1.1"
                title="Vite + React + Tailwind"
                description="Set up the modern React development environment."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Navigate to your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">frontend/</code> folder</ActivityTask>
                    <ActivityTask>Delete the placeholder <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">index.html</code></ActivityTask>
                    <ActivityTask>Run: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm create vite@latest . -- --template react-ts</code></ActivityTask>
                    <ActivityTask>Install dependencies: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install</code></ActivityTask>
                    <ActivityTask>Install Tailwind: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p</code></ActivityTask>
                    <ActivityTask>Configure <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tailwind.config.js</code> content paths and add the Tailwind directives to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">index.css</code></ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run dev</code> and verify the default Vite page loads</ActivityTask>
                </div>

                <TerminalBlock
                    title="bash — frontend"
                    lines={[
                        { cmd: 'npm create vite@latest . -- --template react-ts' },
                        { cmd: 'npm install' },
                        { cmd: 'npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p' },
                        { cmd: 'npm run dev' },
                    ]}
                />

                <LectureCallout type="info">
                    <span title="A frontend build tool that uses native ES modules in development for near-instant hot module replacement. Dramatically faster than webpack-based setups like Create React App.">Vite</span> is incredibly fast — changes appear instantly in your browser during development.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 02 PROJECT REQUIREMENTS ─────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Project Requirements" />

            <div className="my-4 space-y-2">
                {[
                    '3 or more views/pages (use React Router for navigation between them)',
                    'All data fetched from your live FastAPI backend using fetch + useEffect',
                    'No hardcoded mock data — if the backend is down, the UI should show an error state',
                    'Fully styled with Tailwind — no inline styles, no separate CSS files',
                    'Loading and error states handled for every fetch call',
                ].map((req, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 shrink-0">✓</span>
                        <p className="text-sm text-foreground">{req}</p>
                    </div>
                ))}
            </div>

            <LectureCallout type="warning">
                Handle loading and error states on every fetch. An app that crashes silently when the API is unreachable is not a finished app.
            </LectureCallout>

            {/* ── 03 BUILD YOUR VIEWS ─────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Build Your Views" />

            <ActivityChallenge
                number="3.1"
                title="Set Up React Router"
                description="Create navigation between your views."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Install React Router: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install react-router-dom</code></ActivityTask>
                    <ActivityTask>Wrap your app in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">BrowserRouter</code></ActivityTask>
                    <ActivityTask>Define at least 3 routes</ActivityTask>
                    <ActivityTask>Build a minimal nav component that links between them</ActivityTask>
                </div>

                <ActivityHint label="basic router setup">
                    <code className="bg-muted px-1 rounded text-xs">{'<BrowserRouter><Routes><Route path="/" element={<Home />} />...'}</code> — then use <code className="bg-muted px-1 rounded text-xs">Link</code> components in your nav to navigate.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="Fetch Real Data"
                description="Build your primary list view with live API data."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>In your primary list view, fetch data from your backend using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useEffect</code> and store it in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useState</code></ActivityTask>
                    <ActivityTask>Show a loading state (a simple "Loading..." text is fine) while the fetch is in progress</ActivityTask>
                    <ActivityTask>Show an error message if the fetch fails</ActivityTask>
                    <ActivityTask>Display the data once it arrives</ActivityTask>
                </div>

                <LectureCallout type="info">
                    <span title="A React hook that runs a side effect after render. With an empty dependency array ([]), it runs once when the component mounts — the right place to trigger your initial data fetch.">useEffect</span> is where you fetch data. The empty dependency array <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">[]</code> runs it once on mount.
                </LectureCallout>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.3"
                title="Build the Remaining Views"
                description="Implement your remaining 2+ views with full styling."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Implement your remaining 2+ views</ActivityTask>
                    <ActivityTask>Each must fetch from or post to your API</ActivityTask>
                    <ActivityTask>Style everything with Tailwind — pay attention to spacing, color, and responsive layout</ActivityTask>
                </div>
            </ActivityChallenge>

            {/* ── 04 SHIP IT ──────────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Ship It" />

            <ActivityChallenge
                number="4.1"
                title="End-to-End Test"
                description="Verify the full stack works together."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>With <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose up</code> running in your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend/</code> folder and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run dev</code> running in your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">frontend/</code> folder:</ActivityTask>
                    <ActivityTask>Create a new resource through your UI</ActivityTask>
                    <ActivityTask>Verify it appears in the list</ActivityTask>
                    <ActivityTask>Verify it is stored by checking your API <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code></ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.2"
                title="PR and Board Update"
                description="Finalize and ship Issue #3."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Commit everything</ActivityTask>
                    <ActivityTask>Push</ActivityTask>
                    <ActivityTask>Open a PR that closes Issue #3 from your GitHub Project board</ActivityTask>
                    <ActivityTask>Move Issue #3 to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Done</code></ActivityTask>
                    <ActivityTask>Your PR description must include: a screenshot of the running app, confirmation that data persists across page refreshes, and the URL of your running local app</ActivityTask>
                    <ActivityTask>All 3 issues should now be in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Done</code> on your board</ActivityTask>
                </div>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Tailwind CSS & Connecting to Your API',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-5/lecture-2'),
                }}
                next={{
                    label: 'Classes, Encapsulation & Inheritance',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-6/lecture-1'),
                }}
            />
        </LectureLayout>
    );
}
