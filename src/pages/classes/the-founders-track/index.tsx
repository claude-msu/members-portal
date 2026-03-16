import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    BookOpen,
    Timer,
    MapPin,
    Building2,
    GraduationCap,
    Briefcase,
    TrendingUp,
    Zap,
    BarChart2,
    DollarSign,
    Award,
    PieChart,
    Target,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { CURRENT, QUEUED, type WeekConfig, type PortfolioEntry } from './weeks';

// ─── Countdown helpers ────────────────────────────────────────────────────────

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

function useCountdownUpperHalf(target: Date): boolean {
    const calc = useCallback(() => {
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return true;
        return diff > HALF_CYCLE_MS;
    }, [target]);
    const [upper, setUpper] = useState(() => calc());
    useEffect(() => {
        const id = setInterval(() => setUpper(calc()), 1000);
        return () => clearInterval(id);
    }, [calc]);
    return upper;
}

// ─── Countdown inline ─────────────────────────────────────────────────────────

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
                            <div className="w-9 h-8 rounded-lg bg-page border border-border flex items-center justify-center cursor-default shadow-sm font-mono tabular-nums min-w-[2.25rem]">
                                <span className="text-sm font-bold text-foreground">
                                    {unit.pad
                                        ? String(unit.value).padStart(2, '0')
                                        : unit.value}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p className="text-xs">{unit.label}</p>
                        </TooltipContent>
                    </Tooltip>
                    {i < units.length - 1 && (
                        <span className="text-xs font-bold text-muted-foreground/60 mx-0.5">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Experience Timeline ──────────────────────────────────────────────────────

function ExperienceTimeline({ experience }: { experience: WeekConfig['persona']['experience'] }) {
    const showLine = experience.length > 1;
    return (
        <div className="relative">
            {showLine && (
                <div
                    className="absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 bg-border/80"
                    aria-hidden
                />
            )}
            <div className="space-y-5">
                {experience.map((exp, i) => (
                    <div key={i} className="relative flex gap-5 items-start">
                        <div className="w-8 shrink-0 flex justify-center pt-1.5 relative z-10">
                            <div className="w-3 h-3 rounded-full bg-card border-2 border-primary shadow-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{exp.role}</p>
                                    <p className="text-xs text-primary font-medium mt-0.5">{exp.company}</p>
                                </div>
                                <span className="text-xs text-muted-foreground font-mono tabular-nums">{exp.years}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                                {exp.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Portfolio (quote cards: note is primary, company + stage as label) ─────────

function PortfolioList({ portfolio }: { portfolio: PortfolioEntry[]; weekTitle: string }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {portfolio.map((entry, i) => (
                <div
                    key={i}
                    className="relative rounded-xl border border-border bg-muted/10 p-4 text-left"
                >
                    <p className="text-sm text-muted-foreground leading-relaxed italic pr-20">
                        "{entry.note}"
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{entry.company}</span>
                        <span className="text-[11px] text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border">
                            {entry.stage}
                        </span>
                    </div>
                    <span
                        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                    >
                        <TrendingUp className="h-3.5 w-3.5" />
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Persona Card ─────────────────────────────────────────────────────────────

function PersonaCard({ week }: { week: WeekConfig }) {
    const { persona } = week;

    const getStatIcon = (label: string) => {
        const lower = label.toLowerCase();
        if (lower.includes('fund')) return <DollarSign className="h-3.5 w-3.5" />;
        if (lower.includes('portfolio')) return <PieChart className="h-3.5 w-3.5" />;
        if (lower.includes('exit') || lower.includes('unicorn')) return <Award className="h-3.5 w-3.5" />;
        if (lower.includes('check') || lower.includes('entry')) return <BarChart2 className="h-3.5 w-3.5" />;
        if (lower.includes('years')) return <Timer className="h-3.5 w-3.5" />;
        return <Target className="h-3.5 w-3.5" />;
    };
    return (
        <motion.div
            key={week.number}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
        >
            {/* ── Identity block ── */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Top banner */}
                <div className="h-16 bg-gradient-to-r from-primary/15 via-primary/8 to-transparent border-b border-border" />

                <div className="px-5 pb-5">
                    {/* Avatar placeholder + name row */}
                    <div className="flex items-end gap-4 -mt-8 mb-4">
                        <div className="w-16 h-16 rounded-xl border-2 border-background bg-primary flex items-center justify-center shadow-md shrink-0">
                            <span className="text-xl font-black text-primary-foreground select-none">
                                {persona.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div className="pb-1 min-w-0">
                            <h2 className="text-lg font-bold text-foreground leading-tight truncate">{persona.name}</h2>
                            <p className="text-xs text-muted-foreground truncate">{persona.title} · {persona.company}</p>
                        </div>
                    </div>

                    {/* Badges: company, location, education (level + school, no dates) */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                            <Building2 className="h-3 w-3" />
                            {persona.company}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                            <MapPin className="h-3 w-3" />
                            {persona.location}
                        </span>
                        {persona.education.map((edu, i) => {
                            const level = edu.degree.split(/\s+/)[0] ?? edu.degree;
                            return (
                                <span
                                    key={i}
                                    className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border"
                                >
                                    <GraduationCap className="h-3 w-3" />
                                    {level} · {edu.school}
                                </span>
                            );
                        })}
                    </div>

                    {/* About */}
                    <div className="space-y-2">
                        {persona.about.trim().split('\n\n').map((para, i) => (
                            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                                {para.trim()}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {persona.stats.map((stat, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-border bg-card px-4 py-3.5 flex items-stretch justify-between gap-3"
                    >
                        <span className="text-2xl font-black text-foreground leading-none tabular-nums self-center">
                            {stat.value}
                        </span>
                        <div className="flex flex-col items-end justify-between shrink-0">
                            <span className="inline-flex items-center justify-center rounded-md bg-muted w-6 h-6 text-primary">
                                {getStatIcon(stat.label)}
                            </span>
                            <span className="text-[11px] text-muted-foreground text-right leading-snug line-clamp-2 mt-1">
                                {stat.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Experience ── */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
                    <span className="text-primary"><Briefcase className="h-4 w-4" /></span>
                    <span className="text-sm font-semibold text-foreground">Experience</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                        {persona.experience.length}
                    </span>
                </div>
                <div className="p-5 pt-4">
                    <ExperienceTimeline experience={persona.experience} />
                </div>
            </div>

            {/* ── Portfolio ── */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
                    <span className="text-primary"><TrendingUp className="h-4 w-4" /></span>
                    <span className="text-sm font-semibold text-foreground">Portfolio</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                        {persona.portfolio.length}
                    </span>
                </div>
                <div className="p-5 pt-4">
                    <PortfolioList portfolio={persona.portfolio} weekTitle={week.title} />
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TheFoundersTrack() {
    const navigate = useNavigate();
    const useQueue = useCountdownUpperHalf(NEXT_DROP);
    const displayWeek = (useQueue && QUEUED) ? QUEUED : CURRENT;

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
                            <span className="text-foreground font-medium">The Founder's Track</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Timer className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Next drop</span>
                            <CountdownInline />
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                        The Founder's Track
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        An 8-week internal accelerator for students who are building something. Every Thursday at Coworking, you'll defend your progress in front of a different investor persona — each one attacking from a completely different angle.
                    </p>
                </div>
            </motion.div>

            {/* ── How it works ── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="rounded-xl border border-border bg-muted/20 px-5 py-5 space-y-4"
            >
                <h2 className="text-base font-bold tracking-tight text-foreground">How it works</h2>
                <ol className="space-y-4 text-sm">
                    <li className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            1
                        </span>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Read the persona like a brief</p>
                            <p className="text-muted-foreground leading-relaxed">
                                Skim their background, experience, and portfolio notes to understand how they actually think about companies. You are looking for what they care about, not for a list of canned questions.
                            </p>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            2
                        </span>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Build and plan real conversations</p>
                            <p className="text-muted-foreground leading-relaxed">
                                In the startup world you are not making slideshows — you are talking to people and adapting to their interests. Use the persona to decide what progress to make this week and how you would explain it to this specific investor.
                            </p>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            3
                        </span>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Test it live at Coworking</p>
                            <p className="text-muted-foreground leading-relaxed">
                                At Thursday Coworking the teacher becomes the persona and you defend your progress in a Socratic seminar. Treat it like a practice investor meeting: listen closely, respond in real time, and adjust when you realize what they actually care about.
                            </p>
                        </div>
                    </li>
                </ol>
            </motion.div>

            {/* ── Persona ── */}
            <PersonaCard week={displayWeek} />

        </div>
    );
}