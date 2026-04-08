import { Trophy } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';

export default function Week12Activity() {
    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                    week={12}
                    session="Activity"
                    title="Final Demo & Celebration"
                    description="Present your project in a final sprint review. Share your README, live app, and one takeaway. Celebrate the 36-session journey from zero to full-stack."
                    icon={<Trophy className="h-4 w-4" />}
                />

                <LectureCallout type="info">
                    This is the last activity of the fundamentals track. You're not planning another sprint — you're closing the loop: demo what you built, share one lesson learned, and celebrate. Your project is deployed, tested, and documented; this session is about presenting it and reflecting.
                </LectureCallout>

                <LectureSectionHeading number="01" title="Final Sprint Review" />

                <ActivityChallenge
                    number="1.1"
                    title="Present your project"
                    description="Short demo and README walkthrough."
                >
                    <div className="space-y-1">
                        <ActivityTask>Give a 3-5 minute demo: what the project is, show the live app (URL in README), log in and walk through one main flow</ActivityTask>
                        <ActivityTask>Show that your README is complete: live URLs, how to run locally, env vars (names), how to run tests</ActivityTask>
                        <ActivityTask>Share <strong className="text-foreground">one takeaway</strong> — something you learned or will do differently next time (technical or process)</ActivityTask>
                    </div>
                    <ActivityHint label="Demo tip">
                        Open the live URL in an incognito window before you present — no cookies, no cached login. You'll show exactly what a stranger sees. Run through the demo script from Lecture 2 once beforehand so nothing surprises you.
                    </ActivityHint>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.2"
                    title="Retro"
                    description="Reflect on the 12-week journey."
                >
                    <div className="space-y-1">
                        <ActivityTask>Fill in the retro template from Lecture 2: what went well, what was hardest, what you'll do differently</ActivityTask>
                        <ActivityTask>Share one answer with the group (or keep it for yourself — the act of writing is what matters)</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureSectionHeading number="02" title="Portfolio & What's Next" />

                <LectureP>
                    Your fundamentals project is portfolio-ready. Make sure it stays that way.
                </LectureP>

                <ActivityChallenge
                    number="2.1"
                    title="Portfolio-ready repo"
                    description="Ensure the project is shareable."
                >
                    <div className="space-y-1">
                        <ActivityTask>Verify the repo is public (or shareable with a link)</ActivityTask>
                        <ActivityTask>Confirm live URLs still work (frontend loads, backend <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/health</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/docs</code> returns 200)</ActivityTask>
                        <ActivityTask>README has: title, description, live URLs, tech stack, setup instructions, test commands, env vars table</ActivityTask>
                        <ActivityTask>Add the project to your LinkedIn or resume with a one-line description and the live URL</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="2.2"
                    title="What's next"
                    description="Pick one concrete next step."
                >
                    <div className="space-y-1">
                        <ActivityTask>Choose one: build a second project with a new stack, contribute to an open-source repo (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">good first issue</code>), or take an intermediate course</ActivityTask>
                        <ActivityTask>Write it down — a specific repo, course, or project idea, not just "learn more"</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureSectionHeading number="03" title="Celebrate" />

                <ActivityChallenge
                    number="3.1"
                    title="Close the loop"
                    description="Acknowledge the journey."
                >
                    <div className="space-y-1">
                        <ActivityTask>You've gone from Linux and the CLI (Week 1) through data structures, C++, Git, Agile, Docker, FastAPI, databases, React, Tailwind, auth, testing, CI/CD, and deployment. Take a moment to acknowledge that</ActivityTask>
                        <ActivityTask>Optional: update your project board one final time — move any remaining cards to "Done" and archive the board</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureCallout type="tip">
                    Keep your repo and live app public. A recruiter or future teammate can open the README, run the app, and see a full-stack, tested, deployed product. The habit of shipping, testing, and documenting is what you take forward — frameworks change, that ability doesn't.
                </LectureCallout>

                
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
