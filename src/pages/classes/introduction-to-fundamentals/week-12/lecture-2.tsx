import { Trophy } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { CodeBlock } from '@/components/ui/code-block';

export default function Week12Lecture2() {
    return (
        <LectureLayout>
            <LectureHeader
                week={12}
                session="Lecture 2"
                title="Demo Prep & Retrospective"
                description="Prepare a short demo of your fundamentals project: what you built, what you'd do next, and one lesson you're taking forward. Run a lightweight retrospective."
                icon={<Trophy className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="This Is the Finish Line" />

            <LectureP>
                Earlier in the course you demoed the full-stack app and planned the second half (auth, testing, deployment). This week is the <strong className="text-foreground">final sprint</strong>. You've added auth, tests, CI, and deployment. The goal now is polish, a clear narrative, and a proper close to the 12-week journey.
            </LectureP>
            <LectureP>
                Your final demo should feel like a capstone: "Here's my project, here's the live app, here's what I learned." No need to re-explain every feature — focus on the highlights, the README, and one concrete takeaway.
            </LectureP>

            <LectureCallout type="info">
                The distinction: the <strong>mid-course review</strong> was about progress and planning the second half. The <strong>final demo</strong> is about the finished product, your README, and one lesson you're taking forward. Keep that framing clear in how you present.
            </LectureCallout>

            <LectureSectionHeading number="02" title="Preparing Your Demo" />

            <LectureP>
                Keep it short (3-5 minutes). Before you present, verify everything still works:
            </LectureP>

            <TerminalBlock
                title="bash — pre-demo verification"
                lines={[
                    { comment: 'frontend loads', cmd: 'curl -s -o /dev/null -w "%{http_code}" https://your-app.vercel.app' },
                    { comment: 'backend health', cmd: 'curl https://your-api.railway.app/health' },
                    { comment: 'tests pass', cmd: 'npm run test && cd backend && pytest' },
                ]}
            />

            <LectureCallout type="tip">
                Open the live URL in an <LectureTip tip="A browser mode with no cookies, cache, or saved login state. Shows the exact experience a stranger would get. Use Ctrl+Shift+N (Chrome) or Cmd+Shift+P (Firefox).">incognito</LectureTip> window before you present. That way you're not logged in with cached state — you show the same experience a stranger would get.
            </LectureCallout>

            <LectureSubHeading title="Demo script you can follow" />
            <LectureP>
                Use this as a literal script: fill in the brackets and say it out loud once before the final session. Timing is ~30-60 seconds per bullet.
            </LectureP>
            <CodeBlock
                language="text"
                title="Demo script (3-5 min)"
                lines={[
                    '1. HOOK (15 sec)',
                    '   "[Project name] is a [one-line description]. It\'s for [who it\'s for]."',
                    '',
                    '2. LIVE APP (1-2 min)',
                    '   "Here\'s the live app." [Open URL]',
                    '   "I\'ll log in." [Show login if you have auth]',
                    '   "Main flow: [e.g. create a note, see the list]." [Click through once]',
                    '',
                    '3. STACK (30 sec)',
                    '   "Frontend is React and Vite on Vercel; backend is FastAPI on Railway.',
                    '    Data lives in [Postgres / SQLite / etc.]."',
                    '',
                    '4. README (30 sec)',
                    '   "The README has clone, env setup, and test commands. Anyone can run it locally."',
                    '',
                    '5. CLOSE (30 sec)',
                    '   "One thing I\'d add next: [e.g. real-time updates].',
                    '    One lesson I\'m taking forward: [e.g. small PRs made debugging easier]."',
                ]}
            />

            <LectureSubHeading title="Polish checklist" />
            <LectureP>
                Before the final session, run through this list. Every item should be true.
            </LectureP>
            <ul className="list-disc pl-6 py-2 space-y-1.5 text-sm text-muted-foreground [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-border">
                <li>README is up to date with live URLs and env docs</li>
                <li><code>.env.example</code> is present and matches README</li>
                <li>Tests pass locally (<code>npm run test</code>, <code>pytest</code>, etc.)</li>
                <li>CI is green (GitHub Actions or your pipeline)</li>
                <li>Live app loads; login works if you have auth</li>
                <li>At least one main flow works on the live URL</li>
                <li>You've run through the demo script once so nothing surprises you</li>
            </ul>

            <LectureSectionHeading number="03" title="Lightweight Retrospective" />

            <LectureP>
                A <LectureTip tip="A structured reflection held at the end of a sprint or project. The team discusses what went well, what could improve, and what to try next. Even solo developers benefit from writing one — it turns experience into transferable insight.">retrospective</LectureTip> is a short reflection: what went well, what could be better, what you'll try next. For the final week, do it for yourself or with a small group. Write down one or two answers — that reflection is what turns "I finished a course" into "I know how to learn and ship."
            </LectureP>

            <LectureSubHeading title="Retro template" />
            <LectureP>
                Copy the template below into a doc or note. Fill in 1-2 sentences per question. You can share it in the final session or keep it for yourself.
            </LectureP>
            <CodeBlock
                copyable
                language="markdown"
                title="Final retro — copy and fill in"
                lines={[
                    '## Final Sprint Retro — [Your name / project]',
                    '',
                    'What went well (last 12 weeks)?',
                    '- ',
                    '',
                    'What was hardest?',
                    '- ',
                    '',
                    'What will I do differently on the next project?',
                    '- ',
                    '',
                    'One lesson I\'m taking forward (for the demo):',
                    '- ',
                ]}
            />

            <LectureP>
                No need for a formal format. Just: stop, look back, name one win and one lesson. Then close the loop.
            </LectureP>
            <LectureCallout type="tip">
                Your "one takeaway" doesn't have to be technical. It could be "I work better when I break tasks into small PRs" or "Documenting as I go saved me at the end." Authentic beats impressive.
            </LectureCallout>

            <LectureSectionHeading number="04" title="What's Next" />

            <LectureP>
                The fundamentals track is complete, but the project lives on — you can keep iterating. Here are concrete paths forward:
            </LectureP>

            <LectureSubHeading title="Build something new" />
            <LectureP>
                The best way to solidify what you've learned is to build a second project from scratch — different domain, same stack (or try a new one). The patterns transfer: Git workflow, CI, env management, README-driven development.
            </LectureP>

            <LectureSubHeading title="Contribute to open source" />
            <LectureP>
                Find a project you use and look for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">good first issue</code> labels. The workflow is the same: fork, branch, PR, code review. Your fundamentals project proves you can navigate that cycle.
            </LectureP>

            <LectureSubHeading title="Portfolio" />
            <LectureP>
                Keep your repo and live app public. Add the project to your LinkedIn and resume with a one-line description and the live URL. A recruiter who clicks through and sees a deployed, tested, documented app with a clean README will remember it.
            </LectureP>

            <LectureCallout type="tip">
                The habit of shipping, testing, and documenting is more valuable than any single framework. Frameworks change; the ability to pick up a new one, build something, and ship it is what you take forward.
            </LectureCallout>


        </LectureLayout>
    );
}
