import { useNavigate } from 'react-router-dom';
import { TestTube } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { CodeBlock } from '@/components/ui/code-block';

export default function Week10Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={10}
                session="Lecture 1"
                title="Vitest & Testing Your Project"
                description="Unit and integration testing with Vitest: testing your API, components, and critical paths so refactors don't break your fundamentals project."
                icon={<TestTube className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="Why Test?" />

            <LectureP>
                Without tests, every change is a gamble: did you break the login flow? The list endpoint? You find out when a user (or you, later) hits the bug. <LectureTerm>Automated tests</LectureTerm> run in seconds and tell you exactly what still works and what broke. They're the safety net that makes refactoring and adding features less scary.
            </LectureP>
            <LectureP>
                You don't need to test every line. Focus on: (1) critical paths — login, creating/editing the main resource, any payment or auth logic; (2) edge cases — empty list, invalid input, unauthorized access; (3) the contract of your API and key components. One good test per important behavior is worth more than dozens of trivial tests.
            </LectureP>

            <LectureCallout type="info">
                <LectureTermWithTip tip="A test runner and assertion library for JavaScript/TypeScript. Fast, Vite-native, and familiar if you've used Jest. Works for unit and integration tests.">Vitest</LectureTermWithTip> is the default choice for Vite-based React projects. It uses the same describe/it/expect style as Jest and runs in the same process as your app, so it's fast. We'll use it for both frontend and (with a small setup) for calling your API in tests.
            </LectureCallout>

            <LectureSectionHeading number="02" title="Unit vs Integration Tests" />

            <LectureP>
                <LectureTerm>Unit tests</LectureTerm> isolate one function or component: you call the function with inputs and assert on the output, or render a component and assert on the DOM or behavior. Dependencies are often <LectureTermWithTip tip="A fake implementation used in tests so you control inputs and don't hit the real API or database.">mocked</LectureTermWithTip> (e.g. replace <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">fetch</code> with a stub that returns fixed data). <LectureTerm>Integration tests</LectureTerm> test several pieces together — e.g. your FastAPI endpoint plus the database, or your React app calling the real (or test) API. Slower but catch more real-world bugs.
            </LectureP>
            <LectureP>
                For your fundamentals project: write a few unit tests for pure logic (e.g. a formatter or validator) and for React components that have clear behavior (e.g. "when user is null, show Login button"). Write integration tests for at least one API route (e.g. GET /items returns 200 and a list) and one full flow (e.g. login then fetch protected data) so you know the stack works together.
            </LectureP>

            <LectureSectionHeading number="03" title="Testing the Backend (FastAPI)" />

            <LectureP>
                FastAPI provides a <LectureTerm>TestClient</LectureTerm> that calls your app without running a server. You get request/response objects and can assert status codes, JSON body, and headers. Use a test database (or SQLite in-memory) so you don't touch real data.
            </LectureP>
            <TerminalBlock
                title="bash — backend project root"
                lines={[
                    { comment: 'install pytest and httpx (FastAPI uses httpx under the hood)', cmd: 'pip install pytest httpx' },
                    { comment: 'run tests', cmd: 'pytest' },
                    { comment: 'run with verbose output', cmd: 'pytest -v' },
                ]}
            />
            <LectureSubHeading title="A test file you can copy" />
            <LectureP>
                Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">test_main.py</code> (or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tests/test_main.py</code>) next to your app. The example below tests a public endpoint and a protected one. Replace <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">app</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/notes</code>, and login logic with your own.
            </LectureP>
            <CodeBlock
                language="python"
                title="test_main.py"
                lines={[
                    'from fastapi.testclient import TestClient',
                    'from main import app',
                    '',
                    'client = TestClient(app)',
                    '',
                    'def test_read_notes_empty():',
                    '    response = client.get("/notes")',
                    '    assert response.status_code == 200',
                    '    assert response.json() == []',
                    '',
                    'def test_create_note():',
                    '    response = client.post(',
                    '        "/notes",',
                    '        json={"title": "Test", "content": "Hello", "published": False},',
                    '    )',
                    '    assert response.status_code == 201',
                    '    data = response.json()',
                    '    assert data["title"] == "Test"',
                    '    assert "id" in data',
                    '',
                    'def test_protected_route_without_token():',
                    '    response = client.get("/me")',
                    '    assert response.status_code == 401',
                    '',
                    'def test_protected_route_with_token():',
                    '    login = client.post("/login", json={"email": "test@test.com", "password": "test"})',
                    '    assert login.status_code == 200',
                    "    token = login.json().get('access_token')",
                    '    response = client.get("/me", headers={"Authorization": f"Bearer {token}"})',
                    '    assert response.status_code == 200',
                ]}
            />
            <LectureSubHeading title="Testing auth" />
            <LectureP>
                For protected endpoints, get a token first (e.g. call your login endpoint with test credentials) and pass it in the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Authorization</code> header. Assert that without the token you get 401, and with it you get the expected 200 and data.
            </LectureP>

            <LectureSectionHeading number="04" title="Testing React with Vitest" />

            <LectureP>
                Install Vitest and a DOM environment (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">jsdom</code>). Write tests in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">*.test.tsx</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">*.spec.tsx</code>. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">@testing-library/react</code> to render components, simulate clicks and input, and query the DOM.
            </LectureP>
            <TerminalBlock
                title="bash — frontend project root"
                lines={[
                    { comment: 'install Vitest and testing library', cmd: 'npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom' },
                    { comment: 'run tests once', cmd: 'npm run test' },
                    { comment: 'run tests in watch mode (re-run on file change)', cmd: 'npm run test -- --watch' },
                ]}
            />
            <LectureSubHeading title="Vitest config and a test you can copy" />
            <LectureP>
                In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vite.config.ts</code>, add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">test</code> block with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">environment: "jsdom"</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">globals: true</code> if you want to use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">describe</code>/<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">it</code> without importing. Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">"test": "vitest"</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package.json</code> scripts.
            </LectureP>
            <CodeBlock
                language="tsx"
                title="src/App.test.tsx"
                lines={[
                    'import { describe, it, expect, vi } from "vitest";',
                    'import { render, screen, fireEvent } from "@testing-library/react";',
                    'import App from "./App";',
                    '',
                    'describe("App", () => {',
                    '  it("renders the app title", () => {',
                    '    render(<App />);',
                    '    expect(screen.getByText(/my app/i)).toBeInTheDocument();',
                    '  });',
                    '',
                    '  it("shows login when user is null", () => {',
                    '    render(<App />);',
                    '    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();',
                    '  });',
                    '',
                    '  it("calls API when submit is clicked", () => {',
                    '    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => ({ token: "fake" }) });',
                    '    vi.stubGlobal("fetch", mockFetch);',
                    '    render(<App />);',
                    '    fireEvent.click(screen.getByRole("button", { name: /log in/i }));',
                    '    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "POST" }));',
                    '  });',
                    '});',
                ]}
            />
            <LectureP>
                Mock <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">fetch</code> (or your API client) so tests don't hit the real backend. That keeps tests fast and deterministic. In integration tests you can point at a test instance of your API if you have one.
            </LectureP>
            <LectureCallout type="tip">
                Test behavior, not implementation. Prefer "user sees a success message after submitting" over "setState was called with X." That way refactoring internals doesn't break tests as long as behavior stays the same.
            </LectureCallout>

            <LectureSectionHeading number="05" title="What to Test First" />

            <LectureP>
                Prioritize: (1) one happy-path test for your main API endpoint (e.g. GET list, POST create); (2) one auth test (login returns token; protected route without token returns 401); (3) one frontend test (e.g. login form submits and stores token, or list page shows items). Add edge-case tests (empty list, 404, invalid input) as you go. Document how to run tests in your README (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm test</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pytest</code>).
            </LectureP>

            <LectureFooterNav
                prev={{
                    label: 'Auth on Your Project',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/activity'),
                }}
                next={{
                    label: 'GitHub Actions & Coverage',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}
