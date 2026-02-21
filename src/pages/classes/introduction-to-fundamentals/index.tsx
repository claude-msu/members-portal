import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Terminal,
    GitBranch,
    Globe,
    Server,
    Sparkles,
    Binary,
    Workflow,
    BookOpen,
    Zap,
    Users,
    Clock,
    ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Types ───────────────────────────────────────────────────────────────────

type SessionType = 'lecture' | 'activity';

interface Session {
    type: SessionType;
    label: string;
    title: string;
    description: string;
    duration: string;
    slug: string; // e.g. "week-1/lecture-1"
    tags: string[];
}

interface Week {
    number: number;
    theme: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string; // tailwind bg class for accent
    sessions: Session[];
}

// ─── Curriculum Data ─────────────────────────────────────────────────────────

const WEEKS: Week[] = [
    {
        number: 1,
        theme: 'The Terminal & Version Control',
        subtitle: 'Your new home base',
        icon: <GitBranch className="h-5 w-5" />,
        color: 'teal',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Linux & The Command Line',
                description:
                    'Stop clicking. Start typing. Learn to navigate the filesystem, manipulate files, manage processes, and install software entirely from the terminal.',
                duration: '90 min',
                slug: 'week-1/lecture-1',
                tags: ['ls', 'grep', 'chmod', 'apt', 'brew'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Version Control with Git',
                description:
                    'Never lose work again. Master commits, branches, merges, and rebases. Learn how teams collaborate on code without stepping on each other.',
                duration: '90 min',
                slug: 'week-1/lecture-2',
                tags: ['git init', 'git commit', 'git push', 'branching'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'The Git + Linux Gauntlet',
                description:
                    'A guided challenge series that puts both skills to the test. No hand-holding — you have the knowledge, now use it.',
                duration: '90 min',
                slug: 'week-1/activity',
                tags: ['merge conflicts', 'rebase', 'squash', 'process management'],
            },
        ],
    },
    {
        number: 2,
        theme: 'Containerization & Operating Systems',
        subtitle: 'Build once, run anywhere',
        icon: <Terminal className="h-5 w-5" />,
        color: 'blue',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Package Managers & Linux Deep Dive',
                description:
                    'From apt to brew to npm — learn how software is installed, managed, and versioned across different environments.',
                duration: '90 min',
                slug: 'week-2/lecture-1',
                tags: ['apt', 'npm', 'pip', 'yum', 'nginx'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Docker Fundamentals',
                description:
                    'Images, containers, layers, and caching. Build your first Dockerfile and understand why every modern team ships with Docker.',
                duration: '90 min',
                slug: 'week-2/lecture-2',
                tags: ['Dockerfile', 'docker run', 'image layers', 'volumes'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Containerize a Web App',
                description:
                    'Take a small Node app and package it into a fully portable Docker container. Then extend it with docker-compose for multi-service setups.',
                duration: '90 min',
                slug: 'week-2/activity',
                tags: ['docker-compose', 'networking', 'environment vars'],
            },
        ],
    },
    {
        number: 3,
        theme: 'Web Development',
        subtitle: 'Build interfaces people actually use',
        icon: <Globe className="h-5 w-5" />,
        color: 'purple',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'React Components & Hooks',
                description:
                    'The mental model that makes React click. Components, props, state, and the hook system that powers modern UIs.',
                duration: '90 min',
                slug: 'week-3/lecture-1',
                tags: ['useState', 'useEffect', 'props', 'JSX'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Tailwind CSS & State Management',
                description:
                    'Utility-first styling that scales. Build responsive layouts fast and learn to lift state up as your component trees grow.',
                duration: '90 min',
                slug: 'week-3/lecture-2',
                tags: ['flex', 'grid', 'responsive', 'lifting state'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Build the Task Tracker',
                description:
                    'A full CRUD app with localStorage persistence, Tailwind design, and optional Framer Motion animations. The classic project, done right.',
                duration: '90 min',
                slug: 'week-3/activity',
                tags: ['CRUD', 'localStorage', 'Framer Motion'],
            },
        ],
    },
    {
        number: 4,
        theme: 'Web Development — Continued',
        subtitle: 'Ship it',
        icon: <Globe className="h-5 w-5" />,
        color: 'purple',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Advanced React Patterns',
                description:
                    'Custom hooks, context, and component composition. The patterns that separate junior from senior React developers.',
                duration: '90 min',
                slug: 'week-4/lecture-1',
                tags: ['useContext', 'custom hooks', 'composition'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Hosting & Deployment',
                description:
                    'Get your app on the internet in under 10 minutes. Vercel, Netlify, environment variables, and CI/CD basics.',
                duration: '90 min',
                slug: 'week-4/lecture-2',
                tags: ['Vercel', 'Netlify', 'env vars', 'CI/CD'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Deploy the Task Tracker',
                description:
                    'Take last week\'s Task Tracker and ship it live. Configure environment variables, set up a custom domain, and watch your build pipeline run.',
                duration: '90 min',
                slug: 'week-4/activity',
                tags: ['deployment', 'domains', 'build pipeline'],
            },
        ],
    },
    {
        number: 5,
        theme: 'Backend Design',
        subtitle: 'The other half of the stack',
        icon: <Server className="h-5 w-5" />,
        color: 'green',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'FastAPI & RESTful APIs',
                description:
                    'Python\'s fastest web framework. Routes, query params, request bodies, Pydantic models, and error handling.',
                duration: '90 min',
                slug: 'week-5/lecture-1',
                tags: ['FastAPI', 'routes', 'Pydantic', 'OpenAPI'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'SQL & Database Design',
                description:
                    'Relational databases from the ground up. SELECT, JOIN, GROUP BY, normalization, and wiring SQLAlchemy to FastAPI.',
                duration: '90 min',
                slug: 'week-5/lecture-2',
                tags: ['SELECT', 'JOIN', 'SQLAlchemy', 'PostgreSQL'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Build a Notes API',
                description:
                    'A full CRUD REST API with user authentication, persistent storage, and auto-generated docs. Test every endpoint with curl.',
                duration: '90 min',
                slug: 'week-5/activity',
                tags: ['authentication', 'CRUD', 'curl', 'Postman'],
            },
        ],
    },
    {
        number: 6,
        theme: 'Prompt Engineering',
        subtitle: 'Talk to models, don\'t just use them',
        icon: <Sparkles className="h-5 w-5" />,
        color: 'yellow',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'LLM Fundamentals & Prompt Design',
                description:
                    'How language models actually work and why prompt structure matters. Role framing, output control, and chain-of-thought reasoning.',
                duration: '90 min',
                slug: 'week-6/lecture-1',
                tags: ['chain-of-thought', 'role framing', 'zero-shot', 'few-shot'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Applied Prompting & API Integration',
                description:
                    'Build real things with the Claude API. Structured outputs, self-refinement loops, and classification at scale.',
                duration: '90 min',
                slug: 'week-6/lecture-2',
                tags: ['Claude API', 'structured output', 'classification'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Prompt Engineering Challenges',
                description:
                    'A set of increasingly difficult tasks — summarization, classification, dialogue — where you design and iterate prompts to hit a target output.',
                duration: '90 min',
                slug: 'week-6/activity',
                tags: ['prompt iteration', 'evaluation', 'few-shot examples'],
            },
        ],
    },
    {
        number: 7,
        theme: 'Data Structures & Algorithms',
        subtitle: 'Think like an engineer',
        icon: <Binary className="h-5 w-5" />,
        color: 'red',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'C++ & OOP Foundations',
                description:
                    'Why C++ for DSA? The mental model of compiled languages, classes, and the four pillars of object-oriented design.',
                duration: '90 min',
                slug: 'week-7/lecture-1',
                tags: ['classes', 'encapsulation', 'inheritance', 'polymorphism'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Arrays, Linked Lists & Hash Maps',
                description:
                    'The bread and butter of technical interviews. Implement each structure, understand their tradeoffs, and solve real LeetCode problems.',
                duration: '90 min',
                slug: 'week-7/lecture-2',
                tags: ['arrays', 'linked lists', 'hash maps', 'time complexity'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'LeetCode Grind Session',
                description:
                    'Work through 2-3 problems per category from the NeetCode 150. Arrays & Hashing, Two Pointers, and Stack. Race the clock.',
                duration: '90 min',
                slug: 'week-7/activity',
                tags: ['NeetCode', 'arrays', 'two pointers', 'stack'],
            },
        ],
    },
    {
        number: 8,
        theme: 'DSA Continued & OOP',
        subtitle: 'Go deeper',
        icon: <Binary className="h-5 w-5" />,
        color: 'red',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Trees, Stacks & Queues',
                description:
                    'Hierarchical data structures and their traversal algorithms. BFS, DFS, and why the call stack is itself a stack.',
                duration: '90 min',
                slug: 'week-8/lecture-1',
                tags: ['trees', 'BFS', 'DFS', 'stacks', 'queues'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'OOP in Practice — C++ Project',
                description:
                    'Apply every OOP principle to a real system. Design classes, define interfaces, and build something that can actually grow.',
                duration: '90 min',
                slug: 'week-8/lecture-2',
                tags: ['inheritance', 'abstraction', 'interfaces', 'design patterns'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Library Management System',
                description:
                    'Build a complete Library Management System in C++ using OOP design principles. Books, members, checkout flows — all in classes.',
                duration: '90 min',
                slug: 'week-8/activity',
                tags: ['C++ classes', 'OOP design', 'system design'],
            },
        ],
    },
    {
        number: 9,
        theme: 'Agile Software Engineering',
        subtitle: 'How real teams ship',
        icon: <Workflow className="h-5 w-5" />,
        color: 'teal',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Scrum, Kanban & Sprint Cycles',
                description:
                    'The ceremonies, artifacts, and mindset behind agile teams. User stories, sprint planning, retrospectives, and backlogs.',
                duration: '90 min',
                slug: 'week-9/lecture-1',
                tags: ['Scrum', 'Kanban', 'user stories', 'sprints'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'CI/CD, TDD & Engineering Culture',
                description:
                    'Automated pipelines, test-driven development, and the practices that keep large codebases healthy. Your last lecture — make it count.',
                duration: '90 min',
                slug: 'week-9/lecture-2',
                tags: ['GitHub Actions', 'TDD', 'CI/CD', 'code review'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Sprint Simulation',
                description:
                    'Define epics, break them into stories, track them in GitHub Projects, and simulate a two-week sprint for your Task Tracker or Notes API.',
                duration: '90 min',
                slug: 'week-9/activity',
                tags: ['GitHub Projects', 'epics', 'burndown', 'retrospective'],
            },
        ],
    },
];

// ─── Color Map ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string; dot: string }> = {
    orange: {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        dot: 'bg-orange-400',
    },
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        dot: 'bg-blue-400',
    },
    green: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        dot: 'bg-emerald-400',
    },
    purple: {
        bg: 'bg-violet-50 dark:bg-violet-950/20',
        text: 'text-violet-600 dark:text-violet-400',
        border: 'border-violet-200 dark:border-violet-800',
        badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
        dot: 'bg-violet-400',
    },
    yellow: {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        dot: 'bg-amber-400',
    },
    red: {
        bg: 'bg-rose-50 dark:bg-rose-950/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
        dot: 'bg-rose-400',
    },
    teal: {
        bg: 'bg-teal-50 dark:bg-teal-950/20',
        text: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800',
        badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
        dot: 'bg-teal-400',
    },
};

// ─── Session Card ─────────────────────────────────────────────────────────────

interface SessionCardProps {
    session: Session;
    color: string;
}

const SessionCard = ({ session, color }: SessionCardProps) => {
    const navigate = useNavigate();
    const c = COLOR_MAP[color];
    const basePath = `/classes/introduction-to-fundamentals/${session.slug}`;

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
            whileHover={{ y: -2, scale: 1.005 }}
            whileTap={{ scale: 0.998 }}
            onClick={() => navigate(basePath)}
            className={`
        w-full text-left rounded-xl border p-4 transition-all duration-200 group
        ${config.cardBg}
        ${session.type === 'activity' ? c.border : 'border-border'}
        hover:shadow-md hover:border-primary/30
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
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
        </motion.button>
    );
};

// ─── Week Folder ──────────────────────────────────────────────────────────────

interface WeekFolderProps {
    week: Week;
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}

const WeekFolder = ({ week, isOpen, onToggle, index }: WeekFolderProps) => {
    const c = COLOR_MAP[week.color];

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
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>
                            Week {week.number}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                        <span className="text-xs text-muted-foreground">{week.subtitle}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground truncate">{week.theme}</h3>
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
                                    color={week.color}
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

export default function IntroductionToFundamentals() {
    const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([1]));

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
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

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
                        onClick={() => window.location.href = '/classes'}
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
                        <p className="mt-1.5 text-sm text-muted-foreground max-w-xl leading-relaxed">
                            An 18-session journey from zero to full-stack. Terminal fluency, version control,
                            containers, React, backend APIs, prompt engineering, algorithms, and agile — everything
                            you need to contribute to real projects.
                        </p>
                    </div>
                </div>

                {/* Topic pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {['Linux', 'Git', 'Docker', 'React', 'FastAPI', 'SQL', 'Prompt Engineering', 'C++ & DSA', 'Agile'].map((topic) => (
                        <Badge key={topic} variant="secondary">
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
            <div className="space-y-3">
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

            {/* ── Footer note ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-muted-foreground text-center pb-4"
            >
                Sessions are added as the semester progresses. All content is reused each semester —
                if a session isn't live yet, check back after the next class meeting.
            </motion.p>
        </div>
    );
}