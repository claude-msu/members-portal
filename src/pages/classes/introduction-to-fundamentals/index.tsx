import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Zap, Users, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCurrent } from '@/lib/semester';
import {
    INTRODUCTION_TO_FUNDAMENTALS_BASE,
    WEEKS,
    type FundamentalsSessionData,
    type FundamentalsWeekAccent,
} from './weeks';

type Session = FundamentalsSessionData;

// ─── Session Card ─────────────────────────────────────────────────────────────

interface SessionCardProps {
    session: Session;
    accent: FundamentalsWeekAccent;
}

const SessionCard = ({ session, accent: c }: SessionCardProps) => {
    const navigate = useNavigate();
    const basePath = `${INTRODUCTION_TO_FUNDAMENTALS_BASE}/${session.slug}`;

    const typeConfig = {
        lecture: {
            icon: <BookOpen className="h-3.5 w-3.5" />,
            label: session.label,
            cardBg: 'bg-white dark:bg-card',
        },
        activity: {
            icon: <Zap className="h-3.5 w-3.5" />,
            label: 'Activity',
            cardBg: `${c.bg}`,
        },
    };

    const config = typeConfig[session.type];

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(basePath)}
            className={`
        w-full text-left rounded-xl border p-4 transition-all duration-200 group
        ${config.cardBg}
        ${session.type === 'activity'
                    ? c.border
                    : 'hover:shadow-md hover:border-primary/50 dark:hover:border-white/50'}
      `}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {/* Type badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`
              inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
              ${session.type === 'activity' ? c.badge : 'bg-muted text-muted-foreground'}
            `}>
                            {config.icon}
                            {config.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {session.duration}
                        </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-sm text-foreground mb-1 leading-snug">
                        {session.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {session.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                        {session.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Arrow */}
                <ChevronRight className={`h-4 w-4 ${c.text} shrink-0 mt-1 group-hover:translate-x-0.5 transition-all`} />
            </div>
        </motion.button>
    );
};

// ─── Week Folder ──────────────────────────────────────────────────────────────

interface WeekFolderProps {
    week: (typeof WEEKS)[number];
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}

const WeekFolder = ({ week, isOpen, onToggle, index }: WeekFolderProps) => {
    const c = week.accent;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
        >
            {/* Header / Toggle */}
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors duration-150 text-left"
            >
                {/* Week number + icon */}
                <div className={`
          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
          ${c.bg} ${c.text} ${c.border} border
        `}>
                    {week.icon}
                </div>

                {/* Title block */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{week.subtitle}</p>
                    <h3 className="font-semibold text-sm text-foreground truncate">{week.title}</h3>
                </div>

                {/* Session count */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {week.sessions.length} sessions
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                </div>
            </button>

            {/* Sessions */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                            {week.sessions.map((session) => (
                                <SessionCard
                                    key={session.slug}
                                    session={session}
                                    accent={week.accent}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const VALID_WEEK_NUMBERS = WEEKS.map((w) => w.number);

function getWeekFromSearchParams(searchParams: URLSearchParams): number | null {
    const s = searchParams.get('s');
    const n = s ? parseInt(s, 10) : NaN;
    return Number.isInteger(n) && VALID_WEEK_NUMBERS.includes(n) ? n : null;
}

export default function IntroductionToFundamentals() {
    const [searchParams] = useSearchParams();
    const weekFromUrl = getWeekFromSearchParams(searchParams);
    const [openWeeks, setOpenWeeks] = useState<Set<number>>(() =>
        weekFromUrl !== null ? new Set([weekFromUrl]) : new Set()
    );
    const navigate = useNavigate();

    // When URL ?s= changes (e.g. breadcrumb link), expand that week
    useEffect(() => {
        if (weekFromUrl !== null) {
            setOpenWeeks((prev) => new Set(prev).add(weekFromUrl));
        }
    }, [weekFromUrl]);

    // Auto-expand current week on load when no URL week is specified
    useEffect(() => {
        if (weekFromUrl !== null) return;
        getCurrent()
            .then((week) => {
                const clamped = Math.min(Math.max(week, 1), 12);
                setOpenWeeks((prev) => new Set(prev).add(clamped));
            })
            .catch(() => { });
    }, [weekFromUrl]);

    const toggleWeek = (n: number) => {
        setOpenWeeks((prev) => {
            const next = new Set(prev);
            if (next.has(n)) {
                next.delete(n);
            } else {
                next.add(n);
            }
            return next;
        });
    };

    const expandAll = () => setOpenWeeks(new Set(WEEKS.map((w) => w.number)));
    const collapseAll = () => setOpenWeeks(new Set());

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                    <BookOpen className="h-3.5 w-3.5" />
                    <button
                        onClick={() => navigate('/classes')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        Classes
                    </button>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground font-medium">Introduction to Fundamentals</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Introduction to Fundamentals
                        </h1>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                            A 36-session journey from zero to full-stack. Terminal fluency, version control,
                            containers, React, backend APIs, algorithms, auth, testing, deployment — everything
                            you need to contribute to real projects.
                        </p>
                    </div>
                </div>

                {/* Topic pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {[
                        'Linux',
                        'Git & Agile',
                        'Docker',
                        'FastAPI',
                        'Redis',
                        'React',
                        'C++ & DSA',
                        'Linux',
                        'Git & Agile',
                        'Docker',
                        'FastAPI',
                        'Redis',
                        'React',
                        'SQL',
                        'C++ & DSA',
                        'Sprint Review',
                        'Project Management',
                    ].map((topic, topicIndex) => (
                        <Badge key={`${topic}-${topicIndex}`} variant="secondary">
                            {topic}
                        </Badge>
                    ))}
                </div>
            </motion.div>

            {/* ── Controls ── */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Course Content</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={expandAll}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Expand all
                    </button>
                    <span className="text-muted-foreground text-xs">·</span>
                    <button
                        onClick={collapseAll}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Collapse all
                    </button>
                </div>
            </div>

            {/* ── Week Folders ── */}
            <div className="space-y-3 !mt-3">
                {WEEKS.map((week, i) => (
                    <WeekFolder
                        key={week.number}
                        week={week}
                        isOpen={openWeeks.has(week.number)}
                        onToggle={() => toggleWeek(week.number)}
                        index={i}
                    />
                ))}
            </div>
        </div>
    );
}