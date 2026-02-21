/**
 * LectureFooterNav
 *
 * Bottom navigation for lecture and activity pages.
 * Shows a "previous" link on the left and a "next" link on the right.
 * Either can be omitted (e.g. first or last page in a week).
 *
 * Usage:
 *   <LectureFooterNav
 *     prev={{
 *       label: 'Linux & The Command Line',
 *       onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/lecture-1'),
 *     }}
 *     next={{
 *       label: 'The Git + Linux Gauntlet',
 *       onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/activity'),
 *     }}
 *   />
 *
 *   // First page — no prev:
 *   <LectureFooterNav
 *     next={{ label: 'Version Control with Git', onClick: () => navigate(...) }}
 *   />
 */

import { ArrowLeft, ChevronRight } from 'lucide-react';

interface NavItem {
    label: string;
    onClick: () => void;
}

interface LectureFooterNavProps {
    prev?: NavItem;
    next?: NavItem;
}

export const LectureFooterNav = ({ prev, next }: LectureFooterNavProps) => (
    <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
        {prev ? (
            <button
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