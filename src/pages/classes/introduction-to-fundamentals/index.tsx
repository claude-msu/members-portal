import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Terminal,
    GitBranch,
    Package,
    Globe,
    Server,
    Cpu,
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
    color: string;
    sessions: Session[];
}

// ─── Curriculum Data ─────────────────────────────────────────────────────────

const WEEKS: Week[] = [
    {
        number: 1,
        theme: 'Linux & The Command Line',
        subtitle: 'Your new home base',
        icon: <Terminal className="h-5 w-5" />,
        color: 'brown',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Linux & The Command Line',
                description:
                    'Every server, container, and cloud environment runs Linux underneath. Learn to navigate, manipulate files, manage processes, and install software without touching a mouse.',
                duration: '90 min',
                slug: 'week-1/lecture-1',
                tags: ['ls', 'grep', 'chmod', 'apt', 'brew'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Shell Scripting & Permissions',
                description:
                    'Automate repetitive tasks with bash scripts and understand the Unix permission model that controls who can read, write, and execute everything on the system.',
                duration: '90 min',
                slug: 'week-1/lecture-2',
                tags: ['bash', 'chmod', 'chown', 'shebang', 'cron'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'The Linux Gauntlet',
                description:
                    'Navigate, manipulate, script, and automate — 90 minutes of terminal challenges that cover everything from Week 1. No walkthroughs, just commands and results.',
                duration: '90 min',
                slug: 'week-1/activity',
                tags: ['filesystem', 'grep', 'bash scripts', 'permissions'],
            },
        ],
    },
    {
        number: 2,
        theme: 'Git & Agile Engineering',
        subtitle: 'How real teams work',
        icon: <GitBranch className="h-5 w-5" />,
        color: 'gray',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Version Control with Git',
                description:
                    'Git is the foundation of every professional software team. Learn not just the commands, but why it works the way it does — commits, branches, merges, and how to recover from mistakes.',
                duration: '90 min',
                slug: 'week-2/lecture-1',
                tags: ['git init', 'git commit', 'branching', 'merge conflicts'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'GitHub, Agile & Project Management',
                description:
                    'Pull requests, GitHub Projects, issues, and the Agile workflow that connects them. This is how every team in industry tracks work from idea to shipped feature.',
                duration: '90 min',
                slug: 'week-2/lecture-2',
                tags: ['pull requests', 'GitHub Projects', 'issues', 'Scrum', 'Kanban'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Project Kickoff',
                description:
                    'Choose your project domain, scaffold your repo, create your GitHub Project board, write issues for Weeks 3–5, and open your first PR. Every deliverable from here ships through this board.',
                duration: '90 min',
                slug: 'week-2/activity',
                tags: ['GitHub Projects', 'issues', 'pull requests', 'README'],
            },
        ],
    },
    {
        number: 3,
        theme: 'Containerization with Docker',
        subtitle: 'Build once, run anywhere',
        icon: <Package className="h-5 w-5" />,
        color: 'green',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Package Managers & Environments',
                description:
                    'Every language has a package manager. Learn how they resolve dependencies, why virtual environments exist, and how to never pollute your system Python again.',
                duration: '90 min',
                slug: 'week-3/lecture-1',
                tags: ['apt', 'npm', 'pip', 'venv', 'dependency resolution'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Docker & Containerization',
                description:
                    '"It works on my machine" ends here. Docker packages your app and everything it needs into a single portable unit that runs identically everywhere.',
                duration: '90 min',
                slug: 'week-3/lecture-2',
                tags: ['Dockerfile', 'docker run', 'image layers', 'volumes'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Containerize Your Backend Stub',
                description:
                    'Write a Dockerfile for a provided Python stub, mount a volume to persist data between runs, and compare image sizes between base images. Your container is ready for Week 4.',
                duration: '90 min',
                slug: 'week-3/activity',
                tags: ['Dockerfile', 'volumes', 'docker images', 'base images'],
            },
        ],
    },
    {
        number: 4,
        theme: 'Backend Development',
        subtitle: 'The engine under the hood',
        icon: <Server className="h-5 w-5" />,
        color: 'blue',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'FastAPI & Python Backends',
                description:
                    'Real apps need a server — for auth, shared state, and business logic that cannot run in the browser. FastAPI is the fastest path from zero to a documented, production-ready Python API.',
                duration: '90 min',
                slug: 'week-4/lecture-1',
                tags: ['FastAPI', 'Pydantic', 'REST', 'endpoints', 'docs'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Databases: SQL, SQLite & Redis',
                description:
                    'SQLite for relational persistent storage, Redis for fast caching. Learn when to use each, how they work together, and how Docker Compose wires both services into one command.',
                duration: '90 min',
                slug: 'week-4/lecture-2',
                tags: ['SQLite', 'SQL', 'Redis', 'caching', 'docker-compose'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Build Your Backend',
                description:
                    'Build the FastAPI backend for your chosen project domain — 3+ endpoints, SQLite storage, Redis caching layer, all running via Docker Compose. Deliverable ships as a PR.',
                duration: '90 min',
                slug: 'week-4/activity',
                tags: ['FastAPI', 'SQLite', 'Redis', 'docker-compose', 'REST'],
            },
        ],
    },
    {
        number: 5,
        theme: 'Frontend Development',
        subtitle: 'Build interfaces people actually use',
        icon: <Globe className="h-5 w-5" />,
        color: 'purple',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'React Components & Hooks',
                description:
                    'React is the most widely used frontend library in the world. Learn the mental model, components, props, state, and the hooks you will use every single day.',
                duration: '90 min',
                slug: 'week-5/lecture-1',
                tags: ['useState', 'useEffect', 'props', 'JSX'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Tailwind CSS & Connecting to Your API',
                description:
                    'Style your UI with utility classes that do exactly one thing, then wire your React frontend to the FastAPI backend you built last week using fetch.',
                duration: '90 min',
                slug: 'week-5/lecture-2',
                tags: ['Tailwind', 'flex', 'grid', 'fetch', 'useEffect'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Build Your Frontend',
                description:
                    'Build the React + Tailwind frontend for your project — 3+ views, real data flowing from your API, fully styled. By the end you have a live full-stack end to end.',
                duration: '90 min',
                slug: 'week-5/activity',
                tags: ['React', 'Tailwind', 'fetch', 'components', 'state'],
            },
        ],
    },
    {
        number: 6,
        theme: 'C++ & Object-Oriented Programming',
        subtitle: 'Design software, not just functions',
        icon: <Cpu className="h-5 w-5" />,
        color: 'red',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Classes, Encapsulation & Inheritance',
                description:
                    'C++ OOP from the ground up — classes, access modifiers, constructors, inheritance chains, and the virtual keyword that makes polymorphism possible.',
                duration: '90 min',
                slug: 'week-6/lecture-1',
                tags: ['classes', 'encapsulation', 'inheritance', 'virtual'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Polymorphism, STL & System Design',
                description:
                    'Abstract base classes, pure virtual methods, and STL containers — the tools you need to design a real system where types can be extended without rewriting the core.',
                duration: '90 min',
                slug: 'week-6/lecture-2',
                tags: ['polymorphism', 'abstract classes', 'vector', 'unordered_map'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'CLI Phonebook — Part 1',
                description:
                    'Build the OOP foundation of a CLI Phonebook in C++ — Contact class hierarchy, manager class, and a working add/list/delete interface.',
                duration: '90 min',
                slug: 'week-6/activity',
                tags: ['C++ classes', 'inheritance', 'STL', 'CLI'],
            },
        ],
    },
    {
        number: 7,
        theme: 'Data Structures & Algorithms',
        subtitle: 'Go deeper',
        icon: <Binary className="h-5 w-5" />,
        color: 'red',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Trees, Stacks & Queues',
                description:
                    'Binary trees, BSTs, in-order traversal, stacks, and queues — the non-linear structures that show up in databases, compilers, and every technical interview you will ever take.',
                duration: '90 min',
                slug: 'week-7/lecture-1',
                tags: ['BST', 'in-order traversal', 'BFS', 'DFS', 'stacks', 'queues'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'Hash Maps, Complexity & Interview Patterns',
                description:
                    'Hash maps, Big-O analysis, two-pointer and sliding window patterns — the toolkit for turning O(n²) brute-force solutions into O(n) answers.',
                duration: '90 min',
                slug: 'week-7/lecture-2',
                tags: ['hash maps', 'Big-O', 'two pointers', 'sliding window'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'CLI Phonebook — Part 2',
                description:
                    'Extend your Week 6 Phonebook with a BST for alphabetically sorted storage, a stack-based undo system, and O(1) search via an unordered_map index.',
                duration: '90 min',
                slug: 'week-7/activity',
                tags: ['BST', 'in-order traversal', 'stack undo', 'unordered_map'],
            },
        ],
    },
    {
        number: 8,
        theme: 'Sprint Review & Showcase',
        subtitle: 'Ship it and reflect',
        icon: <Workflow className="h-5 w-5" />,
        color: 'indigo',
        sessions: [
            {
                type: 'lecture',
                label: 'Lecture 1',
                title: 'Scrum, Kanban & Sprint Cycles',
                description:
                    'The ceremonies, artifacts, and mindset behind agile teams — user stories, sprint planning, standups, and retrospectives.',
                duration: '90 min',
                slug: 'week-8/lecture-1',
                tags: ['Scrum', 'Kanban', 'user stories', 'sprints', 'retro'],
            },
            {
                type: 'lecture',
                label: 'Lecture 2',
                title: 'CI/CD, TDD & Engineering Culture',
                description:
                    'Automated pipelines, test-driven development, code review culture, and the practices that keep large codebases from collapsing under their own weight.',
                duration: '90 min',
                slug: 'week-8/lecture-2',
                tags: ['GitHub Actions', 'TDD', 'CI/CD', 'code review'],
            },
            {
                type: 'activity',
                label: 'Activity',
                title: 'Sprint Simulation & Project Showcase',
                description:
                    'Close out your GitHub Project board, present your full-stack app as a sprint review demo, retrospective, and walk through what you would build next.',
                duration: '90 min',
                slug: 'week-8/activity',
                tags: ['sprint review', 'demo', 'retrospective', 'GitHub Projects'],
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
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-700',
        badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
        dot: 'bg-indigo-500',
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
                    ].map((topic) => (
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