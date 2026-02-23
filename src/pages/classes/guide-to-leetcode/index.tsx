import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Zap,
    BookOpen,
    Trophy,
    FileText,
    Code2,
    Timer
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

import { CURRENT, QUEUED, type Question } from './weeks';

// ─── Countdown / display logic ──────────────────────────────────────────────

const HALF_CYCLE_MS = 3.5 * 24 * 60 * 60 * 1000;

const getNextSunday = () => {
    const now = new Date();
    const day = now.getDay();
    const daysUntilSunday = (7 - day) % 7 === 0 ? 7 : (7 - day) % 7;
    const next = new Date(now);
    next.setDate(now.getDate() + daysUntilSunday);
    next.setHours(9, 0, 0, 0);
    return next;
};

const NEXT_DROP = getNextSunday();

function useCountdownUpperHalf(target: Date): boolean {
    const calc = useCallback(() => {
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return true;
        return diff > HALF_CYCLE_MS;
    }, [target]);
    const [useQueue, setUseQueue] = useState(() => calc());
    useEffect(() => {
        const id = setInterval(() => setUseQueue(calc()), 1000);
        return () => clearInterval(id);
    }, [calc]);
    return useQueue;
}

const DIFFICULTY_CONFIG = {
    easy: {
        label: 'Easy',
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    },
    medium: {
        label: 'Medium',
        className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    },
    hard: {
        label: 'Hard',
        className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    },
};

// ─── Countdown Hook ──────────────────────────────────────────────────────────

function useCountdown(target: Date) {
    const calc = useCallback(() => {
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
            done: false,
        };
    }, [target]);

    const [time, setTime] = useState(calc);

    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [calc]);

    return time;
}

// ─── Countdown (inline, tooltips only) ───────────────────────────────

function CountdownInline() {
    const countdown = useCountdown(NEXT_DROP);

    if (countdown.done) {
        return (
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Live now</span>
            </div>
        );
    }

    const units = [
        { value: countdown.days, label: 'Days', pad: false },
        { value: countdown.hours, label: 'Hours', pad: true },
        { value: countdown.minutes, label: 'Minutes', pad: true },
        { value: countdown.seconds, label: 'Seconds', pad: true },
    ];

    return (
        <div className="flex items-center gap-1">
            {units.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="w-9 h-8 rounded-lg bg-background border border-border flex items-center justify-center cursor-default shadow-sm font-mono tabular-nums min-w-[2.25rem]">
                                <span className="text-sm font-bold text-foreground">
                                    {unit.pad ? String(unit.value).padStart(2, '0') : String(unit.value)}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>{unit.label}</p>
                        </TooltipContent>
                    </Tooltip>
                    {i < units.length - 1 && (
                        <span className="text-sm font-bold text-muted-foreground/50">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Markdown Renderer ───────────────────────────────────────────────────────

function SimpleMarkdown({ content }: { content: string }) {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;
    let keyCounter = 0;
    const key = () => `md-${keyCounter++}`;

    const renderInline = (text: string) => {
        const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        return parts.map((part, idx) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code key={idx} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[13px] border border-primary/20">
                        {part.slice(1, -1)}
                    </code>
                );
            }
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith('```')) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            elements.push(
                <pre key={key()} className="mb-4 mt-1 p-4 rounded-xl bg-muted border border-border overflow-x-auto">
                    <code className="text-sm font-mono text-foreground whitespace-pre leading-relaxed">
                        {codeLines.join('\n')}
                    </code>
                </pre>
            );
            i++;
            continue;
        }

        if (line.startsWith('## ')) {
            elements.push(
                <p key={key()} className="text-sm font-bold text-foreground mb-1.5">
                    {line.slice(3)}
                </p>
            );
            i++;
            continue;
        }

        if (line.startsWith('---')) {
            elements.push(<hr key={key()} className="border-border my-4" />);
            i++;
            continue;
        }

        if (line.startsWith('- ')) {
            elements.push(
                <li key={key()} className="text-sm text-muted-foreground leading-loose ml-4 list-disc">
                    {renderInline(line.slice(2))}
                </li>
            );
            i++;
            continue;
        }

        if (line.trim() === '') {
            i++;
            continue;
        }

        elements.push(
            <p key={key()} className="text-sm text-muted-foreground leading-loose">
                {renderInline(line)}
            </p>
        );
        i++;
    }

    return <div>{elements}</div>;
}

// ─── Question Card ───────────────────────────────────────────────────────────

function QuestionCard({ question, index, onClick }: { question: Question; index: number; onClick: () => void }) {
    const diff = DIFFICULTY_CONFIG[question.difficulty];

    return (
        <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.055 }}
            onClick={onClick}
            className="w-full text-left group"
        >
            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary rounded-r transition-colors duration-200" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.06] to-transparent pointer-events-none" />
                <div className="flex items-start justify-between gap-3 relative">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="shrink-0 w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-sm font-bold text-foreground group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all duration-200 mt-0.5">
                            {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground">
                                    <Code2 className="h-3 w-3" />
                                    Problem {index + 1}
                                </span>
                                <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md border ${diff.className}`}>
                                    {diff.label}
                                </span>
                            </div>
                            <h4 className="font-semibold text-foreground leading-snug mb-0.5 group-hover:text-primary/90 transition-colors">{question.title}</h4>
                            <p className="text-xs text-muted-foreground font-mono">{question.complexity}</p>
                        </div>
                    </div>
                    <ChevronRight className="shrink-0 h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
                </div>
            </div>
        </motion.button>
    );
}

// ─── Problem Modal ───────────────────────────────────────────────────────────

function ProblemModal({
    question, questionIndex, totalCount, weekNumber, weekTheme, onClose, onPrev, onNext, hasPrev, hasNext,
}: {
    question: Question; questionIndex: number; totalCount: number; weekNumber: number; weekTheme: string;
    onClose: () => void; onPrev: () => void; onNext: () => void; hasPrev: boolean; hasNext: boolean;
}) {
    const diff = DIFFICULTY_CONFIG[question.difficulty];

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden border-2 shadow-2xl">

                {/* Header — tighter top padding */}
                <div className="px-7 pt-5 pb-4 border-b border-border shrink-0 bg-gradient-to-b from-muted/30 to-transparent">
                    {/* Context pill row */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            Week {weekNumber} · {weekTheme}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Problem {questionIndex + 1} of {totalCount}
                        </span>
                    </div>

                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-foreground leading-tight text-left">
                            {question.title}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            LeetCode problem: {question.title}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-wrap items-center gap-4 mt-2.5">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border ${diff.className}`}>
                            {diff.label}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{question.complexity}</span>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-7 py-5 min-h-0">
                    <SimpleMarkdown content={question.content} />
                </div>

                {/* Footer */}
                <div className="px-7 py-4 border-t border-border bg-muted/20 shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onPrev}
                                disabled={!hasPrev}
                                className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 disabled:hover:border-border"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={onNext}
                                disabled={!hasNext}
                                className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 disabled:hover:border-border"
                            >
                                Next →
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Bring your solution to Thursday's coworking
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function GuideToLeetCode() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const useQueue = useCountdownUpperHalf(NEXT_DROP);
    // One set at a time: upper half = queue (next drop preview), lower half = current (active)
    const displayWeek = (useQueue && QUEUED) ? QUEUED : CURRENT;
    const displayQuestions = displayWeek.questions;

    const activeId = searchParams.get('q') ? Number(searchParams.get('q')) : null;
    const activeIndex = activeId ? displayQuestions.findIndex(q => q.id === activeId) : -1;
    const activeQuestion = activeIndex >= 0 ? displayQuestions[activeIndex] : null;

    const openQuestion = (q: Question) => setSearchParams({ q: String(q.id) });
    const closeQuestion = () => setSearchParams({});
    const goToPrev = () => { if (activeIndex > 0) setSearchParams({ q: String(displayQuestions[activeIndex - 1].id) }); };
    const goToNext = () => { if (activeIndex < displayQuestions.length - 1) setSearchParams({ q: String(displayQuestions[activeIndex + 1].id) }); };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)] pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BookOpen className="h-3.5 w-3.5" />
                            <button
                                onClick={() => navigate('/classes')}
                                className="hover:text-foreground transition-colors"
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                                Classes
                            </button>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-foreground font-medium">Guide to LeetCode</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Timer className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Next drop</span>
                            <CountdownInline />
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                        Guide to LeetCode
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        Five hand-picked LeetCode Premium problems drop every Sunday. Solve them before Thursday's coworking session — that's when we peer review, share solutions, and learn new techniques together.
                    </p>

                    <div className="mt-6 rounded-xl border border-border bg-muted/20 px-4 py-4 sm:px-5">
                        <h2 className="text-base font-bold tracking-tight text-foreground">
                            Required Submission for Every Problem
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Bring all four required elements to the weekly coworking session.
                        </p>
                        <ol className="mt-3 space-y-3 text-sm text-foreground">
                            <li>
                                <span className="font-semibold">1. Plan (before coding):</span>
                                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-muted-foreground">
                                    <li>Pattern name</li>
                                    <li>Invariant</li>
                                    <li>Target time and space complexity</li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-semibold">2. Implementation:</span>
                                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-muted-foreground">
                                    <li>Clean code</li>
                                    <li>Only minimal comments for non obvious logic</li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-semibold">3. Postmortem:</span>
                                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-muted-foreground">
                                    <li>First point of failure</li>
                                    <li>What earlier signal indicated the correct pattern</li>
                                    <li>One future rule written as: Next time I will _____</li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-semibold">4. Flashcard:</span>
                                <span className="ml-1 text-muted-foreground">1 to 3 bullets capturing the key takeaway in under 10 seconds of reading.</span>
                            </li>
                        </ol>
                        <p className="mt-2 text-sm text-muted-foreground italic">
                            This forces reasoning to be explicit and prevents passive solving.
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
            >
                <div className="border-l-4 border-primary bg-muted/30 px-5 py-4">
                    <h2 className="text-lg font-bold tracking-tight text-foreground">{displayWeek.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Goal:</span> {displayWeek.goal}
                    </p>
                </div>
                <div className="p-5 sm:p-6 space-y-5">
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5 pl-4 list-disc">
                        {displayWeek.rules.map((rule, i) => (
                            <li key={i}>{rule}</li>
                        ))}
                    </ul>

                    <div className="pt-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Concept Sheet</h3>
                        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayWeek.conceptSheets.map((section) => (
                                <div key={section.title} className="rounded-xl bg-muted/50 border border-border/80 p-4">
                                    <p className="text-xs font-semibold text-foreground mb-3">{section.title}</p>
                                    {section.items && (
                                        <ul className="space-y-2">
                                            {section.items.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground leading-snug">
                                                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Topic pills */}
            <div className="flex flex-wrap gap-2">
                {[
                    'Sliding Window', 'Two Pointers', 'Hash Maps',
                    'Binary Search', 'Dynamic Programming', 'Graphs',
                    'Trees', 'Recursion', 'Backtracking',
                ].map((topic) => (
                    <Badge key={topic} variant="secondary" className="border border-border/80 font-medium px-3 py-1">
                        {topic}
                    </Badge>
                ))}
            </div>

            {/* ── Problems section ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-base font-semibold text-foreground">This week's problems</h2>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/80">
                            <Trophy className="h-3.5 w-3.5 text-primary/80" />
                            Week {displayWeek.number} · {displayWeek.theme}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            {displayQuestions.length} problems
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {displayQuestions.map((q, i) => (
                        <QuestionCard key={q.id} question={q} index={i} onClick={() => openQuestion(q)} />
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-muted-foreground text-center pb-4 pt-2 border-t border-border/60"
            >
                Questions sourced from LeetCode Premium · New batch every Sunday · Attendance tracked at Thursday coworking
            </motion.p>

            {/* ── Modal ── */}
            <AnimatePresence>
                {activeQuestion && (
                    <ProblemModal
                        key={activeQuestion.id}
                        question={activeQuestion}
                        questionIndex={activeIndex}
                        totalCount={displayQuestions.length}
                        weekNumber={displayWeek.number}
                        weekTheme={displayWeek.theme}
                        onClose={closeQuestion}
                        onPrev={goToPrev}
                        onNext={goToNext}
                        hasPrev={activeIndex > 0}
                        hasNext={activeIndex < displayQuestions.length - 1}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}