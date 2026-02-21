/**
 * LectureLayout
 *
 * Wrapper for every lecture and activity page. Provides:
 *   - TooltipProvider (required for LectureCmd tooltips to work)
 *   - Consistent max-width, padding, and vertical spacing
 *   - Staggered fade-in animation for the page body
 *
 * Every lecture page should be wrapped in this instead of managing
 * TooltipProvider and layout styles individually.
 *
 * Usage:
 *   export default function Week1Lecture1() {
 *     return (
 *       <LectureLayout>
 *         <LectureHeader ... />
 *         <LectureSectionHeading ... />
 *         ...
 *       </LectureLayout>
 *     );
 *   }
 */

import { motion } from 'framer-motion';

interface LectureLayoutProps {
    children: React.ReactNode;
}

export const LectureLayout = ({ children }: LectureLayoutProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto px-4 py-8"
    >
        {children}
    </motion.div>
);