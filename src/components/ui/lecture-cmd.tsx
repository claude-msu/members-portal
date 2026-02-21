/**
 * LectureCmd
 *
 * An inline code snippet with a hover tooltip explaining what the command does.
 * Used to make lecture content encyclopedic — students can hover any command
 * to see its full definition, etymology, flags, and gotchas.
 *
 * Requires TooltipProvider to be present in the page (wrap the page in it).
 *
 * Usage:
 *   <LectureCmd tip="print working directory — shows your current location">
 *     pwd
 *   </LectureCmd>
 *
 *   <LectureCmd tip="force-deletes without confirmation — dangerous" warn>
 *     rm -rf
 *   </LectureCmd>
 */

import { AlertTriangle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface LectureCmdProps {
    /** The command or flag text displayed inline */
    children: string;
    /** Tooltip content — explain what the command does, its flags, etymology, gotchas */
    tip: string;
    /** If true, renders in red to signal danger */
    warn?: boolean;
}

export const LectureCmd = ({ children, tip, warn }: LectureCmdProps) => (
    <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
            <code
                className={`
          px-1.5 py-0.5 rounded text-xs font-mono cursor-help border transition-colors
          ${warn
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
                    }
        `}
            >
                {children}
            </code>
        </TooltipTrigger>
        <TooltipContent
            side="top"
            className={`max-w-xs text-xs leading-relaxed ${warn ? 'border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200' : ''}`}
        >
            {warn && <AlertTriangle className="inline h-3 w-3 mr-1 text-rose-500" />}
            {tip}
        </TooltipContent>
    </Tooltip>
);