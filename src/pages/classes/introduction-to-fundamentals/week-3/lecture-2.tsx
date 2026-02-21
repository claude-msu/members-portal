import { useNavigate } from 'react-router-dom';
import { Paintbrush } from 'lucide-react';
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

// ── Live class preview card ───────────────────────────────────────────────────
const TailwindPreview = ({
    label,
    className,
    code,
}: {
    label: string;
    className: string;
    code: string;
}) => (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-6 flex items-center justify-center bg-muted/30 min-h-[80px]">
            <div className={className}>{label}</div>
        </div>
        <div className="px-4 py-2 border-t border-border bg-zinc-950">
            <code className="text-xs text-emerald-400 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                {code}
            </code>
        </div>
    </div>
);

export default function Week3Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={3}
                session="Lecture 2"
                title="Tailwind CSS"
                description="Traditional CSS requires you to name things, context-switch between files, and mentally map class names to their styles. Tailwind eliminates all of that — you style directly in your markup with utility classes that do exactly one thing. Once it clicks, you'll never want to write traditional CSS again."
                icon={<Paintbrush className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                onBack={() => navigate('/classes/introduction-to-fundamentals')}
            />

            {/* ── 01 THE UTILITY CLASS MODEL ──────────────────────────────────── */}
            <LectureSectionHeading number="01" title="The Utility Class Model" />

            <LectureP>
                In traditional CSS, you write a class name, define it in a stylesheet, and apply it to elements. Tailwind inverts this: instead of writing custom CSS, you compose styles by applying small, single-purpose utility classes directly to your HTML elements.
            </LectureP>
            <LectureP>
                Every Tailwind class does exactly one thing. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">p-4</code> adds padding. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">text-blue-500</code> sets the text color. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">rounded-lg</code> rounds the corners. You describe a component's appearance by stacking these utilities together.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    traditional CSS vs Tailwind
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-4 select-none">
                    <div>
                        <p className="text-rose-400 mb-2">{`// Traditional — write CSS in a separate file, apply a class name`}</p>
                        <p className="text-zinc-500">{`.card {`}</p>
                        <p className="text-zinc-500 pl-4">{`background: white;`}</p>
                        <p className="text-zinc-500 pl-4">{`border-radius: 8px;`}</p>
                        <p className="text-zinc-500 pl-4">{`padding: 16px;`}</p>
                        <p className="text-zinc-500 pl-4">{`box-shadow: 0 1px 3px rgba(0,0,0,0.1);`}</p>
                        <p className="text-zinc-500">{`}`}</p>
                        <p className="text-emerald-300 mt-1">{`<div class="card">...</div>`}</p>
                    </div>
                    <div>
                        <p className="text-emerald-400 mb-2">{`// Tailwind — styles live directly in the element`}</p>
                        <p className="text-emerald-300">{`<div class="bg-white rounded-lg p-4 shadow-sm">...</div>`}</p>
                    </div>
                </div>
            </div>

            <LectureP>
                The tradeoff is real: Tailwind markup is more verbose. But you get enormous benefits in return. No naming things (notoriously hard). No stylesheet bloat — unused classes are automatically purged from your production build. No context-switching between files. And no specificity wars — utility classes have the same specificity, so the one you write last wins.
            </LectureP>

            <LectureCallout type="info">
                Tailwind generates CSS at build time by scanning your source files for class names and including only the ones you actually use. A production Tailwind CSS bundle is typically just a few KB regardless of how many utilities you use.
            </LectureCallout>

            {/* ── 02 THE SCALE SYSTEM ─────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="The Scale System" />

            <LectureP>
                Tailwind uses a consistent numeric scale for spacing, sizing, and more. The base unit is <strong className="text-foreground">4px</strong>, so <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">1 = 4px</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">2 = 8px</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">4 = 16px</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">8 = 32px</code>, and so on. This gives your UI inherent visual consistency — everything aligns to the same grid.
            </LectureP>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    { category: 'Spacing (padding / margin)', classes: ['p-1 (4px)', 'p-2 (8px)', 'p-4 (16px)', 'p-8 (32px)', 'p-16 (64px)'], prefix: 'p- / m- / gap-' },
                    { category: 'Font size', classes: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'], prefix: 'text-' },
                    { category: 'Border radius', classes: ['rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full'], prefix: 'rounded-' },
                    { category: 'Font weight', classes: ['font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-black'], prefix: 'font-' },
                ].map((group) => (
                    <div key={group.category} className="rounded-lg border border-border bg-card p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.category}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-mono mb-2">{group.prefix}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {group.classes.map((cls) => (
                                <code key={cls} className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                                    {cls}
                                </code>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 03 COLOR SYSTEM ─────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="The Color System" />

            <LectureP>
                Tailwind ships with a comprehensive color palette. Every color has a name and a numeric shade from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">50</code> (near-white) to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">950</code> (near-black). Colors can be applied to text (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">text-</code>), backgrounds (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bg-</code>), borders (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">border-</code>), and more.
            </LectureP>

            <div className="my-6 rounded-xl border border-border overflow-hidden">
                {(['slate', 'orange', 'blue', 'emerald', 'rose', 'amber'] as const).map((color) => (
                    <div key={color} className="flex items-center border-b border-border last:border-b-0">
                        <div className="w-20 px-3 py-2 text-xs font-mono text-muted-foreground shrink-0">{color}</div>
                        <div className="flex flex-1">
                            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                                <div
                                    key={shade}
                                    className={`flex-1 h-8 bg-${color}-${shade}`}
                                    title={`${color}-${shade}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <LectureP>
                For any color you want to apply, the formula is <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'{property}-{color}-{shade}'}</code>. For example: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">text-blue-600</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bg-orange-100</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">border-slate-200</code>. You can also add opacity with a slash: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bg-blue-500/20</code> gives you blue at 20% opacity.
            </LectureP>

            {/* ── 04 LAYOUT: FLEXBOX AND GRID ─────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Layout: Flexbox & Grid" />

            <LectureP>
                The two layout systems you'll use for 95% of layouts in Tailwind are <LectureTerm>Flexbox</LectureTerm> and <LectureTerm>CSS Grid</LectureTerm>. Tailwind makes both extremely easy to work with.
            </LectureP>

            <LectureSubHeading title="Flexbox" />

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TailwindPreview
                    label="flex items-center justify-between"
                    className="flex items-center justify-between w-full bg-muted rounded p-3 text-xs font-mono"
                    code="flex items-center justify-between"
                />
                <TailwindPreview
                    label="flex flex-col gap-2"
                    className="flex flex-col gap-2 text-xs font-mono"
                    code="flex flex-col gap-2"
                />
            </div>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    common flexbox classes
                </div>
                <div className="bg-zinc-950 px-5 py-4 select-none">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {[
                            ['flex', 'enable flexbox'],
                            ['flex-col', 'stack vertically'],
                            ['items-center', 'align on cross axis'],
                            ['justify-center', 'align on main axis'],
                            ['justify-between', 'space between items'],
                            ['gap-4', 'gap between items (16px)'],
                            ['flex-1', 'grow to fill available space'],
                            ['shrink-0', 'prevent shrinking'],
                            ['flex-wrap', 'wrap to next line'],
                            ['items-start', 'align to start of cross axis'],
                        ].map(([cls, desc]) => (
                            <div key={cls} className="flex gap-2">
                                <code className="text-emerald-400 w-32 shrink-0">{cls}</code>
                                <span className="text-zinc-500">{desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <LectureSubHeading title="Grid" />
            <LectureP>
                CSS Grid is perfect for two-dimensional layouts. Tailwind's grid utilities map directly to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">grid-template-columns</code> and related properties.
            </LectureP>

            <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    grid classes
                </div>
                <div className="bg-zinc-950 px-5 py-4 select-none">
                    <div className="space-y-2">
                        {[
                            ['grid grid-cols-3 gap-4', '3 equal columns with 16px gap'],
                            ['grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 'responsive: 1→2→3 columns'],
                            ['col-span-2', 'span 2 columns'],
                            ['grid-cols-[1fr_2fr]', 'custom column widths (arbitrary value)'],
                        ].map(([cls, desc]) => (
                            <div key={cls} className="flex gap-3 flex-wrap">
                                <code className="text-emerald-400">{cls}</code>
                                <span className="text-zinc-500">— {desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 05 RESPONSIVE DESIGN ────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Responsive Design" />

            <LectureP>
                Tailwind is <LectureTerm>mobile-first</LectureTerm>. Classes without a prefix apply to all screen sizes. Breakpoint prefixes (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">sm:</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">md:</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">lg:</code>) apply the style <em>only at that size and above</em>. You build the mobile layout first, then add overrides for larger screens.
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 p-5">
                <div className="grid grid-cols-4 gap-2 text-xs font-mono text-center">
                    {[
                        { prefix: '(none)', min: '0px', label: 'All screens', color: 'text-foreground' },
                        { prefix: 'sm:', min: '640px', label: 'Small+', color: 'text-blue-600 dark:text-blue-400' },
                        { prefix: 'md:', min: '768px', label: 'Medium+', color: 'text-emerald-600 dark:text-emerald-400' },
                        { prefix: 'lg:', min: '1024px', label: 'Large+', color: 'text-orange-600 dark:text-orange-400' },
                    ].map((bp) => (
                        <div key={bp.prefix} className="rounded-lg border border-border bg-card p-3">
                            <code className={`font-bold ${bp.color}`}>{bp.prefix}</code>
                            <p className="text-muted-foreground mt-1">{bp.min}</p>
                            <p className="text-muted-foreground text-xs">{bp.label}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-xs text-emerald-400 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                    {`<div class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">`}
                </div>
                <p className="text-xs text-muted-foreground mt-2">1 column on mobile → 2 on small → 4 on large</p>
            </div>

            <LectureCallout type="tip">
                Resize your browser window while building and check your layout at every breakpoint. Tailwind's breakpoints map closely to real device widths: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">sm</code> ≈ landscape phone, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">md</code> ≈ tablet, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">lg</code> ≈ laptop.
            </LectureCallout>

            {/* ── 06 STATE VARIANTS ───────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="State Variants" />

            <LectureP>
                Tailwind can apply styles conditionally based on element state using <LectureTerm>variants</LectureTerm> — prefixes that correspond to CSS pseudo-classes. The pattern is the same as responsive prefixes: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">variant:class</code>.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    common state variants
                </div>
                <div className="bg-zinc-950 px-5 py-4 select-none">
                    <div className="space-y-2">
                        {[
                            ['hover:bg-blue-600', 'apply on mouse hover'],
                            ['focus:ring-2 focus:ring-blue-500', 'apply when element is focused'],
                            ['active:scale-95', 'apply while being clicked'],
                            ['disabled:opacity-50 disabled:cursor-not-allowed', 'apply when input/button is disabled'],
                            ['dark:bg-zinc-900', 'apply in dark mode'],
                            ['group-hover:text-blue-500', 'apply when a parent with "group" class is hovered'],
                        ].map(([cls, desc]) => (
                            <div key={cls} className="flex gap-3 flex-wrap items-start">
                                <code className="text-emerald-400 shrink-0">{cls}</code>
                                <span className="text-zinc-500">— {desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <LectureP>
                The <LectureCmd tip="group in Tailwind: add 'group' to a parent element, then use 'group-hover:' on children to apply styles when the parent is hovered. Useful for cards where hovering the card changes the appearance of text inside it.">group</LectureCmd> pattern is particularly powerful for cards. Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">group</code> to the card container, then use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">group-hover:</code> on any child elements you want to change when the card is hovered.
            </LectureP>

            {/* ── 07 DYNAMIC CLASSES IN REACT ─────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Dynamic Classes in React" />

            <LectureP>
                Combining Tailwind with React state lets you style components dynamically. The key rule: <strong className="text-foreground">always write complete class names</strong>. Don't try to construct them from fragments at runtime — Tailwind's build tool scans for complete class strings, and if it never sees <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">text-red-500</code> written out fully, it won't include it in the output.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    dynamic classes — right vs wrong
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-4 select-none">
                    <div>
                        <p className="text-rose-400 mb-1">{`// ❌ Broken — Tailwind never sees the full class name`}</p>
                        <p className="text-zinc-400">{`const color = isError ? 'red' : 'green'`}</p>
                        <p className="text-zinc-400">{`<p className={\`text-\${color}-500\`}>`}</p>
                    </div>
                    <div>
                        <p className="text-emerald-400 mb-1">{`// ✅ Correct — full class names are always present in source`}</p>
                        <p className="text-zinc-400">{`<p className={isError ? 'text-red-500' : 'text-green-500'}>`}</p>
                    </div>
                    <div>
                        <p className="text-emerald-400 mb-1">{`// ✅ Also correct — use cn() for complex conditional merging`}</p>
                        <p className="text-zinc-400">{`import { cn } from '@/lib/utils'`}</p>
                        <p className="text-zinc-400 mt-1">{`<button className={cn(`}</p>
                        <p className="text-zinc-400 pl-4">{`'px-4 py-2 rounded font-medium',`}</p>
                        <p className="text-zinc-400 pl-4">{`variant === 'primary' && 'bg-orange-500 text-white',`}</p>
                        <p className="text-zinc-400 pl-4">{`variant === 'ghost' && 'bg-transparent hover:bg-muted',`}</p>
                        <p className="text-zinc-400 pl-4">{`disabled && 'opacity-50 cursor-not-allowed'`}</p>
                        <p className="text-zinc-400">{`)}>`}</p>
                    </div>
                </div>
            </div>

            <LectureP>
                The <LectureCmd tip="cn() — a utility function from @/lib/utils that combines clsx (conditional class joining) and tailwind-merge (deduplication of conflicting Tailwind classes). The standard pattern for dynamic Tailwind classes in a React + shadcn project.">cn()</LectureCmd> function (from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">@/lib/utils</code>) is already in this project and is the standard way to handle dynamic classes. It merges class strings and intelligently resolves conflicts — so if you pass both <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">px-4</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">px-8</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">px-8</code> wins.
            </LectureP>

            {/* ── 08 BUILDING A COMPONENT ─────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Putting It Together: A Task Card" />

            <LectureP>
                Here's what a fully styled task card looks like combining everything from this lecture. Study the class breakdown before the activity.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    TaskCard.tsx — fully styled with Tailwind
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-blue-400">interface </span><span className="text-emerald-400">TaskCardProps </span><span className="text-zinc-400">{'{ title: string; done: boolean; onToggle: () => void }'}</span></p>
                    <p className="mt-2"><span className="text-blue-400">export function </span><span className="text-emerald-400">TaskCard</span><span className="text-zinc-400">{'({ title, done, onToggle }: TaskCardProps) {'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">return </span><span className="text-zinc-400">{'('}</span></p>
                    <p className="pl-8"><span className="text-zinc-500">{`{/* card container */}`}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'<div'}</span><span className="text-sky-300"> className</span><span className="text-zinc-400">=</span><span className="text-amber-400">"group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-12"><span className="text-zinc-500">{`{/* checkbox */}`}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<button'}</span></p>
                    <p className="pl-16"><span className="text-sky-300">onClick</span><span className="text-zinc-400">={'{onToggle}'}</span></p>
                    <p className="pl-16"><span className="text-sky-300">className</span><span className="text-zinc-400">=</span><span className="text-amber-400">"w-5 h-5 rounded border-2 border-muted-foreground/30 shrink-0 flex items-center justify-center hover:border-orange-500 transition-colors"</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-16"><span className="text-zinc-400">{'{'}</span><span className="text-sky-300">done</span><span className="text-zinc-400"> && <span className="text-emerald-300">{'<Check'}</span><span className="text-sky-300"> className</span><span className="text-zinc-400">=</span><span className="text-amber-400">"h-3 w-3 text-orange-500"</span><span className="text-emerald-300"> {'/>'}</span>{'}'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'</button>'}</span></p>
                    <p className="pl-12"><span className="text-zinc-500">{`{/* title */}`}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'<p'}</span><span className="text-sky-300"> className</span><span className="text-zinc-400">={'{cn('}</span><span className="text-amber-400">'text-sm flex-1'</span><span className="text-zinc-400">, </span><span className="text-sky-300">done</span><span className="text-zinc-400"> && </span><span className="text-amber-400">'line-through text-muted-foreground'</span><span className="text-zinc-400">{')}'}</span><span className="text-emerald-300">{'>'}</span></p>
                    <p className="pl-16"><span className="text-zinc-400">{'{'}</span><span className="text-sky-300">title</span><span className="text-zinc-400">{'}'}</span></p>
                    <p className="pl-12"><span className="text-emerald-300">{'</p>'}</span></p>
                    <p className="pl-8"><span className="text-emerald-300">{'</div>'}</span></p>
                    <p className="pl-4"><span className="text-zinc-400">{')'}</span></p>
                    <p><span className="text-zinc-400">{'}'}</span></p>
                </div>
            </div>

            <LectureP>
                Notice how each class is purposeful: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">group</code> enables child hover targeting, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">flex items-center gap-3</code> lays out the row, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">transition-shadow</code> makes the hover effect smooth, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">cn()</code> handles the conditional strikethrough. No custom CSS written anywhere.
            </LectureP>

            <LectureCallout type="tip">
                Install the <strong className="text-foreground">Tailwind CSS IntelliSense</strong> extension in VS Code. It autocompletes class names, shows the underlying CSS on hover, and highlights invalid classes. It's effectively required for productive Tailwind development.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'React Components & Hooks',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/lecture-1'),
                }}
                next={{
                    label: 'Build the Task Tracker',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/activity'),
                }}
            />
        </LectureLayout>
    );
}