import { useNavigate } from 'react-router-dom';
import { TestTube } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week10Activity() {
    const navigate = useNavigate();

    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                    week={10}
                    session="Activity"
                    title="Pipeline for Your Repo"
                    description="Add a GitHub Actions workflow to your project that runs tests and reports coverage. Fix any failing tests and document how to run them locally."
                    icon={<TestTube className="h-4 w-4" />}
                />

                <LectureCallout type="info">
                    Use the same fundamentals project repo. Add at least one automated test (frontend or backend) and a GitHub Actions workflow that runs on every push and pull request. Document commands in the README.
                </LectureCallout>

                <LectureSectionHeading number="01" title="Tests" />

                <ActivityChallenge
                    number="1.1"
                    title="At least one passing test"
                    description="Backend or frontend."
                >
                    <div className="space-y-1">
                        <ActivityTask>Backend: add at least one test (e.g. FastAPI TestClient for GET /items or login) that passes when you run your test command locally</ActivityTask>
                        <ActivityTask>Frontend: add at least one test (e.g. Vitest + Testing Library for a component or fetch mock) that passes when you run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm test</code> (or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pnpm test</code>)</ActivityTask>
                        <ActivityTask>Fix any failing tests that already existed so the suite is green</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.2"
                    title="Document how to run tests"
                    description="README section."
                >
                    <div className="space-y-1">
                        <ActivityTask>In your README, add a short "Testing" or "Development" section: the exact command(s) to run tests (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm test</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pytest</code>) and optionally how to run with coverage</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureSectionHeading number="02" title="GitHub Actions" />

                <ActivityChallenge
                    number="2.1"
                    title="Workflow file"
                    description="Run tests on push and PR."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.github/workflows/test.yml</code> (or a name of your choice)</ActivityTask>
                        <ActivityTask>Trigger on <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">push</code> to main and on <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pull_request</code> to main</ActivityTask>
                        <ActivityTask>Steps: checkout repo, set up Node (and Python if you have a backend), install dependencies, run the same test command(s) you documented</ActivityTask>
                        <ActivityTask>Push and confirm the workflow runs and shows green on the Actions tab (and on the PR if you open one)</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="2.2"
                    title="Coverage (optional)"
                    description="Report coverage in CI."
                >
                    <div className="space-y-1">
                        <ActivityTask>If time: run tests with coverage in the workflow (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vitest run --coverage</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pytest --cov</code>) and either fail the job if coverage is below a threshold or leave the report in the logs</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureFooterNav
                    prev={{
                        label: 'GitHub Actions & Coverage',
                        onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/lecture-2'),
                    }}
                    next={{
                        label: 'Vercel, Railway & What Production Means',
                        onClick: () => navigate('/classes/introduction-to-fundamentals/week-9/lecture-1'),
                    }}
                />
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
