import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { LectureCallout } from '@/components/ui/lecture-callout';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';

// ── CI/CD pipeline diagram ────────────────────────────────────────────────────
const PipelineDiagram = () => {
    const stages = [
        { icon: '💾', label: 'git push', sub: 'developer pushes code' },
        { icon: '🔍', label: 'Lint & Type Check', sub: 'catch errors early' },
        { icon: '🧪', label: 'Run Tests', sub: 'verify nothing broke' },
        { icon: '📦', label: 'Build', sub: 'bundle for production' },
        { icon: '🚀', label: 'Deploy', sub: 'ship to users' },
    ];
    return (
        <div className="my-8 rounded-xl border border-border bg-muted/30 p-5 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
                {stages.map((stage, i) => (
                    <div key={stage.label} className="flex items-center gap-2">
                        <div className="rounded-lg border border-border bg-card px-4 py-3 text-center min-w-[110px]">
                            <div className="text-xl">{stage.icon}</div>
                            <div className="text-xs font-semibold text-foreground mt-1">{stage.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{stage.sub}</div>
                        </div>
                        {i < stages.length - 1 && (
                            <div className="text-muted-foreground text-lg font-light select-none">→</div>
                        )}
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
                Any stage can fail and stop the pipeline. A deploy never happens if tests don't pass.
            </p>
        </div>
    );
};

export default function Week4Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={4}
                session="Lecture 2"
                title="Deployment & CI/CD"
                description="Writing code is half the job. Getting it to users reliably and repeatedly is the other half. This lecture covers how modern teams deploy software: environment variables, Vercel's deployment model, GitHub Actions for automated pipelines, and what CI/CD actually means in practice."
                icon={<Rocket className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
            />

            {/* ── 01 THE BUILD STEP ───────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="From Source Code to Production" />

            <LectureP>
                The code you write — TypeScript, JSX, modern JavaScript — can't run directly in most browsers. Before deployment, it needs to be <LectureTerm>compiled</LectureTerm> and <LectureTerm>bundled</LectureTerm> into a set of plain JavaScript, CSS, and HTML files that any browser understands. This is the <LectureTerm>build step</LectureTerm>.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'run the production build locally', cmd: 'npm run build' },
                    { comment: 'output goes into the dist/ folder', cmd: 'ls dist/' },
                    { comment: 'preview the production build before deploying', cmd: 'npm run preview' },
                ]}
            />

            <LectureP>
                Vite's build process does several things: it compiles TypeScript to JavaScript, transforms JSX, resolves and bundles all imports, minifies the output (removing whitespace and shortening variable names), and splits the bundle into chunks that can be loaded on demand. The result is a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">dist/</code> folder of static files you can serve from any CDN.
            </LectureP>

            <LectureCallout type="tip">
                Always run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run build</code> locally before deploying. TypeScript errors that your editor might not show clearly will surface here and fail the build. Better to catch them on your machine than in a CI pipeline.
            </LectureCallout>

            {/* ── 02 ENVIRONMENT VARIABLES ────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Environment Variables" />

            <LectureP>
                Your app needs to behave differently in different environments. In development it connects to a local database; in production it connects to the real one. API keys shouldn't be committed to git. Secret tokens shouldn't be in your source code. <LectureTerm>Environment variables</LectureTerm> solve all of this.
            </LectureP>

            <LectureSubHeading title="In a Vite project" />
            <LectureP>
                Vite reads from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> files. Any variable prefixed with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_</code> is exposed to the browser at build time. Variables without the prefix stay server-side only (which means in a Vite app they're simply not accessible — this is different from Next.js).
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    .env files — Vite's hierarchy
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-3 select-none">
                    <div>
                        <p className="text-emerald-400 mb-1">.env</p>
                        <p className="text-zinc-500">Loaded in all environments. Commit this with non-secret defaults.</p>
                        <p className="text-amber-400 mt-1">VITE_APP_NAME=TaskTracker</p>
                    </div>
                    <div>
                        <p className="text-emerald-400 mb-1">.env.local</p>
                        <p className="text-zinc-500">Local overrides. Never commit this — add to .gitignore.</p>
                        <p className="text-amber-400 mt-1">VITE_API_URL=http://localhost:8000</p>
                        <p className="text-amber-400">VITE_SUPABASE_KEY=your-secret-key-here</p>
                    </div>
                    <div>
                        <p className="text-emerald-400 mb-1">.env.production</p>
                        <p className="text-zinc-500">Only loaded during production builds (npm run build).</p>
                        <p className="text-amber-400 mt-1">VITE_API_URL=https://api.myapp.com</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 mt-2">Access in code:</p>
                        <p className="text-zinc-400 mt-1">{'const url = import.meta.env.VITE_API_URL'}</p>
                    </div>
                </div>
            </div>

            <LectureCallout type="warning">
                Any variable prefixed <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">VITE_</code> is embedded into the JavaScript bundle and visible to anyone who downloads it. Never put truly secret values (private API keys, database passwords, signing secrets) in a Vite frontend. Those belong on a server. What goes in the frontend: public API keys (Supabase anon key, Stripe publishable key), feature flags, public URLs.
            </LectureCallout>

            {/* ── 03 VERCEL ───────────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Vercel — Zero-Config Deployment" />

            <LectureP>
                <LectureTerm>Vercel</LectureTerm> is the easiest way to deploy a frontend application. You connect a GitHub repository, and Vercel automatically deploys on every push — running your build command, hosting the output on a global CDN, provisioning SSL certificates, and giving you a URL.
            </LectureP>

            <LectureSubHeading title="How Vercel works" />

            <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                {[
                    {
                        step: '01',
                        title: 'Connect your repo',
                        desc: 'Import a GitHub/GitLab/Bitbucket repository. Vercel detects the framework (Vite, Next.js, etc.) and configures build settings automatically.',
                    },
                    {
                        step: '02',
                        title: 'Set environment variables',
                        desc: 'Add your VITE_ variables in the Vercel dashboard under Project → Settings → Environment Variables. These are injected at build time — never commit secrets to git.',
                    },
                    {
                        step: '03',
                        title: 'Push to deploy',
                        desc: 'Every push to main triggers a Production deployment. Every push to any other branch gets a unique Preview URL — a full deployment of that branch you can share for review.',
                    },
                    {
                        step: '04',
                        title: 'Global CDN',
                        desc: 'Your static files are distributed to Vercel\'s edge network. Requests are served from the node closest to the user — typically under 50ms latency worldwide.',
                    },
                ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 p-4 border-b border-border last:border-b-0">
                        <span className="text-xl font-black text-primary/20 shrink-0 select-none">{item.step}</span>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <LectureSubHeading title="Preview deployments" />
            <LectureP>
                One of Vercel's most powerful features: every pull request gets its own live URL. You can share it with teammates to review changes before merging. No more "pull down the branch and run it locally" for code review. This is how professional teams review frontend changes.
            </LectureP>

            <LectureCallout type="tip">
                The free Vercel hobby plan is sufficient for personal projects and club work. It includes unlimited projects, 100GB bandwidth, and preview deployments. You only need to upgrade when you need team collaboration features or SLA guarantees — neither of which you need as a student.
            </LectureCallout>

            {/* ── 04 CI/CD ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="CI/CD with GitHub Actions" />

            <LectureP>
                <LectureTerm>CI</LectureTerm> (Continuous Integration) means automatically running tests and checks whenever code is pushed. <LectureTerm>CD</LectureTerm> (Continuous Deployment) means automatically deploying when those checks pass. Together they form a pipeline that makes shipping code safe and repeatable.
            </LectureP>

            <PipelineDiagram />

            <LectureP>
                <LectureTerm>GitHub Actions</LectureTerm> is GitHub's built-in CI/CD system. You define pipelines as YAML files in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/workflows/</code>. They run on GitHub's servers whenever events happen — a push, a pull request, a schedule.
            </LectureP>

            <LectureSubHeading title="A real CI workflow" />

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    .github/workflows/ci.yml
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p><span className="text-sky-300">name</span><span className="text-zinc-400">: CI</span></p>
                    <p className="mt-2"><span className="text-sky-300">on</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-4"><span className="text-sky-300">push</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-8"><span className="text-sky-300">branches</span><span className="text-zinc-400">: [main]</span></p>
                    <p className="pl-4"><span className="text-sky-300">pull_request</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-8"><span className="text-sky-300">branches</span><span className="text-zinc-400">: [main]</span></p>
                    <p className="mt-2"><span className="text-sky-300">jobs</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-4"><span className="text-sky-300">quality</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-8"><span className="text-sky-300">runs-on</span><span className="text-zinc-400">: ubuntu-latest</span></p>
                    <p className="pl-8"><span className="text-sky-300">steps</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-10"><span className="text-zinc-400">- </span><span className="text-sky-300">uses</span><span className="text-zinc-400">: actions/checkout@v4</span></p>
                    <p className="pl-10"><span className="text-zinc-400">- </span><span className="text-sky-300">uses</span><span className="text-zinc-400">: actions/setup-node@v4</span></p>
                    <p className="pl-12"><span className="text-sky-300">with</span><span className="text-zinc-400">:</span></p>
                    <p className="pl-16"><span className="text-sky-300">node-version</span><span className="text-zinc-400">: </span><span className="text-amber-400">'20'</span></p>
                    <p className="pl-16"><span className="text-sky-300">cache</span><span className="text-zinc-400">: </span><span className="text-amber-400">'npm'</span></p>
                    <p className="pl-10"><span className="text-zinc-400">- </span><span className="text-sky-300">name</span><span className="text-zinc-400">: Install dependencies</span></p>
                    <p className="pl-12"><span className="text-sky-300">run</span><span className="text-zinc-400">: npm ci</span></p>
                    <p className="pl-10"><span className="text-zinc-400">- </span><span className="text-sky-300">name</span><span className="text-zinc-400">: Type check</span></p>
                    <p className="pl-12"><span className="text-sky-300">run</span><span className="text-zinc-400">: npx tsc --noEmit</span></p>
                    <p className="pl-10"><span className="text-zinc-400">- </span><span className="text-sky-300">name</span><span className="text-zinc-400">: Lint</span></p>
                    <p className="pl-12"><span className="text-sky-300">run</span><span className="text-zinc-400">: npm run lint</span></p>
                    <p className="pl-10"><span className="text-zinc-400">- </span><span className="text-sky-300">name</span><span className="text-zinc-400">: Build</span></p>
                    <p className="pl-12"><span className="text-sky-300">run</span><span className="text-zinc-400">: npm run build</span></p>
                </div>
            </div>

            <LectureP>
                This workflow runs on every push to main and every pull request. It checks out the code, sets up Node with npm caching (so installs are fast), runs type checking, lints, and builds. If any step fails, the PR is blocked from merging. Vercel handles the actual deployment after the PR is merged.
            </LectureP>

            <LectureCallout type="info">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm ci</code> is used instead of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install</code> in CI pipelines. It installs exactly what's in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package-lock.json</code> without updating it, and fails loudly if the lockfile is out of sync. This ensures reproducible builds.
            </LectureCallout>

            {/* ── 05 BRANCH PROTECTION ────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Branch Protection Rules" />

            <LectureP>
                A CI pipeline is only useful if it can actually block bad code from being merged. <LectureTerm>Branch protection rules</LectureTerm> in GitHub enforce this at the repository level. Go to Repository → Settings → Branches → Add rule for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>.
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                {[
                    {
                        rule: 'Require a pull request before merging',
                        why: 'Nobody can push directly to main. All changes go through PRs and get a review.',
                    },
                    {
                        rule: 'Require status checks to pass',
                        why: 'Select your CI workflow. The merge button stays grey until all checks are green.',
                    },
                    {
                        rule: 'Require branches to be up to date',
                        why: 'The PR branch must include the latest main before merging — no stale code slipping through.',
                    },
                    {
                        rule: 'Do not allow bypassing the above settings',
                        why: 'Even admins follow the rules. Nobody gets a shortcut.',
                    },
                ].map((item) => (
                    <div key={item.rule} className="flex items-start gap-4 p-4 border-b border-border last:border-b-0">
                        <span className="text-emerald-500 shrink-0 select-none mt-0.5">✓</span>
                        <div>
                            <p className="text-xs font-semibold text-foreground">{item.rule}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.why}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 06 CUSTOM DOMAINS ───────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Custom Domains" />

            <LectureP>
                Vercel gives you a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">*.vercel.app</code> URL by default. For a professional project you'll want a custom domain. Domains cost $10–15/year from registrars like Namecheap or Cloudflare Registrar.
            </LectureP>

            <TerminalBlock
                title="DNS configuration — in your domain registrar"
                lines={[
                    { comment: 'Option 1: CNAME record (for subdomains like www or app)', cmd: 'CNAME  www  cname.vercel-dns.com' },
                    { comment: 'Option 2: A record (for apex/root domain)', cmd: 'A  @  76.76.21.21' },
                ]}
            />

            <LectureP>
                In Vercel: Project → Settings → Domains → Add. Enter your domain, Vercel tells you exactly which DNS records to set. DNS propagation takes anywhere from a few minutes to 48 hours. Vercel automatically provisions and renews an SSL certificate via Let's Encrypt once the DNS is pointing correctly.
            </LectureP>

            {/* ── 07 MONITORING ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="After Deploy: Monitoring" />

            <LectureP>
                Deploying is not the end — you need to know when things break in production. Two essential tools for any deployed app:
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                {[
                    {
                        tool: 'Vercel Analytics',
                        desc: 'Real-time traffic, page views, and Web Vitals scores. Free on the hobby plan. Add it with a one-line install: npm install @vercel/analytics, then <Analytics /> in your app.',
                        cost: 'Free',
                    },
                    {
                        tool: 'Sentry',
                        desc: 'Captures JavaScript errors from real users with full stack traces, breadcrumbs of what the user did, and grouping of duplicate errors. The free tier handles 5,000 errors/month — more than enough for a side project.',
                        cost: 'Free tier',
                    },
                    {
                        tool: 'Vercel Speed Insights',
                        desc: 'Measures Core Web Vitals (LCP, FID, CLS) from real user sessions. Shows you where your app is slow for actual users, not just your fast dev machine.',
                        cost: 'Free',
                    },
                ].map((item) => (
                    <div key={item.tool} className="flex items-start gap-4 p-4 border-b border-border last:border-b-0">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-foreground">{item.tool}</p>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{item.cost}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <LectureCallout type="tip">
                Set up Sentry before you deploy, not after something breaks. The first time a real user hits an error you didn't catch in testing, you'll be grateful for the stack trace.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Advanced React Patterns',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/lecture-1'),
                }}
                next={{
                    label: 'Upgrade the Task Tracker',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-4/activity'),
                }}
            />
        </LectureLayout>
    );
}