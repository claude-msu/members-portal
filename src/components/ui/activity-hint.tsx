/**
 * ActivityHint
 *
 * A collapsible hint accordion for activity pages. Students must click to
 * reveal the hint, nudging them to try on their own first. The label gives
 * a topic so they can decide if it's relevant without opening everything.
 *
 * Usage:
 *   <ActivityHint label="creating everything at once">
 *     mkdir -p can take multiple paths separated by spaces...
 *   </ActivityHint>
 */

import { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';

interface ActivityHintProps {
    /** Short topic label shown in the collapsed state */
    label: string;
    children: React.ReactNode;
}

export const ActivityHint = ({ label, children }: ActivityHintProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 overflow-hidden my-3">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors text-left"
            >
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <Lightbulb className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                    Hint: {label}
                </span>
                <ChevronDown
                    className={`h-3.5 w-3.5 text-amber-600 dark:text-amber-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-4 py-3 text-xs text-muted-foreground leading-relaxed border-t border-amber-200 dark:border-amber-800 bg-white dark:bg-card">
                    {children}
                </div>
            )}
        </div>
    );
};