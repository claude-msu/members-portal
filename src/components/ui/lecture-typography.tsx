/**
 * Lecture UI — layout, header, typography, callouts, and inline command tooltips
 *
 * Import from this module for all lecture and activity pages. Tooltips use the
 * app-level TooltipProvider in App.tsx (not provided here).
 *
 * Layout & chrome:
 *   LectureLayout     — max-width page shell with fade-in; auto prev/next footer on fundamentals session routes (from weeks.ts)
 *   LectureHeader     — breadcrumb + hero (week, session, title, description, icon)
 *
 * Typography:
 *   LectureSectionHeading, LectureSubHeading, LectureP, LectureTerm, LectureTermWithTip
 *
 * Blocks & inline:
 *   LectureCallout    — tip / warning / info boxes
 *   LectureTip        — monospace tip with hover explanation (optional warn styling)
 */

import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, Info, Lightbulb } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getFundamentalsFooterNavFromPathname,
    INTRODUCTION_TO_FUNDAMENTALS_BASE,
} from '@/pages/classes/introduction-to-fundamentals/weeks';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// ─── Shared tooltip (private) ─────────────────────────────────────────────────

type LectureTooltipProps = {
    delayDuration: number;
    triggerTag: 'span' | 'code';
    triggerClassName: string;
    children: string;
    tip: React.ReactNode;
    warn?: boolean;
};

function LectureTooltip({
    delayDuration,
    triggerTag: Trigger,
    triggerClassName,
    children,
    tip,
    warn,
}: LectureTooltipProps) {
    return (
        <Tooltip delayDuration={delayDuration}>
            <TooltipTrigger asChild>
                <Trigger className={triggerClassName}>{children}</Trigger>
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
}

// ─── Section Heading ──────────────────────────────────────────────────────────

/**
 * Top-level section heading with a numbered label and orange left border accent.
 */
interface LectureSectionHeadingProps {
    /** Zero-padded number shown in the left margin, e.g. "01", "02" */
    number: string;
    title: string;
}

export const LectureSectionHeading = ({ number, title }: LectureSectionHeadingProps) => (
    <div className="flex items-start gap-4 mt-8 mb-4 first:mt-6">
        <span className="text-xs font-bold text-muted-foreground mt-1.5 w-6 shrink-0 text-right select-none">
            {number}
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground border-l-2 border-primary pl-4">
            {title}
        </h2>
    </div>
);

// ─── Sub Heading ──────────────────────────────────────────────────────────────

/** Subsection heading — sits inside a section, no number. */
export const LectureSubHeading = ({ title }: { title: string }) => (
    <h3 className="text-base font-semibold text-foreground mt-6 mb-3">{title}</h3>
);

// ─── Paragraph ───────────────────────────────────────────────────────────────

/**
 * Body paragraph. Accepts any React children so you can embed
 * LectureTip, LectureTerm, or plain <code> inline.
 */
export const LectureP = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm leading-7 text-muted-foreground">{children}</p>
);

// ─── Term ─────────────────────────────────────────────────────────────────────

/** Inline bold term — for introducing key vocabulary. */
export const LectureTerm = ({ children }: { children: string }) => (
    <span className="font-semibold text-foreground">{children}</span>
);

// ─── Term with tooltip ────────────────────────────────────────────────────────

interface LectureTermWithTipProps {
    children: string;
    tip: string;
}

export const LectureTermWithTip = ({ children, tip }: LectureTermWithTipProps) => (
    <LectureTooltip
        delayDuration={150}
        triggerTag="span"
        triggerClassName="font-semibold text-foreground cursor-help border-b border-dotted border-muted-foreground/50 hover:border-foreground/50 transition-colors"
        tip={tip}
    >
        {children}
    </LectureTooltip>
);

// ─── Inline command + tooltip ─────────────────────────────────────────────────

interface LectureTipProps {
    children: string;
    tip: string;
    warn?: boolean;
}

export const LectureTip = ({ children, tip, warn }: LectureTipProps) => (
    <LectureTooltip
        delayDuration={100}
        triggerTag="code"
        triggerClassName={`
          px-1.5 py-0.5 rounded text-xs font-mono cursor-help border transition-colors
          ${warn
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                : 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
            }
        `}
        tip={tip}
        warn={warn}
    >
        {children}
    </LectureTooltip>
);

// ─── Callout ──────────────────────────────────────────────────────────────────

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

// ─── Page header ──────────────────────────────────────────────────────────────

interface LectureHeaderProps {
    week: number;
    /** e.g. "Lecture 1", "Lecture 2", "Activity" */
    session: string;
    title: string;
    description: string;
    /** Icon rendered inside the small square badge next to the session label */
    icon: React.ReactNode;
}

export const LectureHeader = ({
    week,
    session,
    title,
    description,
    icon,
}: LectureHeaderProps) => {
    const navigate = useNavigate();

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6"
            >
                <BookOpen className="h-3.5 w-3.5" />
                <button
                    type="button"
                    onClick={() => navigate('/classes')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                    Classes
                </button>
                <ChevronRight className="h-3 w-3" />

                <button
                    type="button"
                    onClick={() => navigate(INTRODUCTION_TO_FUNDAMENTALS_BASE)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                    Introduction to Fundamentals
                </button>
                <ChevronRight className="h-3 w-3" />
                <button
                    type="button"
                    onClick={() => navigate(`${INTRODUCTION_TO_FUNDAMENTALS_BASE}?s=${week}`)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                    Week {week}
                </button>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{session}</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-6"
            >
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-8 h-8 rounded-lg text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center">
                        {icon}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                        Week {week} · {session}
                    </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">{title}</h1>
                <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
        </>
    );
};

// ─── Page layout ───────────────────────────────────────────────────────────────

export interface LectureFooterNavItem {
    label: string;
    onClick: () => void;
}

function LectureLayoutFooter({ prev, next }: { prev?: LectureFooterNavItem; next?: LectureFooterNavItem }) {
    return (
        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
            {prev ? (
                <button
                    type="button"
                    onClick={prev.onClick}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {prev.label}
                </button>
            ) : (
                <div />
            )}
            {next ? (
                <button
                    type="button"
                    onClick={next.onClick}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    {next.label}
                    <ChevronRight className="h-4 w-4" />
                </button>
            ) : (
                <div />
            )}
        </div>
    );
}

export const LectureLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const links = getFundamentalsFooterNavFromPathname(location.pathname);
    const footerNav: { prev?: LectureFooterNavItem; next?: LectureFooterNavItem } | undefined = links
        ? {
              prev: links.prev
                  ? { label: links.prev.title, onClick: () => navigate(links.prev.path) }
                  : undefined,
              next: links.next
                  ? { label: links.next.title, onClick: () => navigate(links.next.path) }
                  : undefined,
          }
        : undefined;
    const showFooter = footerNav && (footerNav.prev || footerNav.next);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto px-4 py-8"
        >
            {children}
            {showFooter ? <LectureLayoutFooter {...footerNav} /> : null}
        </motion.div>
    );
};
