import { Trophy } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
} from '@/components/ui/lecture-typography';
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
                        <ActivityTask>Give a 3–5 minute demo: what the project is, show the live app (URL in README), log in and walk through one main flow</ActivityTask>
                        <ActivityTask>Show that your README is complete: live URLs, how to run locally, env vars (names), how to run tests</ActivityTask>
                        <ActivityTask>Share <strong className="text-foreground">one takeaway</strong> — something you learned or will do differently next time (technical or process)</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.2"
                    title="Celebrate"
                    description="Close the 12-week journey."
                >
                    <div className="space-y-1">
                        <ActivityTask>You've gone from Linux and the CLI (Week 1) through DSA, C++, Git, Docker, backend, frontend, sprint review, auth, testing, deployment, and now a final demo. Take a moment to acknowledge that</ActivityTask>
                        <ActivityTask>Optional: run a short retro with your cohort — what went well, what was hard, what's next. Then consider the fundamentals track complete</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureCallout type="tip">
                    Keep your repo and live app public (or shareable). This project is portfolio-ready: a recruiter or future you can open the README, run the app, and see a full-stack, tested, deployed product. You did that.
                </LectureCallout>

                
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
