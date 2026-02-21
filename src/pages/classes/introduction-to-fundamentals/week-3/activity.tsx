import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
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
    LectureTerm,
} from '@/components/ui/lecture-typography';

// ── Component tree diagram ────────────────────────────────────────────────────
const ComponentTree = () => (
    <div className="my-6 rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs space-y-1.5">
        {[
            { label: '<App />', indent: 0, note: 'state: tasks[], filter' },
            { label: '<Header />', indent: 1, note: 'title, task count' },
            { label: '<AddTaskForm />', indent: 1, note: 'onAdd callback' },
            { label: '<FilterBar />', indent: 1, note: 'filter, onFilterChange' },
            { label: '<TaskList />', indent: 1, note: 'tasks[], onToggle, onDelete' },
            { label: '<TaskCard /> × n', indent: 2, note: 'task, onToggle, onDelete' },
            { label: '<EmptyState />', indent: 2, note: 'shown when list is empty' },
        ].map((item) => (
            <div
                key={item.label}
                className="flex items-center gap-3"
                style={{ paddingLeft: `${item.indent * 1.5}rem` }}
            >
                <span className="text-orange-600 dark:text-orange-400 font-bold">{item.label}</span>
                <span className="text-muted-foreground">— {item.note}</span>
            </div>
        ))}
    </div>
);

export default function Week3Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={3}
                session="Activity"
                title="Build the Task Tracker"
                description="This is the first real project build of the course — not exercises, but a complete working application. You'll build a Task Tracker from scratch using React, TypeScript, and Tailwind. By the end of this session it should be fully functional, polished, and deployed."
                icon={<CheckSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                onBack={() => navigate('/classes/introduction-to-fundamentals')}
            />

            <LectureCallout type="info">
                This activity is longer than the previous ones — it's designed to fill a full coworking session and leave you with something real to show. Work through the parts in order. The deployment step at the end takes five minutes and gives you a live URL to share.
            </LectureCallout>

            {/* ── 01 PLAN BEFORE YOU CODE ─────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Plan Before You Code" />

            <LectureP>
                Before writing a single line, spend five minutes planning. Here's the component tree you're building toward:
            </LectureP>

            <ComponentTree />

            <LectureP>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App</code> owns all the state. Every other component receives what it needs via props and communicates back up via callbacks. Read through the tree, understand what each component is responsible for, then start building.
            </LectureP>

            {/* ── 02 SCAFFOLD ─────────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Scaffold the Project" />

            <ActivityChallenge
                number="2.1"
                title="Create the Project"
                description="Set up a fresh Vite + React + TypeScript project and clean out the boilerplate."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm create vite@latest task-tracker -- --template react-ts</code> and install dependencies</ActivityTask>
                    <ActivityTask>Install Tailwind CSS: follow the official Vite integration guide (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install -D tailwindcss postcss autoprefixer</code> then <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npx tailwindcss init -p</code>)</ActivityTask>
                    <ActivityTask>Configure <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tailwind.config.js</code> to scan <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">./src/**/*.{'{'} js,ts,jsx,tsx {'}'}</code></ActivityTask>
                    <ActivityTask>Add the three Tailwind directives to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/index.css</code>: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">@tailwind base; @tailwind components; @tailwind utilities;</code></ActivityTask>
                    <ActivityTask>Delete everything in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/App.tsx</code> and replace with a minimal component that renders <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'<h1>Task Tracker</h1>'}</code></ActivityTask>
                    <ActivityTask>Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run dev</code> and confirm the page loads with styled text</ActivityTask>
                </div>

                <ActivityHint label="Tailwind not applying styles">
                    The most common issue is a missing or incorrect <code className="bg-muted px-1 rounded">content</code> path in <code className="bg-muted px-1 rounded">tailwind.config.js</code>. It must match where your component files actually live. Also confirm the three <code className="bg-muted px-1 rounded">@tailwind</code> directives are at the top of your CSS file, not inside any selector.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.2"
                title="Define Your Types"
                description="Before building components, define the TypeScript types that will flow through your entire app."
            >
                <LectureP>
                    Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/types.ts</code> and define:
                </LectureP>

                <div className="mt-4 space-y-1">
                    <ActivityTask>A <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Task</code> interface with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">id: string</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">title: string</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">done: boolean</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">createdAt: number</code> (a timestamp)</ActivityTask>
                    <ActivityTask>A <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Filter</code> type that is one of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">'all' | 'active' | 'done'</code></ActivityTask>
                </div>

                <ActivityHint label="using a union type for Filter">
                    <code className="bg-muted px-1 rounded">export type Filter = 'all' | 'active' | 'done'</code> — this is a TypeScript union type. It means a variable of type <code className="bg-muted px-1 rounded">Filter</code> can only ever be one of those three string values. TypeScript will catch typos at compile time.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 03 BUILD THE COMPONENTS ─────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Build the Components" />

            <LectureP>
                Build bottom-up — start with the smallest leaf components and work up to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App</code>. Each component should be in its own file under <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/components/</code>.
            </LectureP>

            <ActivityChallenge
                number="3.1"
                title="TaskCard"
                description="The leaf component — displays a single task with a toggle and delete button."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/components/TaskCard.tsx</code> accepting <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">task: Task</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onToggle: () =&gt; void</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onDelete: () =&gt; void</code> props</ActivityTask>
                    <ActivityTask>Render the task title with a strikethrough and muted color when <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">task.done</code> is true — use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">cn()</code> for conditional classes</ActivityTask>
                    <ActivityTask>Add a clickable checkbox area on the left that calls <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onToggle</code></ActivityTask>
                    <ActivityTask>Add a delete button on the right that calls <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onDelete</code> — style it so it only becomes visible on hover</ActivityTask>
                    <ActivityTask>Add a subtle <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">hover:shadow-md transition-shadow</code> to the card container</ActivityTask>
                </div>

                <ActivityHint label="making the delete button appear on hover">
                    Add <code className="bg-muted px-1 rounded">group</code> to the card container. On the delete button, use <code className="bg-muted px-1 rounded">opacity-0 group-hover:opacity-100 transition-opacity</code>. This makes it invisible by default and fades it in when the card is hovered.
                </ActivityHint>
                <ActivityHint label="cn() setup">
                    If you don't have <code className="bg-muted px-1 rounded">cn()</code>, install it: <code className="bg-muted px-1 rounded">npm install clsx tailwind-merge</code>. Then create <code className="bg-muted px-1 rounded">src/lib/utils.ts</code> with: <code className="bg-muted px-1 rounded">{"import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'; export function cn(...inputs) { return twMerge(clsx(inputs)) }"}</code>
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="TaskList"
                description="Renders the filtered list of tasks, or an empty state when there are none."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/components/TaskList.tsx</code> accepting <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tasks: Task[]</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onToggle: (id: string) =&gt; void</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onDelete: (id: string) =&gt; void</code></ActivityTask>
                    <ActivityTask>Map over <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tasks</code> and render a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskCard</code> for each — use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">task.id</code> as the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">key</code></ActivityTask>
                    <ActivityTask>When <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tasks.length === 0</code>, render an empty state instead — a centered message like "No tasks here" with a subtle icon</ActivityTask>
                </div>

                <ActivityHint label="passing callbacks with the id">
                    In <code className="bg-muted px-1 rounded">TaskList</code>, each <code className="bg-muted px-1 rounded">TaskCard</code> needs an <code className="bg-muted px-1 rounded">onToggle</code> that knows which task to toggle. Use an inline arrow: <code className="bg-muted px-1 rounded">{"onToggle={() => onToggle(task.id)}"}</code>. This creates a closure over the task's id and passes a zero-argument callback to the card.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.3"
                title="AddTaskForm"
                description="A controlled input form for adding new tasks."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/components/AddTaskForm.tsx</code> accepting <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onAdd: (title: string) =&gt; void</code></ActivityTask>
                    <ActivityTask>Manage the input value with local <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useState</code> — this state belongs to the form, not to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App</code></ActivityTask>
                    <ActivityTask>On submit (button click or Enter key), call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onAdd(title.trim())</code> only if the title is not empty, then clear the input</ActivityTask>
                    <ActivityTask>Style the input with a focus ring: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">focus:outline-none focus:ring-2 focus:ring-orange-500</code></ActivityTask>
                    <ActivityTask>Disable the submit button when the input is empty using the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">disabled</code> prop and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">disabled:opacity-50 disabled:cursor-not-allowed</code></ActivityTask>
                </div>

                <ActivityHint label="handling Enter key submission">
                    Wrap your input and button in a <code className="bg-muted px-1 rounded">{'<form>'}</code> element and handle the <code className="bg-muted px-1 rounded">onSubmit</code> event. Add <code className="bg-muted px-1 rounded">e.preventDefault()</code> to stop the page from reloading. A <code className="bg-muted px-1 rounded">{'<button type="submit">'}</code> inside the form will now trigger on Enter automatically.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.4"
                title="FilterBar"
                description="Three buttons that control which tasks are visible: All, Active, Done."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/components/FilterBar.tsx</code> accepting <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">filter: Filter</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">onFilterChange: (f: Filter) =&gt; void</code></ActivityTask>
                    <ActivityTask>Render three buttons for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">all</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">active</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">done</code></ActivityTask>
                    <ActivityTask>Style the active filter button differently from the others — use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">cn()</code> to apply a filled background to the currently selected filter</ActivityTask>
                </div>
            </ActivityChallenge>

            {/* ── 04 WIRE IT TOGETHER IN APP ───────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Wire It Together in App" />

            <ActivityChallenge
                number="4.1"
                title="State and Handlers in App.tsx"
                description="App owns all state. Build the handlers here and pass them down as props."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tasks</code> state initialized from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useLocalStorage&lt;Task[]&gt;('tasks', [])</code> — create the custom hook in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/hooks/useLocalStorage.ts</code> using the code from Lecture 1</ActivityTask>
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">filter</code> state as regular <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useState&lt;Filter&gt;('all')</code> — filter preference doesn't need to persist</ActivityTask>
                    <ActivityTask>Write <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">handleAdd(title)</code>: creates a new task object with a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">crypto.randomUUID()</code> id and appends it to the tasks array</ActivityTask>
                    <ActivityTask>Write <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">handleToggle(id)</code>: maps over tasks and flips <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">done</code> for the matching task</ActivityTask>
                    <ActivityTask>Write <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">handleDelete(id)</code>: filters out the task with the matching id</ActivityTask>
                    <ActivityTask>Derive <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">filteredTasks</code> from the tasks array and current filter — don't store this in state, compute it during render</ActivityTask>
                </div>

                <ActivityHint label="deriving filteredTasks">
                    Derived state should never go into <code className="bg-muted px-1 rounded">useState</code>. Just compute it: <code className="bg-muted px-1 rounded">{"const filteredTasks = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done))"}</code>. This runs on every render and is always correct.
                </ActivityHint>
                <ActivityHint label="handleToggle without mutation">
                    <code className="bg-muted px-1 rounded">{"setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))"}</code> — spread the task object to create a new one with the flipped <code className="bg-muted px-1 rounded">done</code> value. The other tasks are returned unchanged.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.2"
                title="Compose the UI"
                description="Render all components in App.tsx and confirm the full app works end-to-end."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Render <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">AddTaskForm</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">FilterBar</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskList</code> in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App.tsx</code> with the appropriate props wired up</ActivityTask>
                    <ActivityTask>Add a task — it should appear in the list immediately</ActivityTask>
                    <ActivityTask>Toggle the task done — it should show strikethrough and switch the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">active</code> filter count</ActivityTask>
                    <ActivityTask>Delete the task — it should disappear</ActivityTask>
                    <ActivityTask>Reload the page — your tasks should still be there (localStorage persisting)</ActivityTask>
                    <ActivityTask>Open DevTools → Application → Local Storage and confirm you can see the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">tasks</code> key with your data</ActivityTask>
                </div>
            </ActivityChallenge>

            {/* ── 05 POLISH ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Polish" />

            <LectureP>
                A working app isn't a finished app. These challenges turn it from a technical demo into something you'd actually want to use.
            </LectureP>

            <ActivityChallenge
                number="5.1"
                title="Stats Bar"
                description="Show the user how many tasks they've completed."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Below the filter bar, add a line showing: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">X of Y tasks complete</code> derived from the task state</ActivityTask>
                    <ActivityTask>Add a <LectureTerm>progress bar</LectureTerm> — a full-width grey bar with an orange fill whose width is <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'{completionPercentage}%'}</code> — use inline style for the dynamic width since Tailwind can't generate arbitrary percentages</ActivityTask>
                    <ActivityTask>When all tasks are done, change the progress bar color to green</ActivityTask>
                </div>

                <ActivityHint label="dynamic width with inline style">
                    Tailwind can't handle truly arbitrary values like <code className="bg-muted px-1 rounded">w-[47%]</code> for truly dynamic numbers computed at runtime. Use an inline style instead: <code className="bg-muted px-1 rounded">{"style={{ width: `${percentage}%` }}"}</code> on the inner fill div. The outer bar stays full-width with Tailwind classes.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="5.2"
                title="Clear Completed"
                description="Add a button that removes all done tasks at once."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add a "Clear completed" button that only renders when at least one task is done</ActivityTask>
                    <ActivityTask>Clicking it should filter out all tasks where <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">done === true</code></ActivityTask>
                    <ActivityTask>Style it as a small secondary action — muted color, no fill, subtle hover</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="5.3"
                title="Responsive Layout"
                description="Make the app look good on mobile too."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Center the app content and cap its width: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">max-w-lg mx-auto px-4</code></ActivityTask>
                    <ActivityTask>Open DevTools mobile emulation (Cmd+Shift+M) and verify everything looks good at 375px wide</ActivityTask>
                    <ActivityTask>Ensure the add task input and button stack or remain usable at narrow widths</ActivityTask>
                </div>
            </ActivityChallenge>

            {/* ── 06 DEPLOY ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Deploy to Vercel" />

            <ActivityChallenge
                number="6.1"
                title="Push and Deploy"
                description="Get your app live with a public URL in under 5 minutes."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Initialize a git repo in your project, create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">dist</code>, and commit everything</ActivityTask>
                    <ActivityTask>Push the repo to a new public GitHub repository</ActivityTask>
                    <ActivityTask>Go to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vercel.com</code>, sign in with GitHub, click "Add New Project", and import your repo</ActivityTask>
                    <ActivityTask>Vercel auto-detects Vite — leave all settings as defaults and click Deploy</ActivityTask>
                    <ActivityTask>After the build finishes (usually under 60 seconds), open your live URL and confirm the app works</ActivityTask>
                    <ActivityTask>Share the URL in the club Slack</ActivityTask>
                </div>

                <LectureCallout type="tip">
                    Every push to your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code> branch now automatically redeploys. This is continuous deployment — the same model used by real production teams. Make a change, push it, and watch Vercel rebuild in under a minute.
                </LectureCallout>

                <ActivityHint label="build failing on Vercel">
                    If the build fails, check the Vercel build log for errors. The most common issue is TypeScript errors that your local environment was ignoring. Fix them locally, push again, and Vercel will retry.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 07 BONUS ─────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Bonus Challenges" />

            <LectureP>
                Deployed and still have time? Pick any of these to extend the app.
            </LectureP>

            <ActivityChallenge
                number="★"
                title="Drag to Reorder"
                description="Let users reorder tasks by dragging — no hints."
            >
                <LectureP>
                    Install <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">@dnd-kit/core</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">@dnd-kit/sortable</code>. Wrap <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskList</code> in a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">SortableContext</code>, make each <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskCard</code> a sortable item, and update the tasks array order in state when a drag ends.
                </LectureP>
            </ActivityChallenge>

            <ActivityChallenge
                number="★"
                title="Due Dates"
                description="Add an optional due date to tasks and sort overdue items to the top."
            >
                <LectureP>
                    Add an optional <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">dueDate?: number</code> field to your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Task</code> type. Add a date input to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">AddTaskForm</code>. In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">TaskCard</code>, show the due date and apply a red color if it's in the past and the task isn't done. In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">App</code>, sort the filtered tasks so overdue items appear first.
                </LectureP>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Tailwind CSS',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/lecture-2'),
                }}
                next={{
                    label: 'Week 4 — Advanced React & Deployment',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-1'),
                }}
            />
        </LectureLayout>
    );
}