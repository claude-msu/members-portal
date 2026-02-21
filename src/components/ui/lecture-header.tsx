/**
 * LectureHeader
 *
 * The hero section at the top of every lecture and activity page.
 * Includes breadcrumb navigation, week/session label, title, description,
 * and metadata badges (duration, difficulty).
 *
 * Usage:
 *   <LectureHeader
 *     week={1}
 *     session="Lecture 1"
 *     title="Linux & The Command Line"
 *     description="Before you can build anything serious..."
 *     duration="90 min"
 *     difficulty="Beginner"
 *     icon={<Terminal className="h-4 w-4 text-orange-600" />}
 *   />
 */

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';

interface LectureHeaderProps {
    week: number;
    /** e.g. "Lecture 1", "Lecture 2", "Activity" */
    session: string;
    title: string;
    description: string;
    duration?: string;
    difficulty?: string;
    /** Icon rendered inside the small square badge next to the session label */
    icon: React.ReactNode;
    /** Called when the breadcrumb back link is clicked */
}

import { useNavigate } from 'react-router-dom';

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
            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6"
            >
                <BookOpen className="h-3.5 w-3.5" />
                <button
                    onClick={() => navigate('/classes')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                    Classes
                </button>
                <ChevronRight className="h-3 w-3" />

                <button
                    onClick={() => navigate('/classes/introduction-to-fundamentals')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                    Introduction to Fundamentals
                </button>
                <ChevronRight className="h-3 w-3" />
                <span>Week {week}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{session}</span>
            </motion.div>

            {/* Hero */}
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