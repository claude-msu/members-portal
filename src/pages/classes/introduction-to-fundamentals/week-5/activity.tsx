import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
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
} from '@/components/ui/lecture-typography';

// ── File tree diagram ─────────────────────────────────────────────────────────
const FileTree = () => (
    <div className="my-6 rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs space-y-0.5">
        {[
            { label: 'notes-api/', depth: 0, dir: true },
            { label: 'main.py', depth: 1 },
            { label: 'database.py', depth: 1 },
            { label: 'models.py', depth: 1 },
            { label: 'schemas.py', depth: 1 },
            { label: 'routers/', depth: 1, dir: true },
            { label: 'notes.py', depth: 2 },
            { label: 'users.py', depth: 2 },
            { label: 'requirements.txt', depth: 1 },
            { label: '.env', depth: 1 },
            { label: '.gitignore', depth: 1 },
        ].map((item) => (
            <div key={item.label + item.depth} style={{ paddingLeft: `${item.depth * 1.25}rem` }} className="flex items-center gap-1.5">
                <span className="text-muted-foreground select-none">{item.depth > 0 ? '├─' : ''}</span>
                <span className={item.dir ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-foreground'}>
                    {item.label}
                </span>
            </div>
        ))}
    </div>
);

export default function Week5Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={5}
                session="Activity"
                title="Build the Notes API"
                description="Two lectures, one project: a fully functional Notes API with user management, CRUD operations, search, and persistent SQLite storage — all documented and testable through FastAPI's interactive docs. This is your first real backend."
                icon={<FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
            />

            <LectureCallout type="info">
                Unlike previous activities, this one is purely backend — no React, no Tailwind. Your deliverable is a running API you can poke at through <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">localhost:8000/docs</code>. The bonus challenge at the end connects it to a frontend.
            </LectureCallout>

            {/* ── 01 PROJECT SETUP ────────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Project Setup" />

            <ActivityChallenge
                number="1.1"
                title="Scaffold the Project"
                description="Create the directory structure, virtual environment, and install dependencies."
            >
                <LectureP>
                    Target structure for the project:
                </LectureP>

                <FileTree />

                <div className="mt-4 space-y-1">
                    <ActivityTask>Create the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">notes-api/</code> directory and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">cd</code> into it</ActivityTask>
                    <ActivityTask>Create and activate a virtual environment: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">python3 -m venv .venv && source .venv/bin/activate</code></ActivityTask>
                    <ActivityTask>Install dependencies: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pip install fastapi uvicorn[standard] sqlalchemy python-dotenv</code></ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pip freeze {'>'} requirements.txt</code></ActivityTask>
                    <ActivityTask>Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.venv/</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">*.db</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">__pycache__/</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code></ActivityTask>
                    <ActivityTask>Create a minimal <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code> with a single <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /</code> health check route that returns <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'{"status": "ok"}'}</code></ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">uvicorn main:app --reload</code> and verify <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl http://localhost:8000/</code> returns the health check</ActivityTask>
                </div>

                <ActivityHint label="routers/ directory">
                    Create the <code className="bg-muted px-1 rounded">routers/</code> directory and add an empty <code className="bg-muted px-1 rounded">__init__.py</code> file inside it. This makes it a Python package so you can import from it with <code className="bg-muted px-1 rounded">from routers import notes</code>.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 02 DATABASE ─────────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Database Layer" />

            <ActivityChallenge
                number="2.1"
                title="Define the Models"
                description="Set up the SQLAlchemy connection and define your ORM models."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">database.py</code> with the engine (SQLite), <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">SessionLocal</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Base</code>, and the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">get_db</code> dependency generator</ActivityTask>
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">models.py</code> with a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">User</code> model (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">id</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">name</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">email</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">created_at</code>) and a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Note</code> model (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">id</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">user_id</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">title</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">content</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">created_at</code>)</ActivityTask>
                    <ActivityTask>Add a SQLAlchemy <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">relationship()</code> between User and Note so <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">user.notes</code> gives you a list and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">note.author</code> gives you the user</ActivityTask>
                    <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code>, call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Base.metadata.create_all(bind=engine)</code> on startup</ActivityTask>
                    <ActivityTask>Run the server and confirm a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">notes.db</code> file is created in your project directory</ActivityTask>
                    <ActivityTask>Open the database with the SQLite CLI to inspect the tables: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">sqlite3 notes.db</code> then <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.tables</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.schema notes</code></ActivityTask>
                </div>

                <ActivityHint label="created_at with a default">
                    In SQLAlchemy, set a server-side default with <code className="bg-muted px-1 rounded">server_default=func.now()</code>: <code className="bg-muted px-1 rounded">created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())</code>. This way the DB fills it in automatically — you never pass it manually.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.2"
                title="Write the Pydantic Schemas"
                description="Define the request and response models that FastAPI will use for validation and serialization."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">schemas.py</code></ActivityTask>
                    <ActivityTask>Define <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">UserCreate</code> (name, email), <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">UserResponse</code> (id, name, email, created_at) — separate in/out models</ActivityTask>
                    <ActivityTask>Define <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">NoteCreate</code> (user_id, title, content), <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">NoteUpdate</code> (title and content both optional), <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">NoteResponse</code> (id, user_id, title, content, created_at)</ActivityTask>
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">model_config = ConfigDict(from_attributes=True)</code> to all response models — this tells Pydantic it can read from SQLAlchemy model attributes, not just dicts</ActivityTask>
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Field(min_length=1)</code> constraints to title and content in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">NoteCreate</code></ActivityTask>
                </div>

                <ActivityHint label="NoteUpdate with all optional fields">
                    For a PATCH schema where all fields are optional: <code className="bg-muted px-1 rounded">{"class NoteUpdate(BaseModel):\n    title: str | None = None\n    content: str | None = None"}</code>. Your route handler then only updates fields that aren't None.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 03 ROUTERS ──────────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Build the Routers" />

            <LectureP>
                FastAPI's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">APIRouter</code> lets you split routes across multiple files and include them all in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code>. Keep users and notes separate.
            </LectureP>

            <ActivityChallenge
                number="3.1"
                title="Users Router"
                description="CRUD endpoints for user management."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">routers/users.py</code> with an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">APIRouter(prefix="/users", tags=["users"])</code></ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POST /users</code> — create a user, raise <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">HTTP 400</code> if the email already exists</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /users</code> — list all users with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">skip</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">limit</code> query params</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /users/{'{user_id}'}</code> — get one user, raise <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">HTTP 404</code> if not found</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DELETE /users/{'{user_id}'}</code> — delete a user and return 204 No Content</ActivityTask>
                    <ActivityTask>Include the router in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">app.include_router(users.router)</code></ActivityTask>
                    <ActivityTask>Test all four endpoints from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code> — create two users, list them, fetch one by id, then delete one</ActivityTask>
                </div>

                <ActivityHint label="checking for duplicate email">
                    Before inserting: <code className="bg-muted px-1 rounded">{"existing = db.query(models.User).filter(models.User.email == user.email).first()\nif existing:\n    raise HTTPException(status_code=400, detail='Email already registered')"}</code>
                </ActivityHint>
                <ActivityHint label="including the router in main.py">
                    <code className="bg-muted px-1 rounded">from routers import users, notes</code> then <code className="bg-muted px-1 rounded">app.include_router(users.router)</code>. The prefix you set on the router (<code className="bg-muted px-1 rounded">/users</code>) is automatically prepended to all routes inside it.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="Notes Router"
                description="Full CRUD for notes, scoped to users."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">routers/notes.py</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">APIRouter(prefix="/notes", tags=["notes"])</code></ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POST /notes</code> — create a note, validate the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">user_id</code> exists (raise 404 if not)</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /notes</code> — list notes with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">skip</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">limit</code>, and an optional <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">user_id</code> query param to filter by author</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /notes/{'{note_id}'}</code> — get one note by id</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PATCH /notes/{'{note_id}'}</code> — partial update using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">NoteUpdate</code>, only update fields that are not <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">None</code></ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DELETE /notes/{'{note_id}'}</code> — delete a note and return 204</ActivityTask>
                    <ActivityTask>Test the full CRUD cycle from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code>: create a user → create two notes → list notes filtered by that user → patch one → delete one</ActivityTask>
                </div>

                <ActivityHint label="partial update with PATCH">
                    Get the existing note, then only update the fields that aren't None: <code className="bg-muted px-1 rounded">{"if updates.title is not None: note.title = updates.title\nif updates.content is not None: note.content = updates.content\ndb.commit()\ndb.refresh(note)"}</code>
                </ActivityHint>
                <ActivityHint label="filtering notes by user_id">
                    In your query, apply the filter conditionally: <code className="bg-muted px-1 rounded">{"query = db.query(models.Note)\nif user_id:\n    query = query.filter(models.Note.user_id == user_id)\nreturn query.offset(skip).limit(limit).all()"}</code>
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 04 SEARCH ───────────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Add Search" />

            <ActivityChallenge
                number="4.1"
                title="Full-Text Search on Notes"
                description="Let callers search notes by title and content with a single query param."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add an optional <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">search: str | None = None</code> query param to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /notes</code></ActivityTask>
                    <ActivityTask>When <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">search</code> is provided, filter notes where the title OR content contains the search string using SQLAlchemy's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.ilike()</code> operator</ActivityTask>
                    <ActivityTask>Test it: create a few notes with different titles, then hit <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /notes?search=python</code> and confirm only matching notes are returned</ActivityTask>
                </div>

                <ActivityHint label="using ilike for case-insensitive search">
                    <code className="bg-muted px-1 rounded">{"from sqlalchemy import or_\nif search:\n    pattern = f'%{search}%'\n    query = query.filter(or_(\n        models.Note.title.ilike(pattern),\n        models.Note.content.ilike(pattern)\n    ))"}</code>
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 05 CORS AND ENV ─────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="CORS & Environment Config" />

            <ActivityChallenge
                number="5.1"
                title="Configure CORS and Environment Variables"
                description="Make the API ready to be consumed by a React frontend."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> file with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL=sqlite:///./notes.db</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ALLOWED_ORIGINS=http://localhost:5173</code></ActivityTask>
                    <ActivityTask>Update <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">database.py</code> to read <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DATABASE_URL</code> from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">os.environ</code> using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">python-dotenv</code></ActivityTask>
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">CORSMiddleware</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code>, reading the allowed origins from the environment variable</ActivityTask>
                    <ActivityTask>Restart the server and confirm it still starts correctly with the env-driven config</ActivityTask>
                </div>

                <TerminalBlock
                    lines={[
                        { comment: 'verify CORS headers are being set', cmd: 'curl -i -X OPTIONS http://localhost:8000/notes \\' },
                        { cmd: '  -H "Origin: http://localhost:5173" \\' },
                        { cmd: '  -H "Access-Control-Request-Method: GET"' },
                        { comment: 'look for Access-Control-Allow-Origin in the response headers', cmd: '' },
                    ]}
                />
            </ActivityChallenge>

            {/* ── 06 BONUS ─────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Bonus Challenges" />

            <ActivityChallenge
                number="★"
                title="Connect to Your Task Tracker Frontend"
                description="Replace localStorage with real API calls to your Notes API — no hints."
            >
                <LectureP>
                    In your Task Tracker from Week 3, replace the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useLocalStorage</code> hook with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">fetch</code> calls to your FastAPI backend. You'll need to: hardcode a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">user_id</code> (no auth yet), replace <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">handleAdd</code> with a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POST /notes</code> call, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">handleDelete</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DELETE /notes/:id</code>, and load the initial task list from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /notes?user_id=1</code> in a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useEffect</code>. Tasks now survive clearing your browser.
                </LectureP>
            </ActivityChallenge>

            <ActivityChallenge
                number="★"
                title="Add Pagination Metadata"
                description="Return total count alongside results so the frontend can build pagination controls."
            >
                <LectureP>
                    Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PaginatedNotes</code> Pydantic schema with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">items: list[NoteResponse]</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">total: int</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">skip: int</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">limit: int</code>. Update <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /notes</code> to return this shape. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">query.count()</code> before applying <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">offset</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">limit</code> to get the total.
                </LectureP>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'SQL & Databases',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-5/lecture-2'),
                }}
                next={{
                    label: 'Week 6 — Prompt Engineering',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-6/lecture-1'),
                }}
            />
        </LectureLayout>
    );
}