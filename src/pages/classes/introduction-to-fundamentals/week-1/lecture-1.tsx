import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { TerminalBlock } from '@/components/ui/terminal-block';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { LectureCmd } from '@/components/ui/lecture-cmd';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';

export default function Week1Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={1}
                session="Lecture 1"
                title="Linux & The Command Line"
                description="Every server, container, and cloud environment runs Linux underneath. Learn to navigate, manipulate files, manage processes, and install software without touching a mouse."
                icon={<Terminal className="h-4 w-4" />}
            />

            {/* ── 01 WHAT IS THE TERMINAL ─────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="What is the Terminal?" />

            <LectureP>
                You usually interact with a <LectureTermWithTip tip="Windows, icons, buttons, mouse — a layer on top of the OS to make things approachable. A convenience, not a necessity.">GUI</LectureTermWithTip>. Underneath it is a <LectureTermWithTip tip="A program that takes typed commands and passes them directly to the operating system. No middleman.">shell</LectureTermWithTip>. The <LectureTermWithTip tip="Also called command line, console, or CLI. The window where you type commands to the shell.">terminal</LectureTermWithTip> is where you talk to that shell.
            </LectureP>
            <LectureP>
                The shell exposes everything; GUIs only expose what a designer included. Automate tasks, chain operations, work on remote servers — all from the terminal.
            </LectureP>

            <LectureCallout type="info">
                You'll use <LectureCmd tip="Bourne Again Shell — default on most Linux. Brian Fox, 1989.">bash</LectureCmd> or <LectureCmd tip="Z Shell — default on macOS since Catalina. Very similar to bash.">zsh</LectureCmd>. This course works in both.
            </LectureCallout>

            <LectureSubHeading title="Opening a terminal" />

            <LectureP>
                <LectureTermWithTip tip="⌘ + Space → type “Terminal” → Enter. Or use iTerm2 for more power.">macOS</LectureTermWithTip>: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">⌘ + Space</code>, type "Terminal", Enter.
            </LectureP>
            <LectureP>
                <LectureTermWithTip tip="Install WSL2 from the Microsoft Store for a real Linux environment inside Windows.">Windows</LectureTermWithTip>: install WSL2. Search "WSL" in the Microsoft Store.
            </LectureP>
            <LectureP>
                <LectureTermWithTip tip="Ctrl + Alt + T on most distros.">Linux</LectureTermWithTip>: you already have one. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Ctrl + Alt + T</code>.
            </LectureP>
            <LectureP>
                You'll see a <LectureTermWithTip tip="The shell is waiting for input. Type after the $ and press Enter to run. That's the whole interface.">prompt</LectureTermWithTip> (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">$</code>). Type a command, press Enter.
            </LectureP>

            <TerminalBlock lines={[{ cmd: '' }]} />

            {/* ── 02 NAVIGATION ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Navigating the Filesystem" />

            <LectureP>
                Files live in a <LectureTermWithTip tip="A tree of directories and files. On Linux/macOS everything starts at / (root). Home is /home/you or /Users/you; ~ is shorthand for home.">filesystem</LectureTermWithTip>. You're always "in" one folder — your <LectureTermWithTip tip="Where you currently are. Commands run relative to this unless you specify a path.">working directory</LectureTermWithTip>.
            </LectureP>

            <LectureSubHeading title="Where am I?" />
            <LectureP>
                <LectureCmd tip="print working directory — full path of where you are. Run whenever you're disoriented.">pwd</LectureCmd>
            </LectureP>
            <TerminalBlock lines={[{ comment: 'print your current location', cmd: 'pwd' }]} />

            <LectureSubHeading title="What's in here?" />
            <LectureP>
                <LectureCmd tip="list — contents of the current directory. -l = long format (permissions, size, date). -a = show hidden files (names starting with .).">ls</LectureCmd> — use <LectureCmd tip="-la: long format + all files. The combo you'll use most.">-la</LectureCmd> for the full picture.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'list files in the current directory', cmd: 'ls' },
                    { comment: 'list ALL files including hidden ones, in long format', cmd: 'ls -la' },
                    { comment: 'list a specific directory without navigating there', cmd: 'ls -la /etc' },
                ]}
            />

            <LectureSubHeading title="Moving around" />
            <LectureP>
                <LectureCmd tip="change directory — move to another folder. Like double-clicking, but faster.">cd</LectureCmd> moves you. <LectureCmd tip="Parent directory — one level up. Use constantly.">..</LectureCmd> goes up; <LectureCmd tip="Your home directory. Works anywhere.">~</LectureCmd> goes home.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'go to the Documents folder inside your home directory', cmd: 'cd ~/Documents' },
                    { comment: 'go up one level (to the parent directory)', cmd: 'cd ..' },
                    { comment: 'go up two levels at once', cmd: 'cd ../..' },
                    { comment: 'go back to your home directory (the ~ shortcut)', cmd: 'cd ~' },
                    { comment: 'go back to the last directory you were in', cmd: 'cd -' },
                ]}
            />
            <LectureCallout type="tip">
                <LectureTermWithTip tip="Start typing a path or filename and hit Tab — shell completes it. Tab twice for multiple matches. Saves thousands of keystrokes.">Tab</LectureTermWithTip> autocompletes. Use it.
            </LectureCallout>

            {/* ── 03 FILE MANIPULATION ────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Creating and Manipulating Files" />

            <LectureP>
                Create, copy, move, delete — all from the terminal.
            </LectureP>

            <LectureSubHeading title="Creating files and directories" />
            <TerminalBlock
                lines={[
                    { comment: 'create an empty file called notes.txt', cmd: 'touch notes.txt' },
                    { comment: 'create a new directory called projects', cmd: 'mkdir projects' },
                    { comment: 'create nested directories in one shot', cmd: 'mkdir -p projects/web/src' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="Creates an empty file (or updates its timestamp).">touch</LectureCmd> for files. <LectureCmd tip="Creates a directory. -p = create parent dirs as needed.">mkdir</LectureCmd> for folders. <LectureCmd tip="-p: create parent directories. Without it, mkdir fails if parents don't exist.">-p</LectureCmd> when nesting.
            </LectureP>

            <LectureSubHeading title="Copying and moving" />
            <TerminalBlock
                lines={[
                    { comment: 'copy notes.txt to a new file called backup.txt', cmd: 'cp notes.txt backup.txt' },
                    { comment: 'copy a whole directory and everything inside it', cmd: 'cp -r projects projects-backup' },
                    { comment: 'move (or rename) a file', cmd: 'mv notes.txt ~/Documents/notes.txt' },
                    { comment: 'rename a file (mv works for renaming too)', cmd: 'mv backup.txt old-notes.txt' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="Copy a file. -r for directories.">cp</LectureCmd>. <LectureCmd tip="Move (or rename — same directory, new name). No separate rename command.">mv</LectureCmd>.
            </LectureP>

            <LectureSubHeading title="Deleting files" />
            <TerminalBlock
                lines={[
                    { comment: 'delete a single file', cmd: 'rm notes.txt' },
                    { comment: 'delete a directory and all its contents', cmd: 'rm -r projects-backup' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="Permanent delete. No trash, no undo. -r for directories.">rm</LectureCmd> — gone for good.
            </LectureP>
            <LectureCallout type="warning">
                <LectureCmd tip="Recursive + force. No confirmation. Wrong path = disaster. Never run on / or system paths." warn>rm -rf</LectureCmd> is dangerous. Double-check the path.
            </LectureCallout>

            {/* ── 04 READING FILES ────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Reading File Contents" />

            <LectureP>
                Read files without opening an editor — logs, configs, code.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'print the entire contents of a file', cmd: 'cat notes.txt' },
                    { comment: 'view a large file one screen at a time', cmd: 'less server.log' },
                    { comment: 'print the first 10 lines of a file', cmd: 'head server.log' },
                    { comment: 'print the last 10 lines', cmd: 'tail server.log' },
                    { comment: 'watch a log file update in real time', cmd: 'tail -f server.log' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="Print whole file to the terminal.">cat</LectureCmd>. <LectureCmd tip="Scroll through large files: arrows, / to search, q to quit.">less</LectureCmd> for big files. <LectureCmd tip="Follow mode — stream new lines as they're added. Essential for live logs.">tail -f</LectureCmd> for live logs.
            </LectureP>

            <LectureSubHeading title="Searching inside files with grep" />
            <LectureP>
                <LectureCmd tip="Search for a pattern; prints every matching line. -i = case-insensitive, -n = line numbers, -r = recursive through dirs. One of the most useful commands.">grep</LectureCmd> finds text in files.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'find every line containing the word "error"', cmd: 'grep "error" server.log' },
                    { comment: 'case-insensitive search', cmd: 'grep -i "error" server.log' },
                    { comment: 'search recursively through every file in a directory', cmd: 'grep -r "TODO" ./src' },
                    { comment: 'show line numbers alongside matches', cmd: 'grep -n "error" server.log' },
                    { comment: 'combine: case-insensitive + line numbers + recursive', cmd: 'grep -inr "console.log" ./src' },
                ]}
            />
            <LectureCallout type="tip">
                <LectureCmd tip="Recursive grep through a codebase — often faster than IDE search.">grep -r</LectureCmd> in a project to find where something's defined or used.
            </LectureCallout>

            {/* ── 05 PERMISSIONS ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Permissions" />

            <LectureP>
                Every file has <LectureTermWithTip tip="Who can read, write, or execute. Misconfigured permissions = bugs and security issues.">permissions</LectureTermWithTip>. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ls -la</code> shows them.
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 p-5 font-mono text-sm">
                <div className="flex items-start gap-3 flex-wrap">
                    {[
                        { chars: '-', label: 'type', color: 'text-foreground' },
                        { chars: 'rwx', label: 'owner', color: 'text-orange-500' },
                        { chars: 'r-x', label: 'group', color: 'text-blue-500' },
                        { chars: 'r--', label: 'others', color: 'text-emerald-500' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {i > 0 && <span className="text-muted-foreground">|</span>}
                            <div className="text-center">
                                <div className={`font-bold text-lg ${item.color}`}>{item.chars}</div>
                                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                    <strong>r</strong> read · <strong>w</strong> write · <strong>x</strong> execute · <strong>-</strong> none. First char: <strong>-</strong> file, <strong>d</strong> dir, <strong>l</strong> link.
                </p>
            </div>

            <LectureSubHeading title="Changing permissions with chmod" />
            <LectureP>
                <LectureCmd tip="Change permissions. Symbolic: chmod +x. Numeric: r=4, w=2, x=1 — so 755 = rwxr-xr-x, 644 = rw-r--r--.">chmod</LectureCmd>
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'make a script executable by the owner', cmd: 'chmod +x script.sh' },
                    { comment: 'remove write permission from others', cmd: 'chmod o-w file.txt' },
                    { comment: 'owner read+write, group and others read-only (numeric)', cmd: 'chmod 644 file.txt' },
                    { comment: 'owner full access, others read+execute — common for scripts', cmd: 'chmod 755 script.sh' },
                ]}
            />
            <LectureCallout type="info">
                <LectureCmd tip="Make a file executable. Every .sh script needs this before you can run it.">chmod +x</LectureCmd> on scripts — you'll use it constantly.
            </LectureCallout>

            {/* ── 06 PROCESSES ────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Processes" />

            <LectureP>
                A <LectureTermWithTip tip="A running program. The OS gives each one a unique Process ID (PID).">process</LectureTermWithTip> is a running program. See what's running, find what's eating CPU, or stop a stuck server.
            </LectureP>

            <LectureSubHeading title="Viewing running processes" />
            <TerminalBlock
                lines={[
                    { comment: 'show your own running processes', cmd: 'ps' },
                    { comment: 'show ALL processes on the system', cmd: 'ps aux' },
                    { comment: 'find a specific process by name', cmd: 'ps aux | grep node' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="Process status. aux = all processes with CPU/memory.">ps</LectureCmd> shows what's running. <LectureCmd tip="Pipe — send one command's output to the next. ps aux | grep node lists all processes, then filters for 'node'.">|</LectureCmd> chains commands.
            </LectureP>

            <LectureSubHeading title="Stopping processes" />
            <TerminalBlock
                lines={[
                    { comment: 'stop a process gracefully by its PID', cmd: 'kill 3829' },
                    { comment: 'force-stop a process that won\'t respond', cmd: 'kill -9 3829' },
                    { comment: 'stop all processes with a given name', cmd: 'killall node' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="Send terminate signal. Default is graceful (SIGTERM).">kill</LectureCmd>. <LectureCmd tip="Force kill — no cleanup. Use when a process is frozen." warn>kill -9</LectureCmd> when it won't quit.
            </LectureP>
            <LectureCallout type="tip">
                <LectureTermWithTip tip="Sends interrupt to the foreground process. Standard way to stop npm run dev, Python servers, etc.">Ctrl + C</LectureTermWithTip> stops whatever's running in the terminal.
            </LectureCallout>

            {/* ── 07 PACKAGE MANAGERS ─────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Package Managers" />

            <LectureP>
                <LectureTermWithTip tip="Installs, updates, removes software. One command — download, verify, install, dependencies. No install wizards.">Package managers</LectureTermWithTip>: one command, everything handled.
            </LectureP>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    { name: 'apt', os: 'Ubuntu / Debian', cmd: 'apt install nginx', tip: "Advanced Package Tool — Debian/Ubuntu. Most servers use it. Always run apt update first." },
                    { name: 'brew', os: 'macOS', cmd: 'brew install node', tip: "Homebrew — macOS package manager. Installs what Apple doesn't ship." },
                    { name: 'npm', os: 'Node.js', cmd: 'npm install react', tip: "Node Package Manager — JavaScript libs and tools. You'll use it constantly." },
                    { name: 'pip', os: 'Python', cmd: 'pip install fastapi', tip: "Pip Installs Packages — Python's standard. FastAPI, NumPy, etc." },
                ].map((pkg) => (
                    <div key={pkg.name} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <LectureCmd tip={pkg.tip}>{pkg.name}</LectureCmd>
                            <span className="text-xs text-muted-foreground">{pkg.os}</span>
                        </div>
                        <code
                            className="text-xs text-emerald-600 dark:text-emerald-400 bg-muted px-2 py-1 rounded block select-none"
                            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                            $ {pkg.cmd}
                        </code>
                    </div>
                ))}
            </div>

            <LectureSubHeading title="Installing software with apt" />
            <LectureP>
                <LectureCmd tip="Advanced Package Tool. Run apt update before installing.">apt</LectureCmd> on Linux — typical workflow:
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'refresh the list of available packages (always do this first)', cmd: 'sudo apt update' },
                    { comment: 'install nginx (a popular web server)', cmd: 'sudo apt install nginx' },
                    { comment: 'install node and npm', cmd: 'sudo apt install nodejs npm' },
                    { comment: 'install python3 and its package manager', cmd: 'sudo apt install python3 python3-pip' },
                    { comment: 'remove a package', cmd: 'sudo apt remove nginx' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="Run as administrator for one command. Required for installing software. You'll be prompted for your password.">sudo</LectureCmd> = admin for that command.
            </LectureP>
            <LectureCallout type="warning">
                <LectureCmd tip="Full system access. Can break the OS or create security holes. Only use when needed; understand what you run." warn>sudo</LectureCmd> — know what the command does before you run it.
            </LectureCallout>

            {/* ── 08 PUTTING IT TOGETHER ──────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Putting It All Together" />

            <LectureP>
                Full toolkit. One scenario: set up a project on a fresh server.
            </LectureP>
            <TerminalBlock
                title="bash — fresh server"
                lines={[
                    { comment: 'start in your home directory', cmd: 'cd ~' },
                    { comment: 'create a project folder with a src subdirectory', cmd: 'mkdir -p projects/my-app/src' },
                    { comment: 'navigate into it', cmd: 'cd projects/my-app' },
                    { comment: 'confirm where you are', cmd: 'pwd' },
                    { comment: 'create a README', cmd: 'touch README.md' },
                    { comment: 'create a start script', cmd: 'touch start.sh' },
                    { comment: 'make it executable', cmd: 'chmod +x start.sh' },
                    { comment: 'verify the permissions look right', cmd: 'ls -la' },
                    { comment: 'update package list', cmd: 'sudo apt update' },
                    { comment: 'install node', cmd: 'sudo apt install nodejs npm' },
                    { comment: 'confirm node is installed', cmd: 'node --version' },
                ]}
            />
            <LectureP>
                Navigate, create structure, install, verify. First five minutes on a new server.
            </LectureP>
            <LectureCallout type="tip">
                <LectureCmd tip="Full manual for any command. man ls, man grep, man chmod. q to quit. When in doubt, man it out.">man</LectureCmd> — built-in docs for every Unix command.
            </LectureCallout>

            <LectureFooterNav
                next={{
                    label: 'Shell Scripting & Permissions',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}