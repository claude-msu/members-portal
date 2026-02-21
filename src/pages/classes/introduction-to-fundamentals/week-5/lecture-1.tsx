import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { LectureCmd } from '@/components/ui/lecture-cmd';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';

// ── Props flow diagram ────────────────────────────────────────────────────────
const PropsFlowDiagram = () => (
    <div className="my-8 rounded-xl border border-border bg-muted/30 overflow-hidden">
        <div className="p-5 space-y-2">
            {[
                { label: '<App />', indent: 0, note: 'owns the data: tasks = [...]', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' },
                { label: '<TaskList tasks={tasks} />', indent: 1, note: 'receives tasks, passes each down', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' },
                { label: '<TaskItem task={task} />', indent: 2, note: 'receives one task, renders it', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' },
            ].map((item) => (
                <div
                    key={item.label}
                    className={`rounded-lg border px-4 py-2.5 ${item.bg}`}
                    style={{ marginLeft: `${item.indent * 2}rem` }}
                >
                    <code className={`text-xs font-bold ${item.color}`}>{item.label}</code>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                </div>
            ))}
        </div>
        <div className="px-5 pb-4 text-xs text-muted-foreground">
            Data flows <strong className="text-foreground">down</strong> via props. Events flow <strong className="text-foreground">up</strong> via callback functions passed as props.
        </div>
    </div>
);

// ── useState lifecycle diagram ────────────────────────────────────────────────
const UseStateDiagram = () => (
    <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-border text-center text-xs">
            {[
                { step: '1', label: 'Render', desc: 'React calls your component function. useState returns the current value.', color: 'text-orange-600 dark:text-orange-400' },
                { step: '2', label: 'Event', desc: 'User clicks a button. Your event handler calls setState(newValue).', color: 'text-blue-600 dark:text-blue-400' },
                { step: '3', label: 'Re-render', desc: 'React calls your component again with the new state value. UI updates.', color: 'text-emerald-600 dark:text-emerald-400' },
            ].map((item) => (
                <div key={item.step} className="p-4">
                    <div className={`text-2xl font-black ${item.color}`}>{item.step}</div>
                    <div className={`font-bold mt-1 ${item.color}`}>{item.label}</div>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

export default function Week5Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={5}
                session="Lecture 1"
                title="React Components & Hooks"
                description="React is the most widely used frontend library in the world. Learn the mental model, components, props, state, and the hooks you will use every single day."
                icon={<Globe className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
            />

            {/* ── 01 THE REACT MENTAL MODEL ───────────────────────────────────── */}
            <LectureSectionHeading number="01" title="The React Mental Model" />

            <LectureP>
                Before writing a single line of React, you need to understand the core idea: <strong className="text-foreground">your UI is a function of your state.</strong> Given the same data, your UI always looks the same. When the data changes, React re-runs your functions and updates only the parts of the page that changed.
            </LectureP>
            <LectureP>
                This is a fundamentally different model from jQuery-era web development, where you'd manually find a DOM element and change it. In React, you never touch the DOM directly. You describe what the UI should look like for any given state, and React figures out how to get there efficiently.
            </LectureP>
            <LectureP>
                The practical implication: stop thinking about "what do I need to change when the user clicks this button" and start thinking about "what does the page look like when <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">isLoggedIn</code> is <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">true</code>?"
            </LectureP>

            <LectureCallout type="info">
                React doesn't update the real DOM directly — it maintains a <LectureTerm>Virtual DOM</LectureTerm>, a lightweight in-memory representation of the UI. When state changes, React builds a new virtual DOM tree, compares it to the previous one (called <LectureTerm>diffing</LectureTerm>), and applies only the minimal set of real DOM changes needed. This is why React is fast even for complex UIs.
            </LectureCallout>

            {/* ── 02 COMPONENTS ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Components" />

            <LectureP>
                A <LectureTerm>component</LectureTerm> is a JavaScript function that returns JSX — a syntax that looks like HTML but is actually JavaScript. Components are the building blocks of every React application. You compose them together like Lego pieces to build complex UIs.
            </LectureP>
            <LectureP>
                Every React component follows two rules: the function name must start with a capital letter, and it must return something React can render (JSX, a string, a number, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">null</code>).
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    Button.tsx — a minimal component
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-zinc-500">// A component is just a function that returns JSX</span></p>
                    <p className="mt-2"><span className="text-blue-400">export function </span><span className="text-emerald-400">Button</span><span className="text-zinc-400">() {'{'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-amber-400">{'('}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'<button'}</span><span className="text-zinc-400"> className=</span><span className="text-amber-400">"bg-orange-500 text-white px-4 py-2 rounded"</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-10"><span className="text-zinc-400">Click me</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'</button>'}</span></p>
                    <p className="pl-4"><span className="text-amber-400">{')'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-3"><span className="text-zinc-500">// Use it like an HTML tag in other components</span></p>
                    <p><span className="text-blue-400">export function </span><span className="text-emerald-400">App</span><span className="text-zinc-400">() {'{'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-emerald-300">{'<div>'}</span><span className="text-emerald-300">{'<Button />'}</span><span className="text-emerald-300">{'<Button />'}</span><span className="text-emerald-300">{'</div>'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                </div>
            </div>

            <LectureSubHeading title="JSX rules" />
            <LectureP>
                JSX looks like HTML but has a few important differences. Every element must be closed. Multiple elements must be wrapped in a single parent (or a <LectureTerm>Fragment</LectureTerm>: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'<> </>'}</code>). JavaScript expressions go inside curly braces. And <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class</code> becomes <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">className</code> because <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class</code> is a reserved word in JavaScript.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    JSX — key differences from HTML
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-3 select-none">
                    <div>
                        <p className="text-zinc-500 mb-1">{`// ✅ className, not class`}</p>
                        <p><span className="text-emerald-300">{'<div'}</span><span className="text-sky-300"> className</span><span className="text-zinc-400">=</span><span className="text-amber-400">"container"</span><span className="text-emerald-300">{'>'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// ✅ JS expressions in curly braces`}</p>
                        <p><span className="text-emerald-300">{'<p>'}</span><span className="text-zinc-400">{'Hello, {'}</span><span className="text-sky-300">name</span><span className="text-zinc-400">{'}'}</span><span className="text-emerald-300">{'</p>'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// ✅ self-closing tags must close`}</p>
                        <p><span className="text-emerald-300">{'<img src={url} alt="photo" />'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// ✅ wrap multiple elements in a fragment`}</p>
                        <p><span className="text-zinc-400">{'return ('}</span></p>
                        <p className="pl-4"><span className="text-emerald-300">{'<>'}</span></p>
                        <p className="pl-8"><span className="text-emerald-300">{'<h1>'}</span><span className="text-zinc-400">Title</span><span className="text-emerald-300">{'</h1>'}</span></p>
                        <p className="pl-8"><span className="text-emerald-300">{'<p>'}</span><span className="text-zinc-400">Body</span><span className="text-emerald-300">{'</p>'}</span></p>
                        <p className="pl-4"><span className="text-emerald-300">{'</>'}</span></p>
                        <p><span className="text-zinc-400">{')'}</span></p>
                    </div>
                </div>
            </div>

            {/* ── 03 PROPS ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Props" />

            <LectureP>
                <LectureTerm>Props</LectureTerm> (short for properties) are how you pass data into a component. They're the arguments to your component function. A component with no props is a static piece of UI — the same every time. A component that accepts props is configurable and reusable.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    Button.tsx — props make components reusable
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-zinc-500">// Define the shape of the props with a TypeScript interface</span></p>
                    <p className="mt-1"><span className="text-blue-400">interface </span><span className="text-emerald-400">ButtonProps </span><span className="text-zinc-400">{'{'}</span></p>
                    <p className="pl-4"><span className="text-sky-300">label</span><span className="text-zinc-400">: string</span></p>
                    <p className="pl-4"><span className="text-sky-300">onClick</span><span className="text-zinc-400">: () =&gt; void</span></p>
                    <p className="pl-4"><span className="text-sky-300">variant</span><span className="text-zinc-400">?: </span><span className="text-amber-400">'primary' | 'danger'</span><span className="text-zinc-500">  // optional prop</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-2"><span className="text-blue-400">export function </span><span className="text-emerald-400">Button</span><span className="text-zinc-400">({'{ label, onClick, variant = '}</span><span className="text-amber-400">'primary'</span><span className="text-zinc-400"> {'}'}: ButtonProps) {'{'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-sky-300">styles</span><span className="text-zinc-400"> = variant === </span><span className="text-amber-400">'danger'</span><span className="text-zinc-400"> ? </span><span className="text-amber-400">'bg-red-500'</span><span className="text-zinc-400"> : </span><span className="text-amber-400">'bg-orange-500'</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-emerald-300">{'<button'}</span><span className="text-sky-300"> onClick</span><span className="text-zinc-400">={'{'}onClick{'}'} </span><span className="text-sky-300">className</span><span className="text-zinc-400">={`{\`\${styles} text-white px-4 py-2 rounded\`}`}</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-8"><span className="text-zinc-400">{'{'}</span><span className="text-sky-300">label</span><span className="text-zinc-400">{'}'}</span></p>
                    <p className="pl-4"><span className="text-emerald-300">{'</button>'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-3"><span className="text-zinc-500">// Now you can use it in different ways</span></p>
                    <p><span className="text-emerald-300">{'<Button'}</span><span className="text-sky-300"> label</span><span className="text-zinc-400">=</span><span className="text-amber-400">"Save"</span><span className="text-sky-300"> onClick</span><span className="text-zinc-400">={'{'}handleSave{'}'} </span><span className="text-emerald-300">{'/>'}</span></p>
                    <p><span className="text-emerald-300">{'<Button'}</span><span className="text-sky-300"> label</span><span className="text-zinc-400">=</span><span className="text-amber-400">"Delete"</span><span className="text-sky-300"> onClick</span><span className="text-zinc-400">={'{'}handleDelete{'}'} </span><span className="text-sky-300">variant</span><span className="text-zinc-400">=</span><span className="text-amber-400">"danger"</span><span className="text-emerald-300"> {'/>'}</span></p>
                </div>
            </div>

            <LectureP>
                The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">?</code> in the TypeScript interface marks a prop as optional. When a prop is optional, you can provide a default value in the function signature using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">= 'primary'</code>. This is a pattern you'll use constantly.
            </LectureP>

            <LectureSubHeading title="The data flow rule" />
            <LectureP>
                Props flow <strong className="text-foreground">down</strong> — from parent to child. A parent component owns its data and passes relevant pieces to its children. Children can never directly modify their parent's data. To communicate back up, the parent passes a <em>callback function</em> as a prop, and the child calls it when something happens.
            </LectureP>

            <PropsFlowDiagram />

            <LectureCallout type="tip">
                The "data down, events up" pattern is the foundation of React architecture. If you find yourself trying to pass data upward through props, that's a sign the state should be lifted to a common ancestor — or moved into a global state solution like Context.
            </LectureCallout>

            {/* ── 04 STATE WITH USESTATE ──────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="State with useState" />

            <LectureP>
                <LectureTerm>State</LectureTerm> is data that can change over time and, when it changes, causes the component to re-render. The <LectureCmd tip="useState — the most fundamental React hook. Takes an initial value and returns a pair: the current state value and a setter function. When you call the setter, React re-renders the component with the new value.">useState</LectureCmd> hook is how you add state to a functional component.
            </LectureP>

            <UseStateDiagram />

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    Counter.tsx — useState in action
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">import </span><span className="text-zinc-400">{'{ '}</span><span className="text-sky-300">useState</span><span className="text-zinc-400">{' }'}</span><span className="text-blue-400"> from </span><span className="text-amber-400">'react'</span></p>
                    <p className="mt-2"><span className="text-blue-400">export function </span><span className="text-emerald-400">Counter</span><span className="text-zinc-400">() {'{'}</span></p>
                    <p className="pl-4"><span className="text-zinc-500">// [currentValue, setterFunction] = useState(initialValue)</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">[</span><span className="text-sky-300">count</span><span className="text-zinc-400">, </span><span className="text-sky-300">setCount</span><span className="text-zinc-400">] = </span><span className="text-emerald-400">useState</span><span className="text-zinc-400">(0)</span></p>
                    <p className="mt-2 pl-4"><span className="text-blue-400">return </span><span className="text-zinc-400">{'('}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'<div>'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<p>'}</span><span className="text-zinc-400">Count: {'{'}</span><span className="text-sky-300">count</span><span className="text-zinc-400">{'}'}</span><span className="text-emerald-300">{'</p>'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<button'}</span><span className="text-sky-300"> onClick</span><span className="text-zinc-400">={'{() => '}</span><span className="text-sky-300">setCount</span><span className="text-zinc-400">{'(count + 1)}'}</span><span className="text-emerald-300">{'>'}</span><span className="text-zinc-400">+</span><span className="text-emerald-300">{'</button>'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<button'}</span><span className="text-sky-300"> onClick</span><span className="text-zinc-400">={'{() => '}</span><span className="text-sky-300">setCount</span><span className="text-zinc-400">{'(count - 1)}'}</span><span className="text-emerald-300">{'>'}</span><span className="text-zinc-400">-</span><span className="text-emerald-300">{'</button>'}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'</div>'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{')'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                </div>
            </div>

            <LectureP>
                A critical rule: <strong className="text-foreground">never mutate state directly.</strong> Always use the setter function. React needs to know state changed in order to re-render. If you do <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">count++</code> directly, React has no idea the value changed and the UI won't update.
            </LectureP>

            <LectureCallout type="warning">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">setState</code> is asynchronous: React may batch multiple updates into one re-render. Don't read state immediately after calling the setter and expect the new value — use the value from the next render or the functional form: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">setCount(c =&gt; c + 1)</code> when the new state depends on the previous one.
            </LectureCallout>

            <LectureSubHeading title="State with arrays and objects" />
            <LectureP>
                When your state is an array or object, you need to create a new one instead of modifying the existing one. React uses reference equality to detect changes — if the reference is the same object, it assumes nothing changed.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    state mutations — right vs wrong
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-3 select-none">
                    <div>
                        <p className="text-rose-400 mb-1">{`// ❌ Wrong — mutates the existing array`}</p>
                        <p className="text-zinc-400">{'tasks.push(newTask)  // React doesn\'t see this change'}</p>
                        <p className="text-zinc-400">{'setTasks(tasks)      // same reference — no re-render'}</p>
                    </div>
                    <div>
                        <p className="text-emerald-400 mb-1">{`// ✅ Right — creates a new array`}</p>
                        <p className="text-zinc-400">{'setTasks([...tasks, newTask])  // spread creates a new array'}</p>
                    </div>
                    <div>
                        <p className="text-rose-400 mb-1">{`// ❌ Wrong — mutates the existing object`}</p>
                        <p className="text-zinc-400">{'user.name = "Alice"'}</p>
                        <p className="text-zinc-400">{'setUser(user)'}</p>
                    </div>
                    <div>
                        <p className="text-emerald-400 mb-1">{`// ✅ Right — creates a new object`}</p>
                        <p className="text-zinc-400">{'setUser({ ...user, name: "Alice" })  // spread + override'}</p>
                    </div>
                </div>
            </div>

            {/* ── 05 USEEFFECT ────────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Side Effects with useEffect" />

            <LectureP>
                <LectureCmd tip="useEffect — runs code after React renders the component. Used for anything that needs to happen 'outside' of rendering: fetching data, setting up subscriptions, updating the document title, timers. Takes a function and a dependency array.">useEffect</LectureCmd> runs code after a component renders. It's how you handle <LectureTerm>side effects</LectureTerm> — anything that reaches outside the component: fetching data from an API, setting up a timer, syncing with localStorage.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    useEffect — three forms
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-4 select-none">
                    <div>
                        <p className="text-zinc-500 mb-1">{`// 1. No dependency array — runs after every render`}</p>
                        <p className="text-blue-400">{'useEffect'}<span className="text-zinc-400">{'(() => {'}</span></p>
                        <p className="text-zinc-400 pl-4">{'console.log('}<span className="text-amber-400">'rendered'</span>{')'}</p>
                        <p className="text-zinc-400">{'})'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// 2. Empty array — runs once, on mount only`}</p>
                        <p className="text-blue-400">{'useEffect'}<span className="text-zinc-400">{'(() => {'}</span></p>
                        <p className="text-zinc-400 pl-4">{'fetchData()  '}<span className="text-zinc-500">{'// like componentDidMount'}</span></p>
                        <p className="text-zinc-400">{'}, [])'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// 3. Dependency array — runs when listed values change`}</p>
                        <p className="text-blue-400">{'useEffect'}<span className="text-zinc-400">{'(() => {'}</span></p>
                        <p className="text-zinc-400 pl-4">{'document.title = '}<span className="text-amber-400">{`\`Tasks: \${tasks.length}\``}</span></p>
                        <p className="text-zinc-400">{'}, [tasks])  '}<span className="text-zinc-500">{'// re-runs whenever tasks changes'}</span></p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// Cleanup — return a function to clean up when component unmounts`}</p>
                        <p className="text-blue-400">{'useEffect'}<span className="text-zinc-400">{'(() => {'}</span></p>
                        <p className="text-zinc-400 pl-4">{'const timer = setInterval(tick, 1000)'}</p>
                        <p className="text-blue-400 pl-4">{'return'}<span className="text-zinc-400">{' () => clearInterval(timer)'}</span></p>
                        <p className="text-zinc-400">{'}, [])'}</p>
                    </div>
                </div>
            </div>

            <LectureCallout type="warning">
                The dependency array is not optional — it controls when the effect runs. Omitting it means the effect runs after every render (usually not what you want). An empty array <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">[]</code> means run once. Listing values means run when those values change. Getting this wrong is the most common source of infinite loops and stale data bugs in React.
            </LectureCallout>

            {/* ── 06 CUSTOM HOOKS ─────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Custom Hooks" />

            <LectureP>
                A <LectureTerm>custom hook</LectureTerm> is just a function whose name starts with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">use</code> and that calls other hooks inside it. Custom hooks let you extract and reuse stateful logic across components without duplicating code.
            </LectureP>
            <LectureP>
                A classic example: you need to fetch data in multiple components. Instead of copy-pasting the same <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useState</code> + <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useEffect</code> pattern everywhere, you extract it into a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useFetch</code> hook.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    useLocalStorage.ts — a practical custom hook
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">import </span><span className="text-zinc-400">{'{ '}</span><span className="text-sky-300">useState</span><span className="text-zinc-400">{' }'}</span><span className="text-blue-400"> from </span><span className="text-amber-400">'react'</span></p>
                    <p className="mt-2"><span className="text-blue-400">export function </span><span className="text-emerald-400">useLocalStorage</span><span className="text-zinc-400">{'<T>(key: string, initialValue: T) {'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const </span><span className="text-zinc-400">[</span><span className="text-sky-300">stored</span><span className="text-zinc-400">, </span><span className="text-sky-300">setStored</span><span className="text-zinc-400">] = </span><span className="text-emerald-400">useState</span><span className="text-zinc-400">{'<T>(() => {'}</span></p>
                    <p className="pl-8"><span className="text-blue-400">const </span><span className="text-sky-300">item</span><span className="text-zinc-400"> = localStorage.getItem(key)</span></p>
                    <p className="pl-8"><span className="text-blue-400">return </span><span className="text-sky-300">item</span><span className="text-zinc-400"> ? JSON.parse(</span><span className="text-sky-300">item</span><span className="text-zinc-400">) : </span><span className="text-sky-300">initialValue</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{'})'}</span></p>
                    <p className="mt-2 pl-4"><span className="text-blue-400">const </span><span className="text-sky-300">setValue</span><span className="text-zinc-400"> {'= (value: T) => {'}</span></p>
                    <p className="pl-8"><span className="text-sky-300">setStored</span><span className="text-zinc-400">(value)</span></p>
                    <p className="pl-8"><span className="text-zinc-400">localStorage.setItem(key, JSON.stringify(value))</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-2 pl-4"><span className="text-blue-400">return </span><span className="text-zinc-400">[</span><span className="text-sky-300">stored</span><span className="text-zinc-400">, </span><span className="text-sky-300">setValue</span><span className="text-zinc-400">] </span><span className="text-blue-400">as const</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                    <p className="mt-3"><span className="text-zinc-500">// Use it exactly like useState, but it persists to localStorage</span></p>
                    <p><span className="text-blue-400">const </span><span className="text-zinc-400">[</span><span className="text-sky-300">tasks</span><span className="text-zinc-400">, </span><span className="text-sky-300">setTasks</span><span className="text-zinc-400">] = </span><span className="text-emerald-400">useLocalStorage</span><span className="text-zinc-400">{'<Task[]>('}</span><span className="text-amber-400">'tasks'</span><span className="text-zinc-400">, {'[])'}</span></p>
                </div>
            </div>

            <LectureCallout type="tip">
                You'll use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">useLocalStorage</code> exactly like this in the Task Tracker activity. It's one of the most practical custom hooks you can write — persist state with zero extra effort.
            </LectureCallout>

            {/* ── 07 CONDITIONAL RENDERING AND LISTS ──────────────────────────── */}
            <LectureSectionHeading number="07" title="Conditional Rendering & Lists" />

            <LectureSubHeading title="Conditional rendering" />
            <LectureP>
                JSX is just JavaScript, so you use regular JS to conditionally show or hide elements. The two patterns you'll use most:
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    conditional rendering patterns
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-3 select-none">
                    <div>
                        <p className="text-zinc-500 mb-1">{`// Ternary — when you need to show one thing OR another`}</p>
                        <p className="text-zinc-400">{'{'}<span className="text-sky-300">isLoggedIn</span>{' ? '}<span className="text-emerald-300">{'<Dashboard />'}</span>{' : '}<span className="text-emerald-300">{'<LoginPage />'}</span>{'}'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mb-1">{`// && operator — when you only need to show something OR nothing`}</p>
                        <p className="text-zinc-400">{'{'}<span className="text-sky-300">error</span>{' && '}<span className="text-emerald-300">{'<ErrorMessage message={error} />'}</span>{'}'}</p>
                    </div>
                </div>
            </div>

            <LectureSubHeading title="Rendering lists" />
            <LectureP>
                To render a list of items, use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.map()</code> to transform an array of data into an array of JSX elements. Each element in the list needs a unique <LectureTerm>key</LectureTerm> prop — React uses this to efficiently update the DOM when the list changes.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    rendering a list with .map()
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">const </span><span className="text-sky-300">tasks</span><span className="text-zinc-400"> = [</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{'{ id: 1, title: '}</span><span className="text-amber-400">'Buy groceries'</span><span className="text-zinc-400">{', done: false },'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{'{ id: 2, title: '}</span><span className="text-amber-400">'Walk the dog'</span><span className="text-zinc-400">{', done: true },'}</span></p>
                    <p><span className="text-zinc-400">]</span></p>
                    <p className="mt-2"><span className="text-blue-400">return </span><span className="text-zinc-400">{'('}</span></p>
                    <p className="pl-4"><span className="text-emerald-300">{'<ul>'}</span></p>
                    <p className="pl-8"><span className="text-zinc-400">{'{'}</span><span className="text-sky-300">tasks</span><span className="text-zinc-400">{'.map(task => ('}</span></p>
                    <p className="pl-12"><span className="text-zinc-500">{'// key must be unique and stable — use an id, not an index'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<li'}</span><span className="text-sky-300"> key</span><span className="text-zinc-400">={'{'}task.id{'}'} </span><span className="text-sky-300">className</span><span className="text-zinc-400">={'{'}task.done ? <span className="text-amber-400">'line-through'</span> : <span className="text-amber-400">''</span>{'}'}</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-16"><span className="text-zinc-400">{'{'}</span><span className="text-sky-300">task</span><span className="text-zinc-400">.title{'}'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'</li>'}</span></p>
                    <p className="pl-8"><span className="text-zinc-400">{'))'}</span></p>
                    <p className="pl-8"><span className="text-zinc-400">{'}'}</span></p>
                    <p className="pl-4"><span className="text-emerald-300">{'</ul>'}</span></p>
                    <p><span className="text-zinc-400">{')'}</span></p>
                </div>
            </div>

            <LectureCallout type="warning">
                Don't use array index as the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">key</code> prop if the list can be reordered or filtered. If the item at index 0 changes, React gets confused. Always use a stable, unique identifier from your data — like an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">id</code> field.
            </LectureCallout>

            {/* ── 08 COMPONENT COMPOSITION ────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Component Composition" />

            <LectureP>
                The most important skill in React isn't knowing the APIs — it's knowing how to break a UI into the right components. A good rule of thumb: a component should do one thing. If it's getting long or complex, split it up.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'create a new Vite + React + TypeScript project', cmd: 'npm create vite@latest my-app -- --template react-ts' },
                    { cmd: 'cd my-app && npm install' },
                    { cmd: 'npm run dev' },
                ]}
            />

            <LectureP>
                This scaffolds a complete project with React, TypeScript, and Vite already configured. Open <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">src/App.tsx</code> and start there. Delete the boilerplate and build your own component tree. In the activity, you'll build a full Task Tracker from scratch using exactly the concepts covered today.
            </LectureP>

            <LectureCallout type="tip">
                A good exercise before the activity: sketch your component tree on paper first. What are the top-level components? What data does each one need? What events does each one emit? Planning the structure before coding saves enormous time.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Build Your Backend',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/activity'),
                }}
                next={{
                    label: 'Tailwind CSS & Connecting to Your API',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-5/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}
