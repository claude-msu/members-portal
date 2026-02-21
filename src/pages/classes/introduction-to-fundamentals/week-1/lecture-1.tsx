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
    LectureTerm,
} from '@/components/ui/lecture-typography';

export default function Week1Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={1}
                session="Lecture 1"
                title="Linux & The Command Line"
                description="Before you can build anything serious, you need to feel at home in the terminal. Every server, every container, every cloud environment — it's all Linux underneath. By the end of this lecture you'll navigate, manipulate files, manage processes, and install real software without touching a mouse."
                icon={<Terminal className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                onBack={() => navigate('/classes/introduction-to-fundamentals')}
            />

            {/* ── 01 WHAT IS THE TERMINAL ─────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="What is the Terminal?" />

            <LectureP>
                When you use a computer normally, you interact with it through a <LectureTerm>Graphical User Interface</LectureTerm> — windows, icons, buttons, a mouse. The GUI is a layer built on top of the actual operating system to make things feel approachable. It's a convenience, not a necessity.
            </LectureP>
            <LectureP>
                Underneath every GUI is a <LectureTerm>shell</LectureTerm> — a program that takes typed commands and passes them directly to the operating system. The <LectureTerm>terminal</LectureTerm> (also called the command line, console, or CLI) is the window where you interact with that shell. When you open a terminal and type a command, you are talking directly to your computer with no middleman.
            </LectureP>
            <LectureP>
                This matters because GUIs can only expose what the designer decided to include. The shell exposes everything. You can automate tasks, chain operations together, work on remote servers over SSH, run scripts that do in one line what would take dozens of mouse clicks — none of that is possible through a GUI alone.
            </LectureP>

            <LectureCallout type="info">
                The most common shell you'll encounter is <LectureCmd tip="Bourne Again Shell — written by Brian Fox in 1989 as a free replacement for the original Bourne shell. Default on most Linux systems.">bash</LectureCmd>. macOS now defaults to <LectureCmd tip="Z Shell — a modern shell with better autocomplete, plugins, and customization. The default shell on macOS since Catalina (2019).">zsh</LectureCmd>, which is very similar. Everything in this course works in both.
            </LectureCallout>

            <LectureSubHeading title="Opening a terminal" />

            <LectureP>
                On <LectureTerm>macOS</LectureTerm>: press <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">⌘ + Space</code>, type "Terminal", hit enter. Or use iTerm2 if you want something more powerful.
            </LectureP>
            <LectureP>
                On <LectureTerm>Windows</LectureTerm>: install WSL2 (Windows Subsystem for Linux). This gives you a real Linux environment running inside Windows. Search "WSL" in the Microsoft Store.
            </LectureP>
            <LectureP>
                On <LectureTerm>Linux</LectureTerm>: you already have one. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Ctrl + Alt + T</code> opens it on most distributions.
            </LectureP>
            <LectureP>
                When the terminal opens, you'll see a <LectureTerm>prompt</LectureTerm>. The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">$</code> symbol means the shell is waiting for your input. Everything you type after it is a command. Press Enter to run it. That's the entire interface.
            </LectureP>

            <TerminalBlock lines={[{ cmd: '' }]} />

            {/* ── 02 NAVIGATION ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Navigating the Filesystem" />

            <LectureP>
                Your computer's files are organized into a <LectureTerm>filesystem</LectureTerm> — a tree of directories (folders) and files. On Linux and macOS, everything starts at <LectureTerm>/</LectureTerm>, called the <LectureTerm>root directory</LectureTerm>. Your home folder lives at <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/home/yourname</code> on Linux, or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/Users/yourname</code> on macOS. The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">~</code> symbol is a shortcut that always means your home directory.
            </LectureP>
            <LectureP>
                When you open the terminal, you start somewhere in this tree. That location is called your <LectureTerm>working directory</LectureTerm> — where you currently "are." Every command you run happens relative to this location unless you say otherwise.
            </LectureP>

            <LectureSubHeading title="Where am I?" />
            <LectureP>
                The first command you should know: <LectureCmd tip="print working directory — prints the full path of the directory you're currently in. Run this whenever you're disoriented.">pwd</LectureCmd>. It prints the full path of your current location.
            </LectureP>
            <TerminalBlock lines={[{ comment: 'print your current location', cmd: 'pwd' }]} />

            <LectureSubHeading title="What's in here?" />
            <LectureP>
                <LectureCmd tip="list — shows the contents of a directory. One of the most-used commands you'll ever type.">ls</LectureCmd> lists the files and directories in your current location. On its own it gives you a simple list. The real power comes from flags.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'list files in the current directory', cmd: 'ls' },
                    { comment: 'list ALL files including hidden ones, in long format', cmd: 'ls -la' },
                    { comment: 'list a specific directory without navigating there', cmd: 'ls -la /etc' },
                ]}
            />
            <LectureP>
                The <LectureCmd tip="-l flag: long format. Shows permissions, owner, file size, and last modified date for each file.">-l</LectureCmd> flag gives you detailed info for each file. The <LectureCmd tip="-a flag: all. Shows hidden files — files whose names start with a dot (.) are hidden by default. Things like .gitignore and .env are hidden files.">-a</LectureCmd> flag shows hidden files — files whose names start with a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.</code>. They're not special, just conventionally hidden from normal listings.
            </LectureP>
            <LectureCallout type="tip">
                You can combine flags: <LectureCmd tip="-la combines -l (long format) and -a (show all files) into a single flag. This is the most common way to use ls.">-la</LectureCmd> and <LectureCmd tip="-al is identical to -la. Flag order doesn't matter for most commands.">-al</LectureCmd> are identical. Most flags can be combined this way.
            </LectureCallout>

            <LectureSubHeading title="Moving around" />
            <LectureP>
                <LectureCmd tip="change directory — moves you to a different location in the filesystem. The most fundamental navigation command.">cd</LectureCmd> changes your working directory. Think of it like double-clicking a folder, but faster.
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
            <LectureP>
                The <LectureCmd tip="dot-dot — represents the parent directory, i.e. one level up in the filesystem tree. A single dot (.) represents the current directory.">..</LectureCmd> shortcut means "the folder above where I am." You'll use it constantly. The <LectureCmd tip="tilde — shorthand for your home directory (/home/yourname on Linux, /Users/yourname on macOS). Works anywhere a path is expected.">~</LectureCmd> shortcut always takes you home no matter where you are.
            </LectureP>
            <LectureCallout type="tip">
                Press <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Tab</code> to autocomplete paths and filenames. Start typing a directory name and hit Tab — the shell completes it for you. If there are multiple matches, pressing Tab twice shows all of them. This will save you thousands of keystrokes.
            </LectureCallout>

            {/* ── 03 FILE MANIPULATION ────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Creating and Manipulating Files" />

            <LectureP>
                Navigating is reading. Now let's write. These commands let you create, copy, move, and delete files and directories entirely from the terminal.
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
                <LectureCmd tip="touch — originally used to update a file's timestamp, but its most common use is creating empty files. If the file doesn't exist, it creates it.">touch</LectureCmd> creates an empty file. <LectureCmd tip="make directory — creates a new folder.">mkdir</LectureCmd> creates a directory. The <LectureCmd tip="-p flag for mkdir: creates parent directories as needed. Without -p, mkdir fails if the parent folder doesn't exist yet.">-p</LectureCmd> flag means "create parent directories too" — without it, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">mkdir projects/web/src</code> would fail if <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">projects/web</code> doesn't exist yet.
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
                <LectureCmd tip="copy — duplicates a file. The original stays in place.">cp</LectureCmd> copies files. The <LectureCmd tip="-r flag: recursive. Required when copying directories — tells cp to copy the folder and everything inside it.">-r</LectureCmd> flag is required for directories. <LectureCmd tip="move — moves a file to a new location. If source and destination are in the same directory, it effectively renames the file.">mv</LectureCmd> moves files — and because moving a file to the same directory with a different name is a rename, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">mv</code> is also how you rename things. There is no separate <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">rename</code> command.
            </LectureP>

            <LectureSubHeading title="Deleting files" />
            <TerminalBlock
                lines={[
                    { comment: 'delete a single file', cmd: 'rm notes.txt' },
                    { comment: 'delete a directory and all its contents', cmd: 'rm -r projects-backup' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="remove — permanently deletes files. There is no trash can. No undo. The file is gone immediately.">rm</LectureCmd> deletes files permanently. There is no Recycle Bin, no undo, no "are you sure?" by default. The <LectureCmd tip="-r flag for rm: recursive. Required to delete directories.">-r</LectureCmd> flag makes it recursive so you can delete directories.
            </LectureP>
            <LectureCallout type="warning">
                <LectureCmd tip="rm -rf: deletes everything at the given path, recursively, without asking for confirmation. Running this on the wrong path can destroy your entire system. Always double-check the path before pressing Enter." warn>rm -rf</LectureCmd> is one of the most dangerous commands in existence. The <LectureCmd tip="-f flag: force. Suppresses all confirmation prompts and error messages. Combined with -r, it deletes everything silently." warn>-f</LectureCmd> flag suppresses all warnings. Running <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">rm -rf /</code> would attempt to delete your entire operating system. Never run it unless you are absolutely certain of the path.
            </LectureCallout>

            {/* ── 04 READING FILES ────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Reading File Contents" />

            <LectureP>
                You can read files from the terminal without opening an editor. These commands are essential when you're working on a server and need to inspect log files, config files, or code.
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
                <LectureCmd tip="concatenate — originally designed to concatenate multiple files together, but most commonly used to print the contents of a single file to the terminal.">cat</LectureCmd> dumps the whole file at once. <LectureCmd tip="less — a pager that lets you scroll through a file one screen at a time. Press spacebar to go forward, b to go back, / to search, and q to quit. Called 'less' because it's the improved version of an older program called 'more'.">less</LectureCmd> is better for large files — scroll with arrow keys, search with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/</code>, quit with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">q</code>. <LectureCmd tip="tail -f: follow mode. Keeps the file open and prints new lines as they are added. Invaluable for watching application logs in real time.">tail -f</LectureCmd> is invaluable in production — run it on your app's log file and watch errors stream in live.
            </LectureP>

            <LectureSubHeading title="Searching inside files with grep" />
            <LectureP>
                <LectureCmd tip="global regular expression print — searches for a pattern inside files and prints every line that matches. Named after the ed editor command g/re/p. One of the most useful commands you'll ever learn.">grep</LectureCmd> searches for text inside files. It prints every line in a file that matches a pattern you provide.
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
                <LectureCmd tip="grep -r: recursive grep. Searches every file in the given directory and all subdirectories. Combine with -i (case-insensitive) and -n (show line numbers) to build a powerful search.">grep -r</LectureCmd> through a codebase is one of the fastest ways to find where something is defined or used. Many developers reach for grep before their IDE's search feature.
            </LectureCallout>

            {/* ── 05 PERMISSIONS ──────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Permissions" />

            <LectureP>
                Every file and directory on a Linux system has a set of <LectureTerm>permissions</LectureTerm> that control who can read it, write to it, or execute it. Understanding permissions is essential — misconfigured permissions are a common source of bugs and security vulnerabilities.
            </LectureP>
            <LectureP>
                When you run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ls -la</code>, you'll see something like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-rwxr-xr--</code> at the start of each line. This is a 10-character permission string. Here's how to read it:
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
                    <strong>r</strong> = read &nbsp;·&nbsp; <strong>w</strong> = write &nbsp;·&nbsp; <strong>x</strong> = execute &nbsp;·&nbsp; <strong>-</strong> = not granted
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    First character is file type: <strong>-</strong> regular file, <strong>d</strong> directory, <strong>l</strong> symbolic link.
                </p>
            </div>

            <LectureP>
                There are three sets: permissions for the <LectureTerm>owner</LectureTerm> (the user who created the file), the <LectureTerm>group</LectureTerm> (a set of users the owner belongs to), and <LectureTerm>others</LectureTerm> (everyone else on the system).
            </LectureP>

            <LectureSubHeading title="Changing permissions with chmod" />
            <LectureP>
                <LectureCmd tip="change file mode bits — modifies the permissions of a file or directory. Can be used in symbolic mode (chmod +x) or octal/numeric mode (chmod 755).">chmod</LectureCmd> changes permissions. The simplest form uses symbols:
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'make a script executable by the owner', cmd: 'chmod +x script.sh' },
                    { comment: 'remove write permission from others', cmd: 'chmod o-w file.txt' },
                    { comment: 'owner read+write, group and others read-only (numeric)', cmd: 'chmod 644 file.txt' },
                    { comment: 'owner full access, others read+execute — common for scripts', cmd: 'chmod 755 script.sh' },
                ]}
            />
            <LectureP>
                The numeric mode works on a simple system: <LectureTerm>r=4, w=2, x=1</LectureTerm>. Add them together for each group. So <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">755</code> means owner gets 4+2+1=7 (full), group gets 5 (read+execute), others gets 5 (read+execute). <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">644</code> is a typical file: owner reads and writes, everyone else can only read.
            </LectureP>
            <LectureCallout type="info">
                You'll encounter <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">chmod +x</code> constantly — every shell script you write needs to be made executable before you can run it. It's the first thing you do after writing a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.sh</code> file.
            </LectureCallout>

            {/* ── 06 PROCESSES ────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Processes" />

            <LectureP>
                A <LectureTerm>process</LectureTerm> is a running program. Every time you start an application — your browser, your code editor, a web server — the operating system creates a process for it and assigns it a unique <LectureTerm>Process ID (PID)</LectureTerm>. You'll often need to see what's running, find something eating your CPU, or kill a server that didn't shut down cleanly.
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
                <LectureCmd tip="process status — shows a snapshot of currently running processes. On its own it only shows processes in your current terminal session.">ps</LectureCmd> shows processes. The <LectureCmd tip="ps aux: a = all users, u = user-oriented format (shows CPU%, memory%), x = include processes not attached to a terminal. Together they show every process on the system.">aux</LectureCmd> flags show every process on the system with CPU and memory usage. The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">|</code> character is a <LectureTerm>pipe</LectureTerm> — it sends the output of one command as input to the next. So <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ps aux | grep node</code> lists all processes then filters for lines containing "node."
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
                <LectureCmd tip="kill — sends a signal to a process. By default it sends SIGTERM (signal 15), which asks the process to terminate gracefully and allows it to clean up before exiting.">kill</LectureCmd> sends a termination signal. By default it asks nicely. <LectureCmd tip="kill -9: sends SIGKILL, which cannot be caught or ignored. The OS immediately terminates the process with no cleanup. Use when a process is frozen and not responding." warn>kill -9</LectureCmd> is the nuclear option — it bypasses the process entirely and forces the OS to terminate it instantly.
            </LectureP>
            <LectureCallout type="tip">
                If you start a server in the terminal and need to stop it, press <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Ctrl + C</code>. This sends an interrupt signal to the foreground process and is the standard way to stop things like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm run dev</code> or a Python server.
            </LectureCallout>

            {/* ── 07 PACKAGE MANAGERS ─────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Package Managers" />

            <LectureP>
                A <LectureTerm>package manager</LectureTerm> is a tool for installing, updating, and removing software. Instead of downloading an installer and clicking through a wizard, you type one command and the package manager handles everything — downloading, verifying, installing, and setting up dependencies automatically.
            </LectureP>
            <LectureP>
                Different operating systems and ecosystems use different package managers. You'll encounter all of these:
            </LectureP>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    { name: 'apt', os: 'Ubuntu / Debian Linux', cmd: 'apt install nginx', tip: "Advanced Package Tool — the standard package manager for Debian-based Linux distros like Ubuntu. Used on most servers you'll ever work with." },
                    { name: 'brew', os: 'macOS', cmd: 'brew install node', tip: "Homebrew — the universally used package manager for macOS. Installs software that Apple doesn't include by default." },
                    { name: 'npm', os: 'Node.js / JavaScript', cmd: 'npm install react', tip: "Node Package Manager — installs JavaScript libraries and tools. You'll use this constantly for web development." },
                    { name: 'pip', os: 'Python', cmd: 'pip install fastapi', tip: 'Pip Installs Packages — the standard package manager for Python. Used to install libraries like FastAPI, NumPy, and Pandas.' },
                ].map((pkg) => (
                    <div key={pkg.name} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <code className="text-sm font-bold text-foreground">{pkg.name}</code>
                            <span className="text-xs text-muted-foreground">{pkg.os}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{pkg.tip}</p>
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
                On a Linux server you'll almost always use <LectureCmd tip="apt: Advanced Package Tool. Always run 'apt update' before installing anything to refresh the list of available packages.">apt</LectureCmd>. Here's the standard workflow:
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
                Notice <LectureCmd tip="superuser do — runs the following command with administrator (root) privileges. Required for system-level operations like installing software. You'll be prompted for your password.">sudo</LectureCmd> before every apt command. Installing software is a system-level operation that requires administrator privileges. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">sudo</code> temporarily elevates your permissions for that one command.
            </LectureP>
            <LectureCallout type="warning">
                <LectureCmd tip="sudo: superuser do. Grants root-level privileges for one command. With sudo you can modify or delete system files, break your OS, or introduce security vulnerabilities. Only use it when you need it." warn>sudo</LectureCmd> runs as the system administrator with no restrictions. Before running any command with sudo — especially one you found online — understand exactly what it does.
            </LectureCallout>

            {/* ── 08 PUTTING IT TOGETHER ──────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Putting It All Together" />

            <LectureP>
                You now have the full toolkit. Let's run through a complete scenario that strings everything together — setting up a new project folder on a fresh server.
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
                This is a real workflow. When you get access to a new server, this is roughly what the first five minutes looks like. Navigate, orient, create the structure, install what you need, verify it worked.
            </LectureP>
            <LectureCallout type="tip">
                One last command worth knowing: <LectureCmd tip="manual — shows the full documentation for any command. Try 'man ls', 'man grep', 'man chmod'. Press q to quit. Every Unix command has a man page. When in doubt, man it out.">man</LectureCmd>. Running <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">man ls</code> opens the full manual for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ls</code>. Every Unix command has one. When you encounter a flag you don't recognize, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">man</code> it before you run it.
            </LectureCallout>

            <LectureFooterNav
                next={{
                    label: 'Version Control with Git',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}