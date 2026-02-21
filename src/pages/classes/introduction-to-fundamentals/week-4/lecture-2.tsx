import { useNavigate } from 'react-router-dom';
import { Server } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { LectureCmd } from '@/components/ui/lecture-cmd';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';

// ── Relational table diagram ──────────────────────────────────────────────────
const RelationalDiagram = () => (
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
            {
                table: 'users',
                color: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-800',
                header: 'bg-blue-50 dark:bg-blue-950/30',
                rows: [
                    { id: '1', name: 'Alice', email: 'alice@msu.edu' },
                    { id: '2', name: 'Bob', email: 'bob@msu.edu' },
                ],
                cols: ['id', 'name', 'email'],
            },
            {
                table: 'notes',
                color: 'text-emerald-600 dark:text-emerald-400',
                border: 'border-emerald-200 dark:border-emerald-800',
                header: 'bg-emerald-50 dark:bg-emerald-950/30',
                rows: [
                    { id: '1', user_id: '1', title: 'FastAPI intro' },
                    { id: '2', user_id: '1', title: 'SQL basics' },
                    { id: '3', user_id: '2', title: 'React hooks' },
                ],
                cols: ['id', 'user_id', 'title'],
            },
        ].map((t) => (
            <div key={t.table} className={`rounded-xl border ${t.border} overflow-hidden`}>
                <div className={`px-4 py-2 ${t.header}`}>
                    <code className={`text-xs font-bold ${t.color}`}>{t.table}</code>
                </div>
                <table className="w-full text-xs font-mono">
                    <thead>
                        <tr className="border-b border-border">
                            {t.cols.map((c) => (
                                <th key={c} className="px-3 py-1.5 text-left text-muted-foreground font-normal">{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {t.rows.map((row, i) => (
                            <tr key={i} className="border-b border-border last:border-b-0">
                                {t.cols.map((c) => (
                                    <td key={c} className={`px-3 py-1.5 ${c === 'user_id' ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>
                                        {(row as Record<string, string>)[c]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ))}
        <div className="sm:col-span-2 text-xs text-muted-foreground">
            <code>notes.user_id</code> is a foreign key that references <code>users.id</code>. The relationship: one user has many notes.
        </div>
    </div>
);

// ── SQL code block ────────────────────────────────────────────────────────────
const SqlBlock = ({ title, lines }: { title: string; lines: { comment?: string; sql: string }[] }) => (
    <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
        <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">{title}</div>
        <div className="bg-zinc-950 px-5 py-4 space-y-2 select-none">
            {lines.map((line, i) => (
                <div key={i}>
                    {line.comment && <p className="text-zinc-500 mb-0.5">{`-- ${line.comment}`}</p>}
                    <p className="text-zinc-300">{line.sql}</p>
                </div>
            ))}
        </div>
    </div>
);

export default function Week4Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={4}
                session="Lecture 2"
                title="Databases: SQL, SQLite & Redis"
                description="SQLite for relational persistent storage, Redis for fast caching. Learn when to use each, how they work together, and how Docker Compose wires both services into one command."
                icon={<Server className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
            />

            {/* ── 01 RELATIONAL DATABASES ─────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Relational Databases" />

            <LectureP>
                A <LectureTerm>relational database</LectureTerm> stores data in <LectureTerm>tables</LectureTerm> — rows and columns, like a spreadsheet. Each table represents one type of thing (users, notes, orders). Rows are individual records. Columns are the attributes of those records.
            </LectureP>
            <LectureP>
                What makes relational databases powerful is the ability to <LectureTerm>join</LectureTerm> tables together. Instead of duplicating user data into every note, you store users in one table and notes in another, linked by a <LectureTerm>foreign key</LectureTerm>. When you need the full picture, you join them in your query.
            </LectureP>

            <RelationalDiagram />

            <LectureCallout type="info">
                <strong className="text-foreground">SQLite</strong> stores the database in a single file on disk — zero configuration, perfect for development and small apps. <strong className="text-foreground">PostgreSQL</strong> is a full server, handles concurrent writes, supports advanced types, and is what you use in production. Start with SQLite, switch to Postgres when you need it. FastAPI + SQLAlchemy makes this switch trivial.
            </LectureCallout>

            {/* ── 02 CORE SQL ─────────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Core SQL" />

            <LectureP>
                SQL (Structured Query Language) is the language you use to talk to relational databases. The same syntax works across SQLite, PostgreSQL, MySQL, and most others with minor variations. Learn it once, use it everywhere.
            </LectureP>

            <LectureSubHeading title="Creating tables" />

            <SqlBlock
                title="DDL — defining the schema"
                lines={[
                    { comment: 'CREATE TABLE defines the structure. Run once when setting up.', sql: '' },
                    { sql: 'CREATE TABLE users (' },
                    { sql: '    id         INTEGER PRIMARY KEY AUTOINCREMENT,' },
                    { sql: '    name       TEXT    NOT NULL,' },
                    { sql: '    email      TEXT    NOT NULL UNIQUE,' },
                    { sql: '    created_at TEXT    NOT NULL DEFAULT (datetime(\'now\'))' },
                    { sql: ');' },
                    { sql: '' },
                    { sql: 'CREATE TABLE notes (' },
                    { sql: '    id         INTEGER PRIMARY KEY AUTOINCREMENT,' },
                    { sql: '    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,' },
                    { sql: '    title      TEXT    NOT NULL,' },
                    { sql: '    content    TEXT    NOT NULL,' },
                    { sql: '    created_at TEXT    NOT NULL DEFAULT (datetime(\'now\'))' },
                    { sql: ');' },
                ]}
            />

            <LectureSubHeading title="Reading data — SELECT" />

            <SqlBlock
                title="SELECT — the most important SQL statement"
                lines={[
                    { comment: 'Get everything from a table', sql: 'SELECT * FROM notes;' },
                    { comment: 'Get specific columns', sql: 'SELECT id, title FROM notes;' },
                    { comment: 'Filter with WHERE', sql: "SELECT * FROM notes WHERE user_id = 1;" },
                    { comment: 'Multiple conditions', sql: "SELECT * FROM notes WHERE user_id = 1 AND title LIKE '%SQL%';" },
                    { comment: 'Sort results', sql: 'SELECT * FROM notes ORDER BY created_at DESC;' },
                    { comment: 'Limit results (pagination)', sql: 'SELECT * FROM notes ORDER BY created_at DESC LIMIT 10 OFFSET 20;' },
                    { comment: 'Count rows', sql: 'SELECT COUNT(*) FROM notes WHERE user_id = 1;' },
                ]}
            />

            <LectureSubHeading title="JOIN — combining tables" />

            <LectureP>
                A <LectureTerm>JOIN</LectureTerm> combines rows from two tables based on a related column. The most common kind is <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">INNER JOIN</code> — it returns only rows where the join condition matches in both tables.
            </LectureP>

            <SqlBlock
                title="JOIN — get notes with their author's name"
                lines={[
                    { sql: 'SELECT' },
                    { sql: '    notes.id,' },
                    { sql: '    notes.title,' },
                    { sql: '    users.name AS author_name,' },
                    { sql: '    notes.created_at' },
                    { sql: 'FROM notes' },
                    { sql: 'INNER JOIN users ON notes.user_id = users.id' },
                    { sql: 'WHERE users.email = \'alice@msu.edu\'' },
                    { sql: 'ORDER BY notes.created_at DESC;' },
                ]}
            />

            <LectureSubHeading title="Writing data — INSERT, UPDATE, DELETE" />

            <SqlBlock
                title="DML — modifying data"
                lines={[
                    { comment: 'INSERT — add a new row', sql: "INSERT INTO notes (user_id, title, content) VALUES (1, 'New note', 'Hello SQL');" },
                    { comment: 'UPDATE — modify existing rows (ALWAYS include WHERE or you update everything)', sql: "UPDATE notes SET title = 'Updated title' WHERE id = 3;" },
                    { comment: 'DELETE — remove rows (ALWAYS include WHERE or you delete everything)', sql: 'DELETE FROM notes WHERE id = 3;' },
                ]}
            />

            <LectureCallout type="warning">
                Every <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">UPDATE</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DELETE</code> without a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">WHERE</code> clause affects every row in the table. This is the most common way to accidentally destroy production data. Before running any destructive query, run the equivalent <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">SELECT</code> first to see exactly which rows you're about to modify.
            </LectureCallout>

            {/* ── 03 GROUP BY AND AGGREGATES ──────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Aggregates & GROUP BY" />

            <LectureP>
                Aggregate functions compute a single value from a set of rows. Combined with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GROUP BY</code>, you can compute statistics per group — notes per user, revenue per product, signups per day.
            </LectureP>

            <SqlBlock
                title="aggregates with GROUP BY"
                lines={[
                    { comment: 'Count notes per user', sql: 'SELECT user_id, COUNT(*) AS note_count' },
                    { sql: 'FROM notes' },
                    { sql: 'GROUP BY user_id' },
                    { sql: 'ORDER BY note_count DESC;' },
                    { comment: 'Only include users with more than 5 notes (HAVING filters groups, WHERE filters rows)', sql: 'SELECT user_id, COUNT(*) AS note_count' },
                    { sql: 'FROM notes' },
                    { sql: 'GROUP BY user_id' },
                    { sql: 'HAVING COUNT(*) > 5;' },
                ]}
            />

            {/* ── 04 SQLALCHEMY ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="SQLAlchemy — Python's Database Toolkit" />

            <LectureP>
                Writing raw SQL strings in Python works but gets messy fast — no type safety, no autocomplete, and SQL injection risk if you're not careful. <LectureTerm>SQLAlchemy</LectureTerm> is Python's most widely used database library. It can be used as a pure query builder (Core) or as a full <LectureTerm>ORM</LectureTerm> (Object Relational Mapper) that maps Python classes to database tables.
            </LectureP>
            <LectureP>
                With the ORM, you define your tables as Python classes. SQLAlchemy translates operations on those classes into SQL. You interact with Python objects — SQLAlchemy handles the database communication.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    database.py — connection setup
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">sqlalchemy </span><span className="text-blue-400">import </span><span className="text-zinc-400">create_engine</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">sqlalchemy.orm </span><span className="text-blue-400">import </span><span className="text-zinc-400">sessionmaker, DeclarativeBase</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># SQLite for development — just a file, zero config</span></p>
                    <p><span className="text-sky-300">DATABASE_URL </span><span className="text-zinc-400">= </span><span className="text-amber-400">"sqlite:///./notes.db"</span></p>
                    <p className="mt-1"><span className="text-zinc-500"># Switch to Postgres in production — only this line changes</span></p>
                    <p><span className="text-zinc-500"># DATABASE_URL = "postgresql://user:pass@localhost/notesdb"</span></p>
                    <p className="mt-2"><span className="text-sky-300">engine </span><span className="text-zinc-400">= create_engine(DATABASE_URL, connect_args={'{"check_same_thread": False'}{'}'})  </span><span className="text-zinc-500"># SQLite only</span></p>
                    <p><span className="text-sky-300">SessionLocal </span><span className="text-zinc-400">= sessionmaker(autocommit=</span><span className="text-blue-400">False</span><span className="text-zinc-400">, autoflush=</span><span className="text-blue-400">False</span><span className="text-zinc-400">, bind=engine)</span></p>
                    <p className="mt-2"><span className="text-blue-400">class </span><span className="text-emerald-400">Base</span><span className="text-zinc-400">(DeclarativeBase): </span><span className="text-blue-400">pass</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># Dependency — gives each request its own DB session, then closes it</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">get_db</span><span className="text-zinc-400">():</span></p>
                    <p className="pl-4"><span className="text-sky-300">db </span><span className="text-zinc-400">= SessionLocal()</span></p>
                    <p className="pl-4"><span className="text-blue-400">try</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-8"><span className="text-blue-400">yield </span><span className="text-sky-300">db</span></p>
                    <p className="pl-4"><span className="text-blue-400">finally</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-8"><span className="text-sky-300">db</span><span className="text-zinc-400">.close()</span></p>
                </div>
            </div>

            <LectureCallout type="tip">
                In production with Postgres or MySQL, use <LectureTerm>connection pooling</LectureTerm> (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">create_engine(..., pool_size=10, max_overflow=20)</code>) so the app reuses connections instead of opening a new one per request. SQLite doesn't need pooling for typical dev use.
            </LectureCallout>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    models.py — SQLAlchemy ORM models
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">sqlalchemy </span><span className="text-blue-400">import </span><span className="text-zinc-400">Integer, String, Boolean, ForeignKey, func</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">sqlalchemy.orm </span><span className="text-blue-400">import </span><span className="text-zinc-400">mapped_column, Mapped, relationship</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">.database </span><span className="text-blue-400">import </span><span className="text-zinc-400">Base</span></p>
                    <p className="mt-2"><span className="text-blue-400">class </span><span className="text-emerald-400">User</span><span className="text-zinc-400">(Base):</span></p>
                    <p className="pl-4"><span className="text-sky-300">__tablename__ </span><span className="text-zinc-400">= </span><span className="text-amber-400">"users"</span></p>
                    <p className="pl-4"><span className="text-sky-300">id</span><span className="text-zinc-400">: Mapped[int] = mapped_column(Integer, primary_key=</span><span className="text-blue-400">True</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-sky-300">name</span><span className="text-zinc-400">: Mapped[str] = mapped_column(String, nullable=</span><span className="text-blue-400">False</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-sky-300">email</span><span className="text-zinc-400">: Mapped[str] = mapped_column(String, unique=</span><span className="text-blue-400">True</span><span className="text-zinc-400">, nullable=</span><span className="text-blue-400">False</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-sky-300">notes</span><span className="text-zinc-400">: Mapped[list[</span><span className="text-emerald-400">"Note"</span><span className="text-zinc-400">]] = relationship(back_populates=</span><span className="text-amber-400">"author"</span><span className="text-zinc-400">)</span></p>
                    <p className="mt-2"><span className="text-blue-400">class </span><span className="text-emerald-400">Note</span><span className="text-zinc-400">(Base):</span></p>
                    <p className="pl-4"><span className="text-sky-300">__tablename__ </span><span className="text-zinc-400">= </span><span className="text-amber-400">"notes"</span></p>
                    <p className="pl-4"><span className="text-sky-300">id</span><span className="text-zinc-400">: Mapped[int] = mapped_column(Integer, primary_key=</span><span className="text-blue-400">True</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-sky-300">user_id</span><span className="text-zinc-400">: Mapped[int] = mapped_column(ForeignKey(</span><span className="text-amber-400">"users.id"</span><span className="text-zinc-400">))</span></p>
                    <p className="pl-4"><span className="text-sky-300">title</span><span className="text-zinc-400">: Mapped[str] = mapped_column(String, nullable=</span><span className="text-blue-400">False</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-sky-300">content</span><span className="text-zinc-400">: Mapped[str] = mapped_column(String, nullable=</span><span className="text-blue-400">False</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-sky-300">author</span><span className="text-zinc-400">: Mapped[</span><span className="text-emerald-400">"User"</span><span className="text-zinc-400">] = relationship(back_populates=</span><span className="text-amber-400">"notes"</span><span className="text-zinc-400">)</span></p>
                </div>
            </div>

            {/* ── 05 FASTAPI + SQLALCHEMY ─────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Wiring FastAPI to SQLAlchemy" />

            <LectureP>
                FastAPI uses <LectureTerm>Depends</LectureTerm> to inject dependencies into route handlers. The database session is a perfect use case: each request gets its own session (from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">get_db</code>), uses it, and the session is closed after the response is sent.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    main.py — full CRUD with SQLAlchemy
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">fastapi </span><span className="text-blue-400">import </span><span className="text-zinc-400">FastAPI, Depends, HTTPException</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">sqlalchemy.orm </span><span className="text-blue-400">import </span><span className="text-zinc-400">Session</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">. </span><span className="text-blue-400">import </span><span className="text-zinc-400">models, schemas</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">.database </span><span className="text-blue-400">import </span><span className="text-zinc-400">engine, get_db</span></p>
                    <p className="mt-2"><span className="text-sky-300">models</span><span className="text-zinc-400">.Base.metadata.create_all(bind=engine)  </span><span className="text-zinc-500"># create tables if they don't exist</span></p>
                    <p><span className="text-sky-300">app </span><span className="text-zinc-400">= FastAPI()</span></p>
                    <p className="mt-2"><span className="text-sky-300">@app</span><span className="text-zinc-400">.get(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">, response_model=list[schemas.NoteResponse])</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">get_notes</span><span className="text-zinc-400">(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">db</span><span className="text-zinc-400">.query(models.Note).offset(skip).limit(limit).all()</span></p>
                    <p className="mt-2"><span className="text-sky-300">@app</span><span className="text-zinc-400">.post(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">, response_model=schemas.NoteResponse, status_code=201)</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">create_note</span><span className="text-zinc-400">(note: schemas.NoteCreate, db: Session = Depends(get_db)):</span></p>
                    <p className="pl-4"><span className="text-sky-300">db_note </span><span className="text-zinc-400">= models.Note(**note.model_dump())</span></p>
                    <p className="pl-4"><span className="text-sky-300">db</span><span className="text-zinc-400">.add(db_note)</span></p>
                    <p className="pl-4"><span className="text-sky-300">db</span><span className="text-zinc-400">.commit()</span></p>
                    <p className="pl-4"><span className="text-sky-300">db</span><span className="text-zinc-400">.refresh(db_note)  </span><span className="text-zinc-500"># load the auto-generated id from DB</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">db_note</span></p>
                    <p className="mt-2"><span className="text-sky-300">@app</span><span className="text-zinc-400">.delete(</span><span className="text-amber-400">"/notes/{'{note_id}'}"</span><span className="text-zinc-400">, status_code=204)</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">delete_note</span><span className="text-zinc-400">(note_id: int, db: Session = Depends(get_db)):</span></p>
                    <p className="pl-4"><span className="text-sky-300">note </span><span className="text-zinc-400">= db.query(models.Note).filter(models.Note.id == note_id).first()</span></p>
                    <p className="pl-4"><span className="text-blue-400">if not </span><span className="text-sky-300">note</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-8"><span className="text-blue-400">raise </span><span className="text-zinc-400">HTTPException(status_code=404, detail=</span><span className="text-amber-400">"Note not found"</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-sky-300">db</span><span className="text-zinc-400">.delete(note)</span></p>
                    <p className="pl-4"><span className="text-sky-300">db</span><span className="text-zinc-400">.commit()</span></p>
                </div>
            </div>

            <LectureP>
                The <LectureCmd tip="Depends() — FastAPI's dependency injection system. Pass a function to Depends() and FastAPI will call it for you and inject the result as the parameter value. Used for database sessions, authentication, config, and any shared logic that routes need.">Depends(get_db)</LectureCmd> annotation is FastAPI's dependency injection system. FastAPI calls <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">get_db()</code> before the handler runs, injects the session, and runs the generator's cleanup (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">db.close()</code>) after the response is sent. You never manage session lifecycle manually.
            </LectureP>

            <LectureCallout type="warning">
                When using the ORM with relationships, avoid the <LectureTerm>N+1 query problem</LectureTerm>: loading a list of notes and then accessing <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">note.author</code> for each one triggers a separate query per note. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">joinedload()</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">selectinload()</code> to eager-load related data in one (or two) queries.
            </LectureCallout>

            {/* ── 06 INDEXING ─────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Indexing — Making Queries Fast" />

            <LectureP>
                Without an index, a database has to scan every row to find matching records — a <LectureTerm>full table scan</LectureTerm>. For a table with 1M rows, that's 1M comparisons per query. An <LectureTerm>index</LectureTerm> is a data structure (usually a B-tree) that lets the database jump directly to matching rows. The cost: more disk space and slightly slower writes. The benefit: reads that would take seconds become milliseconds.
            </LectureP>

            <SqlBlock
                title="indexing common query patterns"
                lines={[
                    { comment: "Add an index on any column you filter by frequently", sql: 'CREATE INDEX idx_notes_user_id ON notes(user_id);' },
                    { comment: "Unique index — enforces uniqueness AND speeds up lookups", sql: 'CREATE UNIQUE INDEX idx_users_email ON users(email);' },
                    { comment: "Composite index — useful when you always filter by both columns together", sql: 'CREATE INDEX idx_notes_user_created ON notes(user_id, created_at DESC);' },
                    { comment: "Check if a query is using an index (SQLite)", sql: 'EXPLAIN QUERY PLAN SELECT * FROM notes WHERE user_id = 1;' },
                ]}
            />

            <LectureCallout type="tip">
                A good rule of thumb: index every foreign key column and every column that appears in a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">WHERE</code> clause in a frequently-run query. Don't index everything — each index adds overhead to inserts and updates.
            </LectureCallout>

            {/* ── 07 NORMALIZATION ────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Normalization — Designing Good Schemas" />

            <LectureP>
                <LectureTerm>Normalization</LectureTerm> is the practice of organizing data to eliminate redundancy. The core idea: store each piece of information in exactly one place. If you need to update it, you update it once.
            </LectureP>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border bg-rose-50 dark:bg-rose-950/20">
                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">❌ Denormalized — data repeated</p>
                    </div>
                    <div className="p-4 font-mono text-xs space-y-1 text-muted-foreground">
                        <p className="text-foreground font-semibold">notes table</p>
                        <p>id, title, content</p>
                        <p className="text-rose-500">author_name, author_email ← repeated for every note</p>
                        <p className="mt-2 text-rose-400 text-xs">If Alice changes her email, you update every note she wrote.</p>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border bg-emerald-50 dark:bg-emerald-950/20">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ Normalized — data stored once</p>
                    </div>
                    <div className="p-4 font-mono text-xs space-y-1 text-muted-foreground">
                        <p className="text-foreground font-semibold">users</p>
                        <p>id, name, email ← stored once</p>
                        <p className="text-foreground font-semibold mt-2">notes</p>
                        <p>id, user_id, title, content ← references users</p>
                        <p className="mt-2 text-emerald-400 text-xs">Update email in one place. All notes reflect it automatically.</p>
                    </div>
                </div>
            </div>

            <LectureCallout type="info">
                <strong className="text-foreground">When to use SQL vs Redis:</strong> Use SQL (SQLite, Postgres) for persistent, relational data that you query in flexible ways — users, notes, orders. Use Redis for fast caching (e.g. session data, API response cache), rate limiting, or temporary data. In the activity you'll wire both: SQLite for the source of truth, Redis for a cache layer.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'FastAPI & Python Backends',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-1'),
                }}
                next={{
                    label: 'Build Your Backend',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/activity'),
                }}
            />
        </LectureLayout>
    );
}