/**
 * Lecture typography primitives
 *
 * Shared text components used across all lecture pages for consistent
 * formatting. Import what you need rather than re-defining inline.
 *
 * Components:
 *   LectureSectionHeading  — numbered H2 with orange left accent
 *   LectureSubHeading      — H3 for subsections within a section
 *   LectureP               — body paragraph in muted text
 *   LectureTerm            — bold inline term highlight
 */

// ─── Section Heading ──────────────────────────────────────────────────────────

/**
 * Top-level section heading with a numbered label and orange left border accent.
 *
 * Usage:
 *   <LectureSectionHeading number="01" title="What is the Terminal?" />
 *   <LectureSectionHeading number="02" title="Navigating the Filesystem" />
 */
interface LectureSectionHeadingProps {
    /** Zero-padded number shown in the left margin, e.g. "01", "02" */
    number: string;
    title: string;
}

export const LectureSectionHeading = ({ number, title }: LectureSectionHeadingProps) => (
    <div className="flex items-start gap-4 my-6">
        <span className="text-xs font-bold text-muted-foreground mt-1.5 w-6 shrink-0 text-right select-none">
            {number}
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground border-l-2 border-primary pl-4">
            {title}
        </h2>
    </div>
);

// ─── Sub Heading ──────────────────────────────────────────────────────────────

/**
 * Subsection heading — sits inside a section, no number.
 *
 * Usage:
 *   <LectureSubHeading title="Opening a terminal" />
 */
export const LectureSubHeading = ({ title }: { title: string }) => (
    <h3 className="text-base font-semibold text-foreground mt-10 mb-3">{title}</h3>
);

// ─── Paragraph ───────────────────────────────────────────────────────────────

/**
 * Body paragraph. Accepts any React children so you can embed
 * LectureCmd, LectureTerm, or plain <code> inline.
 *
 * Usage:
 *   <LectureP>
 *     The <LectureTerm>working directory</LectureTerm> is where you currently are.
 *     Use <LectureCmd tip="print working directory">pwd</LectureCmd> to see it.
 *   </LectureP>
 */
export const LectureP = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm leading-7 text-muted-foreground">{children}</p>
);

// ─── Term ─────────────────────────────────────────────────────────────────────

/**
 * Inline bold term — for introducing key vocabulary.
 *
 * Usage:
 *   <LectureTerm>shell</LectureTerm>
 */
export const LectureTerm = ({ children }: { children: string }) => (
    <span className="font-semibold text-foreground">{children}</span>
);