/**
 * LectureCallout
 *
 * A styled callout box for lecture pages. Three variants: tip, warning, info.
 *
 * Usage:
 *   <LectureCallout type="tip">
 *     Press Tab to autocomplete paths and filenames.
 *   </LectureCallout>
 *
 *   <LectureCallout type="warning">
 *     rm -rf is permanent. There is no undo.
 *   </LectureCallout>
 *
 *   <LectureCallout type="info">
 *     Git and GitHub are different things.
 *   </LectureCallout>
 */

import { AlertTriangle, Lightbulb, Info } from 'lucide-react';

interface LectureCalloutProps {
    type: 'tip' | 'warning' | 'info';
    children: React.ReactNode;
}

const CALLOUT_STYLES = {
    tip: {
        bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
        icon: <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
        label: 'Tip',
        labelColor: 'text-emerald-700 dark:text-emerald-400',
    },
    warning: {
        bg: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800',
        icon: <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
        label: 'Warning',
        labelColor: 'text-rose-700 dark:text-rose-400',
    },
    info: {
        bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
        icon: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
        label: 'Note',
        labelColor: 'text-blue-700 dark:text-blue-400',
    },
};

export const LectureCallout = ({ type, children }: LectureCalloutProps) => {
    const s = CALLOUT_STYLES[type];
    return (
        <div className={`my-6 flex gap-3 rounded-xl border p-4 ${s.bg}`}>
            {s.icon}
            <div className="text-sm leading-relaxed text-foreground">
                <span className={`font-semibold ${s.labelColor}`}>{s.label}: </span>
                {children}
            </div>
        </div>
    );
};