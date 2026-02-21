/**
 * TerminalBlock
 *
 * A styled macOS-style terminal window for displaying commands in lecture pages.
 * Commands and comments are intentionally non-selectable to encourage students to type.
 *
 * Usage:
 *   <TerminalBlock
 *     title="bash — ~/projects"        // optional, defaults to "bash — ~"
 *     lines={[
 *       { comment: "create a file", cmd: "touch notes.txt" },
 *       { cmd: "ls -la" },
 *     ]}
 *   />
 */

interface TerminalLine {
    /** Optional grey comment shown above the command (like a # bash comment) */
    comment?: string;
    /** The command itself — shown in green, non-selectable */
    cmd: string;
}

interface TerminalBlockProps {
    lines: TerminalLine[];
    /** Text shown in the title bar. Defaults to "bash — ~" */
    title?: string;
}

export const TerminalBlock = ({ lines, title = 'bash — ~' }: TerminalBlockProps) => (
    <div className="rounded-xl overflow-hidden border border-zinc-700 shadow-xl my-6 font-mono text-sm">
        {/* Title bar */}
        <div className="bg-zinc-800 px-4 py-2.5 flex items-center gap-2 border-b border-zinc-700">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-3 text-xs text-zinc-400 tracking-wide select-none">{title}</span>
        </div>
        {/* Body */}
        <div className="bg-zinc-950 px-5 py-4 space-y-3">
            {lines.map((line, i) => (
                <div key={i}>
                    {line.comment && (
                        <p className="text-zinc-500 text-xs mb-1 select-none"># {line.comment}</p>
                    )}
                    <p
                        className="text-emerald-400 select-none"
                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                        <span className="text-zinc-500 mr-2">$</span>
                        {line.cmd}
                    </p>
                </div>
            ))}
        </div>
    </div>
);