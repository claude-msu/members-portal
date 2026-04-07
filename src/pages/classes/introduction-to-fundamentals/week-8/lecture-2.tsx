import { TestTube } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureTip,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { CodeBlock } from '@/components/ui/code-block';

export default function Week10Lecture2() {
    return (
        <LectureLayout>
            <LectureHeader
                week={10}
                session="Lecture 2"
                title="GitHub Actions & Coverage"
                description="CI/CD with GitHub Actions: run tests on every push, enforce coverage, and automate checks so the team stays in sync."
                icon={<TestTube className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="What is CI/CD?" />

            <LectureP>
                <LectureTermWithTip tip="Continuous Integration: every time someone pushes code, the project is built and tested automatically. Catches breakage before it reaches production.">CI</LectureTermWithTip> (Continuous Integration) means your tests and build run automatically on every push or pull request. <LectureTermWithTip tip="Continuous Deployment/Delivery: automatically deploy when tests pass. For this course we focus on CI; deployment is Week 11.">CD</LectureTermWithTip> can mean automatically deploying when tests pass. For now we'll focus on CI: run tests and report results so no one merges broken code.
            </LectureP>
            <LectureP>
                GitHub Actions is GitHub's built-in CI: you add a <LectureTerm>workflow</LectureTerm> file (YAML) to your repo that defines when to run (e.g. on push to main, on every PR) and what steps to run (checkout code, install deps, run tests). The run happens in a fresh virtual machine; you see pass/fail and logs on the PR. Free for public repos and generous for private.
            </LectureP>

            <LectureSectionHeading number="02" title="A Minimal Workflow" />

            <LectureP>
                Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/workflows/test.yml</code>. Typical steps: (1) trigger on <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">push</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pull_request</code> to main; (2) checkout the repo; (3) set up Node (and optionally Python for the backend); (4) install dependencies; (5) run tests. If any step fails, the workflow fails and the PR shows a red X.
            </LectureP>
            <LectureSubHeading title="Workflow file you can copy" />
            <LectureP>
                Put this file at <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/workflows/test.yml</code>. It runs on every push and pull request to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>. Adjust <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node-version</code> and the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">run</code> commands to match your project (e.g. add a backend job that runs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pytest</code>).
            </LectureP>
            <CodeBlock
                language="yaml"
                title=".github/workflows/test.yml"
                lines={[
                    'name: Test',
                    '',
                    'on:',
                    '  push:',
                    '    branches: [main]',
                    '  pull_request:',
                    '    branches: [main]',
                    '',
                    'jobs:',
                    '  test:',
                    '    runs-on: ubuntu-latest',
                    '    steps:',
                    '      - uses: actions/checkout@v4',
                    '',
                    '      - name: Setup Node',
                    '        uses: actions/setup-node@v4',
                    '        with:',
                    '          node-version: "20"',
                    '          cache: "npm"',
                    '',
                    '      - name: Install dependencies',
                    '        run: npm ci',
                    '',
                    '      - name: Run tests',
                    '        run: npm test',
                ]}
            />
            <TerminalBlock
                title="bash — create the workflow file"
                lines={[
                    { comment: 'create the workflows directory', cmd: 'mkdir -p .github/workflows' },
                    { comment: 'create test.yml (paste the YAML above), then commit and push', cmd: 'git add .github/workflows/test.yml && git commit -m "Add CI workflow" && git push' },
                ]}
            />
            <LectureCallout type="info">
                Use <LectureTip tip="npm ci — installs exactly what's in package-lock.json. Faster and more reproducible than npm install for CI.">npm ci</LectureTip> in CI instead of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install</code> so the install is deterministic and matches your lockfile.
            </LectureCallout>

            <LectureSectionHeading number="03" title="Coverage" />

            <LectureP>
                <LectureTerm>Coverage</LectureTerm> measures which lines (or branches) of your code were executed during tests. High coverage doesn't guarantee good tests, but low coverage means large chunks of code are never exercised. Use Vitest's coverage option (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vitest run --coverage</code>) and optionally fail the build if coverage drops below a threshold (e.g. 70%). For pytest, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pytest-cov</code> does the same.
            </LectureP>
            <LectureP>
                In CI, run tests with coverage and (optional) upload the report to a service or leave it in the logs. At minimum, run coverage locally before pushing and fix any regressions.
            </LectureP>

            <LectureSectionHeading number="04" title="Monorepo or Split Repos" />

            <LectureP>
                If your frontend and backend live in one repo, you can have one workflow with two jobs (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">frontend</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">backend</code>) that run in parallel, or one job that installs both and runs both test suites. If they're in separate repos, each repo has its own workflow. Document in the README: "Tests run on every push via GitHub Actions."
            </LectureP>
            <LectureSubHeading title="Secrets in CI" />
            <LectureP>
                Use GitHub Secrets for any environment variables your tests need (for example: a test database URL or a test JWT secret). Never commit real secrets to your code. In your workflow YAML, reference them like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">env:</code> <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">JWT_SECRET: $&#123;&#123; secrets.JWT_SECRET &#125;&#125;</code>. For public repositories, never use production secrets—only use test/demo values in Actions.
            </LectureP>
            <LectureCallout type="tip">
                A green check on the PR means "tests passed." Get in the habit of not merging until the check is green. That single habit prevents most "it worked on my machine" breakages.
            </LectureCallout>


        </LectureLayout>
    );
}
