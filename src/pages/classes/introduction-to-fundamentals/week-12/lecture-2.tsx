import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
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

export default function Week12Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={12}
                session="Lecture 2"
                title="Demo Prep & Retrospective"
                description="Prepare a short demo of your fundamentals project: what you built, what you'd do next, and one lesson you're taking forward. Run a lightweight retrospective."
                icon={<Trophy className="h-4 w-4" />}
            />

            {/* ── 01 THIS IS THE FINISH LINE ──────────────────────────────────── */}
            <LectureSectionHeading number="01" title="This Is the Finish Line" />

            <LectureP>
                Week 8 was your <strong className="text-foreground">first</strong> sprint review — you demoed the full-stack app, ran a retro, and planned Sprint 2 (Auth, Testing, Deployment). This week is different: it's the <strong className="text-foreground">final</strong> sprint. You've added auth, tests, CI, and deployment. The goal now is polish, a clear narrative, and a proper close to the 12-week journey.
            </LectureP>
            <LectureP>
                Your final demo should feel like a capstone: "Here's my project, here's the live app, here's what I learned." No need to re-explain every feature — focus on the highlights, the README, and one concrete takeaway. Then celebrate. You went from zero to a deployed, tested, authenticated full-stack application.
            </LectureP>

            <LectureCallout type="info">
                <LectureTerm>Sprint 1 Review (Week 8)</LectureTerm> = first demo, first retro, plan the second half. <LectureTerm>Final Sprint (Week 12)</LectureTerm> = polish, README, final demo, one takeaway, celebration. Keep that distinction clear in how you present and reflect.
            </LectureCallout>

            {/* ── 02 PREPARING YOUR DEMO ──────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Preparing Your Demo" />

            <LectureP>
                Keep it short (3–5 minutes): (1) One sentence on what the project is and who it's for. (2) Show the live app — open the URL, log in if you have auth, click through one or two main flows (e.g. create an item, see the list). (3) Mention the stack and where it's deployed (Vercel + Railway, etc.). (4) Share your README — that it's runnable and documented. (5) One thing you'd do next (e.g. "add real-time updates") and <strong className="text-foreground">one lesson you're taking forward</strong> (e.g. "writing tests first would have saved me two debug sessions").
            </LectureP>

            <LectureSubHeading title="Demo script you can follow" />
            <LectureP>
                Use this as a literal script: fill in the brackets and say it out loud once before the final session. Timing is ~30–60 seconds per bullet.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    Demo script (3–5 min)
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`1. HOOK (15 sec)
   "[Project name] is a [one-line description]. It's for [who it's for]."

2. LIVE APP (1–2 min)
   "Here's the live app." [Open URL]
   "I'll log in." [Show login if you have auth]
   "Main flow: [e.g. create a note, see the list]." [Click through once, no rush]

3. STACK (30 sec)
   "Frontend is React and Vite on Vercel; backend is FastAPI on Railway.
    Data lives in [Postgres / SQLite / etc.]."

4. README (30 sec)
   "The README has clone, env setup, and test commands. Anyone can run it locally."

5. CLOSE (30 sec)
   "One thing I'd add next: [e.g. real-time updates].
    One lesson I'm taking forward: [e.g. small PRs made debugging easier]."
`}
                </pre>
            </div>

            <LectureSubHeading title="Polish checklist" />
            <LectureP>
                Before the final session, run through this list. Every item should be true; if not, fix it so the demo and the repo are in good shape.
            </LectureP>
            <ul className="list-disc pl-6 py-2 space-y-1.5 text-sm text-muted-foreground [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-border">
                <li>README is up to date with live URLs and env docs</li>
                <li><code>.env.example</code> is present and matches README</li>
                <li>Tests pass locally (<code>npm run test</code>, <code>pytest</code>, etc.)</li>
                <li>CI is green (GitHub Actions or your pipeline)</li>
                <li>Live app loads; login works if you have auth</li>
                <li>At least one main flow works on the live URL (e.g. create item, see list)</li>
                <li>You've run through the demo script once so nothing surprises you</li>
            </ul>

            <LectureCallout type="tip">
                Open the live URL in an incognito window before you present. That way you're not logged in as yourself with cached state — you show the same experience a stranger would get.
            </LectureCallout>

            {/* ── 03 LIGHTWEIGHT RETROSPECTIVE ─────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Lightweight Retrospective" />

            <LectureP>
                A <LectureTerm>retrospective</LectureTerm> is a short reflection: what went well, what could be better, what we'll try next. For the final week, do it for yourself (or with a small group): What went well in the last 12 weeks? What was hardest? What will you do differently on the next project? Write down one or two answers. That reflection is what turns "I finished a course" into "I know how to learn and ship."
            </LectureP>

            <LectureSubHeading title="Retro template you can use" />
            <LectureP>
                Copy the template below into a doc or note. Fill in 1–2 sentences per question. You can share it in the final session or keep it for yourself — the act of writing it is what matters.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    Final retro (copy and fill in)
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`## Final Sprint Retro — [Your name / project]

What went well (last 12 weeks)?
- 

What was hardest?
- 

What will I do differently on the next project?
- 

One lesson I'm taking forward (for the demo):
- 
`}
                </pre>
            </div>

            <LectureP>
                No need for a formal format. Just: stop, look back, name one win and one lesson. Then close the loop — you're done with this run of the fundamentals track. The project lives on; you can keep iterating. The habit of shipping, testing, and documenting is what you take forward.
            </LectureP>
            <LectureCallout type="tip">
                Your "one takeaway" doesn't have to be technical. It could be "I work better when I break tasks into small PRs" or "Documenting as I go saved me at the end." Authentic beats impressive.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'README, Docs & Open Source Habits',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-12/lecture-1'),
                }}
                next={{
                    label: 'Final Demo & Celebration',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-12/activity'),
                }}
            />
        </LectureLayout>
    );
}
