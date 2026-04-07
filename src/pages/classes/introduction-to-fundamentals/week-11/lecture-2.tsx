import { Rocket } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';

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
                Locally you might use SQLite in a file or an in-memory DB. In production you need a database that (1) survives restarts, (2) is backed up, and (3) is reachable by your backend with a <LectureTerm>connection string</LectureTerm> (URL with host, port, user, password, db name). Railway, Render, and others offer managed Postgres or MySQL; you get a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code> and set it as an env var. Your app uses the same code path — only the URL changes.
            </LectureP>
            <LectureP>
                If you started with SQLite, you can keep it for a small project and deploy the file with the app (some hosts support persistent volumes). For anything you care about long-term, switch to a managed relational DB and use the same ORM or SQL layer with the production URL.
            </LectureP>

            <LectureCallout type="info">
                <LectureTermWithTip tip="A version-controlled set of changes to the database schema (create table, add column, etc.). Run migrations on deploy so production schema stays in sync with code.">Migrations</LectureTermWithTip> (e.g. Alembic for Python, Prisma migrate for Node) let you evolve the schema without manual SQL. Generate migrations locally, commit them, and run them as part of the deploy or startup so production DB is always in the right state.
            </LectureCallout>

            <LectureSectionHeading number="02" title="Connection Strings and Security" />

            <LectureP>
                The <LectureTerm>connection string</LectureTerm> contains the password. It must be in an env var, never in code. Use the host's secret/env UI. In the app, read <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">os.environ["DATABASE_URL"]</code> (or equivalent) and pass it to your DB client. Use SSL/TLS for the connection in production if the provider requires it (many do).
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    Example: reading DATABASE_URL in FastAPI
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./local.db"  # fallback for local dev
)
# Railway Postgres often uses postgres://; some clients need postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
`}
                </pre>
            </div>
            <LectureSubHeading title="Backups" />
            <LectureP>
                Managed DBs usually offer automated backups. Turn them on. For critical data, know how to restore from a backup. For this course, the host's default backup policy is enough; just be aware that production data is precious.
            </LectureP>

            <LectureSectionHeading number="03" title="Migrations on Deploy" />

            <LectureP>
                Two common patterns: (1) Run migrations in CI or in a release step before starting the new app — e.g. a GitHub Action or a script that runs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">alembic upgrade head</code> then deploys. (2) Run migrations at app startup — the app checks schema version and runs pending migrations before accepting traffic. Either way, never skip migrations; a code deploy that expects a new column will break if the column doesn't exist.
            </LectureP>
            <TerminalBlock
                title="bash — Alembic workflow (follow along)"
                lines={[
                    { comment: 'install Alembic in your backend project', cmd: 'pip install alembic' },
                    { comment: 'initialize Alembic (creates alembic.ini and alembic/)', cmd: 'alembic init alembic' },
                    { comment: 'set sqlalchemy.url in alembic.ini to use env var, e.g. script.py.mako or env.py', cmd: '' },
                    { comment: 'generate a migration after changing models', cmd: 'alembic revision --autogenerate -m "add users table"' },
                    { comment: 'apply all pending migrations (run this on deploy)', cmd: 'alembic upgrade head' },
                    { comment: 'run migrations then start app (e.g. in Procfile or start script)', cmd: 'alembic upgrade head && uvicorn main:app --host 0.0.0.0' },
                ]}
            />
            <LectureCallout type="tip">
                Keep migrations reversible when possible (add a downgrade). That way you can roll back a deploy and revert the schema if something goes wrong.
            </LectureCallout>

            <LectureSectionHeading number="04" title="Summary: Production Checklist" />

            <LectureP>
                Before you call the project "deployed": (1) Frontend and backend both have live URLs; (2) Frontend uses the production API URL via env var; (3) Backend has CORS set for the frontend origin; (4) All secrets (JWT, DB URL, etc.) are in the host's env, not in code; (5) Database is provisioned and migrations have been run; (6) You've tested login and at least one main flow on the live URLs. Document the live URLs and how to set env vars in the README (without exposing secrets).
            </LectureP>

            
        </LectureLayout>
    );
}
