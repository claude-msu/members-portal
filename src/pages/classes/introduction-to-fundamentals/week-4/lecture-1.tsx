import { useNavigate } from 'react-router-dom';
import { Server } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { LectureCallout } from '@/components/ui/lecture-callout';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';

// ── Request/Response cycle diagram ────────────────────────────────────────────
const RequestCycleDiagram = () => {
    const steps = [
        { label: 'Browser', sub: 'sends HTTP request', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
        { label: 'FastAPI', sub: 'routes & validates', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' },
        { label: 'Database', sub: 'reads / writes data', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
        { label: 'FastAPI', sub: 'serializes response', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' },
        { label: 'Browser', sub: 'receives JSON', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
    ];
    return (
        <div className="my-8 rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                        <div className={`rounded-lg border px-3 py-2.5 text-center min-w-[90px] ${step.bg}`}>
                            <p className={`text-xs font-bold ${step.color}`}>{step.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.sub}</p>
                        </div>
                        {i < steps.length - 1 && (
                            <span className="text-muted-foreground select-none">
                                {i < 2 ? '→' : '←'}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── HTTP methods table ────────────────────────────────────────────────────────
const HttpMethodsTable = () => (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
        {[
            { method: 'GET', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', purpose: 'Read data. Never modifies anything. Safe to call multiple times.', example: 'GET /notes — list all notes' },
            { method: 'POST', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', purpose: 'Create a new resource. Body contains the data to create.', example: 'POST /notes — create a note' },
            { method: 'PUT', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', purpose: 'Replace a resource entirely. Body contains the full replacement.', example: 'PUT /notes/1 — replace note 1' },
            { method: 'PATCH', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20', purpose: 'Partially update a resource. Body contains only the changed fields.', example: 'PATCH /notes/1 — update title only' },
            { method: 'DELETE', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20', purpose: 'Remove a resource. Usually no body.', example: 'DELETE /notes/1 — delete note 1' },
        ].map((row) => (
            <div key={row.method} className="flex items-start gap-4 px-4 py-3 border-b border-border last:border-b-0">
                <span className={`text-xs font-black w-14 shrink-0 select-none rounded px-1.5 py-0.5 ${row.color} ${row.bg}`}>
                    {row.method}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{row.purpose}</p>
                    <code className="text-xs text-muted-foreground mt-0.5 block">{row.example}</code>
                </div>
            </div>
        ))}
    </div>
);

export default function Week4Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={4}
                session="Lecture 1"
                title="FastAPI & Python Backends"
                description="Real apps need a server — for auth, shared state, and business logic that cannot run in the browser. FastAPI is the fastest path from zero to a documented, production-ready Python API."
                icon={<Server className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
            />

            {/* ── 01 HOW THE WEB WORKS ────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="How the Web Actually Works" />

            <LectureP>
                Every time your React app fetches data, it's making an <LectureTermWithTip tip="A message from client to server: method (GET, POST, etc.), URL, headers, and optional body. Sent over TCP, usually on port 80 (HTTP) or 443 (HTTPS).">HTTP request</LectureTermWithTip> to a server. The server receives the request, does some work, and sends back an <LectureTermWithTip tip="The server's reply: status code (200, 404, etc.), headers, and body (often JSON). The browser or client uses this to update the UI.">HTTP response</LectureTermWithTip>. This request/response cycle is the foundation of everything on the web.
            </LectureP>

            <RequestCycleDiagram />

            <LectureP>
                A <LectureTermWithTip tip="Representational State Transfer. An API design style: resources as URLs, CRUD via HTTP methods, stateless requests. Common and well-understood.">REST API</LectureTermWithTip> is a server that exposes data through a predictable set of URLs called <LectureTermWithTip tip="A URL path + HTTP method that the server handles. e.g. GET /notes returns the list; POST /notes creates one.">endpoints</LectureTermWithTip>. Each endpoint responds to specific HTTP methods. The convention maps methods to CRUD operations: Create → POST, Read → GET, Update → PUT/PATCH, Delete → DELETE.
            </LectureP>

            <HttpMethodsTable />

            <LectureCallout type="info">
                HTTP responses include a <LectureTermWithTip tip="A number that indicates result: 2xx success, 3xx redirect, 4xx client error (e.g. 404), 5xx server error. FastAPI sets these for you.">status code</LectureTermWithTip> that tells the client what happened. The ranges: 2xx = success (200 OK, 201 Created, 204 No Content), 3xx = redirect, 4xx = client error (400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Validation Error), 5xx = server error (500 Internal Server Error). FastAPI handles most of these automatically.
            </LectureCallout>

            {/* ── 02 WHAT IS FASTAPI ───────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="What is FastAPI?" />

            <LectureP>
                <LectureTermWithTip tip="A Python web framework for APIs. Uses type hints for validation, auto-generates OpenAPI docs, and supports async. Built on Starlette and Pydantic.">FastAPI</LectureTermWithTip> is a modern Python web framework for building APIs. It's built on two things: <LectureTermWithTip tip="A lightweight ASGI framework. FastAPI wraps it to add validation, docs, and dependency injection.">Starlette</LectureTermWithTip> (an async web framework) and <LectureTermWithTip tip="A library for data validation using Python type hints. FastAPI uses it for request/response bodies and settings.">Pydantic</LectureTermWithTip> (a data validation library). Together they give you automatic request validation, automatic response serialization, automatic API documentation, and excellent performance — all with minimal boilerplate.
            </LectureP>
            <LectureP>
                FastAPI uses Python type hints to do all of this. You annotate your function parameters with types, and FastAPI figures out the rest — where each value comes from (URL, query string, request body), how to validate it, and how to document it.
            </LectureP>

            <TerminalBlock
                title="bash — from a new project folder"
                lines={[
                    { comment: 'create a project folder and go into it', cmd: 'mkdir myapi && cd myapi' },
                    { comment: 'create and activate a virtual environment', cmd: 'python3 -m venv .venv && source .venv/bin/activate' },
                    { comment: 'install FastAPI and uvicorn (the server that runs it)', cmd: 'pip install fastapi uvicorn[standard]' },
                    { comment: 'save dependencies', cmd: 'pip freeze > requirements.txt' },
                ]}
            />

            <LectureSubHeading title="Your first FastAPI app" />

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    main.py — a complete FastAPI application
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">fastapi </span><span className="text-blue-400">import </span><span className="text-zinc-400">FastAPI</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">pydantic </span><span className="text-blue-400">import </span><span className="text-zinc-400">BaseModel</span></p>
                    <p className="mt-2"><span className="text-sky-300">app </span><span className="text-zinc-400">= FastAPI()</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># A Pydantic model defines the shape of request/response bodies</span></p>
                    <p><span className="text-blue-400">class </span><span className="text-emerald-400">Note</span><span className="text-zinc-400">(BaseModel):</span></p>
                    <p className="pl-4"><span className="text-sky-300">title</span><span className="text-zinc-400">: str</span></p>
                    <p className="pl-4"><span className="text-sky-300">content</span><span className="text-zinc-400">: str</span></p>
                    <p className="pl-4"><span className="text-sky-300">published</span><span className="text-zinc-400">: bool = </span><span className="text-blue-400">False</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># In-memory store (replaced by a real DB later)</span></p>
                    <p><span className="text-sky-300">notes </span><span className="text-zinc-400">= []</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># Route decorator tells FastAPI which method + path triggers this function</span></p>
                    <p><span className="text-sky-300">@app</span><span className="text-zinc-400">.get(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">)</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">get_notes</span><span className="text-zinc-400">():</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">notes</span></p>
                    <p className="mt-2"><span className="text-sky-300">@app</span><span className="text-zinc-400">.post(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">, status_code=201)</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">create_note</span><span className="text-zinc-400">(note: Note):  </span><span className="text-zinc-500"># FastAPI sees Note and reads the body</span></p>
                    <p className="pl-4"><span className="text-sky-300">notes</span><span className="text-zinc-400">.append(note)</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">note</span></p>
                </div>
            </div>

            <LectureP>
                Save the code above as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.py</code> in your project root (the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">myapi</code> folder). Then, from that folder with your venv activated, run:
            </LectureP>
            <TerminalBlock
                title="bash — project root, venv activated"
                lines={[
                    { comment: 'start the development server with auto-reload', cmd: 'uvicorn main:app --reload' },
                    { comment: 'open the auto-generated interactive docs (macOS); on Windows use start or just visit in browser', cmd: 'open http://localhost:8000/docs' },
                ]}
            />

            <LectureCallout type="tip">
                Go to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">http://localhost:8000/docs</code> the moment you start your server. FastAPI generates a fully interactive Swagger UI from your code — you can send real requests to your API right from the browser, with no curl or Postman needed. The schema is also available at <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/openapi.json</code> for generating clients or API gateways.
            </LectureCallout>

            {/* ── 03 PYDANTIC MODELS ──────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Pydantic Models" />

            <LectureP>
                <LectureTermWithTip tip="Validates and serializes data using type annotations. BaseModel classes define shape; invalid input raises clear validation errors.">Pydantic</LectureTermWithTip> is FastAPI's validation engine. When you define a class that inherits from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">BaseModel</code>, Pydantic automatically validates any data passed to it — coercing types where possible, and raising clear validation errors when data doesn't match.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    Pydantic models — validation and serialization
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">pydantic </span><span className="text-blue-400">import </span><span className="text-zinc-400">BaseModel, Field, EmailStr</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">typing </span><span className="text-blue-400">import </span><span className="text-zinc-400">Optional</span></p>
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">datetime </span><span className="text-blue-400">import </span><span className="text-zinc-400">datetime</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># Request model — what the client sends</span></p>
                    <p><span className="text-blue-400">class </span><span className="text-emerald-400">NoteCreate</span><span className="text-zinc-400">(BaseModel):</span></p>
                    <p className="pl-4"><span className="text-sky-300">title</span><span className="text-zinc-400">: str = Field(min_length=1, max_length=100)</span></p>
                    <p className="pl-4"><span className="text-sky-300">content</span><span className="text-zinc-400">: str = Field(min_length=1)</span></p>
                    <p className="pl-4"><span className="text-sky-300">tags</span><span className="text-zinc-400">: list[str] = []  </span><span className="text-zinc-500"># optional, defaults to empty list</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># Response model — what the server sends back</span></p>
                    <p><span className="text-blue-400">class </span><span className="text-emerald-400">NoteResponse</span><span className="text-zinc-400">(BaseModel):</span></p>
                    <p className="pl-4"><span className="text-sky-300">id</span><span className="text-zinc-400">: int</span></p>
                    <p className="pl-4"><span className="text-sky-300">title</span><span className="text-zinc-400">: str</span></p>
                    <p className="pl-4"><span className="text-sky-300">content</span><span className="text-zinc-400">: str</span></p>
                    <p className="pl-4"><span className="text-sky-300">created_at</span><span className="text-zinc-400">: datetime</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># Using response_model ensures the response is filtered and validated</span></p>
                    <p><span className="text-sky-300">@app</span><span className="text-zinc-400">.post(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">, response_model=NoteResponse, status_code=201)</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">create_note</span><span className="text-zinc-400">(note: NoteCreate):</span></p>
                    <p className="pl-4"><span className="text-zinc-400">...</span></p>
                </div>
            </div>

            <LectureP>
                Separating <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">NoteCreate</code> (what comes in) from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">NoteResponse</code> (what goes out) is a critical pattern. The create model has no <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">id</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">created_at</code> — those are assigned by the server. The response model ensures you never accidentally leak sensitive fields (like a password hash) back to the client.
            </LectureP>

            {/* ── 04 PATH AND QUERY PARAMS ────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Path Parameters & Query Strings" />

            <LectureP>
                FastAPI reads parameters from three places: the URL path, the query string, and the request body. Declaring them in your function signature is all you need — FastAPI handles the rest.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    path params, query params, body — all at once
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-4 select-none">
                    <div>
                        <p className="text-zinc-500 mb-1"># Path param — curly brace in the route, matching param name in function</p>
                        <p><span className="text-sky-300">@app</span><span className="text-zinc-400">.get(</span><span className="text-amber-400">"/notes/{'{note_id}'}"</span><span className="text-zinc-400">)</span></p>
                        <p><span className="text-blue-400">def </span><span className="text-emerald-400">get_note</span><span className="text-zinc-400">(note_id: int):  </span><span className="text-zinc-500"># FastAPI extracts from URL and converts to int</span></p>
                        <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">notes</span><span className="text-zinc-400">[note_id]</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1"># Query param — any param not in the path and not a Pydantic model</p>
                        <p><span className="text-sky-300">@app</span><span className="text-zinc-400">.get(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">)</span></p>
                        <p><span className="text-blue-400">def </span><span className="text-emerald-400">get_notes</span><span className="text-zinc-400">(skip: int = 0, limit: int = 10, search: str | </span><span className="text-blue-400">None</span><span className="text-zinc-400"> = </span><span className="text-blue-400">None</span><span className="text-zinc-400">):</span></p>
                        <p className="pl-4"><span className="text-zinc-500"># GET /notes?skip=20&limit=5&search=python</span></p>
                        <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">notes</span><span className="text-zinc-400">[skip : skip + limit]</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1"># Path param + body — update a specific resource</p>
                        <p><span className="text-sky-300">@app</span><span className="text-zinc-400">.patch(</span><span className="text-amber-400">"/notes/{'{note_id}'}"</span><span className="text-zinc-400">)</span></p>
                        <p><span className="text-blue-400">def </span><span className="text-emerald-400">update_note</span><span className="text-zinc-400">(note_id: int, updates: NoteCreate):</span></p>
                        <p className="pl-4"><span className="text-zinc-500"># note_id from path, updates from request body</span></p>
                        <p className="pl-4"><span className="text-blue-400">return</span><span className="text-zinc-400"> {'{'}...{'}'}</span></p>
                    </div>
                </div>
            </div>

            {/* ── 05 ERROR HANDLING ───────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Error Handling" />

            <LectureP>
                When something goes wrong — a note isn't found, a user isn't authorized — you raise an <LectureTermWithTip tip="FastAPI's way to return an error response. You set status_code and detail; FastAPI serializes it to JSON and sends the right status.">HTTPException</LectureTermWithTip>. FastAPI catches it and returns a properly formatted JSON error response with the correct status code.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    HTTPException — the standard way to return errors
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">fastapi </span><span className="text-blue-400">import </span><span className="text-zinc-400">FastAPI, HTTPException</span></p>
                    <p className="mt-2"><span className="text-sky-300">@app</span><span className="text-zinc-400">.get(</span><span className="text-amber-400">"/notes/{'{note_id}'}"</span><span className="text-zinc-400">)</span></p>
                    <p><span className="text-blue-400">def </span><span className="text-emerald-400">get_note</span><span className="text-zinc-400">(note_id: int):</span></p>
                    <p className="pl-4"><span className="text-blue-400">if </span><span className="text-sky-300">note_id</span><span className="text-zinc-400"> &gt;= len(notes):</span></p>
                    <p className="pl-8"><span className="text-blue-400">raise </span><span className="text-zinc-400">HTTPException(</span></p>
                    <p className="pl-12"><span className="text-sky-300">status_code</span><span className="text-zinc-400">=404,</span></p>
                    <p className="pl-12"><span className="text-sky-300">detail</span><span className="text-zinc-400">=</span><span className="text-amber-400">"Note not found"</span></p>
                    <p className="pl-8"><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">notes</span><span className="text-zinc-400">[note_id]</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># FastAPI returns: {"{'detail': 'Note not found'}"} with status 404</span></p>
                </div>
            </div>

            {/* ── 06 CORS ─────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="CORS — Letting Your Frontend Talk to Your Backend" />

            <LectureP>
                When your React app (running on <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">localhost:5173</code>) tries to fetch from your FastAPI server (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">localhost:8000</code>), the browser blocks it. This is the <LectureTermWithTip tip="Browser rule: a page can only freely request to the same origin (scheme + host + port). Different port or domain is 'cross-origin' and restricted.">Same-Origin Policy</LectureTermWithTip> — a security feature that prevents one website from making requests to a different domain without permission.
            </LectureP>
            <LectureP>
                You grant permission with <LectureTermWithTip tip="Cross-Origin Resource Sharing. HTTP headers that tell the browser which origins may call your API. The server sends Allow-Origin and related headers.">CORS</LectureTermWithTip> (Cross-Origin Resource Sharing) headers. FastAPI includes middleware to handle this:
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    main.py — adding CORS middleware
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">from </span><span className="text-emerald-400">fastapi.middleware.cors </span><span className="text-blue-400">import </span><span className="text-zinc-400">CORSMiddleware</span></p>
                    <p className="mt-2"><span className="text-sky-300">app</span><span className="text-zinc-400">.add_middleware(</span></p>
                    <p className="pl-4"><span className="text-sky-300">CORSMiddleware</span><span className="text-zinc-400">,</span></p>
                    <p className="pl-4"><span className="text-sky-300">allow_origins</span><span className="text-zinc-400">=[</span><span className="text-amber-400">"http://localhost:5173"</span><span className="text-zinc-400">],  </span><span className="text-zinc-500"># your React dev server</span></p>
                    <p className="pl-4"><span className="text-sky-300">allow_credentials</span><span className="text-zinc-400">=</span><span className="text-blue-400">True</span><span className="text-zinc-400">,</span></p>
                    <p className="pl-4"><span className="text-sky-300">allow_methods</span><span className="text-zinc-400">=[</span><span className="text-amber-400">"*"</span><span className="text-zinc-400">],</span></p>
                    <p className="pl-4"><span className="text-sky-300">allow_headers</span><span className="text-zinc-400">=[</span><span className="text-amber-400">"*"</span><span className="text-zinc-400">],</span></p>
                    <p><span className="text-zinc-400">)</span></p>
                    <p className="mt-2"><span className="text-zinc-500"># In production: replace localhost with your deployed frontend URL</span></p>
                    <p><span className="text-sky-300">allow_origins</span><span className="text-zinc-400">=[</span><span className="text-amber-400">"https://myapp.vercel.app"</span><span className="text-zinc-400">]</span></p>
                </div>
            </div>

            <LectureCallout type="warning">
                Never use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">allow_origins=["*"]</code> in production — this allows any website on the internet to make requests to your API. Always list the specific origins you trust.
            </LectureCallout>

            {/* ── 07 ASYNC ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Async Endpoints" />

            <LectureP>
                FastAPI supports Python's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">async/await</code> natively. When your endpoint does I/O — hitting a database, calling another API — making it async lets FastAPI handle other requests while it waits instead of blocking the entire server.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    sync vs async endpoints
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-4 select-none">
                    <div>
                        <p className="text-zinc-500 mb-1"># Sync — fine for CPU-bound work or when using a sync DB driver</p>
                        <p><span className="text-sky-300">@app</span><span className="text-zinc-400">.get(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">)</span></p>
                        <p><span className="text-blue-400">def </span><span className="text-emerald-400">get_notes</span><span className="text-zinc-400">():</span></p>
                        <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">notes</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1"># Async — required when awaiting DB calls, HTTP requests, etc.</p>
                        <p><span className="text-sky-300">@app</span><span className="text-zinc-400">.get(</span><span className="text-amber-400">"/notes"</span><span className="text-zinc-400">)</span></p>
                        <p><span className="text-blue-400">async def </span><span className="text-emerald-400">get_notes</span><span className="text-zinc-400">():</span></p>
                        <p className="pl-4"><span className="text-sky-300">results </span><span className="text-zinc-400">= </span><span className="text-blue-400">await </span><span className="text-sky-300">db</span><span className="text-zinc-400">.fetch_all(query)</span></p>
                        <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">results</span></p>
                    </div>
                </div>
            </div>

            <LectureCallout type="info">
                FastAPI runs sync endpoints in a thread pool so they don't block the event loop, but <strong className="text-foreground">async</strong> endpoints are more efficient under load: while one request is waiting on the database or another API, the server can handle other requests. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">async def</code> when your endpoint does I/O.
            </LectureCallout>

            <LectureCallout type="warning">
                Avoid long-running sync work (e.g. a slow database call with a sync driver) in sync endpoints — it blocks the server from handling other requests. For database access, prefer an async driver and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">async def</code> so the event loop can stay responsive.
            </LectureCallout>

            {/* ── 08 TESTING WITH CURL ────────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Testing Your API" />

            <LectureP>
                You'll test your API in two ways: the interactive docs at <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl</code> from the terminal. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl</code> is the universal HTTP client — available everywhere, no installation needed, scriptable.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'GET request — list all notes', cmd: 'curl http://localhost:8000/notes' },
                    { comment: 'POST request — create a note (send JSON body)', cmd: 'curl -X POST http://localhost:8000/notes \\' },
                    { cmd: '  -H "Content-Type: application/json" \\' },
                    { cmd: '  -d \'{"title": "My first note", "content": "Hello FastAPI"}\'' },
                    { comment: 'GET request with query params', cmd: 'curl "http://localhost:8000/notes?skip=0&limit=5"' },
                    { comment: 'DELETE request', cmd: 'curl -X DELETE http://localhost:8000/notes/1' },
                    { comment: 'pretty-print JSON response', cmd: 'curl http://localhost:8000/notes | python3 -m json.tool' },
                ]}
            />

            <LectureCallout type="tip">
                For more complex API testing, install <strong className="text-foreground">Bruno</strong> (free, open-source, stores requests as files in your repo) or use the built-in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code> page. Both are better than Postman for most use cases and don't require an account.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Containerize Your Backend Stub',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/activity'),
                }}
                next={{
                    label: 'Databases: SQL, SQLite & Redis',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}