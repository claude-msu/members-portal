import { useNavigate } from 'react-router-dom';
import { Container } from 'lucide-react';
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

export default function Week2Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={2}
                session="Activity"
                title="The Containerization Challenge"
                description="Two lectures down. Now you take a real application from zero to fully containerized. By the end of this session you'll have a Node.js app and a PostgreSQL database running together in Docker, communicating over a Compose network, with data that survives container restarts."
                icon={<Container className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                onBack={() => navigate('/classes/introduction-to-fundamentals')}
            />

            <LectureCallout type="info">
                Each challenge builds directly on the last. Don't skip ahead — the final challenge assumes everything from the earlier ones is already running. If you get stuck on a step, use the hints before asking for help.
            </LectureCallout>

            {/* ── 01 SINGLE CONTAINER ─────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Single Container" />

            <LectureP>
                Start with the fundamentals. Before composing multiple services, get comfortable with the full build-run-debug cycle for a single container.
            </LectureP>

            <ActivityChallenge
                number="1.1"
                title="Write Your First Dockerfile"
                description="Take a provided Node.js app and containerize it from scratch."
            >
                <LectureP>
                    Create a new directory called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker-app</code> and set up the following files:
                </LectureP>

                <TerminalBlock
                    title="bash — ~/docker-app"
                    lines={[
                        { comment: 'scaffold the project', cmd: 'mkdir docker-app && cd docker-app && npm init -y' },
                        { cmd: 'npm install express' },
                        { comment: 'create the server', cmd: 'touch server.js' },
                    ]}
                />

                <LectureP>
                    Open <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">server.js</code> in your editor and paste this in:
                </LectureP>

                <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                    <div className="bg-zinc-800 px-4 py-2 text-zinc-400 text-xs border-b border-zinc-700 select-none">
                        server.js
                    </div>
                    <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                        <p className="text-blue-400">const <span className="text-emerald-400">express</span> = require(<span className="text-amber-400">'express'</span>)</p>
                        <p className="text-blue-400">const <span className="text-emerald-400">app</span> = express()</p>
                        <p className="text-zinc-500 mt-2">const PORT = process.env.PORT || 3000</p>
                        <p className="text-blue-400 mt-2">app.get(<span className="text-amber-400">'/'</span>, (req, res) =&gt; {'{'}</p>
                        <p className="text-zinc-400 pl-4">res.json({'{'} message: <span className="text-amber-400">'Hello from Docker!'</span>, port: PORT {'}'})</p>
                        <p className="text-blue-400">{'}'})</p>
                        <p className="text-blue-400 mt-2">app.listen(PORT, () =&gt; {'{'}</p>
                        <p className="text-zinc-400 pl-4">console.log(<span className="text-amber-400">`Server running on port ${'{'}PORT{'}'}`</span>)</p>
                        <p className="text-blue-400">{'}'})</p>
                    </div>
                </div>

                <div className="mt-4 space-y-1">
                    <ActivityTask>Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Dockerfile</code> that uses <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node:20-alpine</code> as the base image, sets a working directory, copies and installs dependencies, copies the app code, exposes port 3000, and starts the server</ActivityTask>
                    <ActivityTask>Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.dockerignore</code> that excludes <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.git</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code></ActivityTask>
                    <ActivityTask>Build the image with the tag <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker-app:latest</code></ActivityTask>
                    <ActivityTask>Run the container in detached mode, mapping port 3000 on your machine to port 3000 in the container</ActivityTask>
                    <ActivityTask>Verify it works: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl http://localhost:3000</code> should return the JSON response</ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker logs</code> on your container and confirm you see the startup message</ActivityTask>
                </div>

                <ActivityHint label="Dockerfile structure">
                    The order matters for layer caching. Copy <code className="bg-muted px-1 rounded">package*.json</code> first, then run <code className="bg-muted px-1 rounded">npm install</code>, then copy the rest of your code. This way, Docker only re-runs the install step when your dependencies change — not every time you edit <code className="bg-muted px-1 rounded">server.js</code>.
                </ActivityHint>
                <ActivityHint label="running the container">
                    The full run command needs: <code className="bg-muted px-1 rounded">-d</code> for detached, <code className="bg-muted px-1 rounded">-p 3000:3000</code> to publish the port, and <code className="bg-muted px-1 rounded">--name docker-app</code> to give it a friendly name. Then the image name at the end.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="1.2"
                title="Inspect and Debug"
                description="Explore the inside of your running container and understand what Docker actually built."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Open a shell inside your running container using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker exec -it</code></ActivityTask>
                    <ActivityTask>Navigate to the working directory and run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ls -la</code> — confirm your files are there</ActivityTask>
                    <ActivityTask>Check which version of Node.js is running inside the container with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node --version</code></ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ps aux</code> inside the container — notice how few processes are running compared to your host machine</ActivityTask>
                    <ActivityTask>Exit the container shell</ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker inspect docker-app</code> on your host machine and find the container's internal IP address in the output</ActivityTask>
                </div>

                <ActivityHint label="opening a shell in alpine">
                    Alpine Linux is minimal — it doesn't include bash. Use <code className="bg-muted px-1 rounded">/bin/sh</code> instead: <code className="bg-muted px-1 rounded">docker exec -it docker-app /bin/sh</code>
                </ActivityHint>
                <ActivityHint label="finding the IP in docker inspect">
                    The output of <code className="bg-muted px-1 rounded">docker inspect</code> is a large JSON blob. Pipe it through grep: <code className="bg-muted px-1 rounded">docker inspect docker-app | grep IPAddress</code>
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="1.3"
                title="Environment Variables"
                description="Pass configuration into your container at runtime rather than baking it into the image."
            >
                <LectureP>
                    Hardcoding config into an image is bad practice — you'd need a different image for dev, staging, and production. The correct approach is to pass values in as environment variables at runtime.
                </LectureP>

                <div className="mt-4 space-y-1">
                    <ActivityTask>Stop and remove your current container</ActivityTask>
                    <ActivityTask>Run a new container that sets the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PORT</code> environment variable to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">4000</code> using the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-e</code> flag, and maps host port 4000 to container port 4000</ActivityTask>
                    <ActivityTask>Hit <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl http://localhost:4000</code> and confirm the JSON response shows <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">port: 4000</code></ActivityTask>
                    <ActivityTask>Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> file with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PORT=5000</code> and run a third container using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">--env-file .env</code> instead of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-e</code></ActivityTask>
                </div>

                <ActivityHint label="running two containers simultaneously">
                    You can run multiple containers from the same image as long as they have different names and different host ports. Each container is completely isolated.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 02 MULTI-CONTAINER WITH COMPOSE ─────────────────────────────── */}
            <LectureSectionHeading number="02" title="Multi-Container with Compose" />

            <LectureP>
                Single containers are useful. Multi-container applications are where Docker really shines. Now you'll add a PostgreSQL database and wire it to your app using Docker Compose.
            </LectureP>

            <ActivityChallenge
                number="2.1"
                title="Add a Database with Compose"
                description="Replace your manual docker run commands with a docker-compose.yml that manages everything."
            >
                <LectureP>
                    Stop and remove all running containers from Part 1 before starting. Then:
                </LectureP>

                <div className="mt-4 space-y-1">
                    <ActivityTask>Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker-compose.yml</code> in your project root with two services: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">app</code> (built from your Dockerfile) and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">db</code> (using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">postgres:16-alpine</code>)</ActivityTask>
                    <ActivityTask>Configure the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">app</code> service to map port 3000, set <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code> as an environment variable pointing to the db service, and declare <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">depends_on: db</code></ActivityTask>
                    <ActivityTask>Configure the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">db</code> service with the required Postgres environment variables (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POSTGRES_USER</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POSTGRES_PASSWORD</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POSTGRES_DB</code>) and a named volume to persist data</ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose up -d</code> and verify both services start with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose ps</code></ActivityTask>
                    <ActivityTask>Check the logs of both services with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose logs -f</code></ActivityTask>
                </div>

                <ActivityHint label="named volumes in compose">
                    Volumes are declared in two places. Under the service, you map the volume to a path: <code className="bg-muted px-1 rounded">volumes: - postgres_data:/var/lib/postgresql/data</code>. At the top level of the file, you declare the volume name so Compose creates it: <code className="bg-muted px-1 rounded">volumes: {'\n'}  postgres_data:</code>
                </ActivityHint>
                <ActivityHint label="DATABASE_URL format">
                    The format is: <code className="bg-muted px-1 rounded">postgres://USER:PASSWORD@SERVICE_NAME:5432/DB_NAME</code>. The host is the service name from compose (<code className="bg-muted px-1 rounded">db</code>), not localhost — services on the same Compose network reach each other by name.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.2"
                title="Connect the App to the Database"
                description="Update your server to actually query Postgres and prove the two containers are talking."
            >
                <LectureP>
                    Install the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pg</code> package and update <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">server.js</code> to add a health-check endpoint that queries the database:
                </LectureP>

                <TerminalBlock
                    lines={[
                        { comment: 'install the postgres client library', cmd: 'npm install pg' },
                    ]}
                />

                <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                    <div className="bg-zinc-800 px-4 py-2 text-zinc-400 text-xs border-b border-zinc-700 select-none">
                        server.js — add this route
                    </div>
                    <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                        <p className="text-blue-400">const {'{ '}<span className="text-emerald-400">Pool</span>{' }'} = require(<span className="text-amber-400">'pg'</span>)</p>
                        <p className="text-blue-400">const <span className="text-emerald-400">pool</span> = new Pool({'{'} connectionString: process.env.DATABASE_URL {'}'})</p>
                        <p className="text-zinc-400 mt-2">app.get(<span className="text-amber-400">'/health'</span>, async (req, res) =&gt; {'{'}</p>
                        <p className="text-zinc-400 pl-4">try {'{'}</p>
                        <p className="text-zinc-400 pl-8">const result = await pool.query(<span className="text-amber-400">'SELECT NOW()'</span>)</p>
                        <p className="text-zinc-400 pl-8">res.json({'{'} db: <span className="text-amber-400">'connected'</span>, time: result.rows[0].now {'}'})</p>
                        <p className="text-zinc-400 pl-4">{'}'} catch (err) {'{'}</p>
                        <p className="text-zinc-400 pl-8">res.status(500).json({'{'} db: <span className="text-amber-400">'error'</span>, error: err.message {'}'})</p>
                        <p className="text-zinc-400 pl-4">{'}'}</p>
                        <p className="text-zinc-400">{'}'})</p>
                    </div>
                </div>

                <div className="mt-4 space-y-1">
                    <ActivityTask>Update <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">server.js</code> with the code above</ActivityTask>
                    <ActivityTask>Rebuild and restart using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose up --build -d</code></ActivityTask>
                    <ActivityTask>Hit <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl http://localhost:3000/health</code> — you should see <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">db: "connected"</code> and the current database timestamp</ActivityTask>
                    <ActivityTask>Open a shell inside the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">db</code> container using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose exec db psql -U user mydb</code> and run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">SELECT NOW();</code> to confirm the database is working</ActivityTask>
                </div>

                <ActivityHint label="why --build is needed">
                    Docker Compose caches the built image. If you change <code className="bg-muted px-1 rounded">server.js</code> or install new packages, you need <code className="bg-muted px-1 rounded">--build</code> to force a rebuild. Without it, Compose just restarts the old image.
                </ActivityHint>
                <ActivityHint label="exiting psql">
                    Type <code className="bg-muted px-1 rounded">\q</code> and press Enter to exit the Postgres interactive shell.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.3"
                title="Prove Data Persists"
                description="Verify that your named volume survives container restarts — the whole point of volumes."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Open a psql shell inside the db container and create a table: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">CREATE TABLE pings (id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW());</code></ActivityTask>
                    <ActivityTask>Insert a row: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">INSERT INTO pings DEFAULT VALUES;</code></ActivityTask>
                    <ActivityTask>Verify it exists: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">SELECT * FROM pings;</code></ActivityTask>
                    <ActivityTask>Exit psql and run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose down</code> (without <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-v</code>) — this stops and removes the containers but keeps the volume</ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose up -d</code> again and reconnect to psql</ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">SELECT * FROM pings;</code> — the row should still be there</ActivityTask>
                    <ActivityTask>Now run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose down -v</code> and restart — confirm the data is gone this time</ActivityTask>
                </div>

                <LectureCallout type="info">
                    This is the critical distinction: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose down</code> removes containers but not volumes. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose down -v</code> removes everything. In production you never run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-v</code> unless you intentionally want to wipe the database.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 03 LAYER CACHING ────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Optimizing Your Build" />

            <LectureP>
                Understanding layer caching is the difference between a 30-second rebuild and a 3-second one. This section makes it concrete.
            </LectureP>

            <ActivityChallenge
                number="3.1"
                title="See Caching in Action"
                description="Run the same build twice and observe Docker skipping unchanged layers."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose build --no-cache</code> to force a full rebuild from scratch — note how long it takes</ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose build</code> again immediately without changing anything — notice it completes almost instantly and every step says <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">CACHED</code></ActivityTask>
                    <ActivityTask>Now make a small change to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">server.js</code> (change the message text) and rebuild — only the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">COPY . .</code> step and anything after it should re-run</ActivityTask>
                    <ActivityTask>Now add a new package to your project (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install dotenv</code>) and rebuild — this time the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install</code> layer will be invalidated and re-run</ActivityTask>
                </div>

                <ActivityHint label="why the npm install layer re-runs">
                    When you add a package, <code className="bg-muted px-1 rounded">package.json</code> and <code className="bg-muted px-1 rounded">package-lock.json</code> change. The <code className="bg-muted px-1 rounded">COPY package*.json ./</code> step copies different files, so Docker can't use the cache for that layer or any layer after it.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 04 BONUS ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Bonus Challenge" />

            <LectureP>
                Finished early? This one requires combining everything you know.
            </LectureP>

            <ActivityChallenge
                number="★"
                title="Add a Ping Endpoint"
                description="Wire the database all the way through to the API — no hints."
            >
                <LectureP>
                    Add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POST /ping</code> endpoint to your server that inserts a row into the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pings</code> table and returns the total ping count. Add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /pings</code> endpoint that returns all rows. Rebuild and verify both endpoints work with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl</code>. Then run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">docker compose down</code> and back up — confirm the ping history persists.
                </LectureP>
                <LectureP>
                    This is the full loop: API endpoint → container → database → named volume → survives restarts. It's the foundation of every backend service you'll ever build.
                </LectureP>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Docker & Containerization',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-2/lecture-2'),
                }}
                next={{
                    label: 'Week 3 — React & Components',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/lecture-1'),
                }}
            />
        </LectureLayout>
    );
}