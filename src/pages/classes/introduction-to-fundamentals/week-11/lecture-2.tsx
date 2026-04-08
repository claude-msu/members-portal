import { Rocket } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
    LectureTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { CodeBlock } from '@/components/ui/code-block';

export default function Week11Lecture2() {
    return (
        <LectureLayout>
            <LectureHeader
                week={11}
                session="Lecture 2"
                title="Databases & Persistence in Production"
                description="Production databases, connection strings, migrations, and keeping your project's data safe and consistent when you ship."
                icon={<Rocket className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="Local vs Production Database" />

            <LectureP>
                Locally you might use SQLite in a file or an in-memory DB. In production you need a database that survives restarts, is backed up, and is reachable via a <LectureTerm>connection string</LectureTerm> (URL with host, port, user, password, and DB name). Railway, Render, and others offer managed Postgres — you get a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code> and set it as an env var.
            </LectureP>

            <LectureCallout type="info">
                <LectureTip tip="A version-controlled set of changes to the database schema (create table, add column, etc.). Run migrations on deploy so production schema stays in sync with code.">Migrations</LectureTip> (e.g. Alembic for Python, Prisma migrate for Node) let you evolve the schema without manual SQL. Generate them locally, commit them, and run them on deploy so production stays in sync with code.
            </LectureCallout>

            <LectureSubHeading title="Provisioning a database on Railway" />
            <LectureP>
                In the Railway dashboard: <strong className="text-foreground">New → Database → PostgreSQL</strong>. Railway spins up a Postgres instance and gives you a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code>. Copy it into your backend service's env vars. Your app connects with the same SQLAlchemy code — only the URL changes.
            </LectureP>

            <LectureCallout type="tip">
                If you're using Render, the flow is similar: <strong>New → PostgreSQL</strong>. Both platforms offer a free tier for small databases. Pick whichever you used for the backend — keeping frontend, backend, and DB on the same platform simplifies networking.
            </LectureCallout>

            <LectureSectionHeading number="02" title="Connection Strings and Security" />

            <LectureP>
                The connection string contains the password — it <strong className="text-foreground">must</strong> be in an env var, never in code. In the app, read <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">os.environ["DATABASE_URL"]</code> and pass it to your DB client.
            </LectureP>
            <CodeBlock
                language="python"
                title="database.py — reading DATABASE_URL"
                lines={[
                    'import os',
                    'from sqlalchemy import create_engine',
                    'from sqlalchemy.orm import sessionmaker',
                    '',
                    'DATABASE_URL = os.environ.get(',
                    '    "DATABASE_URL",',
                    '    "sqlite:///./local.db"  # fallback for local dev',
                    ')',
                    '',
                    '# Railway Postgres uses postgres://; SQLAlchemy needs postgresql://',
                    'if DATABASE_URL.startswith("postgres://"):',
                    '    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)',
                    '',
                    'engine = create_engine(DATABASE_URL, pool_pre_ping=True)',
                    'SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)',
                ]}
            />

            <LectureCallout type="warning">
                Railway and Heroku Postgres use the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">postgres://</code> scheme. SQLAlchemy requires <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">postgresql://</code>. The replace line handles this — without it your app crashes on startup with "scheme not recognized."
            </LectureCallout>

            <LectureSubHeading title="Connection pooling" />
            <LectureP>
                In production, your app may handle many concurrent requests. Opening a new DB connection for each request is slow. SQLAlchemy's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">create_engine</code> uses <LectureTip tip="A cache of reusable database connections. Instead of opening/closing a connection per request, the pool lends one out and takes it back when done. Reduces latency and prevents exhausting the database's connection limit.">connection pooling</LectureTip> by default — it keeps a set of connections open and reuses them across requests.
            </LectureP>
            <LectureP>
                The <LectureTip code tip="A SQLAlchemy option that pings the database before reusing a connection from the pool. If the connection is stale (e.g. the DB restarted), it opens a fresh one instead of failing. Small overhead, prevents intermittent 'connection reset' errors.">pool_pre_ping=True</LectureTip> option tells SQLAlchemy to test each connection before using it. This catches stale connections (e.g. after the DB restarts) and avoids intermittent errors in production.
            </LectureP>

            <LectureSectionHeading number="03" title="Migrations on Deploy" />

            <LectureP>
                Two common patterns: (1) run migrations in a release step <em>before</em> starting the app; (2) run them at app startup. Either way, never skip migrations — a deploy that expects a new column will crash if the column doesn't exist.
            </LectureP>

            <LectureSubHeading title="Alembic setup" />
            <LectureP>
                <LectureTip code tip="A database migration tool for SQLAlchemy. It auto-generates migration scripts by comparing your models to the current DB schema. Each migration is a Python file with upgrade() and downgrade() functions.">Alembic</LectureTip> is the standard migration tool for SQLAlchemy. After initializing, you'll need to configure it to read <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code> from the environment instead of a hardcoded string.
            </LectureP>
            <CodeBlock
                language="python"
                title="alembic/env.py — read DATABASE_URL from environment"
                lines={[
                    'import os',
                    'from alembic import context',
                    'from sqlalchemy import engine_from_config, pool',
                    '',
                    '# Replace the hardcoded sqlalchemy.url with the env var',
                    'config = context.config',
                    'config.set_main_option(',
                    '    "sqlalchemy.url",',
                    '    os.environ.get("DATABASE_URL", "sqlite:///./local.db")',
                    ')',
                    '',
                    '# Import your models so Alembic can detect changes',
                    'from app.models import Base',
                    'target_metadata = Base.metadata',
                ]}
            />
            <TerminalBlock
                title="bash — Alembic workflow"
                lines={[
                    { comment: 'install Alembic', cmd: 'pip install alembic' },
                    { comment: 'initialize (creates alembic.ini and alembic/ dir)', cmd: 'alembic init alembic' },
                    { comment: 'generate a migration after changing models', cmd: 'alembic revision --autogenerate -m "add users table"' },
                    { comment: 'apply all pending migrations', cmd: 'alembic upgrade head' },
                    { comment: 'combined start command for deploy', cmd: 'alembic upgrade head && uvicorn main:app --host 0.0.0.0' },
                ]}
            />
            <LectureCallout type="tip">
                Keep migrations reversible when possible — add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">downgrade()</code> function in each migration. That way you can roll back a deploy and revert the schema if something goes wrong.
            </LectureCallout>

            <LectureSectionHeading number="04" title="Backups and Recovery" />

            <LectureP>
                Managed databases usually offer automated backups — turn them on. For this course, the host's default backup policy is enough. But know the manual commands in case you need to migrate data between environments or recover from a mistake.
            </LectureP>
            <TerminalBlock
                title="bash — PostgreSQL backup and restore"
                lines={[
                    { comment: 'dump the production database to a file', cmd: 'pg_dump $DATABASE_URL > backup.sql' },
                    { comment: 'restore from a backup file', cmd: 'psql $DATABASE_URL < backup.sql' },
                    { comment: 'dump only data (no schema) for seeding another env', cmd: 'pg_dump --data-only $DATABASE_URL > seed.sql' },
                ]}
            />
            <LectureCallout type="warning">
                Never run destructive commands against production without a fresh backup. Test restores locally first: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pg_dump</code> from production, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">psql</code> into a local database, verify the data is intact.
            </LectureCallout>

            <LectureSectionHeading number="05" title="Health Check Endpoint" />

            <LectureP>
                A health check is a minimal endpoint (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /health</code>) that returns 200 if the app is running and the database is reachable. Hosting platforms and monitoring tools use it to detect outages and trigger restarts automatically.
            </LectureP>
            <CodeBlock
                language="python"
                title="main.py — health check endpoint"
                lines={[
                    'from sqlalchemy import text',
                    '',
                    '',
                    '@app.get("/health")',
                    'def health_check():',
                    '    try:',
                    '        db = SessionLocal()',
                    '        db.execute(text("SELECT 1"))',
                    '        db.close()',
                    '        return {"status": "healthy", "database": "connected"}',
                    '    except Exception:',
                    '        raise HTTPException(status_code=503, detail="Database unreachable")',
                ]}
            />
            <LectureCallout type="info">
                Railway can use this endpoint to know when your app is ready to receive traffic. If the health check fails after a deploy, Railway will keep the old version running. Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/health</code> as the health check path in the Railway dashboard under Settings.
            </LectureCallout>

            <LectureSectionHeading number="06" title="Production Checklist" />

            <LectureCallout type="info">
                Before you call the project "deployed," verify every item:
            </LectureCallout>

            <LectureP>
                <strong className="text-foreground">1. Live URLs</strong> — frontend and backend both reachable at public URLs.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">2. Env vars</strong> — frontend uses <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> pointing to the backend; backend has <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">FRONTEND_URL</code>.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">3. CORS</strong> — backend allows the frontend's production origin.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">4. Database</strong> — provisioned, migrations run, data accessible.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">5. Secrets</strong> — all in the host's env, none in code or committed to the repo.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">6. Health check</strong> — <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/health</code> returns 200 and confirms DB connection.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">7. Smoke test</strong> — login and at least one main flow work on the live URLs.
            </LectureP>

            <TerminalBlock
                title="bash — quick production smoke test"
                lines={[
                    { comment: 'health check', cmd: 'curl https://your-api.railway.app/health' },
                    { comment: 'test login', cmd: 'curl -X POST https://your-api.railway.app/login -d "username=test@test.com&password=secret"' },
                    { comment: 'frontend loads', cmd: 'curl -s -o /dev/null -w "%{http_code}" https://your-app.vercel.app' },
                ]}
            />

            <LectureCallout type="tip">
                Document the live URLs and required env vars in the README (names only, no values). A reviewer should be able to set up and deploy the project from your README alone.
            </LectureCallout>

            
        </LectureLayout>
    );
}
