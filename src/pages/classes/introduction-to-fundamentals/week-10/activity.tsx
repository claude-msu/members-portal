import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week9Activity() {
    const navigate = useNavigate();

    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                    week={9}
                    session="Activity"
                    title="Auth on Your Project"
                    description="Implement login, session handling, and at least one protected route on your fundamentals project. Bring your code to Coworking for review."
                    icon={<Shield className="h-4 w-4" />}
                />

                <LectureCallout type="info">
                    Use the same full-stack project you've been building (Weeks 4–7). Add authentication so that one or more routes are only accessible after login. You can use JWT (recommended) or session cookies; document your choice in the README.
                </LectureCallout>

                <LectureSectionHeading number="01" title="Backend: Users and Login" />

                <ActivityChallenge
                    number="1.1"
                    title="User model and storage"
                    description="Store users with hashed passwords."
                >
                    <div className="space-y-1">
                        <ActivityTask>Add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">users</code> table (or equivalent) with at least: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">id</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">email</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">password_hash</code></ActivityTask>
                        <ActivityTask>Use bcrypt (or your stack's standard) to hash passwords before storing; never store plain text</ActivityTask>
                        <ActivityTask>Add a way to create one user (e.g. register endpoint or seed script) so you can log in during testing</ActivityTask>
                    </div>
                    <ActivityHint label="FastAPI">
                        <code className="bg-muted px-1 rounded text-xs">passlib.hash.bcrypt</code> for hashing; verify with <code className="bg-muted px-1 rounded text-xs">passlib.verify(plain, hash)</code>.
                    </ActivityHint>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.2"
                    title="Login endpoint and JWT"
                    description="Accept email/password, return a JWT."
                >
                    <div className="space-y-1">
                        <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">POST /login</code> (or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/auth/login</code>): body with email and password</ActivityTask>
                        <ActivityTask>Check credentials: find user by email, verify password against stored hash</ActivityTask>
                        <ActivityTask>If valid, create a JWT with at least <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">sub</code> (user id) and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">exp</code> (expiration); return <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"{ \"token\": \"...\" }"}</code></ActivityTask>
                        <ActivityTask>Store JWT secret in an env var; document it in README (e.g. "Set JWT_SECRET for auth")</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.3"
                    title="Protected route"
                    description="One endpoint that requires a valid token."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create a dependency (or middleware) that reads <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Authorization: Bearer &lt;token&gt;</code>, verifies the JWT, and returns the current user (or 401)</ActivityTask>
                        <ActivityTask>Apply it to at least one existing endpoint (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /me</code> or a list endpoint) so that without a valid token the API returns 401</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureSectionHeading number="02" title="Frontend: Login and Protected Page" />

                <ActivityChallenge
                    number="2.1"
                    title="Login flow"
                    description="Call login API and store token."
                >
                    <div className="space-y-1">
                        <ActivityTask>Add a login page or form: email and password inputs, submit calls your login API</ActivityTask>
                        <ActivityTask>On success, store the returned token (e.g. in state/context or localStorage) and redirect to a dashboard or home page</ActivityTask>
                        <ActivityTask>On every API request to your backend, send <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Authorization: Bearer &lt;token&gt;</code></ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="2.2"
                    title="Protected route (UI)"
                    description="At least one route that requires login."
                >
                    <div className="space-y-1">
                        <ActivityTask>Implement a protected route: if there is no stored user/token, redirect to login (or show login form)</ActivityTask>
                        <ActivityTask>Ensure that the protected page calls your protected API endpoint and displays data only when the user is authenticated</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureCallout type="tip">
                    Bring your project to Coworking and walk through login → protected API call → protected page. A classmate or instructor can sanity-check your flow and security (no secrets in frontend, hashed passwords, env for JWT secret).
                </LectureCallout>

                <LectureFooterNav
                    prev={{
                        label: 'Identity & User Context',
                        onClick: () => navigate('/classes/introduction-to-fundamentals/week-10/lecture-2'),
                    }}
                    next={{
                        label: 'Vercel, Railway & What Production Means',
                        onClick: () => navigate('/classes/introduction-to-fundamentals/week-11/lecture-1'),
                    }}
                />
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
