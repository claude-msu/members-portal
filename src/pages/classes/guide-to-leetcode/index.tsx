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

// ─── UPDATE THESE EVERY SUNDAY ──────────────────────────────────────────────

const getNextSunday = () => {
    const now = new Date();
    const day = now.getDay();
    const daysUntilSunday = (7 - day) % 7 === 0 ? 7 : (7 - day) % 7;
    const next = new Date(now);
    next.setDate(now.getDate() + daysUntilSunday);
    next.setHours(0, 0, 0, 0);
    return next;
};

const NEXT_DROP = getNextSunday();
const WEEK_NUMBER = 1;
const WEEK_THEME = 'Sliding Window';

interface Question {
    id: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    content: string;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        title: 'Maximum Average Subarray I',
        difficulty: 'easy',
        content: `## Problem

You are given an integer array \`nums\` consisting of \`n\` elements, and an integer \`k\`.

Find a contiguous subarray whose **length is equal to** \`k\` that has the maximum average value and return this value. Any answer with a calculation error less than \`10⁻⁵\` will be accepted.

---

**Example 1:**
\`\`\`
Input: nums = [1,12,-5,-6,50,3], k = 4
Output: 12.75000
Explanation: Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [5], k = 1
Output: 5.00000
\`\`\`

---

## Constraints

- \`n == nums.length\`
- \`1 <= k <= n <= 10⁵\`
- \`-10⁴ <= nums[i] <= 10⁴\`
`,
    },
    {
        id: 2,
        title: 'Contains Duplicate II',
        difficulty: 'easy',
        content: `## Problem

Given an integer array \`nums\` and an integer \`k\`, return \`true\` if there are two **distinct indices** \`i\` and \`j\` in the array such that \`nums[i] == nums[j]\` and \`abs(i - j) <= k\`.

---

**Example 1:**
\`\`\`
Input: nums = [1,2,3,1], k = 3
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,0,1,1], k = 1
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,2,3,1,2,3], k = 2
Output: false
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10⁵\`
- \`-10⁹ <= nums[i] <= 10⁹\`
- \`0 <= k <= 10⁵\`
`,
    },
    {
        id: 3,
        title: 'Find All Anagrams in a String',
        difficulty: 'easy',
        content: `## Problem

Given two strings \`s\` and \`p\`, return an array of all the start indices of \`p\`'s anagrams in \`s\`. You may return the answer in **any order**.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

---

**Example 1:**
\`\`\`
Input: s = "cbaebabacd", p = "abc"
Output: [0,6]
Explanation:
The substring at index 0 is "cba", an anagram of "abc".
The substring at index 6 is "bac", an anagram of "abc".
\`\`\`

**Example 2:**
\`\`\`
Input: s = "abab", p = "ab"
Output: [0,1,2]
\`\`\`

---

## Constraints

- \`1 <= s.length, p.length <= 3 * 10⁴\`
- \`s\` and \`p\` consist of lowercase English letters.
`,
    },
    {
        id: 4,
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'easy',
        content: `## Problem

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

---

**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

**Example 2:**
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

**Example 3:**
\`\`\`
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
\`\`\`

---

## Constraints

- \`0 <= s.length <= 5 * 10⁴\`
- \`s\` consists of English letters, digits, symbols and spaces.
`,
    },
    {
        id: 5,
        title: 'Minimum Size Subarray Sum',
        difficulty: 'easy',
        content: `## Problem

Given an array of positive integers \`nums\` and a positive integer \`target\`, return the **minimal length** of a subarray whose sum is greater than or equal to \`target\`. If there is no such subarray, return \`0\` instead.

---

**Example 1:**
\`\`\`
Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.
\`\`\`

**Example 2:**
\`\`\`
Input: target = 4, nums = [1,4,4]
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: target = 11, nums = [1,1,1,1,1,1,1,1]
Output: 0
\`\`\`

---

## Constraints

- \`1 <= target <= 10⁹\`
- \`1 <= nums.length <= 10⁵\`
- \`1 <= nums[i] <= 10⁴\`

---

## Follow-up

If you have figured out the \`O(n)\` solution, try coding another solution of which the time complexity is \`O(n log(n))\`.
`,
    },
];

// ─── END WEEKLY UPDATE ZONE ─────────────────────────────────────────────────

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

// ─── Countdown (inline, no box, tooltips only) ───────────────────────────────

function CountdownInline() {
    const countdown = useCountdown(NEXT_DROP);

    if (countdown.done) {
        return (
            <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold text-primary">Live now</span>
            </div>
        );
    }

    const units = [
        { value: countdown.days, label: 'Days' },
        { value: countdown.hours, label: 'Hours' },
        { value: countdown.minutes, label: 'Minutes' },
        { value: countdown.seconds, label: 'Seconds' },
    ];

    return (
        <div className="flex items-center gap-1">
            {units.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="w-8 h-7 rounded-md bg-muted border border-border flex items-center justify-center cursor-default">
                                <span className="text-sm font-black font-mono text-primary tabular-nums">
                                    {String(unit.value).padStart(2, '0')}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>{unit.label}</p>
                        </TooltipContent>
                    </Tooltip>
                    {i < units.length - 1 && (
                        <span className="text-xs font-bold text-muted-foreground/40">:</span>
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
            <div className="rounded-xl border border-border bg-white dark:bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="shrink-0 w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors mt-0.5">
                            {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                    <Code2 className="h-3 w-3" />
                                    Problem {index + 1}
                                </span>
                                <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diff.className}`}>
                                    {diff.label}
                                </span>
                            </div>
                            <h4 className="font-semibold text-sm text-foreground leading-snug mb-1">{question.title}</h4>
                            <p className="text-xs text-muted-foreground">Click to view full problem statement</p>
                        </div>
                    </div>
                    <ChevronRight className="shrink-0 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
                </div>
            </div>
        </motion.button>
    );
}

// ─── Problem Modal ───────────────────────────────────────────────────────────

function ProblemModal({
    question, questionIndex, onClose, onPrev, onNext, hasPrev, hasNext,
}: {
    question: Question; questionIndex: number; onClose: () => void;
    onPrev: () => void; onNext: () => void; hasPrev: boolean; hasNext: boolean;
}) {
    const diff = DIFFICULTY_CONFIG[question.difficulty];

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">

                {/* Header — tighter top padding */}
                <div className="px-7 pt-5 pb-4 border-b border-border shrink-0">
                    {/* Context pill row */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            Week {WEEK_NUMBER} · {WEEK_THEME}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Problem {questionIndex + 1} of {QUESTIONS.length}
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

                    <div className="flex items-center gap-2 mt-2.5">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border ${diff.className}`}>
                            {diff.label}
                        </span>
                        <span className="text-xs text-muted-foreground">LeetCode Premium</span>
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

    const activeId = searchParams.get('q') ? Number(searchParams.get('q')) : null;
    const activeIndex = activeId ? QUESTIONS.findIndex(q => q.id === activeId) : -1;
    const activeQuestion = activeIndex >= 0 ? QUESTIONS[activeIndex] : null;

    const openQuestion = (q: Question) => setSearchParams({ q: String(q.id) });
    const closeQuestion = () => setSearchParams({});
    const goToPrev = () => { if (activeIndex > 0) setSearchParams({ q: String(QUESTIONS[activeIndex - 1].id) }); };
    const goToNext = () => { if (activeIndex < QUESTIONS.length - 1) setSearchParams({ q: String(QUESTIONS[activeIndex + 1].id) }); };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Breadcrumb row — countdown sits on the opposite end */}
                <div className="flex items-center justify-between mb-4">
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

                    {/* Countdown — inline, no box, right side of breadcrumb row */}
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            <span className="text-xs text-muted-foreground">Next drop:</span>
                        </span>
                        <CountdownInline />
                    </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Guide to LeetCode
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    Five hand-picked LeetCode Premium problems drop every Sunday. Solve them before Thursday's coworking session — attendance is how we track your progress.
                </p>

                {/* Topic pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {[
                        'Sliding Window', 'Two Pointers', 'Hash Maps',
                        'Binary Search', 'Dynamic Programming', 'Graphs',
                        'Trees', 'Recursion', 'Backtracking', 'Greedy',
                    ].map((topic) => (
                        <Badge key={topic} variant="secondary">{topic}</Badge>
                    ))}
                </div>
            </motion.div>

            {/* ── Problems section ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-foreground">This Week's Problems</h2>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Trophy className="h-3.5 w-3.5" />
                            Week {WEEK_NUMBER} · {WEEK_THEME}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            {QUESTIONS.length} problems
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {QUESTIONS.map((q, i) => (
                        <QuestionCard key={q.id} question={q} index={i} onClick={() => openQuestion(q)} />
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-muted-foreground text-center pb-4"
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
                        onClose={closeQuestion}
                        onPrev={goToPrev}
                        onNext={goToNext}
                        hasPrev={activeIndex > 0}
                        hasNext={activeIndex < QUESTIONS.length - 1}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}