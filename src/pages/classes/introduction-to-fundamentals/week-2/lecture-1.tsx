import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
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

export default function Week2Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={2}
                session="Lecture 1"
                title="Package Managers"
                description="Every language, every platform, every operating system has one thing in common: a package manager. Understanding how they work — not just the commands, but the model underneath — is what separates developers who can set up any environment from developers who can only follow tutorials."
                icon={<Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                onBack={() => navigate('/classes/introduction-to-fundamentals')}
            />

            {/* ── 01 WHAT IS A PACKAGE ────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="What is a Package?" />

            <LectureP>
                A <LectureTerm>package</LectureTerm> is a bundle of code that someone else wrote, tested, and published so that you don't have to write it yourself. It has a name, a version, and a set of files. It might also depend on other packages — those are called its <LectureTerm>dependencies</LectureTerm>.
            </LectureP>
            <LectureP>
                When you install a package, you're not just downloading one file. You're downloading that package, plus all of its dependencies, plus all of their dependencies, potentially dozens of levels deep. A simple React project can have tens of thousands of packages in its <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules</code> folder. The package manager resolves, downloads, and wires all of them together so you don't have to think about it.
            </LectureP>
            <LectureP>
                This is both a superpower and a responsibility. You can build sophisticated applications by composing packages written by experts. But you're also trusting that code with your system and your users — which is why understanding what you're installing matters.
            </LectureP>

            <LectureCallout type="info">
                The infamous <LectureTerm>left-pad incident</LectureTerm> in 2016 is a good illustration of package dependency risk. A developer unpublished a 17-line npm package called <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">left-pad</code> from the registry. Because thousands of other packages depended on it, builds broke across the entire JavaScript ecosystem within minutes — including React and Babel. The entire internet's JS infrastructure depended on a function that pads strings with spaces.
            </LectureCallout>

            {/* ── 02 THE REGISTRY MODEL ───────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="The Registry Model" />

            <LectureP>
                Every package manager works against a <LectureTerm>registry</LectureTerm> — a centralized database of published packages. When you run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">npm install react</code>, npm reaches out to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">registry.npmjs.org</code>, downloads the package metadata, resolves the full dependency tree, and installs everything. The registry is the source of truth.
            </LectureP>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    {
                        manager: 'npm / yarn / pnpm',
                        registry: 'registry.npmjs.org',
                        ecosystem: 'JavaScript / Node.js',
                        packages: '2.5M+ packages',
                    },
                    {
                        manager: 'pip',
                        registry: 'pypi.org',
                        ecosystem: 'Python',
                        packages: '500K+ packages',
                    },
                    {
                        manager: 'apt',
                        registry: 'Debian/Ubuntu mirrors',
                        ecosystem: 'Linux system software',
                        packages: '60K+ packages',
                    },
                    {
                        manager: 'brew',
                        registry: 'github.com/Homebrew',
                        ecosystem: 'macOS / Linux userland',
                        packages: '7K+ formulae',
                    },
                ].map((item) => (
                    <div key={item.manager} className="rounded-lg border border-border bg-card p-4">
                        <code className="text-sm font-bold text-foreground">{item.manager}</code>
                        <p className="text-xs text-muted-foreground mt-1">{item.ecosystem}</p>
                        <p className="text-xs text-muted-foreground mt-2 font-mono">{item.registry}</p>
                        <p className="text-xs text-primary/70 mt-1">{item.packages}</p>
                    </div>
                ))}
            </div>

            <LectureP>
                Understanding that there's a registry behind every package manager explains a lot of behavior: why installs fail with network errors, why you sometimes get stale versions, why companies run private registries for internal packages, and why supply chain attacks (malicious code injected into popular packages) are a real security concern.
            </LectureP>

            {/* ── 03 NPM ──────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="npm — The JavaScript Package Manager" />

            <LectureP>
                <LectureTerm>npm</LectureTerm> (Node Package Manager) ships with Node.js and is the package manager you'll use most as a web developer. It manages two things: packages installed globally on your machine (CLI tools), and packages installed locally in a specific project.
            </LectureP>

            <LectureSubHeading title="The package.json file" />
            <LectureP>
                Every Node.js project has a <LectureTerm>package.json</LectureTerm> file at its root. This is the manifest — it records the project name, version, scripts, and most importantly, the list of packages the project depends on. It's the single source of truth for your project's dependencies.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'create a new project and initialize a package.json', cmd: 'mkdir my-project && cd my-project && npm init -y' },
                    { comment: 'install a package as a runtime dependency', cmd: 'npm install express' },
                    { comment: 'install a package only needed during development', cmd: 'npm install --save-dev typescript' },
                    { comment: 'install a specific version of a package', cmd: 'npm install react@18.2.0' },
                    { comment: 'install all dependencies listed in package.json', cmd: 'npm install' },
                    { comment: 'remove a package', cmd: 'npm uninstall express' },
                ]}
            />

            <LectureP>
                The <LectureCmd tip="npm install (no arguments): reads package.json and installs every dependency listed under 'dependencies' and 'devDependencies'. This is what you run after cloning a project — it reconstructs the full node_modules folder from the manifest.">npm install</LectureCmd> command with no arguments is what you run when you clone a new project. It reads <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package.json</code> and recreates the entire <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules</code> folder. The <LectureCmd tip="--save-dev flag: installs the package as a devDependency — only needed during development (linting, testing, TypeScript compilation). Not included in production builds.">--save-dev</LectureCmd> flag marks packages as development-only. These are things like TypeScript, ESLint, and test runners that don't need to be included in production.
            </LectureP>

            <LectureSubHeading title="The package-lock.json file" />
            <LectureP>
                When npm installs packages, it creates a <LectureTerm>package-lock.json</LectureTerm> file. While <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package.json</code> specifies version ranges (e.g., <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">^18.0.0</code>), the lockfile pins every package to its exact installed version — including all transitive dependencies. This ensures that anyone who clones your project gets the exact same dependency tree, not "approximately the same."
            </LectureP>

            <LectureCallout type="warning">
                Never delete <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package-lock.json</code> and never add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules/</code> to Git. The lockfile should be committed — it's what makes builds reproducible across your team. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules/</code> can be 200MB+ and is entirely reconstructable from the lockfile.
            </LectureCallout>

            <LectureSubHeading title="npm scripts" />
            <LectureP>
                The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">scripts</code> field in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package.json</code> lets you define shortcut commands for your project. These are how you start dev servers, run tests, build for production, and lint your code — all through a consistent interface regardless of what tools are underneath.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 text-xs border-b border-zinc-700 select-none">
                    package.json — scripts section
                </div>
                <div className="bg-zinc-950 px-5 py-4 select-none">
                    <p className="text-zinc-400">{'{'}</p>
                    <p className="text-zinc-400 pl-4">{'"scripts": {'}</p>
                    <p className="text-zinc-500 pl-8">{'"dev": '}<span className="text-emerald-400">"vite"</span><span className="text-zinc-400">,</span></p>
                    <p className="text-zinc-500 pl-8">{'"build": '}<span className="text-emerald-400">"tsc && vite build"</span><span className="text-zinc-400">,</span></p>
                    <p className="text-zinc-500 pl-8">{'"lint": '}<span className="text-emerald-400">"eslint src --ext ts,tsx"</span><span className="text-zinc-400">,</span></p>
                    <p className="text-zinc-500 pl-8">{'"test": '}<span className="text-emerald-400">"vitest"</span></p>
                    <p className="text-zinc-400 pl-4">{'}'}</p>
                    <p className="text-zinc-400">{'}'}</p>
                </div>
            </div>

            <TerminalBlock
                lines={[
                    { comment: 'run the dev script (starts the development server)', cmd: 'npm run dev' },
                    { comment: 'run the build script', cmd: 'npm run build' },
                    { comment: 'run the test script', cmd: 'npm run test' },
                    { comment: 'list all globally installed packages', cmd: 'npm list -g --depth=0' },
                    { comment: 'install a CLI tool globally so it works from anywhere', cmd: 'npm install -g typescript' },
                ]}
            />

            <LectureCallout type="tip">
                <LectureCmd tip="npm run dev: runs the 'dev' script defined in package.json. This is the universal way to start a development server regardless of whether the project uses Vite, Next.js, Create React App, or something else — the underlying tool is abstracted away.">npm run dev</LectureCmd> is one of the first commands you'll type on any new project. It's the universal "start the dev server" command. The actual tool it invokes (Vite, webpack, Next.js, etc.) doesn't matter — that complexity lives in the script.
            </LectureCallout>

            {/* ── 04 PIP ──────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="pip — Python's Package Manager" />

            <LectureP>
                <LectureTerm>pip</LectureTerm> is Python's package manager. It installs packages from PyPI (the Python Package Index). The workflow is similar to npm, but Python projects use a <LectureTerm>virtual environment</LectureTerm> instead of a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node_modules</code> folder to isolate dependencies.
            </LectureP>

            <LectureSubHeading title="Virtual environments" />
            <LectureP>
                Without a virtual environment, pip installs packages globally — meaning every Python project on your machine shares the same package versions. This causes version conflicts when Project A needs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">requests==2.25</code> and Project B needs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">requests==2.31</code>. A <LectureTerm>virtual environment</LectureTerm> creates an isolated Python installation per project so each project has its own packages.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'create a virtual environment in a folder called .venv', cmd: 'python3 -m venv .venv' },
                    { comment: 'activate it (macOS/Linux)', cmd: 'source .venv/bin/activate' },
                    { comment: 'activate it (Windows)', cmd: '.venv\\Scripts\\activate' },
                    { comment: 'your prompt will now show (.venv) — you are inside the environment', cmd: '' },
                    { comment: 'install packages — they go into .venv, not globally', cmd: 'pip install fastapi uvicorn' },
                    { comment: 'save the current environment to a requirements file', cmd: 'pip freeze > requirements.txt' },
                    { comment: 'install from a requirements file (on a new machine)', cmd: 'pip install -r requirements.txt' },
                    { comment: 'deactivate the virtual environment', cmd: 'deactivate' },
                ]}
            />

            <LectureP>
                The <LectureCmd tip="pip freeze: outputs every installed package and its exact version in a format suitable for a requirements.txt file. Like package-lock.json for Python — captures the exact state of your environment.">pip freeze</LectureCmd> command captures your exact environment to a <LectureTerm>requirements.txt</LectureTerm> file. This is Python's equivalent of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package-lock.json</code> — it pins exact versions so anyone who runs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">pip install -r requirements.txt</code> gets the same environment.
            </LectureP>

            <LectureCallout type="info">
                Always add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.venv/</code> to your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code>. Virtual environments are local — they contain compiled binaries specific to your OS and Python version. Commit <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">requirements.txt</code>, not <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.venv/</code>.
            </LectureCallout>

            {/* ── 05 APT ──────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="apt — Linux System Package Manager" />

            <LectureP>
                <LectureTerm>apt</LectureTerm> (Advanced Package Tool) is the system-level package manager for Debian and Ubuntu — the Linux distributions you'll encounter on most servers. Unlike npm and pip which manage language-level libraries, apt manages system-level software: web servers, databases, programming language runtimes, system utilities.
            </LectureP>
            <LectureP>
                When you install Node.js on a fresh Ubuntu server, you use apt. When you install PostgreSQL or nginx or Python, you use apt. It's the foundation layer that everything else sits on top of.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'update the package index (always run this first)', cmd: 'sudo apt update' },
                    { comment: 'upgrade all installed packages to their latest versions', cmd: 'sudo apt upgrade' },
                    { comment: 'install a package', cmd: 'sudo apt install nginx' },
                    { comment: 'install multiple packages at once', cmd: 'sudo apt install git curl wget build-essential' },
                    { comment: 'search for a package by name or description', cmd: 'apt search "web server"' },
                    { comment: 'show detailed info about a package before installing', cmd: 'apt show nginx' },
                    { comment: 'remove a package but keep its config files', cmd: 'sudo apt remove nginx' },
                    { comment: 'remove a package AND its config files', cmd: 'sudo apt purge nginx' },
                    { comment: 'remove packages that were installed as dependencies and are no longer needed', cmd: 'sudo apt autoremove' },
                ]}
            />

            <LectureP>
                The difference between <LectureCmd tip="apt remove: uninstalls the package binary but leaves configuration files in place. Useful if you plan to reinstall later and want to keep your settings.">apt remove</LectureCmd> and <LectureCmd tip="apt purge: uninstalls the package AND deletes all its configuration files. Use this for a clean uninstall — like it was never there.">apt purge</LectureCmd> matters when you're managing servers. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">remove</code> leaves config files behind (useful if you might reinstall). <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">purge</code> cleans everything out completely.
            </LectureP>

            <LectureSubHeading title="PPAs and external repositories" />
            <LectureP>
                Not every package is in Ubuntu's default repositories. For software like the latest version of Node.js, you often need to add a <LectureTerm>PPA</LectureTerm> (Personal Package Archive) or an external repository before you can install it.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'add NodeSource repository so apt knows where to get the latest Node.js', cmd: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -' },
                    { comment: 'now apt can find and install the latest Node.js', cmd: 'sudo apt install nodejs' },
                    { comment: 'verify the version', cmd: 'node --version' },
                ]}
            />

            <LectureCallout type="warning">
                Be careful when piping scripts directly into bash from the internet — <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">curl ... | sudo bash</code> runs whatever is at that URL with root privileges. Only do this with commands from official documentation of major, trusted projects.
            </LectureCallout>

            {/* ── 06 BREW ─────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="brew — macOS Package Manager" />

            <LectureP>
                <LectureTerm>Homebrew</LectureTerm> is the unofficial-but-universal package manager for macOS. Apple ships a minimal set of tools — Homebrew fills the gap with thousands of packages that developers need.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'install Homebrew (run this once on a new Mac)', cmd: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' },
                    { comment: 'install a package (called a "formula")', cmd: 'brew install git' },
                    { comment: 'install a GUI application (called a "cask")', cmd: 'brew install --cask visual-studio-code' },
                    { comment: 'update brew and all formula definitions', cmd: 'brew update' },
                    { comment: 'upgrade all installed formulae', cmd: 'brew upgrade' },
                    { comment: 'see what you have installed', cmd: 'brew list' },
                    { comment: 'check for problems with your brew installation', cmd: 'brew doctor' },
                ]}
            />

            <LectureP>
                Homebrew distinguishes between <LectureTerm>formulae</LectureTerm> (command-line tools and libraries, like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">git</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">node</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">postgresql</code>) and <LectureTerm>casks</LectureTerm> (GUI applications, like VS Code, Chrome, or Docker Desktop). The <LectureCmd tip="--cask flag: tells brew to install a GUI application rather than a command-line tool. Casks are macOS .app bundles that install into your Applications folder.">--cask</LectureCmd> flag is how you install GUI apps.
            </LectureP>

            <LectureCallout type="tip">
                A common first-day-on-a-new-Mac workflow: install Homebrew, then use it to install everything else — git, node, python, postgresql, the works. It's faster and cleaner than downloading installers manually.
            </LectureCallout>

            {/* ── 07 SEMANTIC VERSIONING ──────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Semantic Versioning" />

            <LectureP>
                Every package has a version number. Understanding how versioning works helps you make informed decisions about what to install and when to upgrade. The standard format is <LectureTerm>MAJOR.MINOR.PATCH</LectureTerm> — for example, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">18.2.0</code>.
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                <div className="grid grid-cols-3 divide-x divide-border">
                    {[
                        {
                            part: 'MAJOR',
                            example: '18',
                            meaning: 'Breaking changes. Code written for v17 may not work on v18 without modifications.',
                            color: 'text-rose-600 dark:text-rose-400',
                            bg: 'bg-rose-50 dark:bg-rose-950/20',
                        },
                        {
                            part: 'MINOR',
                            example: '2',
                            meaning: 'New features added in a backwards-compatible way. Upgrading is safe.',
                            color: 'text-amber-600 dark:text-amber-400',
                            bg: 'bg-amber-50 dark:bg-amber-950/20',
                        },
                        {
                            part: 'PATCH',
                            example: '0',
                            meaning: 'Bug fixes only. No new features, no breaking changes. Always upgrade.',
                            color: 'text-emerald-600 dark:text-emerald-400',
                            bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                        },
                    ].map((item) => (
                        <div key={item.part} className={`p-4 ${item.bg}`}>
                            <p className={`text-xs font-bold uppercase tracking-wider ${item.color}`}>{item.part}</p>
                            <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.example}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-2">{item.meaning}</p>
                        </div>
                    ))}
                </div>
            </div>

            <LectureP>
                In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package.json</code>, version ranges use special symbols. A <LectureCmd tip="^ (caret) in package.json: accepts any version compatible with the specified version. ^18.2.0 means 'any version >= 18.2.0 and < 19.0.0'. Will automatically get new features and bug fixes but not breaking changes.">^</LectureCmd> (caret) means "compatible with" — it will accept newer minor and patch versions but not a new major. A <LectureCmd tip="~ (tilde) in package.json: more restrictive than caret. ~18.2.0 means 'any version >= 18.2.0 and < 18.3.0'. Only accepts patch-level updates.">~</LectureCmd> (tilde) is more restrictive — only patch updates. No prefix means exactly that version.
            </LectureP>

            <LectureCallout type="info">
                This is why <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package-lock.json</code> exists. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">package.json</code> might say <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">^18.2.0</code> which could resolve to different versions on different machines at different times. The lockfile pins the exact version so every install is identical.
            </LectureCallout>

            {/* ── 08 PUTTING IT TOGETHER ──────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Setting Up a Real Environment" />

            <LectureP>
                Let's walk through setting up a fresh Ubuntu server from scratch — the kind of environment you'd get from a cloud provider like AWS or DigitalOcean. This is the real-world workflow combining everything from this lecture.
            </LectureP>

            <TerminalBlock
                title="bash — fresh Ubuntu server"
                lines={[
                    { comment: 'first thing: update the system', cmd: 'sudo apt update && sudo apt upgrade -y' },
                    { comment: 'install essential build tools', cmd: 'sudo apt install -y curl git build-essential' },
                    { comment: 'add NodeSource repo and install Node.js 20', cmd: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -' },
                    { cmd: 'sudo apt install -y nodejs' },
                    { comment: 'verify node and npm are installed', cmd: 'node --version && npm --version' },
                    { comment: 'install Python and pip', cmd: 'sudo apt install -y python3 python3-pip python3-venv' },
                    { comment: 'install nginx web server', cmd: 'sudo apt install -y nginx' },
                    { comment: 'verify nginx is running', cmd: 'systemctl status nginx' },
                    { comment: 'create a project and set up a Python venv', cmd: 'mkdir ~/app && cd ~/app && python3 -m venv .venv' },
                    { cmd: 'source .venv/bin/activate' },
                    { cmd: 'pip install fastapi uvicorn' },
                ]}
            />

            <LectureP>
                This sequence — update, install essentials, install runtimes, verify — is the pattern for every server setup you'll ever do. The specific packages change, the pattern doesn't.
            </LectureP>

            <LectureFooterNav
                prev={{
                    label: 'The Git + Linux Gauntlet',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/activity'),
                }}
                next={{
                    label: 'Docker & Containerization',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-2/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}