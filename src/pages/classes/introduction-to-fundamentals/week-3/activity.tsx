import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
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

export default function Week3Activity() {
    const navigate = useNavigate();

    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                week={3}
                session="Activity"
                title="Containerize Your Backend Stub"
                description="You have a provided Python stub with one working endpoint. Your job is to containerize it, persist data with a volume, and explore what base image choice actually costs you in megabytes. The Dockerfile you write today is the one you will use in Week 4."
                icon={<Package className="h-4 w-4" />}
            />

            <LectureCallout type="info">
                The stub app is at <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend/main.py</code> in your project repo — the placeholder from Week 2.
            </LectureCallout>

            {/* ── 01 WRITE THE DOCKERFILE ─────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Write the Dockerfile" />

            <LectureP>
                The stub is a single-file Flask app with one GET <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/health</code> endpoint that returns <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{`{"status": "ok"}`}</code> and logs each request to a file called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">requests.log</code>.
            </LectureP>

            {/* Stub code block */}
            <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs">
                <p className="text-blue-400">from flask import Flask, jsonify</p>
                <p className="text-blue-400">import datetime</p>
                <p className="mt-2 text-zinc-400"></p>
                <p className="text-blue-400">app = Flask(__name__)</p>
                <p className="text-blue-400">LOG_FILE = <span className="text-amber-400">"/data/requests.log"</span></p>
                <p className="mt-2 text-zinc-400"></p>
                <p className="text-blue-400">@app.get(<span className="text-amber-400">"/health"</span>)</p>
                <p className="text-blue-400">def health():</p>
                <p className="text-zinc-400 pl-4">with open(LOG_FILE, <span className="text-amber-400">"a"</span>) as f:</p>
                <p className="text-zinc-400 pl-8">f.write(f<span className="text-amber-400">"</span>{`{datetime.datetime.now()} — health check\\n`}<span className="text-amber-400">"</span>)</p>
                <p className="text-zinc-400 pl-4">return jsonify({`{"status": "ok"}`})</p>
                <p className="mt-2 text-zinc-400"></p>
                <p className="text-blue-400">if __name__ == <span className="text-amber-400">"__main__"</span>:</p>
                <p className="text-zinc-400 pl-4">app.run(host=<span className="text-amber-400">"0.0.0.0"</span>, port=8000)</p>
            </div>

            <ActivityChallenge
                number="1.1"
                title="Write the Dockerfile"
                description="Containerize the Python stub with the right base image and configuration."
            >
                <div className="space-y-1">
                    <ActivityTask>In your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend/</code> folder, create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Dockerfile</code></ActivityTask>
                    <ActivityTask>Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">python:3.11-slim</code> as the base image</ActivityTask>
                    <ActivityTask>Set <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/app</code> as the working directory</ActivityTask>
                    <ActivityTask>Copy <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code></ActivityTask>
                    <ActivityTask>Install flask with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">RUN pip install flask</code></ActivityTask>
                    <ActivityTask>Create the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/data</code> directory with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">RUN mkdir /data</code></ActivityTask>
                    <ActivityTask>Expose port 8000</ActivityTask>
                    <ActivityTask>Set the CMD to run the app: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">CMD ["python", "main.py"]</code></ActivityTask>
                </div>

                <ActivityHint label="Dockerfile structure">
                    The skeleton looks like: FROM, WORKDIR, COPY, RUN, RUN, EXPOSE, CMD. Order each step logically.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="1.2"
                title="Build and Run"
                description="Verify the container works end-to-end."
            >
                <div className="space-y-1">
                    <ActivityTask>Build the image: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker build -t my-stub .</code></ActivityTask>
                    <ActivityTask>Run it: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker run -p 8000:8000 my-stub</code></ActivityTask>
                    <ActivityTask>In another terminal, hit the endpoint: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl http://localhost:8000/health</code></ActivityTask>
                    <ActivityTask>Verify you get <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{`{"status": "ok"}`}</code></ActivityTask>
                </div>

                <TerminalBlock
                    title="bash — backend"
                    lines={[
                        { cmd: 'docker build -t my-stub .' },
                        { cmd: 'docker run -p 8000:8000 my-stub' },
                    ]}
                />

                <TerminalBlock
                    title="bash — another terminal"
                    lines={[
                        { cmd: 'curl http://localhost:8000/health' },
                    ]}
                />

                <LectureCallout type="info">
                    <span title="Port mapping — format is host_port:container_port. The left side is what you access on your machine, the right side is what the container listens on internally.">-p 8000:8000</span> tells Docker to map your machine's port 8000 to the container's port 8000.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 02 PERSIST DATA WITH A VOLUME ───────────────────────────────── */}
            <LectureSectionHeading number="02" title="Persist Data with a Volume" />

            <LectureP>
                The stub writes to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/data/requests.log</code> inside the container. Right now that log disappears when the container stops. Fix that with a volume.
            </LectureP>

            <ActivityChallenge
                number="2.1"
                title="Mount a Volume"
                description="Bind mount a directory on your machine to the container's /data folder."
            >
                <div className="space-y-1">
                    <ActivityTask>Stop and remove your running container</ActivityTask>
                    <ActivityTask>Re-run with a bind mount: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker run -p 8000:8000 -v $(pwd)/data:/data my-stub</code></ActivityTask>
                    <ActivityTask>Hit the health endpoint 3 times</ActivityTask>
                    <ActivityTask>Stop the container</ActivityTask>
                    <ActivityTask>Verify that <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">data/requests.log</code> exists on your machine and contains 3 entries</ActivityTask>
                </div>

                <TerminalBlock
                    title="bash — backend"
                    lines={[
                        { cmd: 'docker run -p 8000:8000 -v $(pwd)/data:/data my-stub' },
                    ]}
                />

                <TerminalBlock
                    title="bash — another terminal"
                    lines={[
                        { cmd: 'curl http://localhost:8000/health' },
                        { cmd: 'curl http://localhost:8000/health' },
                        { cmd: 'curl http://localhost:8000/health' },
                        { cmd: 'cat data/requests.log' },
                    ]}
                />

                <LectureCallout type="info">
                    <span title="Maps a specific directory on your host machine directly into the container. Changes in either location are immediately reflected in the other.">bind mount</span> syncs a folder on your machine with a folder inside the container. Both see the same files in real-time.
                </LectureCallout>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.2"
                title="Prove It Survives a Restart"
                description="Stop the container, start it again, and verify the log file persists."
            >
                <div className="space-y-1">
                    <ActivityTask>Stop the container</ActivityTask>
                    <ActivityTask>Start it again with the same volume flag</ActivityTask>
                    <ActivityTask>Hit the endpoint 2 more times</ActivityTask>
                    <ActivityTask>Cat the log file again — it should now have 5 entries, not 2</ActivityTask>
                </div>

                <ActivityHint label="if your count resets">
                    Make sure you are using the same <code className="bg-muted px-1 rounded">$(pwd)/data</code> path each time. If you run from a different directory the volume will mount a different folder.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 03 COMPARE BASE IMAGES ──────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Compare Base Images" />

            <LectureP>
                The image size you ship affects pull times, cold start times, and storage costs. The base image is the biggest lever.
            </LectureP>

            <ActivityChallenge
                number="3.1"
                title="Build with Alpine"
                description="Compare Python slim vs. Alpine Linux."
            >
                <div className="space-y-1">
                    <ActivityTask>Create a second Dockerfile named <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Dockerfile.alpine</code></ActivityTask>
                    <ActivityTask>Change only the FROM line to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">python:3.11-alpine</code></ActivityTask>
                    <ActivityTask>Build it: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker build -f Dockerfile.alpine -t my-stub-alpine .</code></ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker images</code> and compare the sizes of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">my-stub</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">my-stub-alpine</code></ActivityTask>
                </div>

                <LectureCallout type="info">
                    <span title="A minimal Linux distribution designed for security and small size. Uses musl libc and busybox instead of the GNU equivalents, which makes images dramatically smaller but can cause compatibility issues with some packages.">Alpine Linux</span> is built for containers — it strips out everything unnecessary and keeps the OS as tiny as possible.
                </LectureCallout>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="Document Your Findings"
                description="Record the size difference and explain why it matters."
            >
                <div className="space-y-1">
                    <ActivityTask>In your repo, create a file called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DOCKER.md</code></ActivityTask>
                    <ActivityTask>Write the size of each image</ActivityTask>
                    <ActivityTask>Write one sentence explaining why they differ</ActivityTask>
                    <ActivityTask>Commit: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git add . && git commit -m "docs: add Docker findings"</code></ActivityTask>
                    <ActivityTask>Push and open a PR that closes your Issue #1 from the project board</ActivityTask>
                    <ActivityTask>Move Issue #1 to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Done</code> on your GitHub Project board</ActivityTask>
                </div>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Docker & Containerization',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/lecture-2'),
                }}
                next={{
                    label: 'FastAPI & Python Backends',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-1'),
                }}
            />
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
