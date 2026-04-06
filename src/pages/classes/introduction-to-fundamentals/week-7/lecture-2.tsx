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
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { CodeBlock } from '@/components/ui/code-block';

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


export default function Week6Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={6}
                session="Lecture 2"
                title="Databases: SQL, SQLite & Redis"
                description="SQLite for relational persistent storage, Redis for fast caching. Learn when to use each, how they work together, and how Docker Compose wires both services into one command."
                icon={<Server className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
            />

            {/* ── 01 RELATIONAL DATABASES ─────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Relational Databases" />

            <LectureP>
                A <LectureTermWithTip tip="Data stored in tables (rows and columns) with relationships between tables. You query with SQL. Examples: SQLite, PostgreSQL, MySQL.">relational database</LectureTermWithTip> stores data in <LectureTermWithTip tip="A set of rows with the same columns. Like a spreadsheet sheet; each row is one record, each column is an attribute.">tables</LectureTermWithTip> — rows and columns, like a spreadsheet. Each table represents one type of thing (users, notes, orders). Rows are individual records. Columns are the attributes of those records.
            </LectureP>
            <LectureP>
                What makes relational databases powerful is the ability to <LectureTermWithTip tip="Combine rows from two or more tables based on a related column. SQL JOIN clauses (INNER, LEFT, etc.) do this in a single query.">join</LectureTermWithTip> tables together. Instead of duplicating user data into every note, you store users in one table and notes in another, linked by a <LectureTermWithTip tip="A column that references the primary key of another table. Enforces referential integrity and enables joins.">foreign key</LectureTermWithTip>. When you need the full picture, you join them in your query.
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

            <CodeBlock
                language="sql"
                title="DDL — defining the schema"
                lines={[
                    '-- CREATE TABLE defines the structure. Run once when setting up.',
                    'CREATE TABLE users (',
                    '    id         INTEGER PRIMARY KEY AUTOINCREMENT,',
                    '    name       TEXT    NOT NULL,',
                    '    email      TEXT    NOT NULL UNIQUE,',
                    "    created_at TEXT    NOT NULL DEFAULT (datetime('now'))",
                    ');',
                    '',
                    'CREATE TABLE notes (',
                    '    id         INTEGER PRIMARY KEY AUTOINCREMENT,',
                    '    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,',
                    '    title      TEXT    NOT NULL,',
                    '    content    TEXT    NOT NULL,',
                    "    created_at TEXT    NOT NULL DEFAULT (datetime('now'))",
                    ');',
                ]}
            />

            <LectureSubHeading title="Reading data — SELECT" />

            <CodeBlock
                language="sql"
                title="SELECT — the most important SQL statement"
                lines={[
                    '-- Get everything from a table',
                    'SELECT * FROM notes;',
                    '-- Get specific columns',
                    'SELECT id, title FROM notes;',
                    '-- Filter with WHERE',
                    'SELECT * FROM notes WHERE user_id = 1;',
                    '-- Multiple conditions',
                    "SELECT * FROM notes WHERE user_id = 1 AND title LIKE '%SQL%';",
                    '-- Sort results',
                    'SELECT * FROM notes ORDER BY created_at DESC;',
                    '-- Limit results (pagination)',
                    'SELECT * FROM notes ORDER BY created_at DESC LIMIT 10 OFFSET 20;',
                    '-- Count rows',
                    'SELECT COUNT(*) FROM notes WHERE user_id = 1;',
                ]}
            />

            <LectureSubHeading title="JOIN — combining tables" />

            <LectureP>
                A <LectureTerm>JOIN</LectureTerm> combines rows from two tables based on a related column. The most common kind is <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">INNER JOIN</code> — it returns only rows where the join condition matches in both tables.
            </LectureP>

            <CodeBlock
                language="sql"
                title="JOIN — get notes with their author's name"
                lines={[
                    'SELECT',
                    '    notes.id,',
                    '    notes.title,',
                    '    users.name AS author_name,',
                    '    notes.created_at',
                    'FROM notes',
                    'INNER JOIN users ON notes.user_id = users.id',
                    "WHERE users.email = 'alice@msu.edu'",
                    'ORDER BY notes.created_at DESC;',
                ]}
            />

            <LectureSubHeading title="Writing data — INSERT, UPDATE, DELETE" />

            <CodeBlock
                language="sql"
                title="DML — modifying data"
                lines={[
                    '-- INSERT — add a new row',
                    "INSERT INTO notes (user_id, title, content) VALUES (1, 'New note', 'Hello SQL');",
                    '-- UPDATE — modify existing rows (ALWAYS include WHERE or you update everything)',
                    "UPDATE notes SET title = 'Updated title' WHERE id = 3;",
                    '-- DELETE — remove rows (ALWAYS include WHERE or you delete everything)',
                    'DELETE FROM notes WHERE id = 3;',
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

            <CodeBlock
                language="sql"
                title="aggregates with GROUP BY"
                lines={[
                    '-- Count notes per user',
                    'SELECT user_id, COUNT(*) AS note_count',
                    'FROM notes',
                    'GROUP BY user_id',
                    'ORDER BY note_count DESC;',
                    '',
                    '-- Only include users with more than 5 notes (HAVING filters groups, WHERE filters rows)',
                    'SELECT user_id, COUNT(*) AS note_count',
                    'FROM notes',
                    'GROUP BY user_id',
                    'HAVING COUNT(*) > 5;',
                ]}
            />

            {/* ── 04 SQLALCHEMY ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="SQLAlchemy — Python's Database Toolkit" />

            <LectureP>
                Writing raw SQL strings in Python works but gets messy fast — no type safety, no autocomplete, and SQL injection risk if you're not careful. <LectureTermWithTip tip="A Python library for talking to databases. Provides an ORM (map classes to tables) and a Core API for raw SQL. Works with SQLite, PostgreSQL, MySQL, etc.">SQLAlchemy</LectureTermWithTip> is Python's most widely used database library. It can be used as a pure query builder (Core) or as a full <LectureTermWithTip tip="Object Relational Mapper. Maps Python classes to tables; you work with objects and the ORM generates SQL. Reduces boilerplate and helps avoid SQL injection.">ORM</LectureTermWithTip> (Object Relational Mapper) that maps Python classes to database tables.
            </LectureP>
            <LectureP>
                With the ORM, you define your tables as Python classes. SQLAlchemy translates operations on those classes into SQL. You interact with Python objects — SQLAlchemy handles the database communication.
            </LectureP>

            <CodeBlock
                language="python"
                title="database.py — connection setup"
                lines={[
                    'from sqlalchemy import create_engine',
                    'from sqlalchemy.orm import sessionmaker, DeclarativeBase',
                    '',
                    '# SQLite for development — just a file, zero config',
                    'DATABASE_URL = "sqlite:///./notes.db"',
                    '# Switch to Postgres in production — only this line changes',
                    '# DATABASE_URL = "postgresql://user:pass@localhost/notesdb"',
                    '',
                    'engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})  # SQLite only',
                    'SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)',
                    '',
                    'class Base(DeclarativeBase): pass',
                    '',
                    '# Dependency — gives each request its own DB session, then closes it',
                    'def get_db():',
                    '    db = SessionLocal()',
                    '    try:',
                    '        yield db',
                    '    finally:',
                    '        db.close()',
                ]}
            />

            <LectureCallout type="tip">
                In production with Postgres or MySQL, use <LectureTerm>connection pooling</LectureTerm> (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">create_engine(..., pool_size=10, max_overflow=20)</code>) so the app reuses connections instead of opening a new one per request. SQLite doesn't need pooling for typical dev use.
            </LectureCallout>

            <CodeBlock
                language="python"
                title="models.py — SQLAlchemy ORM models"
                lines={[
                    'from sqlalchemy import Integer, String, Boolean, ForeignKey, func',
                    'from sqlalchemy.orm import mapped_column, Mapped, relationship',
                    'from .database import Base',
                    '',
                    'class User(Base):',
                    '    __tablename__ = "users"',
                    '    id: Mapped[int] = mapped_column(Integer, primary_key=True)',
                    '    name: Mapped[str] = mapped_column(String, nullable=False)',
                    '    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)',
                    '    notes: Mapped[list["Note"]] = relationship(back_populates="author")',
                    '',
                    'class Note(Base):',
                    '    __tablename__ = "notes"',
                    '    id: Mapped[int] = mapped_column(Integer, primary_key=True)',
                    '    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))',
                    '    title: Mapped[str] = mapped_column(String, nullable=False)',
                    '    content: Mapped[str] = mapped_column(String, nullable=False)',
                    '    author: Mapped["User"] = relationship(back_populates="notes")',
                ]}
            />

            {/* ── 05 FASTAPI + SQLALCHEMY ─────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Wiring FastAPI to SQLAlchemy" />

            <LectureP>
                FastAPI uses <LectureTerm>Depends</LectureTerm> to inject dependencies into route handlers. The database session is a perfect use case: each request gets its own session (from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">get_db</code>), uses it, and the session is closed after the response is sent.
            </LectureP>

            <CodeBlock
                language="python"
                title="main.py — full CRUD with SQLAlchemy"
                lines={[
                    'from fastapi import FastAPI, Depends, HTTPException',
                    'from sqlalchemy.orm import Session',
                    'from . import models, schemas',
                    'from .database import engine, get_db',
                    '',
                    "models.Base.metadata.create_all(bind=engine)  # create tables if they don't exist",
                    'app = FastAPI()',
                    '',
                    '@app.get("/notes", response_model=list[schemas.NoteResponse])',
                    'def get_notes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):',
                    '    return db.query(models.Note).offset(skip).limit(limit).all()',
                    '',
                    '@app.post("/notes", response_model=schemas.NoteResponse, status_code=201)',
                    'def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):',
                    '    db_note = models.Note(**note.model_dump())',
                    '    db.add(db_note)',
                    '    db.commit()',
                    '    db.refresh(db_note)  # load the auto-generated id from DB',
                    '    return db_note',
                    '',
                    '@app.delete("/notes/{note_id}", status_code=204)',
                    'def delete_note(note_id: int, db: Session = Depends(get_db)):',
                    '    note = db.query(models.Note).filter(models.Note.id == note_id).first()',
                    '    if not note:',
                    '        raise HTTPException(status_code=404, detail="Note not found")',
                    '    db.delete(note)',
                    '    db.commit()',
                ]}
            />

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

            <CodeBlock
                language="sql"
                title="indexing common query patterns"
                lines={[
                    '-- Add an index on any column you filter by frequently',
                    'CREATE INDEX idx_notes_user_id ON notes(user_id);',
                    '-- Unique index — enforces uniqueness AND speeds up lookups',
                    'CREATE UNIQUE INDEX idx_users_email ON users(email);',
                    '-- Composite index — useful when you always filter by both columns together',
                    'CREATE INDEX idx_notes_user_created ON notes(user_id, created_at DESC);',
                    '-- Check if a query is using an index (SQLite)',
                    'EXPLAIN QUERY PLAN SELECT * FROM notes WHERE user_id = 1;',
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
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/lecture-1'),
                }}
                next={{
                    label: 'Build Your Backend',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/activity'),
                }}
            />
        </LectureLayout>
    );
}