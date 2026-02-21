import { useNavigate } from 'react-router-dom';
import { Terminal, ChevronRight } from 'lucide-react';
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

// ── Three-areas diagram (unique to this lecture) ──────────────────────────────
const ThreeAreasDiagram = () => (
    <div className="my-8 rounded-xl border border-border bg-muted/30 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-border">
            {[
                {
                    label: 'Working Directory',
                    sublabel: 'Your files on disk',
                    desc: 'Where you actually edit code. Changes here are untracked until you stage them.',
                    color: 'text-orange-600 dark:text-orange-400',
                    bg: 'bg-orange-50 dark:bg-orange-950/20',
                },
                {
                    label: 'Staging Area',
                    sublabel: 'The "draft"',
                    desc: "Files you've marked with git add. This is what your next commit will contain.",
                    color: 'text-blue-600 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-950/20',
                },
                {
                    label: 'Repository',
                    sublabel: 'Permanent history',
                    desc: "Every commit you've ever made, stored permanently in the .git folder.",
                    color: 'text-emerald-600 dark:text-emerald-400',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                },
            ].map((area) => (
                <div key={area.label} className={`p-4 ${area.bg}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${area.color}`}>{area.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-2">{area.sublabel}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{area.desc}</p>
                </div>
            ))}
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span><code className="bg-muted px-1 rounded">git add</code> → moves to staging</span>
            <ChevronRight className="h-3 w-3" />
            <span><code className="bg-muted px-1 rounded">git commit</code> → moves to repository</span>
        </div>
    </div>
);

// ── Conflict markers block (unique to this lecture) ───────────────────────────
const ConflictMarkersBlock = () => (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
        <div className="bg-zinc-800 px-4 py-2 text-zinc-400 text-xs border-b border-zinc-700 select-none">
            index.html — conflict markers
        </div>
        <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
            <p className="text-zinc-500">{'<<<<<<< HEAD'}</p>
            <p className="text-blue-300">{'<h1>Welcome to my app</h1>'}</p>
            <p className="text-zinc-500">{'======='}</p>
            <p className="text-emerald-300">{'<h1>Hello from feature branch</h1>'}</p>
            <p className="text-zinc-500">{'>>>>>>> feature/add-homepage'}</p>
        </div>
    </div>
);

// ── Quick reference table (unique to this lecture) ────────────────────────────
const QuickReference = () => (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
        {[
            {
                category: 'Setup',
                items: [
                    { cmd: 'git init', desc: 'Initialize a new repository' },
                    { cmd: 'git config --global user.name "Name"', desc: 'Set your name for all commits' },
                    { cmd: 'git clone <url>', desc: 'Download a repository from GitHub' },
                ],
            },
            {
                category: 'Daily Work',
                items: [
                    { cmd: 'git status', desc: 'See what has changed' },
                    { cmd: 'git add .', desc: 'Stage all changes' },
                    { cmd: 'git commit -m "message"', desc: 'Save a snapshot with a message' },
                    { cmd: 'git pull', desc: 'Download remote changes' },
                    { cmd: 'git push', desc: 'Upload your commits' },
                ],
            },
            {
                category: 'Branching',
                items: [
                    { cmd: 'git branch', desc: 'List all branches' },
                    { cmd: 'git checkout -b <name>', desc: 'Create and switch to a new branch' },
                    { cmd: 'git merge <branch>', desc: 'Merge a branch into the current one' },
                    { cmd: 'git branch -d <name>', desc: 'Delete a merged branch' },
                ],
            },
            {
                category: 'History & Recovery',
                items: [
                    { cmd: 'git log --oneline', desc: 'View compact commit history' },
                    { cmd: 'git revert <hash>', desc: 'Safely undo a commit' },
                    { cmd: 'git reflog', desc: 'View every action (emergency recovery)' },
                    { cmd: 'git restore --staged <file>', desc: 'Unstage a file' },
                ],
            },
        ].map((group) => (
            <div key={group.category}>
                <div className="px-4 py-2 bg-muted/50 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.category}
                    </p>
                </div>
                {group.items.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                        <code
                            className="text-xs font-mono text-foreground select-none"
                            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                            {item.cmd}
                        </code>
                        <span className="text-xs text-muted-foreground ml-4 text-right">{item.desc}</span>
                    </div>
                ))}
            </div>
        ))}
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Week1Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={1}
                session="Lecture 2"
                title="Shell Scripting & Permissions"
                description="Automate repetitive tasks with bash scripts and understand the Unix permission model that controls who can read, write, and execute everything on the system."
                icon={<Terminal className="h-4 w-4 text-yellow-800 dark:text-yellow-300" />}
            />

            {/* ── 01 THE PROBLEM GIT SOLVES ───────────────────────────────────── */}
            <LectureSectionHeading number="01" title="The Problem Git Solves" />

            <LectureP>
                Imagine you're writing code for a week and it's finally working. You decide to add a new feature — and three hours later, everything is broken and you can't remember what you changed. Or you're working with a teammate and you both edit the same file. Who wins? How do you combine your changes without losing either person's work?
            </LectureP>
            <LectureP>
                These are not edge cases. They happen every single day on every software team in the world. Before version control existed, developers dealt with this by keeping folders named things like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">project-final</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">project-final-v2</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">project-FINAL-USE-THIS-ONE</code>. That's not a joke — it was a real practice.
            </LectureP>
            <LectureP>
                <LectureTerm>Git</LectureTerm> solves this by tracking every single change you make to your code, who made it, when, and why. It lets you travel back in time to any point in your project's history, work on multiple versions simultaneously without interfering with each other, and merge work from multiple people intelligently. It was created by Linus Torvalds in 2005 — the same person who created Linux — to manage the Linux kernel, which thousands of developers contribute to simultaneously.
            </LectureP>

            <LectureCallout type="info">
                <LectureTerm>Git</LectureTerm> is the tool. <LectureTerm>GitHub</LectureTerm> is a website that hosts Git repositories in the cloud so teams can collaborate. You can use Git entirely without GitHub — it works locally on your machine. GitHub is just a popular place to store and share repositories.
            </LectureCallout>

            {/* ── 02 THE THREE AREAS ──────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="The Three Areas" />

            <LectureP>
                This is the mental model that makes Git click. Most people learn Git by memorizing commands without understanding why they exist — which leads to confusion and mistakes for months. Everything in Git flows through three distinct areas, and once you understand them, every command will make sense.
            </LectureP>

            <ThreeAreasDiagram />

            <LectureP>
                Your <LectureTerm>working directory</LectureTerm> is just your file system — the actual files on your computer that you open and edit. When you change a file, Git notices, but it doesn't do anything yet. That change is <LectureTerm>untracked</LectureTerm>.
            </LectureP>
            <LectureP>
                The <LectureTerm>staging area</LectureTerm> (also called the index) is where you deliberately place changes you want to include in your next commit. Think of it as composing a draft. You might have changed five files, but you only want to commit three of them because they're related. You add exactly those three and leave the others out. This gives you precise control over what goes into each commit.
            </LectureP>
            <LectureP>
                The <LectureTerm>repository</LectureTerm> is the permanent record — the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.git</code> folder inside your project. Every time you commit, a snapshot of everything in the staging area is saved permanently with a unique ID, timestamp, your name, and a message. That history never changes.
            </LectureP>

            <LectureCallout type="tip">
                The staging area trips up a lot of beginners. Why not just commit directly from the working directory? Because real changes are messy. You might fix a bug AND add a feature at the same time. The staging area lets you split that into two clean, separate commits — one for the bug fix, one for the feature — even though you made both changes at once.
            </LectureCallout>

            {/* ── 03 SETTING UP GIT ───────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Setting Up Git" />

            <LectureP>
                Before you do anything else, tell Git who you are. Every commit you make will be stamped with this information. Run these two commands once on any new machine:
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'set your name — this appears in every commit you make', cmd: 'git config --global user.name "Your Name"' },
                    { comment: 'set your email — should match your GitHub account', cmd: 'git config --global user.email "you@example.com"' },
                    { comment: 'verify your config looks right', cmd: 'git config --list' },
                ]}
            />
            <LectureP>
                The <LectureCmd tip="--global flag: applies this setting to all Git repositories on your machine, not just the current one. Stored in ~/.gitconfig. Without --global, the setting only applies to the current repo.">--global</LectureCmd> flag stores these in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">~/.gitconfig</code> so they apply to every project. You only need to do this once per machine.
            </LectureP>

            {/* ── 04 YOUR FIRST REPOSITORY ────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Your First Repository" />

            <LectureP>
                Let's create a project from scratch and track it with Git. Open your terminal and follow along — every command builds on the last.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'create a new project directory and navigate into it', cmd: 'mkdir git-practice && cd git-practice' },
                    { comment: 'initialize a git repository — this creates the .git folder', cmd: 'git init' },
                    { comment: 'confirm the .git folder was created', cmd: 'ls -la' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="git init — initializes a new Git repository in the current directory. Creates a hidden .git folder that stores all version history, configuration, and internal data. Only run this once per project.">git init</LectureCmd> creates a hidden <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.git</code> folder. That folder is the entire repository — it contains every commit, every branch, every piece of history. If you delete it, you lose all version history. Don't touch it directly.
            </LectureP>

            <LectureSubHeading title="Checking status" />
            <LectureP>
                <LectureCmd tip="git status — shows the current state of your working directory and staging area. Tells you which files are untracked, staged, or modified. Run this constantly — it's your orientation tool.">git status</LectureCmd> is the command you'll run more than any other. It tells you exactly what's going on right now — what's changed, what's staged, what's not tracked. Get in the habit of running it before and after everything.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'see the current state of the repository', cmd: 'git status' },
                    { comment: 'create a file so we have something to track', cmd: 'touch README.md' },
                    { comment: 'run status again — notice README.md shows as untracked', cmd: 'git status' },
                ]}
            />

            <LectureSubHeading title="Staging and committing" />
            <LectureP>
                Now let's move that file through the three areas. First we stage it with <LectureCmd tip="git add — moves changes from the working directory to the staging area. Does not save anything permanently — that happens when you commit.">git add</LectureCmd>, then commit it permanently with <LectureCmd tip="git commit — takes everything in the staging area and saves it as a permanent snapshot. Each commit has a unique SHA hash, your name, email, timestamp, and message.">git commit</LectureCmd>.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'stage README.md', cmd: 'git add README.md' },
                    { comment: 'run status — notice README.md is now "staged for commit"', cmd: 'git status' },
                    { comment: 'commit it with a descriptive message', cmd: 'git commit -m "Initial commit: add README"' },
                    { comment: 'run status again — working tree is now clean', cmd: 'git status' },
                ]}
            />
            <LectureCallout type="tip">
                <LectureCmd tip="git add . — stages ALL changes in the current directory and all subdirectories. Convenient, but run git status first so you know exactly what you're staging.">git add .</LectureCmd> stages everything at once. The dot means "current directory and everything inside it." Always run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git status</code> first so you know what you're about to stage.
            </LectureCallout>
            <LectureP>
                The <LectureCmd tip="-m flag for git commit: message. Lets you write the commit message inline. Without -m, Git opens a text editor (usually vim) for you to write a longer message.">-m</LectureCmd> flag lets you write your commit message inline. A good commit message describes what changed and why — not how. "Fix login bug" is good. "Changed line 47" is useless. Your future self and teammates will read these when something breaks.
            </LectureP>

            {/* ── 05 VIEWING HISTORY ──────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Viewing History" />

            <LectureP>
                Every commit is stored permanently. <LectureCmd tip="git log — shows the commit history for the current branch in reverse chronological order. Each entry shows the commit hash, author, date, and message.">git log</LectureCmd> lets you scroll through that history.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'view full commit history', cmd: 'git log' },
                    { comment: 'compact one-line view — great for getting an overview', cmd: 'git log --oneline' },
                    { comment: 'one-line view with a visual branch graph', cmd: 'git log --oneline --graph --all' },
                ]}
            />
            <LectureP>
                Each entry shows a <LectureTerm>commit hash</LectureTerm> — a 40-character string like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">a3f92c1...</code>. This is a unique identifier for that exact snapshot. You'll use these hashes to reference specific commits when going back in time or comparing changes. The <LectureCmd tip="--oneline flag for git log: shows each commit as a single line with a shortened hash and message. Far more readable for most purposes.">--oneline</LectureCmd> flag shortens them to 7 characters, which is usually enough.
            </LectureP>
            <LectureCallout type="info">
                <LectureCmd tip="git log --oneline --graph --all: shows all branches as an ASCII graph. --all includes branches you haven't checked out. Best command for understanding what's happening across multiple branches.">--graph --all</LectureCmd> is extremely useful once you start branching. It draws the commit history as a tree in your terminal so you can see exactly where branches diverged and merged.
            </LectureCallout>

            {/* ── 06 BRANCHING ────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Branching" />

            <LectureP>
                A <LectureTerm>branch</LectureTerm> is an independent line of development. Think of it as a parallel universe for your code. The default branch is called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>. When you want to work on a new feature or fix a bug, you create a new branch. Your changes live there, completely isolated from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>, until you decide to merge them in.
            </LectureP>
            <LectureP>
                This is how every professional team works. Nobody commits directly to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>. You branch, work, and merge — so that <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code> always represents a working, stable version of the code.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'see all branches (* marks the one you are on)', cmd: 'git branch' },
                    { comment: 'create a new branch', cmd: 'git branch feature/add-homepage' },
                    { comment: 'switch to that branch', cmd: 'git checkout feature/add-homepage' },
                    { comment: 'shortcut: create AND switch in one command (use this)', cmd: 'git checkout -b feature/add-homepage' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="git branch: lists all local branches. With a name argument, creates a new branch. Does not switch to it.">git branch</LectureCmd> creates and lists branches. <LectureCmd tip="git checkout: switches to a different branch or commit. Moving between branches changes the files in your working directory to match that branch's state.">git checkout</LectureCmd> switches between them. The <LectureCmd tip="-b flag for git checkout: create and switch in one step. Equivalent to running git branch then git checkout, but faster. This is what you'll use in practice.">-b</LectureCmd> flag creates and switches in one step — which is what you'll use almost every time.
            </LectureP>
            <LectureCallout type="tip">
                Branch naming conventions matter on real teams. Common patterns: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">feature/thing-you-are-building</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">fix/bug-you-are-fixing</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">chore/maintenance-task</code>. Consistent names make pull requests and history much easier to read.
            </LectureCallout>

            <LectureSubHeading title="Making changes on a branch" />
            <LectureP>
                Let's make a commit on this branch, switch back to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>, and see that <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code> is unchanged. This is the key thing to internalize — branches are fully isolated.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'make sure you are on the feature branch', cmd: 'git checkout feature/add-homepage' },
                    { comment: 'create a new file', cmd: 'touch index.html' },
                    { comment: 'stage and commit it', cmd: 'git add index.html && git commit -m "Add homepage HTML file"' },
                    { comment: 'switch back to main', cmd: 'git checkout main' },
                    { comment: 'list files — index.html is gone! It only exists on the feature branch', cmd: 'ls' },
                ]}
            />
            <LectureP>
                When you switch back to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">index.html</code> disappears from your file system. It hasn't been deleted — it exists on the feature branch. Git literally changes the files in your working directory to match whichever branch you're on. This feels magical the first time you see it.
            </LectureP>

            {/* ── 07 MERGING ──────────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Merging" />

            <LectureP>
                When your feature is ready, you <LectureTerm>merge</LectureTerm> it back into <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>. The rule is: <strong className="text-foreground">you merge into the branch you're currently on.</strong>
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'make sure you are on main (you are merging INTO main)', cmd: 'git checkout main' },
                    { comment: 'merge the feature branch into main', cmd: 'git merge feature/add-homepage' },
                    { comment: 'list files — index.html is now here on main', cmd: 'ls' },
                    { comment: 'delete the feature branch now that it is merged', cmd: 'git branch -d feature/add-homepage' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="git merge: integrates the history of one branch into the current branch. If the branches haven't diverged, Git does a 'fast-forward' and simply moves the pointer. If they've diverged, Git creates a new merge commit.">git merge</LectureCmd> brings the feature branch's commits into main. <LectureCmd tip="git branch -d: deletes a branch safely — it refuses to delete a branch that hasn't been fully merged. Use -D (capital) to force-delete.">git branch -d</LectureCmd> cleans up the now-redundant branch.
            </LectureP>

            <LectureSubHeading title="Merge conflicts" />
            <LectureP>
                A <LectureTerm>merge conflict</LectureTerm> happens when two branches have changed the same part of the same file in different ways. Git doesn't know which version to keep, so it stops and asks you to decide. This sounds scary but it's completely normal — it happens on every active codebase.
            </LectureP>
            <LectureP>
                When a conflict occurs, Git marks the conflicting sections directly inside the file:
            </LectureP>

            <ConflictMarkersBlock />

            <LectureP>
                Everything between <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'<<<<<<< HEAD'}</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'======='}</code> is what's on your current branch. Everything between <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'======='}</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'>>>>>>>'}</code> is what's coming in from the branch you're merging. To resolve it, edit the file to contain exactly what you want — delete all the conflict markers — then stage and commit.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'after manually editing the conflict in a text editor...', cmd: 'git add index.html' },
                    { comment: 'commit to complete the merge', cmd: 'git commit -m "Resolve merge conflict in index.html"' },
                ]}
            />
            <LectureCallout type="tip">
                VS Code has a built-in merge conflict resolver that highlights both versions visually and lets you click "Accept Current", "Accept Incoming", or "Accept Both." In practice most developers use their editor rather than resolving conflicts in raw text.
            </LectureCallout>

            {/* ── 08 REMOTE REPOSITORIES ──────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Remote Repositories & GitHub" />

            <LectureP>
                Everything so far has been local — on your machine only. A <LectureTerm>remote</LectureTerm> is a version of your repository stored somewhere else, typically GitHub. This is how you back up your work and collaborate with others.
            </LectureP>
            <LectureP>
                Go to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">github.com</code>, create a new empty repository called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git-practice</code>, then come back to your terminal. GitHub will give you a URL like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">https://github.com/yourusername/git-practice.git</code>.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'connect your local repo to GitHub (paste your URL)', cmd: 'git remote add origin https://github.com/yourusername/git-practice.git' },
                    { comment: 'verify the remote was added', cmd: 'git remote -v' },
                    { comment: 'push your local commits to GitHub for the first time', cmd: 'git push -u origin main' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="git remote add: registers a remote repository with a name. 'origin' is the conventional name for your primary remote — just a nickname for the URL. You can have multiple remotes with different names.">git remote add origin</LectureCmd> gives your remote a nickname. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">origin</code> is the conventional name — every project uses it. <LectureCmd tip="git push: uploads your local commits to the remote. -u sets the upstream tracking reference so future pushes only need 'git push' with no arguments.">git push</LectureCmd> uploads your commits. The <LectureCmd tip="-u flag for git push: sets the upstream tracking branch. After doing this once, you can just type 'git push' and Git knows where to send it.">-u</LectureCmd> flag sets a default so future pushes only need <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git push</code>.
            </LectureP>

            <LectureSubHeading title="The daily workflow" />
            <LectureP>
                Once your repo is on GitHub, the day-to-day loop looks like this:
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'pull down any changes your teammates pushed', cmd: 'git pull' },
                    { comment: 'create a branch for your work', cmd: 'git checkout -b feature/my-feature' },
                    { comment: '... do your work, edit files ...', cmd: '' },
                    { comment: 'stage everything', cmd: 'git add .' },
                    { comment: 'commit with a clear message', cmd: 'git commit -m "Add user authentication flow"' },
                    { comment: 'push your branch to GitHub', cmd: 'git push origin feature/my-feature' },
                ]}
            />
            <LectureP>
                After pushing you'd go to GitHub and open a <LectureTerm>Pull Request</LectureTerm> — a proposal to merge your branch into <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>. Teammates review it, leave comments, and approve or request changes. When approved, it gets merged. This is the exact workflow used at every software company in the world.
            </LectureP>

            {/* ── 09 GOING BACK IN TIME ───────────────────────────────────────── */}
            <LectureSectionHeading number="09" title="Going Back in Time" />

            <LectureP>
                One of the most powerful things about Git is the ability to recover from mistakes. There are several tools for this, each with different levels of permanence.
            </LectureP>

            <LectureSubHeading title="Undoing staged changes" />
            <TerminalBlock
                lines={[
                    { comment: 'unstage a file (removes from staging, keeps changes on disk)', cmd: 'git restore --staged index.html' },
                    { comment: 'discard ALL unstaged changes in a file (irreversible)', cmd: 'git restore index.html' },
                ]}
            />
            <LectureCallout type="warning">
                <LectureCmd tip="git restore (without --staged): discards uncommitted changes to a file and restores it to the last committed version. This cannot be undone — the changes are permanently gone." warn>git restore</LectureCmd> without <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">--staged</code> permanently discards your uncommitted changes. There is no undo. Use it carefully.
            </LectureCallout>

            <LectureSubHeading title="Viewing and reverting commits" />
            <TerminalBlock
                lines={[
                    { comment: 'see what changed in the last commit', cmd: 'git show HEAD' },
                    { comment: 'create a new commit that undoes a previous commit (safe)', cmd: 'git revert a3f92c1' },
                    { comment: 'view the reflog — a record of every action even after resets', cmd: 'git reflog' },
                ]}
            />
            <LectureP>
                <LectureCmd tip="git revert: creates a new commit that is the exact inverse of a previous commit. The original commit stays in history — nothing is rewritten. This is the safe way to undo changes on a shared branch because it doesn't alter history.">git revert</LectureCmd> is the safe way to undo a commit on a shared branch. It creates a new commit that undoes the changes — the original stays in history unchanged. <LectureCmd tip="git reflog: logs every single thing HEAD has pointed to, including checkouts, merges, resets, and commits. Even if you accidentally delete commits with a reset, the reflog lets you find the hashes and recover them.">git reflog</LectureCmd> is your emergency recovery tool — even if you accidentally lose commits with a reset, it almost always lets you get them back.
            </LectureP>

            <LectureSubHeading title="Cleaning up history with rebase" />
            <LectureP>
                <LectureCmd tip="git rebase: rewrites commit history by replaying commits on top of a different base. Creates a linear history with no merge commits. Two main uses: updating a branch with the latest main, and squashing multiple commits into one clean commit.">git rebase</LectureCmd> rewrites commit history. The two most common uses are keeping a feature branch up to date with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main</code>, and squashing several messy commits into one clean one before merging.
            </LectureP>
            <TerminalBlock
                lines={[
                    { comment: 'update your feature branch with the latest changes from main', cmd: 'git rebase main' },
                    { comment: 'squash the last 3 commits into one (interactive rebase)', cmd: 'git rebase -i HEAD~3' },
                ]}
            />
            <LectureCallout type="warning">
                <LectureCmd tip="git rebase rewrites history — it creates new commits with different hashes. Never rebase a branch that other people are working on. Rewriting shared history forces everyone to reconcile their work against a new timeline." warn>git rebase</LectureCmd> rewrites history — it creates brand new commits with different hashes. Never rebase a branch that's been pushed and shared with other people. Only rebase local branches or branches you know nobody else is using.
            </LectureCallout>

            {/* ── 10 THE .GITIGNORE ───────────────────────────────────────────── */}
            <LectureSectionHeading number="10" title="The .gitignore File" />

            <LectureP>
                Not everything in your project should be tracked by Git. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules</code> can contain hundreds of thousands of files. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> files contain secret API keys that should never be committed. Build artifacts, log files, OS-specific files like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.DS_Store</code> — none of this belongs in your repository.
            </LectureP>
            <LectureP>
                A <LectureTerm>.gitignore</LectureTerm> file tells Git which files and patterns to ignore entirely. Create it in the root of your project:
            </LectureP>
            <TerminalBlock lines={[{ comment: 'create the gitignore file', cmd: 'touch .gitignore' }]} />

            <LectureP>
                Open it in a text editor and add patterns — one per line. Here's what a typical Node.js project's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code> looks like:
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 text-xs border-b border-zinc-700 select-none">
                    .gitignore
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p className="text-zinc-500"># Dependencies</p>
                    <p className="text-emerald-400">node_modules/</p>
                    <p className="text-zinc-500 mt-2"># Environment variables — never commit secrets</p>
                    <p className="text-emerald-400">.env</p>
                    <p className="text-emerald-400">.env.local</p>
                    <p className="text-zinc-500 mt-2"># Build output</p>
                    <p className="text-emerald-400">dist/</p>
                    <p className="text-emerald-400">build/</p>
                    <p className="text-zinc-500 mt-2"># macOS system files</p>
                    <p className="text-emerald-400">.DS_Store</p>
                    <p className="text-zinc-500 mt-2"># Logs</p>
                    <p className="text-emerald-400">*.log</p>
                </div>
            </div>

            <LectureCallout type="warning">
                If you accidentally commit a secret like an API key, changing your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code> afterwards does not remove it from history. Git history is permanent — the key is still retrievable in old commits. You must <strong className="text-foreground">revoke and rotate the key immediately</strong>. Add your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code> before your first commit.
            </LectureCallout>

            {/* ── 11 QUICK REFERENCE ──────────────────────────────────────────── */}
            <LectureSectionHeading number="11" title="Quick Reference" />

            <LectureP>
                Everything you need in one place. Come back to this whenever you're unsure which command to reach for.
            </LectureP>

            <QuickReference />

            <LectureFooterNav
                prev={{
                    label: 'Linux & The Command Line',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/lecture-1'),
                }}
                next={{
                    label: 'The Git + Linux Gauntlet',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/activity'),
                }}
            />
        </LectureLayout>
    );
}