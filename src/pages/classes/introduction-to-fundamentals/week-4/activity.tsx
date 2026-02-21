import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week4Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={4}
                session="Activity"
                title="Upgrade the Task Tracker"
                description="You built the Task Tracker last week. Now you apply everything from Week 4 to make it production-grade: refactor state to useReducer, add Context so any component can access tasks, set up a CI pipeline that blocks bad code, and ship it with a custom domain."
                icon={<Rocket className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                onBack={() => navigate('/classes/introduction-to-fundamentals')}
            />

            <LectureCallout type="info">
                Open your Task Tracker project from Week 3. All challenges in this activity are refactors and additions to that existing codebase — you're not starting from scratch.
            </LectureCallout>

            {/* ── 01 REFACTOR STATE TO USEREDUCER ─────────────────────────────── */}
            <LectureSectionHeading number="01" title="Refactor State to useReducer" />

            <LectureP>
                Your current <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App.tsx</code> has three separate handler functions for adding, toggling, and deleting tasks. Pull those into a single reducer and test it in isolation.
            </LectureP>

            <ActivityChallenge
                number="1.1"
                title="Write the Reducer"
                description="Extract all task state transitions into a pure taskReducer function."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/features/tasks/taskReducer.ts</code></ActivityTask>
                    <ActivityTask>Define an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Action</code> discriminated union type covering <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ADD</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TOGGLE</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DELETE</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">CLEAR_DONE</code></ActivityTask>
                    <ActivityTask>Write the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">taskReducer(state: Task[], action: Action): Task[]</code> function — each case returns a new array, never mutates</ActivityTask>
                    <ActivityTask>Manually call the reducer in the file with a few test cases and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">console.assert</code> to verify the outputs are correct before touching any UI</ActivityTask>
                </div>

                <ActivityHint label="testing a pure function">
                    A reducer is just a function — you can call it directly: <code className="bg-muted px-1 rounded">{"const next = taskReducer([], { type: 'ADD', title: 'Buy milk' })"}</code>. Then assert the result: <code className="bg-muted px-1 rounded">console.assert(next.length === 1)</code>. No React, no rendering, no setup needed.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="1.2"
                title="Swap useState for useReducer in App"
                description="Replace the three handler functions with a single dispatch call each."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Replace the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tasks</code> state and its three handlers with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">const [tasks, dispatch] = useReducer(taskReducer, [])</code></ActivityTask>
                    <ActivityTask>Update <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">AddTaskForm</code> to call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">dispatch{'({ type: \'ADD\', title })'}</code></ActivityTask>
                    <ActivityTask>Update <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskCard</code>'s toggle and delete to dispatch the appropriate actions</ActivityTask>
                    <ActivityTask>Update the "Clear completed" button to dispatch <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">CLEAR_DONE</code></ActivityTask>
                    <ActivityTask>Confirm the app works identically to before — same behaviour, cleaner internals</ActivityTask>
                </div>

                <ActivityHint label="localStorage + useReducer">
                    <code className="bg-muted px-1 rounded">useReducer</code> doesn't have a built-in persistence mechanism like your custom <code className="bg-muted px-1 rounded">useLocalStorage</code> hook did. You have two options: (1) wrap the dispatch in a custom function that also writes to localStorage, or (2) add a <code className="bg-muted px-1 rounded">useEffect</code> that writes <code className="bg-muted px-1 rounded">tasks</code> to localStorage whenever it changes, and read from localStorage for the initial state argument.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 02 ADD CONTEXT ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Add Context" />

            <LectureP>
                Right now everything flows through <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App.tsx</code> via props. This works for a small app, but as you add more components it gets unwieldy. Move the task state and dispatch into a Context so any component can access them directly.
            </LectureP>

            <ActivityChallenge
                number="2.1"
                title="Create TaskContext"
                description="Build a Provider that wraps the app and exposes tasks + dispatch."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/features/tasks/TaskContext.tsx</code> with a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskProvider</code> component and a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useTasks()</code> custom hook</ActivityTask>
                    <ActivityTask>Move <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useReducer</code> and the localStorage sync into <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskProvider</code></ActivityTask>
                    <ActivityTask>The context value should expose: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tasks</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">dispatch</code>, and the derived <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">stats</code> object (total, done, pct)</ActivityTask>
                    <ActivityTask>Wrap <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'<App />'}</code> in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'<TaskProvider>'}</code> in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main.tsx</code></ActivityTask>
                    <ActivityTask>Refactor <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App.tsx</code> to call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useTasks()</code> instead of managing state directly — remove all the prop threading</ActivityTask>
                    <ActivityTask>Refactor the stats bar to call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useTasks()</code> directly instead of receiving stats as props</ActivityTask>
                </div>

                <ActivityHint label="useMemo for stats inside the Provider">
                    Compute stats inside the Provider using <code className="bg-muted px-1 rounded">useMemo</code> so they only recalculate when <code className="bg-muted px-1 rounded">tasks</code> changes: <code className="bg-muted px-1 rounded">{"const stats = useMemo(() => ({ total: tasks.length, done: tasks.filter(t => t.done).length }), [tasks])"}</code>. Include it in the context value so any component can read it without recomputing.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 03 PERFORMANCE ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Optimize with memo and useCallback" />

            <ActivityChallenge
                number="3.1"
                title="Memoize TaskCard"
                description="Prevent TaskCard from re-rendering when unrelated state changes."
            >
                <LectureP>
                    Install React DevTools in your browser. Open the Profiler tab, record an interaction (toggle a task), and observe which components re-render. You'll see every TaskCard re-renders even when only one task changed.
                </LectureP>

                <div className="mt-4 space-y-1">
                    <ActivityTask>Wrap <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskCard</code> in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">React.memo</code></ActivityTask>
                    <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskList</code>, wrap the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onToggle</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onDelete</code> callbacks passed to each card in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useCallback</code></ActivityTask>
                    <ActivityTask>Profile again — only the toggled card should re-render now</ActivityTask>
                </div>

                <ActivityHint label="why useCallback is needed alongside memo">
                    <code className="bg-muted px-1 rounded">React.memo</code> does a shallow comparison of props. If <code className="bg-muted px-1 rounded">onToggle</code> is defined inline (e.g. <code className="bg-muted px-1 rounded">{"() => dispatch(..."}</code>), a new function is created every render, giving every card a new <code className="bg-muted px-1 rounded">onToggle</code> reference even though nothing changed. <code className="bg-muted px-1 rounded">useCallback</code> stabilizes the reference so <code className="bg-muted px-1 rounded">memo</code>'s comparison actually works.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 04 CI PIPELINE ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Set Up CI with GitHub Actions" />

            <ActivityChallenge
                number="4.1"
                title="Write the Workflow File"
                description="Add a GitHub Actions CI pipeline that runs on every PR to main."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/workflows/ci.yml</code> in your project</ActivityTask>
                    <ActivityTask>Configure it to trigger on pushes to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code> and all pull requests targeting <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                    <ActivityTask>Add a job that checks out the code, sets up Node 20 with npm caching, installs with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm ci</code>, runs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npx tsc --noEmit</code>, and runs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run build</code></ActivityTask>
                    <ActivityTask>Push the workflow file to a new branch and open a PR — watch the Actions tab as the pipeline runs</ActivityTask>
                    <ActivityTask>Deliberately introduce a TypeScript error (assign a string to a number type somewhere) and push — confirm the pipeline fails on the type check step</ActivityTask>
                    <ActivityTask>Fix the error, push again, and confirm the pipeline goes green</ActivityTask>
                </div>

                <ActivityHint label="workflow file structure">
                    The file needs three top-level keys: <code className="bg-muted px-1 rounded">name</code> (display name), <code className="bg-muted px-1 rounded">on</code> (triggers), and <code className="bg-muted px-1 rounded">jobs</code> (what to run). Under <code className="bg-muted px-1 rounded">jobs</code>, define a job with <code className="bg-muted px-1 rounded">runs-on: ubuntu-latest</code> and a <code className="bg-muted px-1 rounded">steps</code> array. Each step is either a <code className="bg-muted px-1 rounded">uses</code> (a pre-built action) or a <code className="bg-muted px-1 rounded">run</code> (a shell command).
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.2"
                title="Enable Branch Protection"
                description="Make the CI pipeline actually enforce quality — it's useless if people can bypass it."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Go to your repository on GitHub → Settings → Branches → Add rule for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code></ActivityTask>
                    <ActivityTask>Enable "Require a pull request before merging"</ActivityTask>
                    <ActivityTask>Enable "Require status checks to pass before merging" and select your CI job</ActivityTask>
                    <ActivityTask>Enable "Require branches to be up to date before merging"</ActivityTask>
                    <ActivityTask>Try pushing directly to main — GitHub should reject it</ActivityTask>
                </div>

                <LectureCallout type="info">
                    You'll need to be a repository admin to set branch protection rules. If you're using a personal repo you created, you already are. If you're working in a shared club repo, ask the President or Technical Chair to enable this.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 05 DEPLOY ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Deploy the Upgraded Version" />

            <ActivityChallenge
                number="5.1"
                title="Merge and Watch Vercel Deploy"
                description="See the full CI/CD loop in action end-to-end."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Make sure all your changes from Parts 1–4 are committed and pushed on a feature branch</ActivityTask>
                    <ActivityTask>Open a pull request targeting <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code> — you should see the CI pipeline check appear on the PR</ActivityTask>
                    <ActivityTask>Wait for CI to go green, then merge the PR</ActivityTask>
                    <ActivityTask>Open Vercel and watch the deployment trigger automatically from the merge</ActivityTask>
                    <ActivityTask>Visit your live URL and verify the upgraded app is running</ActivityTask>
                    <ActivityTask>Open the Vercel dashboard and find the deployment log — read through what Vercel actually did during the build</ActivityTask>
                </div>
            </ActivityChallenge>

            {/* ── 06 BONUS ─────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Bonus Challenges" />

            <ActivityChallenge
                number="★"
                title="Add React Router"
                description="Split the app into multiple pages using React Router — no hints."
            >
                <LectureP>
                    Install React Router v6. Create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/</code> (landing/stats page) and a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/tasks</code> (the task list) route. Add a nav bar with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Link</code> components. Since tasks live in Context, both pages can read from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useTasks()</code> without prop changes. Verify the back button works and the URL updates correctly.
                </LectureP>
            </ActivityChallenge>

            <ActivityChallenge
                number="★"
                title="Add Error Boundaries"
                description="Wrap the app so that a crash in one section doesn't take down everything."
            >
                <LectureP>
                    Install <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">react-error-boundary</code>. Wrap <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskList</code> and the stats bar in separate <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ErrorBoundary</code> components with a fallback UI. Then deliberately throw an error in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskCard</code> and confirm only that section shows the fallback — not the whole page.
                </LectureP>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Deployment & CI/CD',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-2'),
                }}
                next={{
                    label: 'Week 5 — FastAPI & SQL',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-5/lecture-1'),
                }}
            />
        </LectureLayout>
    );
}