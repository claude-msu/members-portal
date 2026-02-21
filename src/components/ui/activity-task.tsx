/**
 * ActivityTask
 *
 * A single checklist-style task item for activity pages. Renders a real
 * checkbox so members can record progress. Checked state is always persisted
 * in localStorage (keyed by route + task index). Wrap the activity page content
 * in ActivityTaskListProvider so each task gets a stable index.
 *
 * Usage:
 *   // In the activity page component:
 *   return (
 *     <ActivityTaskListProvider>
 *       <LectureLayout>...</LectureLayout>
 *     </ActivityTaskListProvider>
 *   );
 *
 *   // In the body, tasks need no id:
 *   <div className="space-y-1">
 *     <ActivityTask>First task</ActivityTask>
 *     <ActivityTask>Second task</ActivityTask>
 *   </div>
 */

import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const STORAGE_KEY_PREFIX = 'activity-task:';

type TaskListContextValue = { getNextIndex: () => number };
const ActivityTaskListContext = createContext<TaskListContextValue | null>(null);

/** Wrap activity page content so each ActivityTask gets a stable index for localStorage. */
export function ActivityTaskListProvider({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const indexRef = useRef(0);
    const pathRef = useRef(location.pathname);
    if (pathRef.current !== location.pathname) {
        pathRef.current = location.pathname;
        indexRef.current = 0;
    }
    const getNextIndex = () => indexRef.current++;
    return (
        <ActivityTaskListContext.Provider value={{ getNextIndex }}>
            {children}
        </ActivityTaskListContext.Provider>
    );
}

function getStorageKey(pathname: string, index: number): string {
    return `${STORAGE_KEY_PREFIX}${pathname}:${index}`;
}

interface ActivityTaskProps {
    children: React.ReactNode;
}

export const ActivityTask = ({ children }: ActivityTaskProps) => {
    const location = useLocation();
    const context = useContext(ActivityTaskListContext);
    const indexRef = useRef<number | null>(null);
    const storageKeyRef = useRef<string | null>(null);

    if (storageKeyRef.current == null) {
        if (context) {
            indexRef.current = context.getNextIndex();
            storageKeyRef.current = getStorageKey(location.pathname, indexRef.current);
        } else {
            storageKeyRef.current = `${STORAGE_KEY_PREFIX}${location.pathname}:u:${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
        }
    }

    const storageKey = storageKeyRef.current;

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            setChecked(stored === 'true');
        } catch {
            // ignore localStorage errors (private mode, etc.)
        }
    }, [storageKey]);

    const handleCheckedChange = (value: boolean | 'indeterminate') => {
        const next = value === true;
        setChecked(next);
        try {
            localStorage.setItem(storageKey, String(next));
        } catch {
            // ignore
        }
    };

    return (
        <label className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0 cursor-pointer group">
            <Checkbox
                checked={checked}
                onCheckedChange={handleCheckedChange}
                indicatorClassName="size-full [&_svg]:stroke-[2.5]"
                className={cn(
                    'rounded border-2 border-muted-foreground/30',
                    'data-[state=checked]:bg-foreground data-[state=checked]:border-foreground data-[state=checked]:text-background',
                    'focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-0',
                    'group-hover:border-muted-foreground/50',
                )}
            />
            <p className="text-sm text-foreground leading-relaxed">
                {children}
            </p>
        </label>
    );
};