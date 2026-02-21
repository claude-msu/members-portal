import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
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

// ── Context vs prop drilling diagram ─────────────────────────────────────────
const PropDrillingDiagram = () => (
    <div className="my-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">❌ Prop Drilling</p>
            </div>
            <div className="p-4 space-y-1.5 font-mono text-xs">
                {[
                    { label: '<App user={user}>', depth: 0 },
                    { label: '<Layout user={user}>', depth: 1 },
                    { label: '<Sidebar user={user}>', depth: 2 },
                    { label: '<Avatar user={user}>', depth: 3, highlight: true },
                ].map((item) => (
                    <div
                        key={item.label}
                        style={{ paddingLeft: `${item.depth * 12}px` }}
                        className={item.highlight ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-muted-foreground'}
                    >
                        {item.label}
                    </div>
                ))}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    <code>user</code> passed through 3 components that don't need it just to reach Avatar.
                </p>
            </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ Context</p>
            </div>
            <div className="p-4 space-y-1.5 font-mono text-xs">
                {[
                    { label: '<UserProvider>', depth: 0 },
                    { label: '<Layout>', depth: 1 },
                    { label: '<Sidebar>', depth: 2 },
                    { label: '<Avatar />', depth: 3, highlight: true },
                ].map((item) => (
                    <div
                        key={item.label}
                        style={{ paddingLeft: `${item.depth * 12}px` }}
                        className={item.highlight ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-muted-foreground'}
                    >
                        {item.label}
                    </div>
                ))}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Avatar calls <code>useUser()</code> and gets the data directly. No middlemen.
                </p>
            </div>
        </div>
    </div>
);

export default function Week4Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={4}
                session="Lecture 1"
                title="Advanced React Patterns"
                description="You know the fundamentals. Now the patterns that separate junior React developers from seniors: Context for global state, useReducer for complex state logic, performance optimization with memo and useCallback, and React Router for multi-page apps."
                icon={<Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
            />

            {/* ── 01 CONTEXT ──────────────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Context — Global State Without Prop Drilling" />

            <LectureP>
                As apps grow, passing data through props becomes painful. You end up threading values through five layers of components just to get them to the one component that actually needs them. This is called <LectureTerm>prop drilling</LectureTerm>, and Context is the solution.
            </LectureP>

            <PropDrillingDiagram />

            <LectureP>
                <LectureTerm>React Context</LectureTerm> creates a value that's available to any component in the tree without explicitly passing it as a prop. The parent wraps children in a <LectureTerm>Provider</LectureTerm>. Any descendant can call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useContext</code> to access the value directly.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    UserContext.tsx — the full pattern
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">import </span><span className="text-zinc-400">{'{ createContext, useContext, useState } from '}</span><span className="text-amber-400">'react'</span></p>
                    <p className="mt-2"><span className="text-zinc-500">// 1. Define the shape of the context value</span></p>
                    <p><span className="text-blue-400">interface </span><span className="text-emerald-400">UserContextType </span><span className="text-zinc-400">{'{'}</span></p>
                    <p className="pl-4"><span className="text-sky-300">user</span><span className="text-zinc-400">: User | null</span></p>
                    <p className="pl-4"><span className="text-sky-300">setUser</span><span className="text-zinc-400">: (user: User | null) =&gt; void</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-2"><span className="text-zinc-500">// 2. Create the context with a default value</span></p>
                    <p><span className="text-blue-400">const </span><span className="text-sky-300">UserContext </span><span className="text-zinc-400">= createContext</span><span className="text-zinc-400">{'<UserContextType | null>(null)'}</span></p>
                    <p className="mt-2"><span className="text-zinc-500">// 3. Build a Provider component that holds the state</span></p>
                    <p><span className="text-blue-400">export function </span><span className="text-emerald-400">UserProvider</span><span className="text-zinc-400">{'({ children }: { children: React.ReactNode }) {'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">[user, setUser] = useState</span><span className="text-zinc-400">{'<User | null>(null)'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-zinc-400">{'('}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'<UserContext.Provider'}</span><span className="text-sky-300"> value</span><span className="text-zinc-400">={'{'}{'{ user, setUser }'}{'}'}</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-12"><span className="text-zinc-400">{'{'}</span><span className="text-sky-300">children</span><span className="text-zinc-400">{'}'}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'</UserContext.Provider>'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{')'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-2"><span className="text-zinc-500">// 4. Build a custom hook for clean consumption</span></p>
                    <p><span className="text-blue-400">export function </span><span className="text-emerald-400">useUser</span><span className="text-zinc-400">() {'{'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-sky-300">ctx </span><span className="text-zinc-400">= useContext(UserContext)</span></p>
                    <p className="pl-4"><span className="text-blue-400">if </span><span className="text-zinc-400">(!ctx) throw new Error(</span><span className="text-amber-400">'useUser must be inside UserProvider'</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-sky-300">ctx</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-3"><span className="text-zinc-500">// Usage — anywhere in the tree under UserProvider</span></p>
                    <p><span className="text-blue-400">function </span><span className="text-emerald-400">Avatar</span><span className="text-zinc-400">() {'{'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">{'{ user } = '}</span><span className="text-emerald-400">useUser</span><span className="text-zinc-400">()</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-emerald-300">{'<img'}</span><span className="text-sky-300"> src</span><span className="text-zinc-400">={'{'}user?.avatar{'}'} </span><span className="text-emerald-300">{'/>'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                </div>
            </div>

            <LectureCallout type="warning">
                Context is not a replacement for all props. Use it for truly global data: the authenticated user, the current theme, the selected language. For data that's only shared between a few components, props are still the right tool. Overusing Context makes components harder to reason about and test in isolation.
            </LectureCallout>

            {/* ── 02 USEREDUCER ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="useReducer — Complex State Logic" />

            <LectureP>
                <LectureCmd tip="useReducer — an alternative to useState for complex state that involves multiple sub-values or when the next state depends on the previous one. Takes a reducer function and an initial state. Returns the current state and a dispatch function.">useReducer</LectureCmd> is a more structured alternative to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useState</code> for complex state. Instead of calling setters directly, you <LectureTerm>dispatch</LectureTerm> actions — plain objects that describe what happened. A <LectureTerm>reducer</LectureTerm> function receives the current state and an action, and returns the next state.
            </LectureP>
            <LectureP>
                If you've used Redux, this is the same pattern — but built into React, no library needed.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    taskReducer.ts — state machine for the Task Tracker
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-zinc-500">// Actions are discriminated unions — TypeScript narrows the type in each case</span></p>
                    <p><span className="text-blue-400">type </span><span className="text-emerald-400">Action </span><span className="text-zinc-400">=</span></p>
                    <p className="pl-4"><span className="text-zinc-400">| {'{ type: '}</span><span className="text-amber-400">'ADD'</span><span className="text-zinc-400">{'; title: string }'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">| {'{ type: '}</span><span className="text-amber-400">'TOGGLE'</span><span className="text-zinc-400">{'; id: string }'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">| {'{ type: '}</span><span className="text-amber-400">'DELETE'</span><span className="text-zinc-400">{'; id: string }'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">| {'{ type: '}</span><span className="text-amber-400">'CLEAR_DONE'</span><span className="text-zinc-400">{' }'}</span></p>
                    <p className="mt-2"><span className="text-blue-400">function </span><span className="text-emerald-400">taskReducer</span><span className="text-zinc-400">(state: Task[], action: Action): Task[] {'{'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">switch </span><span className="text-zinc-400">(action.type) {'{'}</span></p>
                    <p className="pl-8"><span className="text-blue-400">case </span><span className="text-amber-400">'ADD'</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-12"><span className="text-blue-400">return </span><span className="text-zinc-400">[...state, {'{ id: crypto.randomUUID(), title: action.title, done: false, createdAt: Date.now() }'}]</span></p>
                    <p className="pl-8"><span className="text-blue-400">case </span><span className="text-amber-400">'TOGGLE'</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-12"><span className="text-blue-400">return </span><span className="text-zinc-400">state.map(t =&gt; t.id === action.id ? {'{ ...t, done: !t.done }'} : t)</span></p>
                    <p className="pl-8"><span className="text-blue-400">case </span><span className="text-amber-400">'DELETE'</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-12"><span className="text-blue-400">return </span><span className="text-zinc-400">state.filter(t =&gt; t.id !== action.id)</span></p>
                    <p className="pl-8"><span className="text-blue-400">case </span><span className="text-amber-400">'CLEAR_DONE'</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-12"><span className="text-blue-400">return </span><span className="text-zinc-400">state.filter(t =&gt; !t.done)</span></p>
                    <p className="pl-8"><span className="text-blue-400">default</span><span className="text-zinc-400">: </span><span className="text-blue-400">return </span><span className="text-sky-300">state</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{'}'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-3"><span className="text-zinc-500">// In your component:</span></p>
                    <p><span className="text-blue-400">const </span><span className="text-zinc-400">[tasks, dispatch] = useReducer(taskReducer, [])</span></p>
                    <p className="mt-1"><span className="text-zinc-500">// Dispatch actions instead of calling setters</span></p>
                    <p><span className="text-sky-300">dispatch</span><span className="text-zinc-400">({'{ type: '}</span><span className="text-amber-400">'ADD'</span><span className="text-zinc-400">{', title: '}</span><span className="text-amber-400">'Buy milk'</span><span className="text-zinc-400">{' }'})</span></p>
                    <p><span className="text-sky-300">dispatch</span><span className="text-zinc-400">({'{ type: '}</span><span className="text-amber-400">'TOGGLE'</span><span className="text-zinc-400">{', id: task.id }'})</span></p>
                </div>
            </div>

            <LectureP>
                The reducer function is a <LectureTerm>pure function</LectureTerm> — given the same state and action, it always returns the same result. No side effects. This makes it trivially testable: call it with different inputs and assert on the output. No mocking, no async, no setup required.
            </LectureP>

            <LectureCallout type="tip">
                Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useReducer</code> when you have 3+ related state values that change together, when the next state depends on the previous state in complex ways, or when you want your state transitions to be explicit and traceable. For simple cases, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useState</code> is still fine.
            </LectureCallout>

            {/* ── 03 PERFORMANCE ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Performance: memo, useCallback, useMemo" />

            <LectureP>
                React re-renders a component whenever its state or props change. When a parent re-renders, all of its children re-render too — even if their props didn't change. For most apps this is fast enough to be invisible. But for large lists or expensive computations, unnecessary re-renders cause jank.
            </LectureP>

            <LectureCallout type="warning">
                Don't optimize prematurely. The React team's advice is clear: measure first, then optimize. Adding <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">memo</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useCallback</code> everywhere makes code harder to read without necessarily making it faster. Profile in DevTools, find the actual bottleneck, then fix it.
            </LectureCallout>

            <LectureSubHeading title="React.memo" />
            <LectureP>
                <LectureCmd tip="React.memo — a higher-order component that wraps your component and memoizes the render output. If the props haven't changed since the last render (by shallow comparison), React skips re-rendering it and reuses the previous result.">React.memo</LectureCmd> wraps a component and skips re-rendering it if its props haven't changed. It does a shallow comparison — primitive values are compared by value, objects and functions by reference.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    memo, useCallback, useMemo
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-4 select-none">
                    <div>
                        <p className="text-zinc-500 mb-1">{`// React.memo — skip re-render if props are the same`}</p>
                        <p><span className="text-blue-400">const </span><span className="text-emerald-400">TaskCard </span><span className="text-zinc-400">= React.memo(</span><span className="text-blue-400">function </span><span className="text-emerald-400">TaskCard</span><span className="text-zinc-400">({'{ task, onToggle }'}) {'{'}</span></p>
                        <p className="pl-4"><span className="text-zinc-500">// only re-renders when task or onToggle changes</span></p>
                        <p className="pl-4"><span className="text-blue-400">return </span><span className="text-emerald-300">{'<div>...</div>'}</span></p>
                        <p><span className="text-zinc-400">{'})'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// useCallback — stable function reference across renders`}</p>
                        <p className="text-zinc-500 mb-1">{`// Without this, a new onToggle function is created every render,`}</p>
                        <p className="text-zinc-500 mb-1">{`// busting React.memo's shallow comparison`}</p>
                        <p><span className="text-blue-400">const </span><span className="text-sky-300">handleToggle </span><span className="text-zinc-400">= useCallback((id: string) =&gt; {'{'}</span></p>
                        <p className="pl-4"><span className="text-sky-300">dispatch</span><span className="text-zinc-400">({'{ type: '}</span><span className="text-amber-400">'TOGGLE'</span><span className="text-zinc-400">{', id }'})</span></p>
                        <p><span className="text-zinc-400">{'}, [dispatch])'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// useMemo — cache the result of an expensive computation`}</p>
                        <p><span className="text-blue-400">const </span><span className="text-sky-300">stats </span><span className="text-zinc-400">= useMemo(() =&gt; ({'{'}</span></p>
                        <p className="pl-4"><span className="text-sky-300">total</span><span className="text-zinc-400">: tasks.length,</span></p>
                        <p className="pl-4"><span className="text-sky-300">done</span><span className="text-zinc-400">: tasks.filter(t =&gt; t.done).length,</span></p>
                        <p className="pl-4"><span className="text-sky-300">pct</span><span className="text-zinc-400">: tasks.length ? Math.round(tasks.filter(t =&gt; t.done).length / tasks.length * 100) : 0</span></p>
                        <p><span className="text-zinc-400">{'}), [tasks])'}</span></p>
                    </div>
                </div>
            </div>

            <LectureP>
                <LectureCmd tip="useCallback — memoizes a function so it has a stable reference across renders. The function is only recreated when values in the dependency array change. Primarily useful when passing callbacks to memoized child components.">useCallback</LectureCmd> and <LectureCmd tip="useMemo — memoizes the result of a computation. Only recomputes when values in the dependency array change. Useful for expensive calculations that don't need to run on every render.">useMemo</LectureCmd> both take a dependency array — same rules as <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useEffect</code>. The value is only recomputed when a dependency changes.
            </LectureP>

            {/* ── 04 REACT ROUTER ─────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="React Router" />

            <LectureP>
                React apps are <LectureTerm>Single Page Applications</LectureTerm> — the browser loads one HTML page and JavaScript handles all navigation. <LectureTerm>React Router</LectureTerm> makes this feel like a multi-page app: the URL changes, the browser history updates, the back button works, but the page never fully reloads.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    React Router v6 — core setup and usage
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-4 select-none">
                    <div>
                        <p className="text-zinc-500 mb-1">{`// main.tsx — wrap the app in BrowserRouter`}</p>
                        <p><span className="text-emerald-300">{'<BrowserRouter>'}</span></p>
                        <p className="pl-4"><span className="text-emerald-300">{'<App />'}</span></p>
                        <p><span className="text-emerald-300">{'</BrowserRouter>'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// App.tsx — define routes`}</p>
                        <p><span className="text-emerald-300">{'<Routes>'}</span></p>
                        <p className="pl-4"><span className="text-emerald-300">{'<Route'}</span><span className="text-sky-300"> path</span><span className="text-zinc-400">=</span><span className="text-amber-400">"/"</span><span className="text-sky-300"> element</span><span className="text-zinc-400">={'{<Home />}'}</span><span className="text-emerald-300">{' />'}</span></p>
                        <p className="pl-4"><span className="text-emerald-300">{'<Route'}</span><span className="text-sky-300"> path</span><span className="text-zinc-400">=</span><span className="text-amber-400">"/tasks"</span><span className="text-sky-300"> element</span><span className="text-zinc-400">={'{<TasksPage />}'}</span><span className="text-emerald-300">{' />'}</span></p>
                        <p className="pl-4"><span className="text-emerald-300">{'<Route'}</span><span className="text-sky-300"> path</span><span className="text-zinc-400">=</span><span className="text-amber-400">"/tasks/:id"</span><span className="text-sky-300"> element</span><span className="text-zinc-400">={'{<TaskDetail />}'}</span><span className="text-emerald-300">{' />'}</span></p>
                        <p className="pl-4"><span className="text-emerald-300">{'<Route'}</span><span className="text-sky-300"> path</span><span className="text-zinc-400">=</span><span className="text-amber-400">"*"</span><span className="text-sky-300"> element</span><span className="text-zinc-400">={'{<NotFound />}'}</span><span className="text-emerald-300">{' />'}</span></p>
                        <p><span className="text-emerald-300">{'</Routes>'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// Navigation — use Link instead of <a> to avoid full reloads`}</p>
                        <p><span className="text-emerald-300">{'<Link'}</span><span className="text-sky-300"> to</span><span className="text-zinc-400">=</span><span className="text-amber-400">"/tasks"</span><span className="text-emerald-300">{'>'}</span><span className="text-zinc-400">Go to Tasks</span><span className="text-emerald-300">{'</Link>'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// Programmatic navigation — from inside a component`}</p>
                        <p><span className="text-blue-400">const </span><span className="text-sky-300">navigate </span><span className="text-zinc-400">= useNavigate()</span></p>
                        <p><span className="text-sky-300">navigate</span><span className="text-zinc-400">(</span><span className="text-amber-400">'/tasks'</span><span className="text-zinc-400">)</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// URL params — read :id from the URL`}</p>
                        <p><span className="text-blue-400">const </span><span className="text-zinc-400">{'{ id } = '}</span><span className="text-sky-300">useParams</span><span className="text-zinc-400">()</span></p>
                    </div>
                </div>
            </div>

            <LectureCallout type="info">
                Always use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'<Link to="...">'}</code> instead of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'<a href="...">'}</code> for internal navigation in a React Router app. A regular anchor tag triggers a full page reload, which destroys all React state. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Link</code> updates the URL and renders the new route without reloading.
            </LectureCallout>

            {/* ── 05 DATA FETCHING PATTERNS ───────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Data Fetching Patterns" />

            <LectureP>
                Fetching data is one of the most common things you'll do in React apps. There are two approaches: the manual <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useEffect</code> pattern, and a dedicated data fetching library. Understanding both matters.
            </LectureP>

            <LectureSubHeading title="The manual pattern" />

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    manual fetch with useEffect
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">function </span><span className="text-emerald-400">UserProfile</span><span className="text-zinc-400">({'{ userId }: { userId: string }) {'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">[user, setUser] = useState</span><span className="text-zinc-400">{'<User | null>(null)'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">[loading, setLoading] = useState(</span><span className="text-blue-400">true</span><span className="text-zinc-400">)</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">[error, setError] = useState</span><span className="text-zinc-400">{'<string | null>(null)'}</span></p>
                    <p className="mt-2 pl-4"><span className="text-blue-400">useEffect</span><span className="text-zinc-400">{'(() => {'}</span></p>
                    <p className="pl-8"><span className="text-blue-400">let </span><span className="text-sky-300">cancelled </span><span className="text-zinc-400">= </span><span className="text-blue-400">false</span><span className="text-zinc-500">  // cleanup flag</span></p>
                    <p className="pl-8"><span className="text-sky-300">setLoading</span><span className="text-zinc-400">(true)</span></p>
                    <p className="pl-8"><span className="text-sky-300">fetch</span><span className="text-zinc-400">({"`/api/users/${userId}`"})</span></p>
                    <p className="pl-12"><span className="text-zinc-400">.then(r =&gt; r.json())</span></p>
                    <p className="pl-12"><span className="text-zinc-400">.then(data =&gt; {'{ if (!cancelled) setUser(data) }'})</span></p>
                    <p className="pl-12"><span className="text-zinc-400">.catch(err =&gt; {'{ if (!cancelled) setError(err.message) }'})</span></p>
                    <p className="pl-12"><span className="text-zinc-400">.finally(() =&gt; {'{ if (!cancelled) setLoading(false) }'})</span></p>
                    <p className="pl-8"><span className="text-blue-400">return </span><span className="text-zinc-400">() =&gt; {'{ cancelled = true }'}</span><span className="text-zinc-500">  // cleanup on unmount</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{'}, [userId])'}</span></p>
                    <p className="mt-2 pl-4"><span className="text-blue-400">if </span><span className="text-zinc-400">(loading) </span><span className="text-blue-400">return </span><span className="text-emerald-300">{'<Spinner />'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">if </span><span className="text-zinc-400">(error) </span><span className="text-blue-400">return </span><span className="text-emerald-300">{'<ErrorMessage'}</span><span className="text-sky-300"> message</span><span className="text-zinc-400">={'{error}'}</span><span className="text-emerald-300">{' />'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-emerald-300">{'<div>'}</span><span className="text-zinc-400">{'{'}</span><span className="text-sky-300">user</span><span className="text-zinc-400">?.name{'}'}</span><span className="text-emerald-300">{'</div>'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                </div>
            </div>

            <LectureSubHeading title="TanStack Query" />
            <LectureP>
                The manual pattern works but it's verbose. Every component that fetches data needs the same loading/error/data state boilerplate. <LectureTerm>TanStack Query</LectureTerm> (formerly React Query) eliminates this with automatic caching, background refetching, loading states, and error handling out of the box. It's what this portal uses.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    same thing with TanStack Query — 4 lines instead of 20
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">import </span><span className="text-zinc-400">{'{ useQuery } from '}</span><span className="text-amber-400">'@tanstack/react-query'</span></p>
                    <p className="mt-2"><span className="text-blue-400">function </span><span className="text-emerald-400">UserProfile</span><span className="text-zinc-400">({'{ userId }) {'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">{'{ data: user, isLoading, error } = '}</span><span className="text-emerald-400">useQuery</span><span className="text-zinc-400">({'{'}</span></p>
                    <p className="pl-8"><span className="text-sky-300">queryKey</span><span className="text-zinc-400">: [</span><span className="text-amber-400">'user'</span><span className="text-zinc-400">, userId],</span></p>
                    <p className="pl-8"><span className="text-sky-300">queryFn</span><span className="text-zinc-400">: () =&gt; fetch({"`/api/users/${userId}`"}).then(r =&gt; r.json())</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{'})'}</span></p>
                    <p className="mt-1 pl-4"><span className="text-zinc-500">// loading, error, and caching handled automatically</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                </div>
            </div>

            {/* ── 06 ERROR BOUNDARIES ─────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Error Boundaries" />

            <LectureP>
                When a component throws an error during rendering, React unmounts the entire component tree and shows a blank screen. <LectureTerm>Error Boundaries</LectureTerm> catch these errors at a specific point in the tree and show a fallback UI instead — so a bug in one widget doesn't crash the entire app.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    using react-error-boundary (simplest approach)
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">import </span><span className="text-zinc-400">{'{ ErrorBoundary } from '}</span><span className="text-amber-400">'react-error-boundary'</span></p>
                    <p className="mt-2"><span className="text-blue-400">function </span><span className="text-emerald-400">ErrorFallback</span><span className="text-zinc-400">({'{ error, resetErrorBoundary }) {'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-zinc-400">{'('}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'<div'}</span><span className="text-sky-300"> role</span><span className="text-zinc-400">=</span><span className="text-amber-400">"alert"</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<p>'}</span><span className="text-zinc-400">Something went wrong: {'{'}</span><span className="text-sky-300">error</span><span className="text-zinc-400">.message{'}'}</span><span className="text-emerald-300">{'</p>'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<button'}</span><span className="text-sky-300"> onClick</span><span className="text-zinc-400">={'{resetErrorBoundary}'}</span><span className="text-emerald-300">{'>'}</span><span className="text-zinc-400">Try again</span><span className="text-emerald-300">{'</button>'}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'</div>'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{')'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-2"><span className="text-emerald-300">{'<ErrorBoundary'}</span><span className="text-sky-300"> FallbackComponent</span><span className="text-zinc-400">={'{ErrorFallback}'}</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-4"><span className="text-emerald-300">{'<TaskTracker />'}</span></p>
                    <p><span className="text-emerald-300">{'</ErrorBoundary>'}</span></p>
                </div>
            </div>

            <LectureP>
                Wrap each major section of your UI in its own error boundary. If the sidebar crashes, the main content still works. If a widget fails, the rest of the page still renders. This is standard practice in any production React app.
            </LectureP>

            {/* ── 07 FOLDER STRUCTURE ─────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Scaling Your Project Structure" />

            <LectureP>
                There's no single correct way to organize a React project, but there are patterns that scale well. As projects grow beyond a handful of components, a feature-based structure beats a type-based one.
            </LectureP>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border bg-rose-50 dark:bg-rose-950/20">
                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Type-based (doesn't scale)</p>
                    </div>
                    <div className="p-4 font-mono text-xs text-muted-foreground space-y-0.5">
                        <p>src/</p>
                        <p className="pl-4">components/</p>
                        <p className="pl-8">Button.tsx</p>
                        <p className="pl-8">TaskCard.tsx</p>
                        <p className="pl-8">UserAvatar.tsx</p>
                        <p className="pl-4">hooks/</p>
                        <p className="pl-8">useTask.ts</p>
                        <p className="pl-8">useUser.ts</p>
                        <p className="pl-4">utils/</p>
                        <p className="pl-8">date.ts</p>
                        <p className="pl-8">format.ts</p>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border bg-emerald-50 dark:bg-emerald-950/20">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Feature-based (scales well)</p>
                    </div>
                    <div className="p-4 font-mono text-xs text-muted-foreground space-y-0.5">
                        <p>src/</p>
                        <p className="pl-4">features/</p>
                        <p className="pl-8">tasks/</p>
                        <p className="pl-12">TaskCard.tsx</p>
                        <p className="pl-12">useTask.ts</p>
                        <p className="pl-12">taskReducer.ts</p>
                        <p className="pl-8">auth/</p>
                        <p className="pl-12">UserAvatar.tsx</p>
                        <p className="pl-12">useUser.ts</p>
                        <p className="pl-4">components/ui/</p>
                        <p className="pl-8">Button.tsx</p>
                    </div>
                </div>
            </div>

            <LectureP>
                In the feature-based structure, everything related to tasks lives together — the component, the hook, the reducer, the types. When you need to understand or modify how tasks work, you only look in one place. Shared UI primitives (Button, Input, etc.) live in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">components/ui/</code>.
            </LectureP>

            <LectureFooterNav
                prev={{
                    label: 'Build the Task Tracker',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/activity'),
                }}
                next={{
                    label: 'Deployment & CI/CD',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}