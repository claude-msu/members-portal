import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Terminal,
    GitBranch,
    Globe,
    Server,
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
    slug: string;
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
        color: 'brown',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Linux & The Command Line',
                description:
                    'Before you can build anything serious, you need to feel at home in the terminal. Every server, every container, every cloud environment — it\'s all Linux underneath. By the end of this lecture you\'ll navigate, manipulate files, manage processes, and install real software without touching a mouse.',
                duration: '90 min',
                slug: 'week-1/lecture-1',
                tags: ['ls', 'grep', 'chmod', 'apt', 'brew'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Version Control with Git',
                description:
                    'You\'re already comfortable in the terminal. Now let\'s make sure your work is never lost, always collaborative, and completely traceable. Git is the foundation of every professional software team on the planet — and after this lecture, you\'ll understand not just how to use it, but why it works the way it does.',
                duration: '90 min',
                slug: 'week-1/lecture-2',
                tags: ['git init', 'git commit', 'git push', 'branching'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'The Git + Linux Gauntlet',
                description:
                    'Two lectures down. Now you prove it. This activity strings together everything from Lecture 1 and Lecture 2 into a set of increasingly difficult challenges. There are no walkthroughs here — you have the knowledge, now apply it. Hints are available if you get stuck, but try without them first.',
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
        color: 'gray',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Package Managers',
                description:
                    'Every language, every platform, every operating system has one thing in common: a package manager. Understanding how they work — not just the commands, but the model underneath — is what separates developers who can set up any environment from developers who can only follow tutorials.',
                duration: '90 min',
                slug: 'week-2/lecture-1',
                tags: ['apt', 'npm', 'pip', 'yum', 'nginx'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Docker & Containerization',
                description:
                    '\'It works on my machine\' is the most expensive sentence in software. Docker solves this by packaging your application and everything it needs — runtime, libraries, config — into a single portable unit that runs identically everywhere. This lecture covers the concepts, the commands, and the Dockerfile.',
                duration: '90 min',
                slug: 'week-2/lecture-2',
                tags: ['Dockerfile', 'docker run', 'image layers', 'volumes'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'The Containerization Challenge',
                description:
                    'Two lectures down. Now you take a real application from zero to fully containerized. By the end of this session you\'ll have a Node.js app and a PostgreSQL database running together in Docker, communicating over a Compose network, with data that survives container restarts.',
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
                    'React is the most widely used frontend library in the world, and for good reason — it gives you a clean model for building UIs out of reusable pieces. This lecture covers the mental model, components, props, state, and the hooks you\'ll use every single day.',
                duration: '90 min',
                slug: 'week-3/lecture-1',
                tags: ['useState', 'useEffect', 'props', 'JSX'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Tailwind CSS',
                description:
                    'Traditional CSS requires you to name things, context-switch between files, and mentally map class names to their styles. Tailwind eliminates all of that — you style directly in your markup with utility classes that do exactly one thing. Once it clicks, you\'ll never want to write traditional CSS again.',
                duration: '90 min',
                slug: 'week-3/lecture-2',
                tags: ['flex', 'grid', 'responsive', 'lifting state'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Build the Task Tracker',
                description:
                    'This is the first real project build of the course — a complete Task Tracker from scratch with React, TypeScript, and Tailwind. Full CRUD, localStorage persistence, and optional Framer Motion. By the end you\'ll have something fully functional and ready to deploy.',
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
                    'You know the fundamentals. Now the patterns that separate junior React developers from seniors: Context for global state, useReducer for complex state logic, performance optimization with memo and useCallback, and React Router for multi-page apps.',
                duration: '90 min',
                slug: 'week-4/lecture-1',
                tags: ['useContext', 'custom hooks', 'composition'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Deployment & CI/CD',
                description:
                    'Writing code is half the job. Getting it to users reliably and repeatedly is the other half. This lecture covers how modern teams deploy software: environment variables, Vercel\'s deployment model, GitHub Actions for automated pipelines, and what CI/CD actually means in practice.',
                duration: '90 min',
                slug: 'week-4/lecture-2',
                tags: ['Vercel', 'Netlify', 'env vars', 'CI/CD'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Upgrade the Task Tracker',
                description:
                    'You built the Task Tracker last week. Now you apply everything from Week 4 to make it production-grade: refactor state to useReducer, add Context so any component can access tasks, set up a CI pipeline that blocks bad code, and ship it with a custom domain.',
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
        color: 'blue',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'FastAPI & Python Backends',
                description:
                    'Every app eventually needs a server. Not because localStorage isn\'t enough — it is, for a while — but because real apps need authentication, shared state between users, persistent storage, and business logic that can\'t run in the browser. FastAPI is the fastest path from zero to a production-ready Python API.',
                duration: '90 min',
                slug: 'week-5/lecture-1',
                tags: ['FastAPI', 'routes', 'Pydantic', 'OpenAPI'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'SQL & Databases',
                description:
                    'Every serious application stores data somewhere. Relational databases have been the dominant storage technology for 50 years for good reason — they\'re consistent, queryable, and battle-tested. This lecture covers the SQL you\'ll actually use, how to connect a database to FastAPI with SQLAlchemy, and when to reach for PostgreSQL vs. SQLite.',
                duration: '90 min',
                slug: 'week-5/lecture-2',
                tags: ['SELECT', 'JOIN', 'SQLAlchemy', 'PostgreSQL'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Build the Notes API',
                description:
                    'Two lectures, one project: a fully functional Notes API with user management, CRUD operations, search, and persistent SQLite storage — all documented and testable through FastAPI\'s interactive docs. This is your first real backend.',
                duration: '90 min',
                slug: 'week-5/activity',
                tags: ['authentication', 'CRUD', 'curl', 'Postman'],
            },
        ],
    },
    {
        number: 6,
        theme: 'Data Structures & Algorithms',
        subtitle: 'Think like an engineer',
        icon: <Binary className="h-5 w-5" />,
        color: 'red',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Arrays, Linked Lists, Stacks & Queues',
                description:
                    'Data structures are the vocabulary of algorithms. Before you can solve problems efficiently, you need to know which structure fits which problem — and understand why, not just what to type. This lecture covers the four foundational structures in C++, their tradeoffs, and the problems they\'re built for.',
                duration: '90 min',
                slug: 'week-6/lecture-1',
                tags: ['classes', 'encapsulation', 'inheritance', 'polymorphism'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Trees, Hash Maps & Object-Oriented Programming',
                description:
                    'Trees are the most important non-linear structure in computer science — they show up in databases, compilers, file systems, and the DOM. OOP in C++ is where you learn to design software, not just write functions. This lecture covers binary trees, BSTs, the four OOP principles, and how to apply them to build a real system.',
                duration: '90 min',
                slug: 'week-6/lecture-2',
                tags: ['arrays', 'linked lists', 'hash maps', 'time complexity'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Library Management System',
                description:
                    'You\'ll build a complete Library Management System in C++ from scratch — using every concept from both lectures: abstract base classes, inheritance, polymorphism through virtual methods, and STL containers for catalog and loan tracking. Then you\'ll close out with a curated set of interview problems.',
                duration: '90 min',
                slug: 'week-6/activity',
                tags: ['NeetCode', 'arrays', 'two pointers', 'stack'],
            },
        ],
    },
    {
        number: 7,
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
                slug: 'week-7/lecture-1',
                tags: ['trees', 'BFS', 'DFS', 'stacks', 'queues'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'OOP in Practice — C++ Project',
                description:
                    'Apply every OOP principle to a real system. Design classes, define interfaces, and build something that can actually grow.',
                duration: '90 min',
                slug: 'week-7/lecture-2',
                tags: ['inheritance', 'abstraction', 'interfaces', 'design patterns'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Library Management System',
                description:
                    'Build a complete Library Management System in C++ using OOP design principles. Books, members, checkout flows — all in classes.',
                duration: '90 min',
                slug: 'week-7/activity',
                tags: ['C++ classes', 'OOP design', 'system design'],
            },
        ],
    },
    {
        number: 8,
        theme: 'Agile Software Engineering',
        subtitle: 'How real teams ship',
        icon: <Workflow className="h-5 w-5" />,
        color: 'green',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Scrum, Kanban & Sprint Cycles',
                description:
                    'The ceremonies, artifacts, and mindset behind agile teams. User stories, sprint planning, retrospectives, and backlogs.',
                duration: '90 min',
                slug: 'week-8/lecture-1',
                tags: ['Scrum', 'Kanban', 'user stories', 'sprints'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'CI/CD, TDD & Engineering Culture',
                description:
                    'Automated pipelines, test-driven development, and the practices that keep large codebases healthy. Your last lecture — make it count.',
                duration: '90 min',
                slug: 'week-8/lecture-2',
                tags: ['GitHub Actions', 'TDD', 'CI/CD', 'code review'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Sprint Simulation',
                description:
                    'Define epics, break them into stories, track them in GitHub Projects, and simulate a two-week sprint for your Task Tracker or Notes API.',
                duration: '90 min',
                slug: 'week-8/activity',
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
    brown: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        border: 'border-yellow-300 dark:border-yellow-700',
        badge: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/60 dark:text-yellow-200',
        dot: 'bg-yellow-700',
    },
    gray: {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-400 dark:border-gray-700',
        badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-200',
        dot: 'bg-gray-400',
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
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
                <ChevronRight className={`h-4 w-4 ${c.text} shrink-0 mt-1 group-hover:translate-x-0.5 transition-all`} />
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
    const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set());
    const navigate = useNavigate();

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
                            An 18-session journey from zero to full-stack. Terminal fluency, version control,
                            containers, React, backend APIs, algorithms, and agile — everything
                            you need to contribute to real projects.
                        </p>
                    </div>
                </div>

                {/* Topic pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {['Linux', 'Git', 'Docker', 'React', 'FastAPI', 'SQL', 'C++ & DSA', 'Agile'].map((topic) => (
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