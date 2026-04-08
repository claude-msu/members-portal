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
                Railway and Heroku Postgres use the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">postgres://</code> scheme in their URLs. SQLAlchemy requires <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">postgresql://</code>. The replace line above handles this automatically — without it your app will crash on startup with a "scheme not recognized" error.
            </LectureCallout>

            <LectureSubHeading title="Backups" />
            <LectureP>
                Managed DBs usually offer automated backups. Turn them on. For this course the host's default backup policy is enough — just know that production data is precious and be aware of how to restore if needed.
            </LectureP>

            <LectureSectionHeading number="03" title="Migrations on Deploy" />

            <LectureP>
                Two common patterns: (1) run migrations in a release step <em>before</em> starting the new app; (2) run them at app startup. Either way, never skip migrations — a deploy that expects a new column will crash if the column doesn't exist.
            </LectureP>
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
                Keep migrations reversible when possible (add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">downgrade</code> function). That way you can roll back a deploy and revert the schema if something goes wrong.
            </LectureCallout>

            <LectureSectionHeading number="04" title="Production Checklist" />

            <LectureCallout type="info">
                Before you call the project "deployed," verify every item:
            </LectureCallout>

            <LectureP>
                <strong className="text-foreground">1. Live URLs</strong> — frontend and backend both reachable at public URLs.
            </LectureP>
            <LectureP>
                <strong className="text-foreground">2. Env vars</strong> — frontend uses <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_API_URL</code> pointing to the backend; backend has <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code>, etc.
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
                <strong className="text-foreground">6. Smoke test</strong> — login and at least one main flow work on the live URLs.
            </LectureP>

            <LectureCallout type="tip">
                Document the live URLs and required env vars in the README (names only, no values). A reviewer should be able to set up the project from your README alone.
            </LectureCallout>

            
        </LectureLayout>
    );
}
