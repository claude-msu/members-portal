/**
 * ActivityChallenge
 *
 * A card container for a single challenge within an activity page.
 * Shows a large faded number, title, and description in the header,
 * with a content area for tasks, terminal blocks, hints, and callouts.
 *
 * Usage:
 *   <ActivityChallenge
 *     number="1.1"
 *     title="Build a Project Structure"
 *     description="Create a specific directory layout using only terminal commands."
 *   >
 *     <ActivityTask>Create the directory tree using mkdir -p</ActivityTask>
 *     <ActivityHint label="creating everything at once">...</ActivityHint>
 *   </ActivityChallenge>
 */

interface ActivityChallengeProps {
    /** Display number, e.g. "1.1", "2.3", "★" */
    number: string;
    title: string;
    description: string;
    children: React.ReactNode;
}

export const ActivityChallenge = ({
    number,
    title,
    description,
    children,
}: ActivityChallengeProps) => (
    <div className="rounded-xl border border-border bg-card overflow-hidden my-8">
        <div className="flex items-start gap-4 p-5 border-b border-border bg-muted/30">
            <span className="text-2xl font-black text-primary/30 leading-none select-none">
                {number}
            </span>
            <div>
                <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
            </div>
        </div>
        <div className="p-5">{children}</div>
    </div>
);