import { useNavigate } from 'react-router-dom';
import { Workflow } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';
import { CodeBlock } from '@/components/ui/code-block';
import { FlowDiagram } from '@/components/ui/flow-diagram';

export default function Week8Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={8}
                session="Lecture 2"
                title="CI/CD, TDD & Engineering Culture"
                description="Agile ceremonies are the meeting structure. CI/CD and TDD are the technical practices that make continuous delivery safe. And engineering culture is what determines whether any of it actually works. This is the final lecture — it's also the one most likely to affect your first six months at a real company."
                icon={<Workflow className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
            />

            {/* ── 01 CI/CD ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="CI/CD — Continuous Integration & Continuous Delivery" />

            <LectureP>
                <LectureTerm>Continuous Integration</LectureTerm> (CI) means every code change is automatically built and tested the moment it's pushed. <LectureTerm>Continuous Delivery</LectureTerm> (CD) means that if those tests pass, the change can be deployed to production automatically — or with a single click. Together, CI/CD turns deployment from a stressful quarterly event into a routine daily activity.
            </LectureP>
            <LectureP>
                The business case is simple: small, frequent deployments are safer than large, infrequent ones. A change that touches 50 lines is easy to debug when something breaks. A change that touches 5,000 lines deployed once a quarter is a nightmare. CI/CD enforces small, reviewed, tested increments.
            </LectureP>

            <FlowDiagram
                stages={[
                    { label: 'Push', icon: '↑', desc: 'Developer pushes to GitHub', color: 'text-zinc-500', bg: 'bg-muted/50 border-border' },
                    { label: 'Lint', icon: '✦', desc: 'ESLint / tsc check', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
                    { label: 'Test', icon: '✓', desc: 'Unit + integration tests', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' },
                    { label: 'Build', icon: '⬡', desc: 'Compile + bundle', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800' },
                    { label: 'Deploy', icon: '→', desc: 'Ship to production', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
                ]}
                description="Any stage failing blocks deployment automatically. A broken lint check is as much a blocker as a broken test — the pipeline enforces standards without relying on human memory."
            />

            <LectureSubHeading title="GitHub Actions — CI/CD in your repo" />
            <LectureP>
                GitHub Actions is the most common CI/CD tool for projects hosted on GitHub. Workflows live in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/workflows/</code> as YAML files and run on GitHub's infrastructure — free for public repos, 2,000 minutes/month for free tier private repos.
            </LectureP>

            <CodeBlock
                title=".github/workflows/ci.yml — complete pipeline"
                lines={[
                    { text: 'name: CI' },
                    { text: '' },
                    { text: 'on:' },
                    { text: '  push:' },
                    { text: '    branches: [main, develop]' },
                    { text: '  pull_request:' },
                    { text: '    branches: [main]' },
                    { text: '' },
                    { text: 'jobs:' },
                    { text: '  ci:' },
                    { text: '    runs-on: ubuntu-latest' },
                    { text: '    steps:' },
                    { text: '      - uses: actions/checkout@v4' },
                    { text: '' },
                    { text: '      - name: Setup Node.js' },
                    { text: '        uses: actions/setup-node@v4' },
                    { text: '        with:' },
                    { text: '          node-version: \'20\'' },
                    { text: '          cache: \'npm\'' },
                    { text: '' },
                    { text: '      - name: Install dependencies' },
                    { text: '        run: npm ci' },
                    { text: '' },
                    { text: '      - name: Type check' },
                    { text: '        run: npm run tsc --noEmit' },
                    { text: '' },
                    { text: '      - name: Lint' },
                    { text: '        run: npm run lint' },
                    { text: '' },
                    { text: '      - name: Test' },
                    { text: '        run: npm run test -- --coverage' },
                    { text: '' },
                    { text: '      - name: Build' },
                    { text: '        run: npm run build' },
                ]}
            />

            <LectureCallout type="info">
                Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm ci</code> (not <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install</code>) in CI pipelines. It installs exactly what's in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package-lock.json</code> without modifying it, runs faster, and fails if the lockfile is out of sync — preventing "works on my machine" dependency drift.
            </LectureCallout>

            {/* ── 02 BRANCH PROTECTION ────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Branch Protection Rules" />

            <LectureP>
                A CI pipeline is only effective if merging broken code is actually prevented. <LectureTerm>Branch protection rules</LectureTerm> on GitHub enforce this: certain branches (typically <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>) can only receive code through pull requests, and only after all required checks pass.
            </LectureP>

            <div className="my-6 space-y-2">
                {[
                    { rule: 'Require pull request before merging', why: 'No direct pushes to main. Every change gets reviewed.' },
                    { rule: 'Require status checks to pass', why: 'CI must go green — lint, tests, build — before the merge button is clickable.' },
                    { rule: 'Require at least 1 approving review', why: 'A second pair of eyes catches bugs and knowledge silos. Reviewers learn the codebase as a side effect.' },
                    { rule: 'Dismiss stale reviews on new commits', why: 'A new push after approval invalidates old approvals — you have to re-review the updated diff.' },
                    { rule: 'Require branches to be up to date', why: 'Can\'t merge a branch that\'s behind main — prevents "merge race" bugs where two PRs conflict only after both land.' },
                ].map((item) => (
                    <div key={item.rule} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                        <span className="text-emerald-500 shrink-0 mt-0.5 text-sm">✓</span>
                        <div>
                            <p className="text-xs font-semibold text-foreground">{item.rule}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.why}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 03 TDD ──────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Test-Driven Development" />

            <LectureP>
                <LectureTerm>Test-Driven Development</LectureTerm> (TDD) inverts the usual order: write the test first, watch it fail, then write the code to make it pass. The loop is: <span className="text-rose-500 font-semibold">Red</span> (test fails) → <span className="text-emerald-500 font-semibold">Green</span> (make it pass) → <span className="text-blue-500 font-semibold">Refactor</span> (clean up without breaking it).
            </LectureP>
            <LectureP>
                TDD sounds backwards. It feels backwards at first. The payoff: you write exactly as much code as the tests require — no more. Your design emerges from usage, not speculation. And you end up with a test suite that covers every feature by construction, because you never wrote a feature without a test.
            </LectureP>

            <div className="my-6 flex items-center justify-center gap-4">
                {[
                    { label: '① Red', sub: 'Write a failing test', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800' },
                    { label: '→', sub: '', color: 'text-muted-foreground', bg: '' },
                    { label: '② Green', sub: 'Make it pass', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
                    { label: '→', sub: '', color: 'text-muted-foreground', bg: '' },
                    { label: '③ Refactor', sub: 'Clean without breaking', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
                ].map((item, i) => (
                    item.bg ? (
                        <div key={i} className={`rounded-xl border px-4 py-3 text-center ${item.bg}`}>
                            <p className={`text-xs font-bold ${item.color}`}>{item.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                        </div>
                    ) : (
                        <span key={i} className={`text-lg font-bold ${item.color} select-none`}>{item.label}</span>
                    )
                ))}
            </div>

            <LectureSubHeading title="Writing tests with Vitest" />

            <CodeBlock
                title="src/lib/cart.test.ts — TDD style: test first"
                lines={[
                    { text: 'import { describe, it, expect } from \'vitest\'' },
                    { text: 'import { Cart } from \'./cart\'' },
                    { text: '' },
                    { text: 'describe(\'Cart\', () => {' },
                    { text: '  it(\'starts empty\', () => {' },
                    { text: '    const cart = new Cart()' },
                    { text: '    expect(cart.total()).toBe(0)' },
                    { text: '    expect(cart.items()).toHaveLength(0)' },
                    { text: '  })' },
                    { text: '' },
                    { text: '  it(\'adds items and updates total\', () => {' },
                    { text: '    const cart = new Cart()' },
                    { text: '    cart.add({ id: \'a\', name: \'Book\', price: 12.99 })' },
                    { text: '    cart.add({ id: \'b\', name: \'Pen\', price: 1.50 })' },
                    { text: '    expect(cart.total()).toBeCloseTo(14.49)' },
                    { text: '    expect(cart.items()).toHaveLength(2)' },
                    { text: '  })' },
                    { text: '' },
                    { text: '  it(\'removes items\', () => {' },
                    { text: '    const cart = new Cart()' },
                    { text: '    cart.add({ id: \'a\', name: \'Book\', price: 12.99 })' },
                    { text: '    cart.remove(\'a\')' },
                    { text: '    expect(cart.items()).toHaveLength(0)' },
                    { text: '  })' },
                    { text: '' },
                    { text: '  it(\'does not add duplicates — increases quantity instead\', () => {' },
                    { text: '    const cart = new Cart()' },
                    { text: '    cart.add({ id: \'a\', name: \'Book\', price: 12.99 })' },
                    { text: '    cart.add({ id: \'a\', name: \'Book\', price: 12.99 })' },
                    { text: '    expect(cart.items()).toHaveLength(1)' },
                    { text: '    expect(cart.items()[0].quantity).toBe(2)' },
                    { text: '  })' },
                    { text: '})' },
                ]}
            />

            <LectureCallout type="tip">
                The test names are the spec. Read them top to bottom and you understand exactly what <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Cart</code> is supposed to do — without reading the implementation. Good test names are documentation that never goes out of date.
            </LectureCallout>

            <LectureSubHeading title="What to test — and what not to" />

            <div className="my-6 rounded-xl border border-border overflow-hidden text-xs">
                <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-4">
                        <p className="font-semibold text-foreground mb-2.5">✅ Test this</p>
                        <div className="space-y-2">
                            {[
                                'Business logic — calculation, transformation, validation',
                                'Edge cases — empty input, nulls, boundary values',
                                'Error paths — what happens when things go wrong',
                                'Public API of a module — the interface, not internals',
                            ].map((item) => <p key={item} className="text-muted-foreground leading-relaxed">{item}</p>)}
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="font-semibold text-foreground mb-2.5">❌ Don't test this</p>
                        <div className="space-y-2">
                            {[
                                'Implementation details — private methods, internal state',
                                'Third-party libraries — they have their own tests',
                                'Simple getters/setters with no logic',
                                'Things that require complex mocking to set up — usually a design smell',
                            ].map((item) => <p key={item} className="text-muted-foreground leading-relaxed">{item}</p>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 04 CODE REVIEW ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Code Review — The Most Underrated Practice" />

            <LectureP>
                Code review is the primary mechanism for knowledge transfer on a team. It's how junior engineers learn from seniors, how seniors learn the codebase, and how the team maintains shared standards. A team that skips code review is a team where knowledge siloes form, where bugs ship that a second pair of eyes would have caught, and where no one grows.
            </LectureP>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border bg-muted/30">
                        <p className="text-xs font-bold text-foreground">Writing good PRs</p>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                        {[
                            { title: 'Keep them small', desc: 'Under 400 lines of diff. Reviewers lose focus on large PRs — bugs slip through.' },
                            { title: 'Write a description', desc: 'What changed, why, and how to test it. A PR with no description gets superficial review.' },
                            { title: 'Link the issue', desc: '"Closes #42" — connects the PR to the user story it implements.' },
                            { title: 'Self-review first', desc: 'Read your own diff before requesting review. You\'ll catch 30% of issues yourself.' },
                        ].map((item) => (
                            <div key={item.title}>
                                <p className="text-xs font-semibold text-foreground">{item.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border bg-muted/30">
                        <p className="text-xs font-bold text-foreground">Giving good reviews</p>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                        {[
                            { title: 'Ask questions, not accusations', desc: '"What happens if this list is empty?" not "You forgot to handle empty lists."' },
                            { title: 'Distinguish blocking vs non-blocking', desc: '"Nit: rename this variable" vs "This will crash in production — must fix."' },
                            { title: 'Explain the why', desc: 'Don\'t just say "use a map here." Say why a map is better for this use case.' },
                            { title: 'Approve and learn', desc: 'You don\'t have to understand every line before approving. But ask about what you don\'t understand.' },
                        ].map((item) => (
                            <div key={item.title}>
                                <p className="text-xs font-semibold text-foreground">{item.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 05 ENGINEERING CULTURE ──────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Engineering Culture" />

            <LectureP>
                Every technical practice in this lecture — CI/CD, TDD, code review, retrospectives — only works in a team culture that supports it. Culture isn't a values statement on the wall. It's what actually happens when a deadline is tight and someone proposes skipping tests "just this once."
            </LectureP>

            <div className="my-6 space-y-3">
                {[
                    {
                        title: 'Blameless post-mortems',
                        color: 'text-blue-600 dark:text-blue-400',
                        desc: 'When something breaks in production, the question isn\'t "who screwed up" — it\'s "how did our system allow this to happen?" The goal is to fix the system, not punish the person. Blame-based cultures hide failures; blameless cultures learn from them.',
                    },
                    {
                        title: 'Psychological safety',
                        color: 'text-emerald-600 dark:text-emerald-400',
                        desc: 'Team members should be able to say "I don\'t understand this," "I think this is wrong," or "I made a mistake" without fear. Google\'s Project Aristotle found psychological safety was the single biggest predictor of team effectiveness — more important than individual talent.',
                    },
                    {
                        title: 'Done means done',
                        color: 'text-orange-600 dark:text-orange-400',
                        desc: '"Done" doesn\'t mean "coded." It means tested, reviewed, merged, and deployed. A feature that\'s 90% done and sitting in a PR branch has zero value to users. Finishing matters more than starting.',
                    },
                    {
                        title: 'Leave the codebase better than you found it',
                        color: 'text-purple-600 dark:text-purple-400',
                        desc: 'The Boy Scout Rule: whenever you touch a file, clean up one small thing nearby. Rename the confusing variable. Add the missing test. Remove the dead code. Codebases don\'t decay all at once — they decay in small ignored moments.',
                    },
                ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                        <p className={`text-xs font-bold mb-1 ${item.color}`}>{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* ── 06 YOUR FIRST JOB ───────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="What to Expect on Day One" />

            <LectureP>
                You've now covered the full stack of a modern software engineer: terminal fluency, version control, containerization, frontend, backend, databases, data structures, and software engineering practices. Here's what actually matters when you start a real job.
            </LectureP>

            <div className="my-6 space-y-2">
                {[
                    { label: 'Read before writing', desc: 'Spend your first two weeks understanding the existing codebase — the patterns, the conventions, the why. Code first, ask questions later is the fastest path to revert.' },
                    { label: 'Small PRs from day one', desc: 'Your first PR should be tiny and unambiguously correct. Build trust before making large changes. Ask for review, ask questions in review comments.' },
                    { label: 'Ask questions early, not late', desc: 'Asking "how does X work?" on day 3 is expected. Asking on day 30 after spinning for a week is costly. No one expects you to know everything on day one.' },
                    { label: 'Write things down', desc: 'Document what you learn about the system — in wikis, in PR descriptions, in comments. Future-you and your teammates will thank you.' },
                    { label: 'Ship something in week one', desc: 'Even if it\'s tiny. Fixing a typo in the docs. Adding a missing test. The goal is to complete the full cycle — branch, PR, review, merge, deploy — early. Everything after is iteration.' },
                ].map((item, i) => (
                    <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                        <span className="text-2xl font-black text-primary/70 shrink-0 select-none">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <LectureCallout type="info">
                This is the last lecture of the course. What comes next is building — real projects, real clients, real feedback loops. The CBC exists to close the gap between classroom CS and industry, and you've now seen the full picture of what industry looks like technically. The rest is reps.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Scrum, Kanban & Sprint Cycles',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/lecture-1'),
                }}
                next={{
                    label: 'Sprint Simulation',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/activity'),
                }}
            />
        </LectureLayout>
    );
}