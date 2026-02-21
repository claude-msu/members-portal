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
    LectureTerm,
} from '@/components/ui/lecture-typography';

export default function Week1Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={1}
                session="Lecture 2"
                title="Shell Scripting & Permissions"
                description="Automate repetitive tasks with bash scripts and understand the Unix permission model that controls who can read, write, and execute everything on the system."
                icon={<Terminal className="h-4 w-4" />}
            />

            {/* ── 01 WHY SHELL SCRIPTS ──────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Why Shell Scripts?" />

            <LectureP>
                You already run commands one at a time in the terminal. A <LectureTerm>shell script</LectureTerm> is a text file full of those same commands, run in sequence. No new syntax to learn — just the commands you already know, saved in a file. Scripts turn one-off tasks into repeatable automation: deploy a server, run tests, back up a folder, or set up a new project.
            </LectureP>
            <LectureP>
                On Linux servers and in CI/CD pipelines, shell scripts are everywhere. They're the glue that ties tools together. Learning to write clear, safe scripts will save you hours and make you at home in any Unix environment.
            </LectureP>

            <LectureCallout type="info">
                On servers, scripts often run without a human at the keyboard — via <LectureTermWithTip tip="Scheduled tasks. cron runs commands at fixed times (e.g. every night at 2am).">cron</LectureTermWithTip>, init systems, or deployment pipelines. That's why making scripts <strong className="text-foreground">fail fast</strong> and use clear paths matters: there's no one there to notice a typo.
            </LectureCallout>

            {/* ── 02 THE SHEBANG AND EXECUTING SCRIPTS ───────────────────────── */}
            <LectureSectionHeading number="02" title="The Shebang and Executing Scripts" />

            <LectureP>
                The first line of a script tells the system which interpreter to use. That line is the <LectureTerm>shebang</LectureTerm> (from "hash" + "bang"): <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">#!</code> followed by the path to the shell.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    backup.sh
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p className="text-rose-400">{'#!/bin/bash'}</p>
                    <p className="text-zinc-500">{'# Backup the project folder'}</p>
                    <p className="text-emerald-300">cp -r ./project ./project-backup-$(date +%Y%m%d)</p>
                </div>
            </div>

            <LectureP>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">#!/bin/bash</code> means "run this file with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/bin/bash</code>." On macOS, bash is often at <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/bin/bash</code> or you might use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">#!/usr/bin/env bash</code> so the system finds whatever <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bash</code> is in your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PATH</code>.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'create the script', cmd: 'touch backup.sh' },
                    { comment: 'add the shebang and commands (use your editor)', cmd: 'chmod +x backup.sh' },
                    { comment: 'run it from the current directory', cmd: './backup.sh' },
                ]}
            />

            <LectureCallout type="tip">
                <LectureCmd tip="Make a file executable. Required before you can run ./script.sh.">chmod +x</LectureCmd> is required before <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">./backup.sh</code> works. Without execute permission, the shell will refuse to run the file. You only need to run <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">chmod +x</code> once per script.
            </LectureCallout>

            {/* ── 03 VARIABLES AND QUOTING ─────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Variables and Quoting" />

            <LectureP>
                Store values in variables and reuse them. In bash, you <strong className="text-foreground">don't</strong> use spaces around <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">=</code>. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">$VAR</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'${VAR}'}</code> to read them.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    example.sh
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p className="text-rose-400">{'#!/bin/bash'}</p>
                    <p className="text-emerald-300">NAME="my-project"</p>
                    <p className="text-emerald-300">echo "Building $NAME"</p>
                    <p className="text-emerald-300">{'echo "Date: $(date)"'}</p>
                </div>
            </div>

            <LectureP>
                <LectureTermWithTip tip="Double quotes allow variable expansion. Single quotes treat everything literally.">Double quotes</LectureTermWithTip> let <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">$NAME</code> expand. <LectureTermWithTip tip="Command substitution: run the command and use its output as the string.">$(date)</LectureTermWithTip> runs the command and inserts its output. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'${VAR}'}</code> when the variable name is followed by letters or digits so the shell knows where the name ends.
            </LectureP>

            <LectureCallout type="warning">
                In scripts, unquoted variables can break on spaces or empty values. Prefer <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'"$VAR"'}</code> (quoted) so a path like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/home/my project</code> is treated as one argument, not two.
            </LectureCallout>

            {/* ── 04 CONDITIONALS AND EXIT CODES ─────────────────────────────── */}
            <LectureSectionHeading number="04" title="Conditionals and Exit Codes" />

            <LectureP>
                Every command returns an <LectureTerm>exit code</LectureTerm>: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">0</code> means success, non-zero means failure. Scripts use this to decide what to do next. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">if</code> checks the exit code of the command that follows.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    check.sh
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p className="text-rose-400">{'#!/bin/bash'}</p>
                    <p className="text-emerald-300">if grep -q "error" server.log; then</p>
                    <p className="text-zinc-500 pl-4">echo "Errors found in log"</p>
                    <p className="text-emerald-300">{'  exit 1'}</p>
                    <p className="text-emerald-300">fi</p>
                </div>
            </div>

            <LectureP>
                <LectureCmd tip="Quiet mode — no output, only exit code. Perfect for scripts.">grep -q</LectureCmd> succeeds (exit 0) if it finds a match and fails otherwise. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">exit 1</code> tells the rest of the system "this script failed."
            </LectureP>

            <LectureCallout type="tip">
                Put <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">set -e</code> at the top of a script to make it exit immediately if any command fails. Without it, the script keeps going after a failure, which can cause dangerous follow-up actions (e.g. deploying broken code). In production scripts, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">set -e</code> is standard.
            </LectureCallout>

            {/* ── 05 LOOPS ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Loops" />

            <LectureP>
                Loop over a list of items or over lines in a file. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">for ... in ...</code> is the most common.
            </LectureP>

            <TerminalBlock
                title="bash — loop over files"
                lines={[
                    { comment: 'run a command once per .txt file', cmd: 'for f in *.txt; do echo "Processing $f"; done' },
                    { comment: 'loop over a list', cmd: 'for env in dev staging prod; do echo "Deploy $env"; done' },
                ]}
            />

            <LectureP>
                You can also loop over the output of a command: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">for f in $(ls *.sh); do ...</code>. Be careful with filenames that contain spaces — they'll be split. Prefer <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">find</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-exec</code> for complex cases.
            </LectureP>

            <LectureCallout type="info">
                <LectureCmd tip="Find files and run a command on each. -type f = files only; -name '*.sh' = match pattern.">{'find . -name "*.sh" -exec chmod +x {} \\;'}</LectureCmd> is a robust way to make all <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.sh</code> files in a tree executable without breaking on spaces in names.
            </LectureCallout>

            {/* ── 06 PERMISSIONS IN DEPTH ─────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Permissions in Depth" />

            <LectureP>
                Every file and directory has three permission classes: <LectureTerm>owner</LectureTerm>, <LectureTerm>group</LectureTerm>, and <LectureTerm>others</LectureTerm>. Each class can have <strong className="text-foreground">r</strong>ead, <strong className="text-foreground">w</strong>rite, and <strong className="text-foreground">x</strong>ecute. For a script to run, it must have execute (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">x</code>) for the user running it.
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

            <LectureSubHeading title="Numeric permissions" />
            <LectureP>
                You'll see permissions as numbers: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">755</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">644</code>. Each digit is the sum of r=4, w=2, x=1. So <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">7</code> = rwx, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">5</code> = r-x, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">0</code> = no access.
            </LectureP>

            <TerminalBlock
                lines={[
                    { comment: 'owner read+write+execute, group and others read+execute (scripts)', cmd: 'chmod 755 deploy.sh' },
                    { comment: 'owner read+write, group and others read-only (config files)', cmd: 'chmod 644 config.env' },
                    { comment: 'owner only: read+execute, no one else (secret script)', cmd: 'chmod 700 secret.sh' },
                ]}
            />

            <LectureCallout type="warning">
                On a shared server, scripts that contain secrets (API keys, passwords) should be <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">chmod 700</code> so only the owner can read or run them. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">chmod 755</code> lets anyone on the system read the file — fine for non-sensitive scripts, dangerous for anything that touches credentials.
            </LectureCallout>

            <LectureSubHeading title="chown and chgrp" />
            <LectureP>
                <LectureCmd tip="Change file owner. Often requires sudo.">chown</LectureCmd> and <LectureCmd tip="Change file group. Useful when multiple users need access.">chgrp</LectureCmd> change who owns a file or which group it belongs to. On a server, you might run a web app as a dedicated user and use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">chown www-data:www-data</code> so the web server can read the files but others cannot.
            </LectureP>

            <LectureCallout type="info">
                Directories need execute (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">x</code>) for you to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">cd</code> into them. So directory permissions are often <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">755</code> (owner full, others can enter and list) or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">711</code> (others can enter but not list contents — useful for restricted areas).
            </LectureCallout>

            {/* ── 07 CRON ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Scheduling with cron" />

            <LectureP>
                <LectureTermWithTip tip="Cron runs commands on a schedule: every minute, every day at 2am, etc. The cron daemon reads crontab files.">cron</LectureTermWithTip> runs commands at fixed times. Edit your user's crontab with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">crontab -e</code>. Each line is: minute, hour, day-of-month, month, day-of-week, then the command.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    crontab example
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p className="text-zinc-500">{'# Every day at 2:30 AM — backup'}</p>
                    <p className="text-emerald-300">30 2 * * * /home/you/scripts/backup.sh</p>
                    <p className="text-zinc-500 mt-2">{'# Every 15 minutes — health check'}</p>
                    <p className="text-emerald-300">*/15 * * * * /home/you/scripts/health-check.sh</p>
                </div>
            </div>

            <LectureP>
                Use absolute paths in cron jobs. Cron runs with a minimal environment — your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PATH</code> and current directory are not what you expect. Scripts started by cron also don't see your terminal; redirect output to a log file if you want to debug.
            </LectureP>

            <LectureCallout type="tip">
                End cron entries with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'>> /var/log/my-script.log 2>&1'}</code> to capture both stdout and stderr. Otherwise failed runs leave no trace unless you've set up separate logging.
            </LectureCallout>

            {/* ── 08 PUTTING IT TOGETHER ──────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="Putting It Together" />

            <LectureP>
                A typical deploy or backup script: set up a safe environment, check prerequisites, then run the real work. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">set -e</code> so the script stops on any failure.
            </LectureP>

            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                    deploy.sh — minimal safe pattern
                </div>
                <div className="bg-zinc-950 px-5 py-4 space-y-1 select-none">
                    <p className="text-rose-400">{'#!/bin/bash'}</p>
                    <p className="text-rose-400">set -e</p>
                    <p className="text-zinc-500">{'# Exit on any command failure'}</p>
                    <p className="text-emerald-300">cd "$(dirname "$0")"</p>
                    <p className="text-zinc-500">{'# Run from script directory'}</p>
                    <p className="text-emerald-300">echo "Starting deploy..."</p>
                    <p className="text-emerald-300">npm run build</p>
                    <p className="text-emerald-300">echo "Deploy complete."</p>
                </div>
            </div>

            <LectureCallout type="warning">
                Avoid <LectureCmd tip="Recursive force delete. No undo. In a script, a wrong variable or path can wipe the wrong directory." warn>rm -rf</LectureCmd> in scripts unless the path is fixed and you're certain. Prefer moving to a trash directory or using a flag that requires confirmation. One typo in a variable used with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">rm -rf $VAR</code> has destroyed production systems.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Linux & The Command Line',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/lecture-1'),
                }}
                next={{
                    label: 'The Linux Gauntlet',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-1/activity'),
                }}
            />
        </LectureLayout>
    );
}
