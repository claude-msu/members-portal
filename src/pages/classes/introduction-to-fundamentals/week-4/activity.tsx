import { useNavigate } from 'react-router-dom';
import { Server } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week4Activity() {
    const navigate = useNavigate();

    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                week={4}
                session="Activity"
                title="Build Your Backend"
                description="The Dockerfile exists. Now fill it in — a real FastAPI backend with SQLite storage and Redis caching, all running via Docker Compose. By the end you have a documented API you can hand off to your frontend next week."
                icon={<Server className="h-4 w-4" />}
            />

            <LectureCallout type="info">
                You are building the backend for the domain you chose in Week 2. Use FastAPI's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code> page to verify everything as you go.
            </LectureCallout>

            {/* ── 01 PROJECT REQUIREMENTS ──────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Project Requirements" />

            <LectureP>
                Before writing code, understand what you are shipping. Every backend this week must meet these requirements regardless of domain.
            </LectureP>

            <div className="my-4 space-y-2">
                {[
                    '3 or more REST endpoints (at minimum: create one resource, list all resources, get one resource by ID)',
                    'SQLite database using SQLAlchemy for all persistent data',
                    'At least one Redis-cached endpoint — a read that is expensive enough to be worth caching (e.g., aggregate, filtered list, recommendation computation)',
                    'Docker Compose file that starts FastAPI + Redis with one command: docker compose up',
                    'FastAPI /docs page fully documents all endpoints with correct schemas',
                ].map((req, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                        <p className="text-sm text-foreground">{req}</p>
                    </div>
                ))}
            </div>

            <LectureCallout type="warning">
                Redis is a cache, not your primary database. Every piece of data must live in SQLite first. Redis holds computed results that are expensive to recompute on every request. If Redis goes down, your app should still work.
            </LectureCallout>

            {/* ── 02 SET UP DOCKER COMPOSE ────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Set Up Docker Compose" />

            <ActivityChallenge
                number="2.1"
                title="Write docker-compose.yml"
                description="Define FastAPI + Redis services that work together."
            >
                <div className="space-y-1">
                    <ActivityTask>In your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend/</code> folder, create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker-compose.yml</code></ActivityTask>
                    <ActivityTask>Define an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">api</code> service: build from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.</code>, ports <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">8000:8000</code>, depends_on <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">redis</code></ActivityTask>
                    <ActivityTask>Define a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">redis</code> service: image <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">redis:7-alpine</code>, no extra config needed</ActivityTask>
                    <ActivityTask>Verify with: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose up</code></ActivityTask>
                </div>

                <TerminalBlock
                    title="bash — backend"
                    lines={[
                        { cmd: 'docker compose up' },
                    ]}
                />

                <LectureCallout type="info">
                    <span title="Tells Docker Compose to start the redis service before the api service. Does not wait for Redis to be ready — just for the container to start. For production readiness checks, you would use healthchecks.">depends_on</span> ensures Redis starts first, but doesn't wait for it to be ready. Your code should handle the case where Redis is temporarily unavailable.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 03 BUILD YOUR ENDPOINTS ─────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Build Your Endpoints" />

            <ActivityChallenge
                number="3.1"
                title="Database Models"
                description="Set up SQLAlchemy and define your data schema."
            >
                <div className="space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">models.py</code> with your SQLAlchemy model(s) representing your chosen domain</ActivityTask>
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">database.py</code> with engine setup and a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">get_db</code> dependency</ActivityTask>
                    <ActivityTask>Update your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code> to create tables on startup</ActivityTask>
                </div>

                <ActivityHint label="SQLAlchemy quickstart">
                    <code className="bg-muted px-1 rounded text-xs">from sqlalchemy import create_engine; from sqlalchemy.orm import sessionmaker, declarative_base</code> — then define your Base class and models that inherit from it.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="Core Endpoints"
                description="Implement your 3 required REST endpoints."
            >
                <div className="space-y-1">
                    <ActivityTask>Implement your 3 required endpoints. Each must use a Pydantic schema for request/response validation</ActivityTask>
                    <ActivityTask>Test each one through <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code> before moving on</ActivityTask>
                </div>

                <LectureCallout type="tip">
                    Write one endpoint, test it in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code>, then write the next. Do not write all three and then test — you will not know which one is broken.
                </LectureCallout>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.3"
                title="Redis Caching Layer"
                description="Add caching to your most expensive read operation."
            >
                <div className="space-y-1">
                    <ActivityTask>Connect to Redis using the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">redis</code> Python package: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">redis.Redis(host='redis', port=6379)</code></ActivityTask>
                    <ActivityTask>Pick the most read-heavy endpoint — the one that does the most computation or hits the most rows</ActivityTask>
                    <ActivityTask>Cache its result in Redis with a 60-second TTL using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">r.setex()</code></ActivityTask>
                    <ActivityTask>On each request: check Redis first (cache hit), fall back to SQLite if not found (cache miss), then store the result in Redis</ActivityTask>
                </div>

                <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs">
                    <p className="text-zinc-400 mb-2"># Cache hit/miss pattern:</p>
                    <p className="text-blue-400">result = r.get(<span className="text-amber-400">'cache_key'</span>)</p>
                    <p className="text-blue-400">if result:</p>
                    <p className="text-zinc-400 pl-4">return json.loads(result)  <span className="text-gray-500"># cache hit</span></p>
                    <p className="text-blue-400">else:</p>
                    <p className="text-zinc-400 pl-4">result = compute_expensive_query()</p>
                    <p className="text-zinc-400 pl-4">r.setex(<span className="text-amber-400">'cache_key'</span>, 60, json.dumps(result))</p>
                    <p className="text-zinc-400 pl-4">return result  <span className="text-gray-500"># cache miss, but now cached</span></p>
                </div>

                <LectureCallout type="info">
                    <span title="Time To Live — how long a cached value stays valid before Redis automatically deletes it. After 60 seconds the next request will recompute the value and re-cache it. Prevents serving stale data indefinitely.">TTL</span> is the expiration time. After 60 seconds the next request will recompute the value and re-cache it.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 04 SHIP IT ──────────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Ship It" />

            <ActivityChallenge
                number="4.1"
                title="Verify and Document"
                description="Finalize your API documentation."
            >
                <div className="space-y-1">
                    <ActivityTask>Open <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code> and confirm all endpoints appear with correct schemas</ActivityTask>
                    <ActivityTask>Test the cached endpoint twice in quick succession and confirm the second response is faster</ActivityTask>
                    <ActivityTask>Write a short <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">API.md</code> in your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend/</code> folder documenting each endpoint: method, path, what it does, example request/response</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.2"
                title="PR and Board Update"
                description="Finalize and ship Issue #2."
            >
                <div className="space-y-1">
                    <ActivityTask>Commit everything</ActivityTask>
                    <ActivityTask>Push</ActivityTask>
                    <ActivityTask>Open a PR that closes Issue #2 from your GitHub Project board</ActivityTask>
                    <ActivityTask>Move Issue #2 to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Done</code></ActivityTask>
                    <ActivityTask>Your PR description should include: a screenshot of your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code> page, confirmation that <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose up</code> works, and which endpoint is Redis-cached and why you chose it</ActivityTask>
                </div>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Databases: SQL, SQLite & Redis',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-2'),
                }}
                next={{
                    label: 'React Components & Hooks',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-5/lecture-1'),
                }}
            />
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
