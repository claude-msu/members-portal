/**
 * ActivityTask
 *
 * A single checklist-style task item for activity pages. Renders with an
 * empty checkbox square to give the page a structured "work through this"
 * feel. Visual only — no interactive state.
 *
 * Wrap multiple tasks in a plain <div> — the border-b on each item handles
 * the dividers automatically via last:border-b-0.
 *
 * Usage:
 *   <div>
 *     <ActivityTask>Initialize a Git repository</ActivityTask>
 *     <ActivityTask>
 *       Create a <code className="...">README.md</code> and commit it
 *     </ActivityTask>
 *   </div>
 */

interface ActivityTaskProps {
    children: React.ReactNode;
}

export const ActivityTask = ({ children }: ActivityTaskProps) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-b-0">
        <span className="mt-0.5 w-4 h-4 rounded border-2 border-muted-foreground/30 shrink-0" />
        <p className="text-sm text-foreground leading-relaxed">{children}</p>
    </div>
);