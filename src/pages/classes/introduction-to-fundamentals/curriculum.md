# Introduction to Fundamentals — Curriculum Audit

_Audit conducted: April 5, 2026_

_Note: The audit prompt references a `CppBlock` component, but no such component exists in the codebase. C++ code should use `<CodeBlock language="cpp">`. This audit will flag raw JSX code blocks and check that `CodeBlock` is used with the correct `language` prop for C++ content._

---

## Week 1 — Linux & The Command Line

### Lecture 1

**Positives**
- Excellent progressive structure: 8 sections flow naturally from "What is a terminal?" through navigation, file manipulation, reading files, permissions, processes, package managers, to a capstone "Putting It All Together" scenario.
- Generous use of `LectureTermWithTip` to introduce every new concept with hover-accessible definitions — good for beginners who may encounter these terms for the first time.
- `LectureCmd` used consistently for every command introduced, with clear tooltip explanations.
- Every `TerminalBlock` includes descriptive `comment` fields that explain each command before the student reads it — strong pedagogical scaffolding.
- `LectureCallout` types (info, tip, warning) used appropriately: `rm -rf` warning, `sudo` warning, tab completion tip.
- `LectureFooterNav` present with correct forward link to Lecture 2.
- Section 08 capstone ties all skills together in a realistic "set up a fresh server" scenario.

**Negatives**
- Section 07 (Package Managers): The package manager comparison grid (lines 296–316) renders shell commands (`$ apt install nginx`, etc.) as raw `<code>` tags with hardcoded `text-emerald-600 dark:text-emerald-400` and `select-none` styles inside a custom card layout, rather than using `TerminalBlock`. These are shell commands and belong in the component system.
- Section 05 (Permissions): The permissions visualization (lines 217–237) is a raw JSX `<div>` with hardcoded color classes (`text-orange-500`, `text-blue-500`, `text-emerald-500`). While this is a diagram rather than code, it is hardcoded color styling outside the design system. (Note: this is a borderline case — it's an illustration, not a code block.)
- `LectureFooterNav` has no `prev` link. This is Lecture 1 of Week 1, so there's no prior page in this class. Acceptable, but worth noting for consistency — some courses link back to the class index.
- The `echo` command is never explicitly introduced in Lecture 1 despite being a fundamental command that appears in Lecture 2 and the Activity.

**Gaps**
- **Pipes and redirection** (`|`, `>`, `>>`, `<`): The pipe operator `|` appears in section 06 (processes) with `ps aux | grep node` but is never formally explained as a concept. Redirection (`>`, `>>`) is not covered at all in Lecture 1, but the Activity (Challenge 1.4) requires students to use `echo "content" > filename`. Students would encounter redirection for the first time in the activity without prior instruction.
- **`echo` command** is not introduced — it appears later in Lecture 2 and the Activity without prior explanation.
- **`man` command** is mentioned only as a tip callout at the very end of section 08. Given its importance for self-directed learning, it could be introduced earlier (e.g., alongside `pwd` and `ls`).
- **`which` command** — useful for understanding where programs are installed, especially in the context of package managers — is absent.

**Component Compliance**
1. Line 58: `<TerminalBlock>` (empty prompt) — COMPLIANT
2. Line 71: `<TerminalBlock>` (pwd) — COMPLIANT
3. Lines 77–83: `<TerminalBlock>` (ls variants) — COMPLIANT
4. Lines 89–97: `<TerminalBlock>` (cd variants) — COMPLIANT
5. Lines 110–116: `<TerminalBlock>` (touch, mkdir) — COMPLIANT
6. Lines 125–130: `<TerminalBlock>` (nano, vim) — COMPLIANT
7. Lines 148–155: `<TerminalBlock>` (cp, mv) — COMPLIANT
8. Lines 161–166: `<TerminalBlock>` (rm) — COMPLIANT
9. Lines 180–187: `<TerminalBlock>` (cat, less, head, tail) — COMPLIANT
10. Lines 197–205: `<TerminalBlock>` (grep variants) — COMPLIANT
11. Lines 217–237: **RAW JSX** — permissions diagram. Uses `text-orange-500`, `text-blue-500`, `text-emerald-500`. Not a code block per se, but hardcoded color styling. FLAG as borderline.
12. Lines 243–250: `<TerminalBlock>` (chmod variants) — COMPLIANT
13. Lines 263–269: `<TerminalBlock>` (ps commands) — COMPLIANT
14. Lines 275–280: `<TerminalBlock>` (kill commands) — COMPLIANT
15. Lines 296–316: **VIOLATION** — Package manager grid. Shell commands (`$ apt install nginx`, `$ brew install node`, etc.) rendered as raw `<code>` tags with `text-emerald-600 dark:text-emerald-400` and `bg-muted`. Should use `<TerminalBlock>` or individual command components.
16. Lines 322–330: `<TerminalBlock>` (apt workflow) — COMPLIANT
17. Lines 344–360: `<TerminalBlock>` (putting it together scenario) — COMPLIANT

---

### Lecture 2

**Positives**
- Strong motivation in section 01 — explains not just "what" but "why" shell scripts matter (CI/CD, servers, automation).
- Good progression: shebang → variables → conditionals → loops → permissions in depth → cron → capstone.
- Permissions section (06) extends Lecture 1's introduction with numeric permissions, `chown`, `chgrp`, and directory-specific permission semantics (e.g., `x` needed for `cd`).
- Cron section (07) is practical and immediately useful — includes real crontab syntax, absolute path warning, and logging tip.
- `LectureFooterNav` present with correct prev (Lecture 1) and next (Activity) links.
- Good callouts: `set -e` for script safety, `rm -rf` in scripts warning, quoting variables.
- Clear explanation of exit codes and their role in conditionals.

**Negatives**
- **Five raw JSX code blocks** render bash scripts with hardcoded color classes instead of using `<CodeBlock language="bash">`. These are full multi-line script files (backup.sh, example.sh, check.sh, crontab, deploy.sh) — the exact use case `CodeBlock` was built for. This is the most significant compliance issue in Week 1.
- The permissions diagram (lines 164–184) is duplicated verbatim from Lecture 1 (lines 217–237). While reinforcement is good pedagogically, this is a copy-paste of raw JSX with hardcoded colors appearing twice in the course.
- Section 04 (Conditionals) only shows `if...then...fi` — no `else` or `elif` branch is demonstrated. Students who need an if/else pattern will have to figure it out on their own.
- Section 05 (Loops) only covers `for` loops — no `while` loop example is provided.
- The TerminalBlock on line 69 has an empty `cmd: ''` entry (the "open backup.sh..." step). This renders as a prompt with no command, which could confuse students.

**Gaps**
- **`else` / `elif`** — only `if...then...fi` shown. A beginner writing a script will almost certainly need an else branch immediately.
- **`while` loops** — not covered. `while read line; do ... done < file` is a very common pattern for processing files line-by-line.
- **Script arguments** (`$1`, `$2`, `$@`, `$#`) — not covered at all. Students cannot write a script that accepts input parameters without this knowledge.
- **Functions in bash** — not mentioned. Even simple `function_name() { ... }` patterns would be valuable.
- **`set -e`** is mentioned in a callout (section 04) and shown in the capstone script (section 08) but never given its own subsection or explanation of what happens when it's active (e.g., how pipes interact with it).
- **String comparison operators** (`-eq`, `-ne`, `-z`, `-n`, `==`) — the `if` example uses `grep -q` (command exit code) but never shows how to compare strings or numbers directly.

**Component Compliance**
1. Lines 51–60: **VIOLATION** — `backup.sh` script rendered as raw JSX `<div>` with `text-rose-400`, `text-zinc-500`, `text-emerald-300`. Should use `<CodeBlock language="bash" title="backup.sh">`.
2. Lines 66–73: `<TerminalBlock>` (create and run script) — COMPLIANT (though has empty cmd on line 69).
3. Lines 86–96: **VIOLATION** — `example.sh` script rendered as raw JSX with same hardcoded colors. Should use `<CodeBlock language="bash" title="example.sh">`.
4. Lines 113–124: **VIOLATION** — `check.sh` script rendered as raw JSX. Should use `<CodeBlock language="bash" title="check.sh">`.
5. Lines 141–147: `<TerminalBlock>` (for loops) — COMPLIANT.
6. Lines 164–184: **RAW JSX** — permissions diagram (duplicate from Lecture 1). Same hardcoded color classes. FLAG as borderline (diagram, not code).
7. Lines 191–197: `<TerminalBlock>` (chmod numeric) — COMPLIANT.
8. Lines 219–229: **VIOLATION** — crontab example rendered as raw JSX with hardcoded colors. Should use `<CodeBlock language="bash" title="crontab example">`.
9. Lines 246–260: **VIOLATION** — `deploy.sh` script rendered as raw JSX with hardcoded colors. Should use `<CodeBlock language="bash" title="deploy.sh — minimal safe pattern">`.

Total: **5 clear violations** (bash script blocks in raw JSX), 1 borderline (permissions diagram).

---

### Activity

**Detailing**
- Challenge 1.1 (Build a Project Structure): Excellent detailing — visual directory tree provided, each task is specific, two hints for different stuck points, clear verification step (`ls -la`).
- Challenge 1.2 (Permissions Puzzle): Clear tasks with specific permission goals described in plain English. Hints provide numeric values. Verification step included (`ls -la`).
- Challenge 1.3 (Process Hunt): Well-structured multi-window exercise. Each step is specific and verifiable. Good hints for PID identification and `killall`.
- Challenge 1.4 (grep Detective): Provides setup commands to create test files, then asks specific questions. Good scaffolding.
- Challenges 2.1–2.4 (Git preview): Thorough step-by-step tasks with verification at each stage. `git revert` vs `git reset` explanation in callout is strong.
- Challenge 3.1 (Full workflow): End-to-end clone-to-PR exercise. Clearly described with 9 discrete tasks.
- Bonus (Squash): Open-ended, no hints — appropriate for advanced students.

**Project Connection**
- No project connection — this is a standalone gauntlet. Appropriate for Week 1 since the fundamentals project doesn't begin until Week 4.

**Feasibility**
- Section 01 (Challenges 1.1–1.4) is well-scoped for ~60 minutes for beginners.
- Sections 02–03 are marked as "optional preview" which is good — they would push the session well past 90 minutes if mandatory.
- The Git content (Sections 02–03) is substantial: 5 challenges covering init, branching, merging, conflict resolution, revert, clone, and PRs. This is a lot even as optional content.
- The bonus challenge (interactive rebase) is appropriate difficulty for an advanced extra.

**Positives**
- Clear separation between mandatory (Section 01: Linux) and optional (Sections 02–03: Git preview).
- `ActivityTaskListProvider` wrapping enables task tracking for student progress.
- Hints are used appropriately — non-obvious steps get hints, straightforward steps don't.
- Callout in Section 02 clearly labels Git as an optional preview and references the future week where it will be covered in full.
- Footer nav links are correct: prev → Lecture 2, next → Week 2 Lecture 1.

**Negatives**
- **Critical inconsistency**: The activity description (line 27) says "you'll cover Version Control in depth in Week 2" and the footer nav (line 329) points to `week-2/lecture-1` with label "Version Control with Git." However, the course index (`index.tsx`) defines Week 2 as "Data Structures & Algorithms" and Week 4 as "Git & Agile Engineering." Either the content files or the index is misordered — this needs reconciliation.
- Challenge 1.4 tells students to use `echo "content" > filename` to create files with content, but `echo` and redirection (`>`, `>>`) were never taught in either lecture. Students are expected to use syntax they haven't learned yet.
- The `\n` escape in TerminalBlock line 140 (`echo "// TODO: handle errors\\nconst fetchUser = () => {}"`) — `echo` does not interpret `\n` by default in bash (it requires `echo -e`). This command won't produce a newline where expected; it will output the literal `\n`.
- Section 02 callout (line 162) says "Version Control with Git is the focus of Week 2 Lecture 1" — this conflicts with the index where Week 2 is DSA.

**Gaps**
- No explicit success criteria for the overall activity — there's no "you're done when..." wrap-up that tells the student what constitutes completion of the required portion.
- No mention of how to submit or demonstrate completion of the gauntlet to the instructor/TA.

**Component Compliance**
1. Lines 51–59: Raw JSX `<div>` — directory tree visualization. Uses `text-muted-foreground`, `border-border`, `bg-muted/30`. This is a text diagram, not code. Borderline — not a code block, so acceptable as a custom visual.
2. Lines 134–141: `<TerminalBlock>` (file creation commands) — COMPLIANT.
3. All other content is rendered via `<ActivityChallenge>`, `<ActivityTask>`, `<ActivityHint>`, inline `<code>` within `<LectureP>` — all COMPLIANT.

---

### Week 1 Overall

**Positives**
- Strong foundational arc: Lecture 1 covers the "what" and "how" of the command line, Lecture 2 extends into automation and deeper permissions, and the Activity applies both in a structured gauntlet.
- Lecture 1 is exceptionally well-paced for beginners — no assumption of prior knowledge, every command introduced with context.
- The activity's optional Git preview is a thoughtful bridge for students who want to get ahead without making it a requirement.
- Consistent use of the component system in Lecture 1 (with one exception) and in the Activity.

**Negatives**
- **Lecture 2 has 5 raw JSX code blocks** that should use `<CodeBlock language="bash">`. This is the most significant component compliance issue in Week 1.
- The permissions diagram is duplicated verbatim between Lecture 1 and Lecture 2 in raw JSX — this should be extracted into a shared component or at minimum use consistent styling.
- `echo` and redirection (`>`, `>>`) are assumed in the Activity but never formally taught in either lecture. This is a sequencing gap that will trip up true beginners.
- The week-2 reference inconsistency (Git vs DSA) creates confusion about what comes next.

**Gaps**
- **Pipes and redirection**: The most important gap. Pipes (`|`) and redirection (`>`, `>>`, `2>&1`) are used repeatedly but never given their own section. These are fundamental concepts that deserve explicit coverage.
- **`echo`**: Used everywhere but never introduced.
- **`else`/`elif`, `while` loops, script arguments, functions**: All absent from the scripting lecture. Students leaving Week 1 can write only very simple linear scripts.

---

### Transition: Week 1 → Week 2

- The Activity's footer nav says "next: Version Control with Git" linking to `week-2/lecture-1`, but the index defines Week 2 as "Data Structures & Algorithms" (BST, stacks, queues). **This is a major routing/content mismatch that must be resolved.** Either the index is wrong or the file-level navigation is wrong.
- If Week 2 is truly DSA (as the index suggests), then there is a cold transition from Linux/bash to binary trees with no bridge. The Activity's Git preview would be the only connection to anything in the next several weeks, and it's marked optional.
- If Week 2 is actually Git (matching the Activity's navigation), then the index needs updating.
- Regardless of resolution, the linux/shell skills from Week 1 are not explicitly referenced again in any upcoming week's description, which may make students feel these skills are disconnected from the rest of the course.

---

## Week 2 — Data Structures & Algorithms

### Lecture 1

**Positives**
- All 8 code blocks use `<CodeBlock language="cpp">` correctly — excellent component compliance.
- Strong technical depth: call stack → DFS/BFS → graphs → connected components → cycle detection → topological sort → monotonic stack. Each section builds on the previous.
- Good explanatory prose before each code block — algorithms are motivated with real-world applications (dependency resolution, shortest path, interview patterns).
- BFS vs DFS comparison diagram (BfsDfsDiagram component) provides a clear side-by-side with data structure, use case, and traversal order.
- `LectureCallout` tips reference specific LeetCode problems (Course Schedule II, Daily Temperatures, Trapping Rain Water) — practical for interview prep.
- `LectureFooterNav` present with correct prev (Week 1 Activity) and next (Lecture 2) links.

**Negatives**
- **CRITICAL — Title/content mismatch**: The title is "Trees, Stacks & Queues" and the index description promises "Binary trees, BSTs, in-order traversal, stacks, and queues." The actual content is advanced graph algorithms: adjacency list representation, graph BFS/DFS, connected components, cycle detection with 3-state coloring, Kahn's topological sort, and monotonic stacks. This is a 300-level algorithms lecture, not an intro to data structures.
- **All code is in C++ but C++ is not taught until Week 3.** Students encounter `TreeNode*`, `std::stack<TreeNode*>`, `unordered_map`, `unordered_set`, structured bindings (`auto [node, dist]`), and template syntax without any prior C++ instruction. This is a severe prerequisite issue.
- **No introduction to basic data structures**: Trees (what is a node, parent/child, leaf), stacks (push/pop/peek, LIFO), and queues (enqueue/dequeue, FIFO) are never defined from first principles. The lecture assumes the student already knows what these are and jumps to using them in algorithm implementations.
- No BST insertion, search, or deletion is shown — despite BST being the first thing the Activity asks students to implement.
- The BfsDfsDiagram (lines 15–66) is a raw JSX component with hardcoded color classes (`text-blue-600`, `text-orange-600`, `border-blue-200`, etc.) outside the design system. This is a diagram rather than code, so it's borderline, but notable.

**Gaps**
- **BST fundamentals**: No coverage of BST insertion, search, or deletion — the Activity requires BST implementation but the lecture only shows traversal.
- **Stack and queue as abstract data types**: Neither data structure is formally introduced. The stack is only mentioned in passing as "the call stack" and "monotonic stack" — both advanced uses.
- **Basic tree terminology**: Nodes, edges, root, leaf, depth, height, parent/child — none formally defined.
- **In-order, pre-order, post-order traversal explanation**: Pre-order appears in code comments but the three traversal types are never compared or explained.
- **Hash maps**: Not covered at all in Lecture 1, despite being in the Week 2 index description. (Lecture 2 should cover them per the index, but doesn't — see below.)
- **Big-O analysis**: No formal coverage of time/space complexity despite the index mentioning it.

**Component Compliance**
1. Lines 15–66: BfsDfsDiagram — raw JSX custom component with hardcoded color classes (`text-blue-600 dark:text-blue-400`, `text-orange-600 dark:text-orange-400`, `border-blue-200 dark:border-blue-800`, `bg-blue-50 dark:bg-blue-950/30`, `bg-orange-50 dark:bg-orange-950/30`). This is a comparison diagram, not a code block. FLAG as borderline.
2. Lines 91–117: `<CodeBlock language="cpp">` (recursive/iterative DFS) — COMPLIANT
3. Lines 132–154: `<CodeBlock language="cpp">` (BFS level-order) — COMPLIANT
4. Lines 167–196: `<CodeBlock language="cpp">` (graph BFS shortest path) — COMPLIANT
5. Lines 198–218: `<CodeBlock language="cpp">` (graph DFS path existence) — COMPLIANT
6. Lines 227–244: `<CodeBlock language="cpp">` (connected components) — COMPLIANT
7. Lines 253–277: `<CodeBlock language="cpp">` (cycle detection) — COMPLIANT
8. Lines 289–317: `<CodeBlock language="cpp">` (topological sort) — COMPLIANT
9. Lines 330–353: `<CodeBlock language="cpp">` (monotonic stack) — COMPLIANT

All 8 code blocks are compliant. No violations.

---

### Lecture 2

**Positives**
- All 5 code blocks use `<CodeBlock language="cpp">` correctly — no violations in actual code rendering.
- SOLID principles section (02) is exceptionally well-designed: each principle gets a violation/compliant comparison card with concrete examples tied to a consistent Library Management System theme. Students see the principle, the wrong way, and the right way.
- Design patterns section (03) covers Singleton, Observer, and Factory — the three most common patterns — with real C++ implementations and clear problem/signal framing.
- The interface section (04) with `IStorage` / `FileStorage` / `InMemoryStorage` is a strong practical example of dependency inversion and testability.
- Smart pointers section (05) is a valuable modern C++ addition — `unique_ptr` and `shared_ptr` with clear guidance on when to use each.
- Architecture diagram in section 06 ties all concepts into a coherent system design.
- `LectureFooterNav` present with correct prev (Lecture 1) and next (Activity) links.

**Negatives**
- **CRITICAL — Title/content mismatch**: The title is "Hash Maps, Complexity & Interview Patterns" and the index description promises "Hash maps, Big-O analysis, two-pointer and sliding window patterns." The actual content is: OOP design principles, SOLID, design patterns (Singleton/Observer/Factory), pure abstract classes, and smart pointers. **None of the advertised topics are covered.** Hash maps are never discussed. Big-O analysis is absent. Two-pointer and sliding window patterns are not mentioned.
- **This lecture's actual content belongs in Week 3** (C++ & Object-Oriented Programming). SOLID, design patterns, abstract classes, and smart pointers are OOP topics — exactly what Week 3's title promises. The content appears to have been placed in the wrong week.
- **C++ code without C++ prerequisites**: Same issue as Lecture 1. Students haven't learned C++ classes, constructors, virtual functions, or templates yet. This lecture teaches advanced OOP in C++ before the basics are covered in Week 3.
- PatternCards component (lines 16–62) uses raw JSX with hardcoded colors (`text-blue-600`, `text-emerald-600`, `text-orange-600`, `bg-blue-50`, etc.). Diagram/cards, not code — borderline.
- SOLID principles cards (lines 109–167) use raw JSX with hardcoded colors (`text-rose-600`, `text-emerald-600`). Same borderline issue.
- Architecture diagram (lines 352–368) uses raw JSX with hardcoded colors (`text-purple-600`, `text-blue-600`, `text-orange-600`, `text-emerald-600`, `text-rose-600`). Borderline.
- The design exercise (lines 87–100) uses hardcoded `text-orange-600 dark:text-orange-400`.

**Gaps**
- **Hash maps**: Completely absent despite being the first word in the lecture title. No coverage of hash functions, collision resolution, O(1) average-case lookup, or any hash map usage.
- **Big-O analysis**: Not covered. No formal introduction to time complexity, space complexity, or complexity classes.
- **Two-pointer pattern**: Not covered. This is explicitly listed in the index description.
- **Sliding window pattern**: Not covered. Also explicitly listed in the index description.
- **Basic C++ syntax**: The lecture uses advanced C++ (templates, virtual functions, smart pointers, structured bindings) without any prior instruction. Class definitions, `#include`, `cout`, constructors, access modifiers — none are introduced.

**Component Compliance**
1. Lines 16–62: PatternCards — raw JSX with hardcoded color classes. Diagram cards, not code. FLAG as borderline.
2. Lines 87–100: Raw JSX div — design exercise cards with `text-orange-600`. Not code. FLAG as borderline.
3. Lines 109–167: Raw JSX div — SOLID principles cards with `text-rose-600`, `text-emerald-600`. Not code. FLAG as borderline.
4. Lines 180–205: `<CodeBlock language="cpp">` (Singleton) — COMPLIANT
5. Lines 209–239: `<CodeBlock language="cpp">` (Observer) — COMPLIANT
6. Lines 243–265: `<CodeBlock language="cpp">` (Factory) — COMPLIANT
7. Lines 274–308: `<CodeBlock language="cpp">` (Interface pattern) — COMPLIANT
8. Lines 321–343: `<CodeBlock language="cpp">` (Smart pointers) — COMPLIANT
9. Lines 352–368: Raw JSX div — architecture diagram with hardcoded colors (`text-purple-600`, `text-blue-600`, `text-orange-600`, `text-emerald-600`, `text-rose-600`, `text-zinc-500`). Not code. FLAG as borderline.

All 5 code blocks are compliant. No code rendering violations. Multiple borderline diagram/card components with hardcoded colors.

---

### Activity

**Detailing**
- Challenge 1.1 (Node and Tree): Clear — two specific tasks, unambiguous deliverable (two Python classes).
- Challenge 1.2 (Insert): Step-by-step recursive insert with specific test case (insert 5, 2, 8, 1, 3). Hint provided. Good.
- Challenge 1.3 (In-Order Traversal): Clear expected output (`[1, 2, 3, 5, 8]`). Good success condition.
- Challenge 2.1 (MinStack): Detailed implementation steps with specific test case (push 3,1,2; get_min at each stage). Good.
- Challenge 3.1 (Two Sum): Standard problem statement with clear function signature and approach guidance.
- Challenge 3.2 (First Repeating Character): Clear function signature, two approach suggestions.
- All challenges have explicit success conditions (expected output or behavior).

**Project Connection**
- No project connection — standalone DSA practice. The project doesn't begin until Week 4, so this is appropriate.
- The callout tip at the end (lines 139–141) provides a forward reference to Week 3's C++ Phonebook, connecting these concepts to future work. Good bridge.

**Feasibility**
- 6 challenges (3 BST, 1 MinStack, 2 hash map) in Python — reasonable for 90 minutes for beginners who've seen the concepts in lecture.
- However: the lectures don't actually teach BST insertion, MinStack, Two Sum, or hash map patterns. The Activity assumes knowledge from lectures that don't exist in their current form. Students would need to self-teach or rely entirely on the Activity's scaffolding.

**Positives**
- Python-first approach is smart — students focus on logic without fighting C++ syntax.
- Scaffolding within each challenge is excellent: class name, method signatures, expected behavior, and hints.
- The progression (tree → stack → hash map) covers three fundamental data structure families.
- The closing callout tip connecting to Week 3's C++ Phonebook is a good motivational bridge.
- `LectureFooterNav` has correct prev (Lecture 2) and next (Week 3 Lecture 1) links.

**Negatives**
- **Lecture-Activity misalignment**: The Activity covers BST, MinStack, and hash map patterns (Two Sum, First Repeat). Lecture 1 covers graph algorithms (DFS, BFS, topo sort, cycle detection). Lecture 2 covers SOLID and design patterns. The overlap is minimal — BST traversal appears in Lecture 1 but BST insertion (the core Activity task) does not. Hash maps and MinStack are not covered in either lecture.
- No code examples are shown in the Activity — all challenges are described in prose with inline `<code>` snippets. This is appropriate for an Activity (students should write the code), but combined with the lecture misalignment, students have very little to work from.
- The Activity description says "just the concepts from this week's lectures" — but the concepts in the Activity are NOT from this week's lectures as they currently exist.

**Gaps**
- No BFS/DFS exercise — the most heavily covered topic in Lecture 1 has no Activity practice.
- No graph problems — Lecture 1 spends 4 sections on graphs but the Activity doesn't include any.
- No SOLID or design pattern exercise — Lecture 2's entire content is unrepresented in the Activity.
- No Big-O analysis practice — despite being in the week's description.

**Component Compliance**
- No code blocks rendered in the Activity — all code references are inline `<code>` within `<ActivityTask>` and `<ActivityHint>` components. COMPLIANT throughout.

---

### Week 2 Overall

**Positives**
- The Activity is well-designed in isolation — BST, MinStack, and hash map practice in Python is exactly the right material for a DSA week in a fundamentals course.
- All actual code blocks across both lectures use `<CodeBlock>` correctly — strong component compliance for code rendering.
- The lectures, while misaligned with the title, contain genuinely high-quality technical content (SOLID explanations, design pattern implementations, graph algorithms).

**Negatives**
- **The most critical issue in the entire course so far**: Lecture titles, index descriptions, and actual content are severely misaligned. Lecture 1's title says "Trees, Stacks & Queues" but teaches graph algorithms and monotonic stacks. Lecture 2's title says "Hash Maps, Complexity & Interview Patterns" but teaches SOLID, design patterns, and smart pointers. The Activity covers BST, MinStack, and hash maps — topics that neither lecture actually teaches.
- **C++ code throughout both lectures but C++ isn't taught until Week 3.** Students have zero C++ exposure before this week. Every code example requires C++ knowledge (pointers, templates, STL containers, classes, virtual functions).
- The actual content of Lecture 2 (SOLID, design patterns, interfaces, smart pointers) is OOP material that belongs in Week 3 ("C++ & Object-Oriented Programming"). It appears the lecture content was swapped or misassigned.
- Students leaving Week 2 would have been exposed to advanced algorithms (topo sort, cycle detection) and advanced OOP (SOLID, design patterns, smart pointers) without foundational knowledge of either C++ syntax or basic data structures.

**Gaps**
- **Hash maps**: Promised in the title, absent from lectures.
- **Big-O analysis**: Promised in the title and critical for DSA, completely absent.
- **Two-pointer and sliding window**: Promised in the index, absent from lectures.
- **Basic data structure introductions**: Trees, stacks, and queues are never introduced from first principles.
- **Python examples**: The Activity uses Python but neither lecture includes Python code. Students must translate C++ concepts to Python on their own.

---

### Transition: Week 2 → Week 3

- Week 3 is titled "C++ & Object-Oriented Programming" with Lecture 1 on "Classes, Encapsulation & Inheritance" and Lecture 2 on "Polymorphism, STL & System Design." However, much of this content has already been covered in Week 2 Lecture 2 (SOLID, design patterns, interfaces, smart pointers in C++). There is likely significant redundancy between Week 2 Lecture 2 and Week 3.
- The Activity's closing callout says "these patterns show up in Week 3 when you build the C++ Phonebook" — a good forward reference. But the Activity teaches BST, MinStack, and hash maps in Python, while the Phonebook will require these in C++. The bridge is conceptual, not syntactic.
- Students still have not been taught C++ basics (variable types, `cout`, `#include`, compilation). If Week 3 Lecture 1 starts with OOP concepts (as its title suggests), there's a gap: who teaches `int main()`, `#include <iostream>`, and how to compile a C++ program?
- The most effective fix would be to reorder or rewrite the Week 2 lectures to actually cover what their titles promise (basic data structures, hash maps, Big-O), leaving OOP/design patterns for Week 3.

---

## Week 3 — C++ & Object-Oriented Programming

### Lecture 1

**Positives**
- Good motivation in section 01 — explains why C++ is the reference OOP model and how concepts transfer to Python, TypeScript, Java.
- Compilation instruction provided early: `g++ -std=c++17 -Wall file.cpp -o file`.
- Clear explanation of all three access modifiers (public, private, protected) with a well-formatted table and practical guidance ("prefer private").
- Strong code examples: Book class with encapsulation (private state, public interface, const getters) and LibraryItem/Book inheritance with virtual methods.
- Initializer list order, const correctness, slicing, and virtual destructor all explained clearly — these are subtle C++ topics that trip up even experienced developers.
- Composition vs inheritance section (05) provides clear is-a vs has-a guidance and the "favor composition" principle.
- Rule of Three section (06) is appropriately simplified — tells students to prefer STL types over raw resource management.
- BankAccount invariant example (section 07) is a strong second example reinforcing encapsulation.
- All 3 code blocks use `<CodeBlock language="cpp">` correctly.
- `LectureFooterNav` present with correct prev (Week 2 Activity) and next (Lecture 2) links.

**Negatives**
- **No basic C++ primer**: The lecture jumps directly into classes and access modifiers without ever introducing C++ fundamentals: variable types (`int`, `string`, `double`, `bool`), `#include`, `int main()`, `cout`/`cin`, compilation process, or basic syntax differences from Python. Students encounter `string`, `bool`, `const`, reference parameters, and template types (`vector<Contact>`) without prior instruction. The Week 2 lectures used C++ code, so students technically *saw* C++ before, but it was never formally introduced.
- Section 02 (Four OOP Principles) renders as raw JSX cards with hardcoded color classes (`text-blue-600`, `text-emerald-600`, `text-orange-600`, `text-purple-600`, `bg-blue-50`, `bg-emerald-50`, `bg-orange-100`, `bg-purple-50`). While these are educational diagrams rather than code, they use hardcoded styling.
- Code examples omit `#include` directives and `int main()` — students don't see a complete compilable program until the Activity asks them to create one.
- No mention of `using namespace std;` despite all examples using `string`, `cout`, `vector` without `std::` prefix.

**Gaps**
- **C++ basics**: No introduction to types, variables, includes, cout/cin, main function, or compilation. This should be the first lecture's first section, given that C++ is new to students.
- **Header files**: `.h` vs `.cpp` file organization never discussed.
- **Namespaces**: `using namespace std;` assumed but not explained.
- **Operator overloading**: Not covered. Relevant for printing objects (e.g. `operator<<` for `Contact`).
- **Strings in C++**: `string` vs C-strings, string methods — not covered.

**Component Compliance**
1. Lines 49–66: **RAW JSX** — Four OOP principles cards with hardcoded color classes (`text-blue-600 dark:text-blue-400`, `text-emerald-600 dark:text-emerald-400`, `text-orange-600 dark:text-orange-400`, `text-purple-600 dark:text-purple-400`, plus corresponding `bg-*` and `border-*`). Educational diagram, not code. FLAG as borderline.
2. Lines 75–93: Raw JSX — Access modifiers table. Uses only design system tokens (`text-foreground`, `text-muted-foreground`, `bg-muted/30`, `border-border`). ACCEPTABLE.
3. Lines 106–131: `<CodeBlock language="cpp">` (Book class) — COMPLIANT
4. Lines 151–175: `<CodeBlock language="cpp">` (LibraryItem/Book inheritance) — COMPLIANT
5. Lines 219–245: `<CodeBlock language="cpp">` (BankAccount) — COMPLIANT

All 3 code blocks compliant. 1 borderline diagram.

---

### Lecture 2

**Positives**
- The STL containers table (section 03) is comprehensive — covers vector, unordered_map, unordered_set, map, stack, queue, priority_queue with "reach for it when" guidance. Excellent reference material.
- BST diagram clearly illustrates the search and in-order traversal properties.
- The `vector`/`sort`/`map` CodeBlock example shows a complete, compilable program with includes and `int main()` — the first complete program in the entire course.
- Big-O cheat sheet (section 04) is practical: O(1) through O(n!) with concrete examples, plus the "n = 10⁵" rule of thumb.
- The 6-step problem-solving framework (section 05) is excellent pedagogical content — understand, trace, brute force, optimize, code, test. Well-structured as numbered steps.
- Two worked examples (Two Sum clarification, Valid Parentheses walkthrough) demonstrate the framework end-to-end.
- NeetCode 150 reference with category breakdown is a valuable external resource pointer.
- `LectureFooterNav` correct prev (Lecture 1) and next (Activity).

**Negatives**
- **Massive scope problem**: This lecture tries to cover polymorphism, abstract base classes, STL containers, iterators, `<algorithm>`, Big-O, recursion, trees/graphs overview, 7 DSA patterns, a problem-solving framework, worked examples, and interview mindset. This is 3–4 lectures of material in one. Students are unlikely to absorb more than a fraction.
- **Code duplication**: Section 02 repeats the Book class (lines 71–98) and LibraryItem/Book/DVD hierarchy (lines 100–143) almost verbatim from Lecture 1 (lines 106–131 and 151–175). This is copy-paste rather than building on what was established.
- **Incorrect forward references**: Section 04 says "we'll implement one in the Week 8 activity (phonebook BST)" and "You'll practice these in the Week 8 activity and in Week 7 (DSA)." The course index shows Week 7 = Backend Development and Week 8 = Testing & CI/CD. The phonebook BST is the Week 3 Activity (this same week). These references are wrong.
- BST diagram (lines 16–46) is raw JSX with hardcoded color classes (`border-blue-300`, `bg-blue-50`, `text-blue-700`, `text-emerald-500`).
- STL containers table (lines 161–179) renders container names with hardcoded `text-orange-600 dark:text-orange-400`.
- The DSA patterns section (two-pointer, sliding window, hash map, stack, queue, binary search, DP) covers 7 patterns in a single paragraph with no code examples. Students can't learn these patterns from prose alone.

**Gaps**
- **No code examples for DSA patterns**: Two-pointer, sliding window, binary search, and DP are described in prose but never demonstrated in code. These patterns were supposed to be covered in Week 2 Lecture 2 (per the index) but weren't.
- **STL code examples**: Only `vector`, `sort`, and `map` get a code example. Stack, queue, priority_queue, unordered_map, and unordered_set have no code demonstrations despite being listed in the table.
- **Abstract base classes**: Mentioned in the intro (section 01) as a focus of this lecture, but the only example is the LibraryItem class repeated from Lecture 1. No new abstract class example is introduced.
- **Move semantics**: Not covered despite being a natural follow-up to the Rule of Three in Lecture 1.

**Component Compliance**
1. Lines 16–46: BstDiagram — **RAW JSX** with hardcoded color classes (`border-blue-300 dark:border-blue-700`, `bg-blue-50 dark:bg-blue-950/40`, `text-blue-700 dark:text-blue-300`, `text-emerald-500`). Diagram, not code. FLAG as borderline.
2. Lines 71–98: `<CodeBlock language="cpp">` (Book class — duplicate from L1) — COMPLIANT
3. Lines 100–143: `<CodeBlock language="cpp">` (LibraryItem/Book/DVD — duplicate from L1) — COMPLIANT
4. Lines 161–179: **RAW JSX** — STL containers table with `text-orange-600 dark:text-orange-400` for container names. Technical reference content with hardcoded colors. FLAG as borderline.
5. Lines 190–215: `<CodeBlock language="cpp">` (vector/sort/map example) — COMPLIANT
6. Lines 269–286: Raw JSX — problem-solving framework steps with `text-primary/70`. Uses design tokens, no hardcoded color classes. ACCEPTABLE.

All 3 code blocks compliant. 2 borderline diagrams/tables with hardcoded colors.

---

### Activity

**Detailing**
- Challenge 1.1 (Contact Class): Clear — struct with 3 fields, constructor, print method. 3 specific tasks.
- Challenge 1.2 (PhoneBook with vector): Clear — 3 methods (add, list, delete) with specific signatures.
- Challenge 1.3 (Interactive Menu): Well-detailed with exact menu options (1-Add, 2-Delete, 3-List, 0-Quit). The `cin.ignore()` hint is practical and prevents a very common beginner pitfall.
- Challenge 2.1 (BST Node): Clear — specific struct fields and replacement of vector with tree root.
- Challenge 2.2 (BST Insert and In-Order): Good scaffolding — recursive insert described in prose, hint provides pseudocode. Verification step: "verify contacts print alphabetically."
- Challenge 3.1 (Action Stack): Detailed — Action struct, push on add/delete, undo logic with type checking.
- Challenge 4.1 (Phone Index): Clear — unordered_map with specific operations, findByPhone return type.
- Challenge 4.2 (Final Menu): Clear — complete menu with all 6 options listed.

**Project Connection**
- No project connection — standalone capstone for the DSA/C++ weeks. The fundamentals project begins in Week 4. Appropriate for Week 3.

**Feasibility**
- The full phonebook (7 challenges across 4 sections) is a substantial C++ project. Part 1 (3 challenges: Contact, PhoneBook, Menu) is feasible in ~45 minutes for a student who can write basic C++.
- Part 2 adds BST (recursive insert + in-order), stack-based undo, and hash map index. This requires understanding pointers, memory management, and 3 different data structures. For a student who just learned C++ this week, completing all 7 challenges in 90 minutes is aggressive.
- **BST deletion is required by Challenge 1.2 (deleteContact) and the BST replacement in 2.2, but BST deletion is never taught in any lecture.** The activity description says "BST for sorted order" but doesn't explain how to remove from a BST (predecessor replacement, etc.). Students must figure this out on their own.
- The `cin.ignore()` hint is the only hint in the entire activity. More hints would be appropriate for a first C++ project.

**Positives**
- Excellent capstone design: starts simple (class + vector + menu), then progressively replaces with more sophisticated data structures (BST, stack, hash map).
- Each section builds on the previous — code is additive, not throwaway.
- The Activity directly applies concepts from both lectures: encapsulation, access modifiers, classes, STL containers, inheritance concepts.
- Compilation instruction provided in the callout.
- `LectureFooterNav` links correct: prev → Lecture 2, next → Week 4 Lecture 1 ("Version Control with Git").

**Negatives**
- Only 1 hint across 7 challenges. Challenges 2.2 (BST insert) and 3.1 (undo with type checking) would benefit from additional hints.
- BST deletion is required but never taught — significant gap between lecture content and activity expectations.
- No expected output shown for any challenge — students can't verify their implementation against a reference.
- No guidance on memory management: students create `Contact*` pointers (Challenge 2.1) but are never told about `delete` or memory leaks. The Lecture 1 Rule of Three section mentions smart pointers but the Activity uses raw pointers.

**Gaps**
- **BST deletion**: Required but not taught. This is a non-trivial algorithm (find node, handle 3 cases: leaf, one child, two children).
- **Expected output/test cases**: No sample runs shown. Students don't know what a correct phonebook interaction should look like.
- **Memory management**: Raw pointers used without discussion of ownership or cleanup.
- **Error handling**: No guidance on handling invalid input (non-integer menu choice, empty phone number, duplicate phones).

**Component Compliance**
- No code blocks rendered. All content uses `<ActivityChallenge>`, `<ActivityTask>`, `<ActivityHint>`, inline `<code>`. COMPLIANT throughout.

---

### Week 3 Overall

**Positives**
- The three files form a coherent unit: Lecture 1 teaches classes, encapsulation, and inheritance; Lecture 2 extends to polymorphism, STL, and complexity; the Activity applies everything in a substantial C++ project.
- The CLI Phonebook activity is an excellent capstone — it integrates OOP, BST, stack, and hash map into a single application with progressive complexity.
- All 6 code blocks across both lectures use `<CodeBlock language="cpp">` correctly — strong component compliance for actual code rendering.
- The compilation instruction (`g++ -std=c++17 -Wall`) appears in both the lectures and the activity.

**Negatives**
- **No C++ basics anywhere in the course**: Students arrive at Week 3 having never been formally taught variable types, includes, main function, cout/cin, or compilation in C++. Week 2 used C++ code but never introduced the language. Week 3 jumps to OOP without a basics primer.
- **Lecture 2 is overloaded**: Polymorphism + STL + Big-O + DSA patterns + interview framework + worked examples. This needs to be split or heavily trimmed.
- **Incorrect forward references** in Lecture 2: "Week 7 (DSA)" and "Week 8 activity (phonebook BST)" don't match the actual course schedule.
- **Code duplication** between Lecture 1 and Lecture 2: Book class and LibraryItem hierarchy are repeated nearly verbatim.
- Multiple borderline raw JSX diagrams (OOP principles cards, BST diagram, STL table) use hardcoded color classes.

**Gaps**
- **C++ primer**: The most impactful gap. A "C++ in 20 minutes" section at the start of Lecture 1 (types, includes, main, cout, compilation, basic syntax) would dramatically improve accessibility.
- **BST deletion**: Required by the Activity but not taught in any lecture.
- **DSA pattern code examples**: Two-pointer, sliding window, binary search, and DP mentioned in prose but never demonstrated.
- **Complete compilable programs**: Only one complete program (Lecture 2 vector/sort/map example) appears across both lectures. Students need to see complete programs they can compile and run.

---

### Transition: Week 3 → Week 4

- Week 4 is "Git & Agile Engineering" — a complete topic shift from C++/OOP/DSA to version control and project management. This is a cold start; the Activity's footer nav correctly links to "Version Control with Git."
- The Week 1 Activity already included optional Git challenges (init, branch, merge, conflict resolution, revert, clone, PR). Students who completed those have a head start; those who skipped them will encounter Git for the first time in Week 4.
- The transition from code-heavy C++ to workflow/tooling is pedagogically reasonable — students get a break from algorithm implementation and learn collaborative development skills.
- Week 4 is where the fundamentals project kicks off (per the index: "Project Kickoff"). Students should understand that the C++ skills from Weeks 2–3 may not be directly used in the project (which appears to be Python/JS-based given Weeks 7–9 cover FastAPI and React). The course should clarify this to set expectations.

---

## Week 4 — Git & Agile Engineering

### Lecture 1

**Positives**
- Excellent Git introduction — 11 sections covering the full Git workflow from motivation to rebase. The best-structured lecture in the course so far.
- Section 01 (The Problem Git Solves) is a strong motivational opener with relatable scenarios (broken code, naming chaos, team conflicts).
- Section 02 (Three Areas) provides a critical mental model: working directory → staging → repository. The ThreeAreasDiagram visualizes the flow clearly.
- Every command introduced with `LectureCmd` tooltip providing detailed explanation of what the command does and why.
- `TerminalBlock` used correctly for all 15 shell command blocks — excellent component compliance for interactive commands.
- Merge conflict section (07) is thorough: shows the markers, explains both sides, demonstrates resolution, and references VS Code's built-in resolver.
- Remote workflow section (08) includes the daily workflow pattern — pull, branch, code, commit, push, PR — the exact loop students will use.
- Section 09 covers recovery tools (restore, revert, reflog, rebase) at an appropriate depth.
- The .gitignore section includes an important security warning about accidentally committed secrets.
- Quick Reference table (section 11) provides a one-page cheat sheet organized by category.
- `LectureFooterNav` with correct prev (Week 3 Activity) and next (Lecture 2).

**Negatives**
- **VIOLATION — ConflictMarkersBlock** (lines 60–73): Merge conflict content (HTML code with `<<<<<<< HEAD` markers) rendered as raw JSX with hardcoded color classes (`text-zinc-500`, `text-blue-300`, `text-emerald-300`). This is file content showing code in a conflict — should use `<CodeBlock>`.
- **VIOLATION — .gitignore content** (lines 462–480): The contents of a `.gitignore` file rendered as raw JSX with hardcoded colors (`text-zinc-500`, `text-emerald-400`). This is file content — should use `<CodeBlock language="bash" title=".gitignore">`.
- ThreeAreasDiagram (lines 18–57) uses hardcoded colors (`text-orange-600`, `text-blue-600`, `text-emerald-600` with corresponding `bg-*`). Diagram, not code — borderline.
- QuickReference (lines 76–139) renders Git commands as `<code>` with `select-none` styling outside the component system. While this is a reference table (not executable commands), the git commands could benefit from being rendered in a more consistent way.

**Gaps**
- **`git stash`**: Not covered at all. This is one of the most commonly needed Git tools in daily development (switch branches while you have uncommitted work).
- **`git switch`**: The modern replacement for `git checkout` for branch switching (introduced Git 2.23) is not mentioned. Not critical since `checkout` still works, but worth noting for a 2026 course.
- **`git diff`**: Never shown — students can't see what they changed before staging or committing.
- **Interactive rebase**: `git rebase -i HEAD~3` is mentioned but not demonstrated (what the interactive editor looks like, what `squash` and `pick` mean).

**Component Compliance**
1. Lines 18–57: ThreeAreasDiagram — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
2. Lines 60–73: ConflictMarkersBlock — **VIOLATION**. File content (HTML merge conflict markers) with hardcoded colors (`text-zinc-500`, `text-blue-300`, `text-emerald-300`, `bg-zinc-950`). Should use `<CodeBlock>`.
3. Lines 76–139: QuickReference — raw JSX rendering git commands with `select-none`. Reference table. FLAG as borderline.
4. Lines 200–206: `<TerminalBlock>` (git config) — COMPLIANT
5. Lines 217–223: `<TerminalBlock>` (git init) — COMPLIANT
6. Lines 232–238: `<TerminalBlock>` (git status) — COMPLIANT
7. Lines 244–251: `<TerminalBlock>` (git add, commit) — COMPLIANT
8. Lines 265–271: `<TerminalBlock>` (git log) — COMPLIANT
9. Lines 288–295: `<TerminalBlock>` (branching) — COMPLIANT
10. Lines 307–315: `<TerminalBlock>` (branch changes) — COMPLIANT
11. Lines 326–333: `<TerminalBlock>` (merging) — COMPLIANT
12. Lines 351–356: `<TerminalBlock>` (conflict resolution) — COMPLIANT
13. Lines 370–376: `<TerminalBlock>` (remote, push) — COMPLIANT
14. Lines 389–398: `<TerminalBlock>` (daily workflow) — COMPLIANT
15. Lines 411–416: `<TerminalBlock>` (restore) — COMPLIANT
16. Lines 422–428: `<TerminalBlock>` (revert, reflog) — COMPLIANT
17. Lines 437–442: `<TerminalBlock>` (rebase) — COMPLIANT
18. Line 456: `<TerminalBlock>` (touch .gitignore) — COMPLIANT
19. Lines 462–480: **VIOLATION** — .gitignore file content rendered as raw JSX with hardcoded colors. Should use `<CodeBlock>`.

15 TerminalBlocks — all COMPLIANT. 2 raw JSX violations (ConflictMarkers, .gitignore content). 2 borderline diagrams.

---

### Lecture 2

**Positives**
- Clear explanation of the pull request workflow: branch → code → push → PR → review → merge.
- PRWorkflow diagram provides a visual pipeline that makes the workflow tangible.
- Good PR description guidance: summary, what problem it solves, how to test, "Closes #N" syntax.
- Issues section (03) explains the backlog model clearly — issues as units of work, linked to PRs.
- Agile section (04) is well-condensed: Scrum vs Kanban in one page, with KanbanBoard visualization.
- GitHub Projects setup (section 05) gives concrete steps to create and populate a project board.
- Callouts are practical: "don't merge your own PR," "Closes #N auto-closes," issue templates.
- `LectureFooterNav` correct prev (Lecture 1) and next (Activity).

**Negatives**
- **Wrong week reference** in section 06 (line 185): Says "The Week 2 activity is Project Kickoff" — should say "The Week 4 activity." This is a copy-paste error.
- **Incorrect week references** in Challenge 3.2 description (line 135): Says "track your Weeks 3–5 work" but the issues described (containerize, backend, frontend) correspond to Weeks 6–9, not Weeks 3–5.
- PRWorkflow diagram (lines 15–38) uses raw JSX with hardcoded colors (`text-blue-600`, `text-orange-600`, `text-emerald-600`, `text-purple-600`, `text-rose-600`). Diagram — borderline.
- KanbanBoard diagram (lines 41–64) uses raw JSX with hardcoded colors (`text-blue-600`, `text-orange-600`, `text-emerald-600`). Diagram — borderline.
- No code blocks or terminal blocks at all — this is entirely conceptual. While appropriate for the topic, students don't practice any commands during this lecture.
- No screenshots of GitHub UI — students must navigate the GitHub interface from prose descriptions alone.

**Gaps**
- **Code review best practices**: How to write a good review comment, when to approve vs request changes, how to use GitHub's "Suggest changes" feature — not covered.
- **Branch protection rules**: Not mentioned. In industry, `main` is protected so PRs can't be merged without review. Students should know this exists.
- **GitHub Actions in the PR workflow**: CI/CD checks mentioned briefly ("required checks pass") but not explained. Students won't learn this until Week 8.
- **Markdown formatting**: PR descriptions and issue bodies use Markdown, but no guidance on Markdown syntax is provided.

**Component Compliance**
1. Lines 15–38: PRWorkflow — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
2. Lines 41–64: KanbanBoard — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
3. Lines 160–175: Steps cards — raw JSX with `text-primary/70`. Uses design tokens. ACCEPTABLE.
4. No code blocks or terminal blocks in this lecture. No violations.

---

### Activity

**Detailing**
- Section 01 (Choose Your Domain): 10 well-chosen project ideas with brief descriptions. Clear instruction to commit to one.
- Challenge 2.1 (Create the Repo): 4 clear tasks — create, clone, README, push.
- Challenge 2.2 (Folder Structure): Excellent — specific folder names, placeholder file contents, exact commit message, and a TerminalBlock showing the commands.
- Challenge 3.1 (Create the Board): Step-by-step GitHub UI navigation with specific column names.
- Challenge 3.2 (Write Your Issues): Provides exact issue titles and body text for 3 issues. Very concrete.
- Challenge 4.1 (Branch, Push, PR): Step-by-step with specific branch name, commit message, and PR description content.
- Challenge 4.2 (Verify Your Setup): 4 explicit success conditions.

**Project Connection**
- This IS the project kickoff — the most critical activity for the project through-line.
- Establishes: domain selection, repository, folder structure (/backend, /frontend), GitHub Project board with 3 issues, first PR.
- Forward reference to Week 5 (Sprint Planning) for detailed issue creation.
- The project constraints are partially communicated: "By the end you will have a live full-stack web app" and the /backend + /frontend structure suggests Python + React. But the exact technology stack constraints (must use FastAPI? must use React? must containerize?) are only implicit through the issue descriptions.

**Feasibility**
- 6 challenges involving GitHub UI, terminal, and Git — feasible in 90 minutes for students who attended both lectures.
- Creating a GitHub repo, Project board, and PR are mostly UI interactions — time depends on GitHub familiarity.

**Positives**
- The 10 domain examples are well-chosen — diverse, achievable in the remaining weeks, and personally motivating ("pick something you would actually want to use" is a strong callout).
- Challenge 2.2's TerminalBlock provides exact commands — students can follow along precisely.
- The structure mirrors real industry project setup: repo → scaffold → board → issues → first PR.
- `LectureFooterNav` links present with correct prev (Lecture 2).

**Negatives**
- **Critical process error in Challenge 4.1**: The PR description tells students to write "Closes #1, Closes #2, Closes #3." If this PR is merged, **all three issues will be closed immediately**, removing them from the board before any actual work is done. The PR should NOT close the project issues — it should only scaffold the project. The "Closes" keywords should be used in future PRs that actually complete those issues.
- **Footer nav mismatch**: The next link says "Containers with Docker" → `week-5/lecture-1`. But the index defines Week 5 as "Sprint Planning" and Week 6 as "Containerization with Docker." Either the content of week-5 files doesn't match the index, or the navigation label is wrong.
- **Unclear project constraints**: The description says "In Week 5 (Sprint Planning) you will create issues for every sprint in advance — Containers, Backend, Testing, Frontend, Auth, Deployment." This implies 6 more weeks of work (Weeks 6–11), but the Activity description says "This project runs Weeks 4–8." The scope is contradictory — does the project run through Week 8 or Week 12?
- Issue 1 references "the backend stub provided in Week 3" — but Week 3 was C++ OOP. The backend stub (`backend/main.py`) is created in this Activity (Challenge 2.2), not in Week 3. Confusing reference.
- No `.gitignore` is created during the scaffolding, despite Lecture 1 spending an entire section on why it matters. The `.env` placeholder from the future backend should be gitignored from the start.

**Gaps**
- **Project grading/assessment criteria**: The Activity never explains how the project will be graded, evaluated, or presented. Students don't know what "done" means at the end.
- **Technology stack constraints**: Never explicitly stated. Is FastAPI required? Is React required? Can students use Next.js or Flask instead? The issue bodies assume specific technologies but the constraints aren't formally communicated.
- **`.gitignore` creation**: Should be part of the scaffold to establish good habits from the start.

**Component Compliance**
1. Lines 42–63: Domain selection grid — raw JSX. Uses only design system tokens (`border-border`, `bg-card`, `text-foreground`, `text-muted-foreground`). ACCEPTABLE.
2. Lines 97–105: `<TerminalBlock>` (folder scaffold commands) — COMPLIANT.
3. All other content uses `<ActivityChallenge>`, `<ActivityTask>`, `<ActivityHint>`, `<LectureCallout>`. COMPLIANT.

---

### Week 4 Overall

**Positives**
- The best-structured week in the course so far. Lecture 1 provides a comprehensive Git introduction, Lecture 2 covers collaboration and project management, and the Activity puts it all into practice by kicking off the fundamentals project.
- Lecture 1's command-by-command approach with LectureCmd tooltips is exceptional pedagogical design — every command is explained in context.
- The Activity successfully launches the project: students leave with a repo, board, issues, and first PR.
- 15 TerminalBlocks in Lecture 1 — all properly using the component system.

**Negatives**
- 2 component compliance violations in Lecture 1 (ConflictMarkersBlock, .gitignore content).
- Wrong week reference in Lecture 2 ("Week 2 activity" should be "Week 4 activity").
- The Activity's "Closes #1, Closes #2, Closes #3" instruction will prematurely close all project issues.
- Unclear project timeline (Weeks 4–8 vs Weeks 4–12) and unstated technology constraints.
- Footer nav says next is "Containers with Docker" but the index says Week 5 is "Sprint Planning."

**Gaps**
- `git stash`, `git diff`, and `git switch` are absent from Git coverage.
- No .gitignore in the project scaffold.
- No project grading criteria communicated to students.

---

### Transition: Week 4 → Week 5

- **Navigation inconsistency**: The Activity's footer nav says "Containers with Docker" → `week-5/lecture-1`, but the index defines Week 5 as "Sprint Planning" (Scrum, Kanban, backlog design) and Week 6 as "Containerization with Docker." The actual content of `week-5/lecture-1.tsx` needs to be checked to determine which is correct.
- The Activity description says "In Week 5 (Sprint Planning) you will create issues for every sprint in advance" — suggesting Sprint Planning comes next. But the footer nav contradicts this by pointing to Docker content.
- If Sprint Planning is indeed next (Week 5), then the transition is smooth: students just set up their board and issues in Week 4, and Week 5 would have them flesh out the full sprint roadmap.
- If Docker/Containers is next (Week 5 content), then Sprint Planning is skipped or merged into another week, which would mean students jump from project setup to containerization without planning their sprints.

---

## Week 5 — Sprint Planning

### Lecture 1

**Positives**
- Comprehensive overview of both Scrum and Kanban in a single lecture — appropriate depth for a fundamentals course.
- Section 01 (Why Agile) motivates the topic with the waterfall vs agile contrast. WaterfallVsAgile diagram makes the comparison tangible.
- SprintCycle diagram (section 02) shows all 5 Scrum ceremonies with detailed descriptions — Sprint Planning, Daily Standup, Development, Sprint Review, Retrospective.
- User stories section (02) provides two fully worked examples with story format, story points, and acceptance criteria. Excellent reference material.
- Story points explanation is clear: Fibonacci scale, relative effort not hours.
- Agile artifacts section (03) explains product backlog, sprint backlog, and burndown chart with practical examples.
- Scrum vs Kanban comparison (section 04) with side-by-side "choose when" guidance.
- GitHub Projects section (05) provides 4 concrete steps — mirrors the Activity setup.
- Retrospective section (06) with Start/Stop/Continue template is immediately actionable.
- `LectureFooterNav` correct: prev = Week 4 Activity, next = Lecture 2.

**Negatives**
- Significant overlap with Week 4 Lecture 2 — Agile, Kanban, GitHub Projects, and "Closes #N" syntax are all repeated. Week 4 L2 and Week 5 L1 could be consolidated or deduplicated.
- Multiple raw JSX diagram components with hardcoded color classes:
  - WaterfallVsAgile (lines 15–67): `text-rose-600`, `text-emerald-600`, hardcoded inline HSL colors via style attribute.
  - SprintCycle (lines 70–119): `text-blue-600`, `text-orange-600`, `text-emerald-600`, `text-purple-600`, `text-rose-600`.
  - KanbanBoard (lines 122–157): `text-blue-600`, `text-orange-600`, `text-emerald-600`.
  - User stories (lines 202–233): `text-emerald-500`.
  - Agile artifacts (lines 246–280): `text-blue-600`, `text-orange-600`, `text-emerald-600`.
  - Scrum vs Kanban (lines 291–326): `text-blue-500`, `text-emerald-500`.
  - Start/Stop/Continue (lines 378–397): `text-emerald-600`, `text-rose-600`, `text-blue-600`.
  All are educational diagrams, not code blocks — borderline for component compliance, but the volume of hardcoded colors is notable.

**Gaps**
- **Velocity**: No mention of how to measure team velocity (average points completed per sprint) — important for sprint planning accuracy over time.
- **Sprint goal**: The concept of a "sprint goal" (a single statement of what the sprint aims to achieve) is not explicitly introduced.
- No practical exercise during the lecture — students read about Agile without doing anything. The Activity handles this, but the lecture could include a quick planning exercise.

**Component Compliance**
- No code blocks or terminal blocks in this lecture. All content is prose and educational diagrams.
- 7 raw JSX diagram components use hardcoded color classes — all are educational cards/diagrams, not code. FLAG as borderline (volume is high).

---

### Lecture 2

**Positives**
- The SPRINT_THEMES data structure (lines 14–21) maps weeks 6–11 to sprint themes with example issues — this is the definitive roadmap for the rest of the course. Very clear.
- Section 01 explains the one-sprint-per-week model clearly: "When you start Week 6, you pull the Containers issues."
- Section 03 on acceptance criteria is practical: contrasts vague ("3 endpoints") with testable ("GET /items returns 200 and JSON array").
- The "Closes #N" and Milestone tips reinforce the GitHub workflow.
- `LectureFooterNav` correct: prev = Lecture 1, next = Activity.

**Negatives**
- **Very short lecture** — only ~85 lines of content across 3 sections. The index describes this as "90 min" but the reading time is 10–15 minutes. This feels like a pre-Activity instruction page rather than a full lecture.
- No actual issue-writing example — the lecture describes what a good issue looks like but doesn't show a complete GitHub issue body (title, Markdown body, labels, acceptance criteria checklist).
- The sprint themes table uses only design system tokens — acceptable styling. But the issue examples are one-liners without acceptance criteria, contradicting what section 03 teaches.

**Gaps**
- **No complete issue example**: A worked example showing a full GitHub issue (title, body with user story, acceptance criteria checklist, labels, milestone assignment) would significantly help students.
- **No issue template guidance**: GitHub issue templates (`.github/ISSUE_TEMPLATE/`) were mentioned in Week 4 Lecture 2 but are not carried through here. Students could benefit from creating one.
- **No estimation guidance**: The issues listed don't include story point estimates or complexity notes. Lecture 1 teaches story points, but Lecture 2 doesn't connect the concept to the actual issues students will create.

**Component Compliance**
- Lines 51–71: Sprint themes cards — raw JSX. Uses design system tokens (`border-border`, `bg-card`, `bg-muted/50`, `text-primary`, `text-foreground`). ACCEPTABLE.
- No code blocks or terminal blocks. COMPLIANT throughout.

---

### Activity

**Detailing**
- Challenge 1.1 (Week 6 — Containers): 3 tasks including acceptance criteria and milestones. Best-detailed challenge.
- Challenges 1.2–1.6 (Weeks 7–11): Each has only 1–2 tasks with less detail than 1.1. Challenge 1.3 (Testing) has only 1 task.
- Acceptance criteria instruction appears in Challenge 1.1 but is not reinforced in later challenges — students may skip it for issues 1.2–1.6.
- No verification challenge at the end (unlike Week 4's "Verify Your Setup").

**Project Connection**
- This IS the sprint planning activity — directly creates the roadmap for weeks 6–11.
- Each challenge maps to a specific course week and sprint theme.
- Builds directly on the Week 4 Activity's repo and GitHub Project board.
- The callout at the end clarifies that the board is a roadmap, not a strict contract.

**Feasibility**
- Creating 12–24 GitHub issues in 90 minutes is feasible but tedious. The quality of issues will depend on how seriously students engage.
- Since challenges 1.2–1.6 are lightly detailed, students may rush through them, creating low-quality issues.

**Positives**
- One challenge per sprint theme (6 challenges for 6 weeks) provides clear structure.
- The callout at the start connects to Week 4's output: "You already have a repo and GitHub Project board from Week 4."
- The closing callout sets expectations: "You don't have to complete every issue in the week it's assigned."
- `LectureFooterNav` correct: prev = Lecture 2, next = Week 6 Lecture 1 ("Package Managers & Environments").

**Negatives**
- Challenges 1.2–1.6 are too brief — each has only 1–2 tasks compared to 1.1's 3 tasks. Students need equal scaffolding for each sprint theme.
- No final verification challenge: students don't have a "confirm your board shows X issues across Y milestones" step.
- No guidance on total issue count — students don't know if 12 issues total is enough or if they need 20+.
- The Activity doesn't explain how Week 12 (Final Demo) connects to the board. Is Week 12 a deliverable sprint?

**Gaps**
- **Verification step**: No "confirm your board is complete" challenge at the end.
- **Issue quality guidance**: No examples of good vs bad issue titles/descriptions.
- **Week 12 planning**: The Activity covers Weeks 6–11 but doesn't address Week 12 (Final Sprint / Demo Prep). Should students create issues for the final demo?

**Component Compliance**
- No code blocks or terminal blocks. All content uses `<ActivityChallenge>`, `<ActivityTask>`, `<LectureCallout>`. COMPLIANT throughout.

---

### Week 5 Overall

**Positives**
- The three files form a clear arc: Lecture 1 teaches Agile theory, Lecture 2 maps it to the course schedule, and the Activity applies it by populating the project board. Students leave Week 5 with a complete roadmap for the rest of the course.
- The SPRINT_THEMES roadmap (Lecture 2) is the clearest statement of what students will build in weeks 6–11. This is the through-line document for the rest of the fundamentals project.
- No component compliance violations — no code is rendered in any of the three files.
- The retrospective and start/stop/continue template (Lecture 1, section 06) provides a tool students can use in their own teams beyond this course.

**Negatives**
- **Lecture 2 is too thin**: At ~85 lines, it's substantially shorter than any other lecture. It should either be expanded with worked examples and issue templates, or merged into Lecture 1.
- **Significant overlap between Week 4 L2 and Week 5 L1**: Agile overview, Kanban, GitHub Projects, and "Closes #N" are covered in both. The two lectures could be deduplicated.
- **The Activity's later challenges (1.2–1.6) are under-detailed** compared to Challenge 1.1. Students need consistent scaffolding across all sprint themes.
- **Heavy use of hardcoded colors** in Lecture 1's diagrams (7 custom components with `text-*-600` colors). While these are diagrams, the volume is the highest in any single lecture.

**Gaps**
- **No worked issue example**: Students are told to write issues with acceptance criteria but never shown a complete example of one.
- **Week 12 is unaddressed**: The sprint roadmap covers Weeks 6–11 but skips Week 12.
- **No connection between story points (Lecture 1) and actual issue creation (Activity)**: Students learn about estimation but never apply it.

---

### Transition: Week 5 → Week 6

- The Activity's footer nav correctly points to "Package Managers & Environments" → `week-6/lecture-1`. This matches the index (Week 6 = Containerization with Docker, Lecture 1 = Package Managers & Environments).
- The transition is smooth: students have a complete board with Container issues ready. Week 6 Lecture 1 will teach package managers and environments, Lecture 2 will cover Docker, and the Activity should have students containerize their project.
- Students should be pulling their Week 6 container issues into "In Progress" at the start of Week 6.
- **Note**: The Week 4 Activity footer nav previously labeled the next page as "Containers with Docker" when linking to `week-5/lecture-1` (which is actually Sprint Planning). This label error should be fixed to "Scrum, Kanban & Sprint Cycles."

---

## Week 6 — Containerization with Docker

### Lecture 1

**Positives**
- Comprehensive coverage of 4 package managers (npm, pip, apt, brew) — each with practical commands and context.
- Strong motivation: the left-pad incident (section 01) is an effective cautionary tale about dependency risk.
- npm section covers package.json, lockfiles, scripts, `--save-dev`, version ranges — thorough.
- pip section properly introduces virtual environments and `requirements.txt` — critical for the project's Python backend.
- Semantic versioning section (07) explains MAJOR.MINOR.PATCH with `^` and `~` notation — practical for understanding package.json.
- Capstone (section 08) walks through a full server setup — apt update, install runtimes, create venv, install packages. Realistic workflow.
- 7 TerminalBlocks — all using the component correctly.

**Negatives**
- **BUG — Wrong week number**: The `LectureHeader` says `week={5}` and the function is named `Week5Lecture1` — but this file is in `week-6/`. Should be `week={6}`. This causes the wrong week badge to display.
- **BUG — Wrong footer nav prev link**: The prev link points to "Project Kickoff" → `week-4/activity`, skipping Week 5 (Sprint Planning) entirely. Should point to `week-5/activity`.
- **VIOLATION — package.json scripts** (lines 134–148): JSON content rendered as raw JSX with hardcoded colors (`text-zinc-400`, `text-zinc-500`, `text-emerald-400`, `bg-zinc-950`). This is JSON file content and should use `<CodeBlock language="json" title="package.json — scripts section">`.
- Semantic versioning diagram (lines 279–311) uses hardcoded colors (`text-rose-600`, `text-amber-600`, `text-emerald-600`). Diagram — borderline.

**Gaps**
- **`npx`**: Not mentioned — the tool for running packages without global installation. Common for `create-react-app`, `create-next-app`, etc.
- **`poetry`** (Python): Modern alternative to pip + venv, increasingly popular. Not covered.
- **Docker Desktop prerequisite**: Students will need Docker in Lecture 2 and the Activity, but Lecture 1 doesn't mention installing it.

**Component Compliance**
1. Lines 53–87: Registry comparison grid — uses design system tokens. ACCEPTABLE.
2. Lines 105–114: `<TerminalBlock>` (npm commands) — COMPLIANT
3. Lines 134–148: **VIOLATION** — package.json scripts rendered as raw JSX with hardcoded colors. Should use `<CodeBlock language="json">`.
4. Lines 153–161: `<TerminalBlock>` (npm run) — COMPLIANT
5. Lines 179–190: `<TerminalBlock>` (pip/venv) — COMPLIANT
6. Lines 210–222: `<TerminalBlock>` (apt) — COMPLIANT
7. Lines 233–239: `<TerminalBlock>` (PPA) — COMPLIANT
8. Lines 252–262: `<TerminalBlock>` (brew) — COMPLIANT
9. Lines 279–311: Raw JSX — semver diagram with hardcoded colors. Diagram. FLAG as borderline.
10. Lines 328–343: `<TerminalBlock>` (server setup) — COMPLIANT

7 TerminalBlocks — COMPLIANT. 1 violation (package.json JSON). 1 borderline diagram.

---

### Lecture 2

**Positives**
- Excellent Docker lecture — arguably the strongest single lecture in the course.
- Clear motivation: "It works on my machine" scenario in section 01.
- VmVsContainerDiagram (section 02) provides clear visual comparison of VMs vs containers.
- The `Image : Container = Class : Object` analogy (section 03) is memorable and accurate.
- Core Docker commands (section 04) organized by workflow: images → running → managing. 3 TerminalBlocks with practical commands and clear `-p`, `-d`, `-v` explanations.
- **Dockerfile** (section 05) uses `<CodeBlock language="docker">` correctly, with line-by-line annotation. Instruction reference table below is practical.
- Layer caching (section 06) explains why `COPY package*.json` comes before `COPY . .` — important optimization that many tutorials skip.
- **`.dockerignore`** uses `<CodeBlock language="bash">` correctly.
- **`docker-compose.yml`** uses `<CodeBlock language="yaml">` correctly — multi-service example with app + postgres + named volume.
- Docker Compose commands in TerminalBlock — comprehensive (up, down, logs, exec).
- Capstone (section 08) walks through complete containerization from `mkdir` to `curl`.

**Negatives**
- **BUG — Wrong week number**: Header says `week={5}`. Should be `week={6}`. Function named `Week5Lecture2`.
- VmVsContainerDiagram (lines 19–56) uses raw JSX with hardcoded colors. Diagram — borderline.
- Dockerfile instructions table (lines 212–230) uses hardcoded `text-blue-600 dark:text-blue-400` for instruction names. Reference table — borderline.

**Gaps**
- **Docker Desktop installation**: Not covered. Students need Docker installed for the commands to work but aren't told how to install it.
- **Multi-stage builds**: Not covered. A powerful technique for reducing image size that would complement the Activity's base image comparison.
- **Docker networking**: Only briefly mentioned ("services on the same Compose network can reach each other by name"). No deeper explanation.

**Component Compliance**
1. Lines 19–56: VmVsContainerDiagram — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
2. Lines 125–133: `<TerminalBlock>` (docker images) — COMPLIANT
3. Lines 140–149: `<TerminalBlock>` (docker run) — COMPLIANT
4. Lines 159–170: `<TerminalBlock>` (docker manage) — COMPLIANT
5. Lines 186–205: `<CodeBlock language="docker">` (Dockerfile) — COMPLIANT
6. Lines 212–230: Raw JSX — instruction table with hardcoded `text-blue-600`. Reference. FLAG as borderline.
7. Lines 251–263: `<CodeBlock language="bash">` (.dockerignore) — COMPLIANT
8. Lines 275–301: `<CodeBlock language="yaml">` (docker-compose.yml) — COMPLIANT
9. Lines 303–314: `<TerminalBlock>` (docker compose) — COMPLIANT
10. Lines 331–346: `<TerminalBlock>` (capstone) — COMPLIANT

3 CodeBlocks + 4 TerminalBlocks — all COMPLIANT. 2 borderline diagrams. 0 violations.

---

### Activity

**Detailing**
- Challenge 1.1 (Write Dockerfile): 8 specific tasks — base image, WORKDIR, COPY, pip install, mkdir, EXPOSE, CMD. Good scaffolding with a hint.
- Challenge 1.2 (Build and Run): 4 tasks with two TerminalBlocks showing exact commands. Clear verification: "Verify you get `{\"status\": \"ok\"}`."
- Challenge 2.1 (Mount a Volume): 5 tasks with two TerminalBlocks. Clear persistence verification.
- Challenge 2.2 (Prove Persistence): 4 tasks proving data survives restart. Hint for path mismatch.
- Challenge 3.1 (Build with Alpine): 4 tasks comparing `python:3.11-slim` vs `python:3.11-alpine`.
- Challenge 3.2 (Document Findings): 6 tasks including DOCKER.md, commit, PR that closes Issue #1, board update. Excellent project board integration.

**Project Connection**
- Directly containerizes the project backend — this is the Week 6 sprint deliverable.
- Challenge 3.2 closes Issue #1 on the project board and moves it to Done — first project board card completion.
- The Dockerfile created here will be used in future weeks (backend development).

**Feasibility**
- 6 challenges with Docker commands — feasible in 90 minutes if Docker is already installed.
- Docker Desktop installation is not addressed — if students don't have it, they lose significant time.

**Positives**
- Well-structured progression: write Dockerfile → build/run → add volume → prove persistence → compare images → document.
- TerminalBlocks provide exact commands for every step.
- Project board integration in Challenge 3.2 reinforces the Agile workflow from Weeks 4–5.
- Footer nav correct: prev = Lecture 2, next = Week 7 Lecture 1.

**Negatives**
- **BUG — Wrong week number**: Header says `week={5}`. Should be `week={6}`. Function named `Week5Activity`.
- **VIOLATION — Python stub code** (lines 42–57): The Flask stub is rendered as raw JSX with hardcoded colors (`text-blue-400`, `text-zinc-400`, `text-amber-400`, `bg-muted/30`). This is Python code and should use `<CodeBlock language="python" title="backend/main.py — stub">`.
- **The stub code is not in students' repos**: The Week 4 Activity created `backend/main.py` with only a comment placeholder (`# Week 7 — FastAPI backend goes here`). This Activity displays a Flask stub but never tells students to replace their placeholder with this code. Students must infer that they need to copy this code into their file.
- **Flask vs FastAPI inconsistency**: The stub uses Flask, but the course's backend technology is FastAPI (Week 7). Students containerize a Flask app this week, then replace it with FastAPI next week. This should be explicitly addressed.
- **Wrong forward reference** in description (line 26): "The Dockerfile you write today is the one you will use in Week 4" — Week 4 is in the past. Should reference Week 7 or later.
- **Wrong backward reference** in callout (line 31): "the placeholder from Week 2" — the placeholder was created in Week 4.
- Activity description says `week={5}` but the file is in `week-6/`.

**Gaps**
- **Docker Desktop installation check**: No verification that Docker is installed and running.
- **Getting the stub code into the repo**: No explicit instruction to replace the placeholder main.py with the Flask stub.
- **`.dockerignore` creation**: Lecture 2 covered this, but the Activity doesn't have students create one.
- **`requirements.txt`**: The Dockerfile uses `RUN pip install flask` inline rather than copying a `requirements.txt` — contradicts Lecture 1's guidance on using `pip freeze > requirements.txt`.

**Component Compliance**
1. Lines 42–57: **VIOLATION** — Flask stub rendered as raw JSX with hardcoded colors (`text-blue-400`, `text-zinc-400`, `text-amber-400`). Should use `<CodeBlock language="python">`.
2. Lines 92–98: `<TerminalBlock>` (build and run) — COMPLIANT
3. Lines 100–105: `<TerminalBlock>` (curl) — COMPLIANT
4. Lines 132–137: `<TerminalBlock>` (volume mount) — COMPLIANT
5. Lines 139–147: `<TerminalBlock>` (curl + cat) — COMPLIANT

4 TerminalBlocks — COMPLIANT. 1 violation (Python stub).

---

### Week 6 Overall

**Positives**
- The strongest applied-technology week so far. Lecture 1 teaches the ecosystem, Lecture 2 teaches Docker comprehensively, and the Activity applies both in a real containerization exercise.
- Lecture 2 is an exemplary technical lecture: clear motivation, visual diagrams, correct component usage (3 CodeBlocks + 4 TerminalBlocks), and a capstone walkthrough.
- The Activity's project board integration (closing Issue #1 via PR) reinforces the Agile workflow established in Weeks 4–5.
- 3 CodeBlocks + 11 TerminalBlocks across the week — strong component compliance overall.

**Negatives**
- **All three files have wrong week number** (`week={5}` instead of `week={6}`) and wrong function names (`Week5Lecture1` etc.). This suggests the content was written before Sprint Planning (Week 5) was inserted into the schedule.
- **Lecture 1's prev footer nav skips Week 5** — links to week-4/activity instead of week-5/activity.
- 2 violations: package.json scripts (Lecture 1) and Flask stub code (Activity) rendered as raw JSX.
- Multiple wrong backward/forward references in the Activity ("Week 2", "Week 4").
- Flask vs FastAPI inconsistency in the Activity.

**Gaps**
- Docker Desktop installation not addressed anywhere in the week.
- Students' existing `main.py` (a comment placeholder) needs to be replaced with the Flask stub, but no instruction says this.

---

### Transition: Week 6 → Week 7

- The Activity's footer nav correctly points to "FastAPI & Python Backends" → `week-7/lecture-1`. This is the expected progression: students containerized a Flask stub, now they'll replace it with a real FastAPI backend.
- The Flask → FastAPI transition should be addressed in Week 7 Lecture 1: "You containerized a Flask stub last week. Now you'll replace that stub with a production FastAPI backend."
- Students should arrive at Week 7 with: a Docker container running their Flask stub, a volume for persistence, and a closed Issue #1 on their board. Week 7's backend issues should be ready to pull from the Backlog.

---

## Week 7 — Backend Development

> **Note on file locations:** The `index.tsx` schedule lists Week 7 as "FastAPI & Python Backends" (L1) / "Databases: SQL, SQLite & Redis" (L2). The actual files in `week-7/` match this content but have wrong internal metadata — function names say `Week6*` and headers say `week={6}`.

### Lecture 1

**Positives**
- Comprehensive introduction to HTTP, REST, and CRUD mapping — strong opening for backend development.
- RequestCycleDiagram (section 01) clearly visualizes the full Browser → FastAPI → Database → FastAPI → Browser cycle.
- HttpMethodsTable covers all 5 methods (GET, POST, PUT, PATCH, DELETE) with purpose and example endpoint — well-organized reference.
- FastAPI setup section uses `TerminalBlock` correctly for project creation, venv, and pip install.
- Pydantic models section (03) explains input/output model separation (NoteCreate vs NoteResponse) — critical real-world pattern.
- Path/query parameters section (04) consolidates path params, query params, and body into one example showing all three sources.
- Error handling section (05) covers `HTTPException` with status codes — practical.
- CORS section (06) addresses a common beginner stumbling block; the `allow_origins=["*"]` warning is well-placed.
- Async section (07) gives a clear sync vs async comparison with guidance on when to use each.
- curl testing section (08) with `TerminalBlock` provides practical API testing commands.
- Callout recommending Bruno over Postman — modern, repo-friendly advice.
- `/docs` Swagger UI emphasized early — FastAPI's killer feature for beginners.

**Negatives**
- **BUG — Wrong week number**: Header says `week={6}`, function named `Week6Lecture1`. File is in `week-7/`. Should be `week={7}`.
- **VIOLATION — main.py first FastAPI app** (lines 122–146): Complete Python file rendered as raw JSX with hardcoded colors (`text-blue-400`, `text-emerald-400`, `text-sky-300`, `text-amber-400`, `text-zinc-400`, `text-zinc-500`, `bg-zinc-950`). Should use `<CodeBlock language="python" title="main.py — a complete FastAPI application">`.
- **VIOLATION — Pydantic models** (lines 170–194): Python code as raw JSX with hardcoded colors. Should use `<CodeBlock language="python">`.
- **VIOLATION — Path & query params** (lines 207–233): Python code as raw JSX with hardcoded colors. Should use `<CodeBlock language="python">`.
- **VIOLATION — Error handling** (lines 242–258): Python code as raw JSX with hardcoded colors. Should use `<CodeBlock language="python">`.
- **VIOLATION — CORS middleware** (lines 270–286): Python code as raw JSX with hardcoded colors. Should use `<CodeBlock language="python">`.
- **VIOLATION — Async endpoints** (lines 299–318): Python code as raw JSX with hardcoded colors. Should use `<CodeBlock language="python">`.
- **6 violations in one lecture** — the worst compliance in the entire course. Every Python code example uses raw JSX; there are zero CodeBlocks for Python in this file.

**Gaps**
- No mention of updating the Dockerfile from Week 6 to serve FastAPI instead of the Flask stub. Students containerized Flask — this transition is never addressed.
- No `requirements.txt` update instruction (needs `fastapi`, `uvicorn[standard]`).
- The Flask → FastAPI migration is completely ignored.

**Component Compliance**
1. Lines 16–43: RequestCycleDiagram — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
2. Lines 46–66: HttpMethodsTable — raw JSX with hardcoded colors. Reference table. FLAG as borderline.
3. Lines 110–118: `<TerminalBlock>` (FastAPI setup) — COMPLIANT
4. Lines 122–146: **VIOLATION** — main.py Python code as raw JSX. Should use `<CodeBlock language="python">`.
5. Lines 151–157: `<TerminalBlock>` (uvicorn) — COMPLIANT
6. Lines 170–194: **VIOLATION** — Pydantic models as raw JSX. Should use `<CodeBlock language="python">`.
7. Lines 207–233: **VIOLATION** — Path/query params as raw JSX. Should use `<CodeBlock language="python">`.
8. Lines 242–258: **VIOLATION** — Error handling as raw JSX. Should use `<CodeBlock language="python">`.
9. Lines 270–286: **VIOLATION** — CORS middleware as raw JSX. Should use `<CodeBlock language="python">`.
10. Lines 299–318: **VIOLATION** — Async endpoints as raw JSX. Should use `<CodeBlock language="python">`.
11. Lines 335–345: `<TerminalBlock>` (curl commands) — COMPLIANT

3 TerminalBlocks — COMPLIANT. **0 CodeBlocks** (all Python code is raw JSX). **6 violations**. 2 borderline.

---

### Lecture 2

**Positives**
- Excellent SQL lecture — arguably the strongest database introduction in the course.
- Pedagogical progression is textbook: DDL (CREATE TABLE) → SELECT → JOIN → DML (INSERT/UPDATE/DELETE) → GROUP BY/HAVING → SQLAlchemy ORM → FastAPI integration → Indexing → Normalization.
- **9 CodeBlocks** (6 SQL + 3 Python) — all using the correct component with appropriate language tags. Best compliance in the entire course.
- SQL examples are realistic and tied to the notes/users domain — consistent throughout.
- SQLAlchemy section provides complete `database.py` (engine, session, `get_db` dependency) and `models.py` (User, Note with relationships) — students can copy these patterns directly.
- FastAPI + SQLAlchemy integration (section 05) shows full CRUD with `Depends(get_db)` — the key pattern for real-world FastAPI apps.
- N+1 query problem warning with `joinedload()`/`selectinload()` — appropriate for this audience.
- Indexing section covers B-trees, composite indexes, and `EXPLAIN QUERY PLAN` — practical production advice.
- Normalization section with denormalized vs normalized side-by-side comparison — visually clear.
- Connection pooling tip for production — forward-looking.
- `ON DELETE CASCADE` in the foreign key definition — catches a real-world issue early.

**Negatives**
- **BUG — Wrong week number**: Header says `week={6}`, function named `Week6Lecture2`. File is in `week-7/`. Should be `week={7}`.
- **Redis is barely covered despite being in the title**: The lecture title is "Databases: SQL, SQLite & Redis", but Redis appears only in a single LectureCallout sentence (line 402): "Use Redis for fast caching..." No Redis setup, no commands, no code, no practical examples.

**Gaps**
- **Redis coverage is critically missing**: No `redis-py` installation, no `r.get()`/`r.setex()`, no TTL concept, no connection setup, no practical examples. The Activity requires Redis caching but this lecture provides zero Redis instruction.
- No database migrations (Alembic) — acceptable at this level but worth a brief mention.
- No transactions / rollback discussion.
- No SQLite CLI usage (`.tables`, `.schema`, `.quit`) — useful for debugging.
- No `TerminalBlock` for common SQLite CLI commands.

**Component Compliance**
1. Lines 18–75: RelationalDiagram — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
2. Lines 116–136: `<CodeBlock language="sql">` (CREATE TABLE) — COMPLIANT
3. Lines 140–159: `<CodeBlock language="sql">` (SELECT) — COMPLIANT
4. Lines 167–181: `<CodeBlock language="sql">` (JOIN) — COMPLIANT
5. Lines 185–196: `<CodeBlock language="sql">` (DML) — COMPLIANT
6. Lines 209–225: `<CodeBlock language="sql">` (GROUP BY) — COMPLIANT
7. Lines 237–262: `<CodeBlock language="python">` (database.py) — COMPLIANT
8. Lines 268–291: `<CodeBlock language="python">` (models.py) — COMPLIANT
9. Lines 300–332: `<CodeBlock language="python">` (main.py CRUD) — COMPLIANT
10. Lines 349–362: `<CodeBlock language="sql">` (indexing) — COMPLIANT
11. Lines 375–399: Raw JSX — normalization comparison with hardcoded colors. Diagram. FLAG as borderline.

6 SQL CodeBlocks + 3 Python CodeBlocks — all COMPLIANT. 0 violations. 2 borderline. **Best component compliance of any lecture.**

---

### Activity

**Detailing**
- Challenge 2.1 (Docker Compose): 4 tasks for api + redis services. `TerminalBlock` for `docker compose up`. Good callout on `depends_on` semantics.
- Challenge 3.1 (Database Models): 3 tasks for models.py, database.py, table creation on startup. Hint for SQLAlchemy quickstart.
- Challenge 3.2 (Core Endpoints): 2 tasks — implement 3 endpoints with Pydantic schemas, test each in /docs. Good "write one, test one" callout.
- Challenge 3.3 (Redis Caching): 4 tasks covering Redis connection, choosing a cacheable endpoint, TTL, and the cache hit/miss pattern. One code example.
- Challenge 4.1 (Verify and Document): 3 tasks — verify /docs, test cache speed, write API.md.
- Challenge 4.2 (PR and Board Update): 5 tasks — commit, push, PR closing Issue #2, board update, PR description requirements (screenshot of /docs, docker compose proof, Redis justification).

**Project Connection**
- Directly builds the project backend — the core Week 7 deliverable.
- PR closes Issue #2 on the project board.
- PR description requires evidence: screenshot of /docs, working `docker compose up`, and Redis choice justification — strong accountability.
- API.md documentation requirement introduces developer documentation practices.

**Feasibility**
- Ambitious for 90 minutes: Docker Compose setup + SQLAlchemy models + 3 endpoints with Pydantic + Redis caching + documentation + PR.
- Students who followed Week 6 carefully and have Docker running should manage, but Redis caching with effectively zero lecture instruction will be a bottleneck.

**Positives**
- Well-structured progression: Docker Compose → models → endpoints → caching → documentation → PR.
- Project requirements (section 01) are clear: 5 bullet points every backend must meet. Unambiguous.
- Redis as a cache (not primary DB) is correctly framed — the warning callout is important.
- PR description requirements are the strongest accountability measures in the course.
- Footer nav: prev = Lecture 2 (correct), next = "React Components & Hooks" → week-8/lecture-1 (label correct per index, but actual file at that URL is wrong — see Week 8).

**Negatives**
- **BUG — Wrong week number**: Header says `week={6}`, function named `Week6Activity`. File is in `week-7/`. Should be `week={7}`.
- **Wrong backward reference** (line 31): "the domain you chose in Week 2" — the domain was chosen in the Week 4 Activity (Project Kickoff).
- **VIOLATION — Redis cache pattern** (lines 133–142): Python code rendered as raw JSX with hardcoded colors (`text-zinc-400`, `text-blue-400`, `text-amber-400`, `text-gray-500`, `bg-muted/30`). Should use `<CodeBlock language="python" title="cache hit/miss pattern">`.
- Broken JSX indentation in header (line 24 — `session` prop misaligned).

**Gaps**
- **No `pip install redis` instruction**: Students need the redis-py package but it's never mentioned.
- **Redis connection host**: Uses `host='redis'` (Docker Compose service name) without explaining Docker Compose networking.
- **`schemas.py` not mentioned**: Pydantic schemas are required but no task creates `schemas.py` (database.py and models.py are listed).
- **`requirements.txt` update**: Students need to add multiple packages but no task mentions requirements management.
- No expected output examples for any endpoint.

**Component Compliance**
1. Lines 41–53: Requirements checklist — uses design system tokens. ACCEPTABLE.
2. Lines 75–80: `<TerminalBlock>` (docker compose up) — COMPLIANT
3. Lines 133–142: **VIOLATION** — Redis cache pattern as raw JSX with hardcoded colors. Should use `<CodeBlock language="python">`.

1 TerminalBlock — COMPLIANT. 0 CodeBlocks. 1 violation.

---

### Week 7 Overall

**Positives**
- Excellent backend teaching content. Lecture 1 covers the full FastAPI stack (HTTP, REST, Pydantic, error handling, CORS, async). Lecture 2 is a model SQL/ORM lecture with 9 compliant CodeBlocks.
- The Activity is a substantial, real-world deliverable: a containerized FastAPI backend with SQLAlchemy and Redis, documented and shipped via PR.
- Lecture 2 has the **best component compliance of any lecture** (9 CodeBlocks, 0 violations).
- Project board integration continues — PR closes Issue #2 with strong accountability.

**Negatives**
- **All three files have wrong week number** (`week={6}` instead of `week={7}`) and wrong function names. Same systematic bug as Week 6.
- **Lecture 1 has the worst compliance of any lecture**: 6 violations — every Python code example is raw JSX. Stark contrast with Lecture 2's perfect compliance.
- **Redis is almost entirely untaught**: Title promises Redis but Lecture 2 provides one sentence. Students face the Activity's Redis requirement with effectively zero instruction.
- Wrong backward reference in Activity ("Week 2" instead of "Week 4").

**Gaps**
- Flask → FastAPI transition from Week 6 is never addressed.
- Redis instruction is critically missing from lectures.
- `schemas.py` and `requirements.txt` management not covered in the Activity.

---

### Transition: Week 7 → Week 8

- The Activity's footer nav points to "React Components & Hooks" → `week-8/lecture-1`. This label is correct per the `index.tsx` schedule.
- **CRITICAL — Week 8 content is misplaced**: The actual file at `week-8/lecture-1.tsx` does NOT contain React content. It contains "Vitest & Testing Your Project" (Week 10 content per index), with function name `Week10Lecture1` and `week={10}`. All three Week 8 files contain Week 10 material (Testing & CI/CD). The React frontend content (Week 8 per index: "React Components & Hooks" / "State Management & API Integration") is completely missing from the course files.
- Students arrive at Week 8 expecting to learn React (the frontend for their project). Instead they find Testing/CI content that references React components they haven't built yet.
- This misplacement breaks the project timeline: the Activity for Week 7 tells students their frontend work comes next week, but Week 8's actual content is about testing code that doesn't exist yet.

---

## Week 8 — Testing & CI/CD

> **CRITICAL — Content misplacement**: Per `index.tsx`, Week 8 should be "React Components & Hooks" (L1) / "State Management & API Integration" (L2). The actual files in `week-8/` contain **Week 10 content** (Testing & CI/CD), with function names `Week10Lecture1`, `Week10Lecture2`, `Week10Activity` and `week={10}` in all headers. The React frontend content that should be here is entirely missing from the course. This audit documents what IS in the files, with the misplacement flagged throughout.

### Lecture 1

> **File content:** "Vitest & Testing Your Project" — belongs in Week 10 per index.

**Positives**
- Practical testing philosophy: "test behavior, not implementation" — excellent framing.
- Clear unit vs integration distinction with concrete examples relevant to the project.
- Backend testing (section 03): FastAPI `TestClient` with pytest — 1 CodeBlock (`test_main.py`) with 4 realistic test functions (empty list, create, protected route without/with token).
- Frontend testing (section 04): Vitest + `@testing-library/react` + `jsdom` — 1 CodeBlock (`App.test.tsx`) with 3 tests (render, conditional UI, mocked fetch).
- "What to Test First" (section 05) provides a clear prioritization: happy path → auth → frontend → edge cases. Actionable.
- "One good test per important behavior is worth more than dozens of trivial tests" — well-calibrated advice.
- Both TerminalBlocks (pytest and vitest setup) are compliant.
- Good tip on mocking fetch for deterministic tests.

**Negatives**
- **BUG — Wrong week number**: Header says `week={10}`, function named `Week10Lecture1`. File is in `week-8/`. Should say `week={8}` if this is the intended placement, or the file should be in `week-10/`.
- **CRITICAL — Out-of-order content**: Tests React components (`App.test.tsx`) but React hasn't been taught — Week 8 was supposed to be the React introduction. Students are being asked to test components they haven't learned to build.
- Footer nav prev: "Auth on Your Project" → `week-7/activity` — **WRONG label**. The actual `week-7/activity` is "Build Your Backend", not auth. Auth is listed as Week 9 per index but no `week-9/` files were audited as part of this scope.
- Relatively short lecture for a 90-minute session (5 sections, could be covered in ~30–40 minutes).

**Gaps**
- No test fixture/setup/teardown guidance (e.g., test database isolation, resetting state between tests).
- No mention of `conftest.py` for pytest fixtures.
- No Vitest config file example (only described in prose — "add a test block with `environment: 'jsdom'`").
- No snapshot testing mention (common in React testing).
- The `vi.stubGlobal("fetch", mockFetch)` pattern is shown but cleanup (`vi.restoreAllMocks()`) is not.

**Component Compliance**
1. Lines 57–64: `<TerminalBlock>` (pytest setup) — COMPLIANT
2. Lines 69–104: `<CodeBlock language="python">` (test_main.py) — COMPLIANT
3. Lines 115–122: `<TerminalBlock>` (vitest setup) — COMPLIANT
4. Lines 127–155: `<CodeBlock language="tsx">` (App.test.tsx) — COMPLIANT

2 CodeBlocks + 2 TerminalBlocks — all COMPLIANT. **0 violations. 0 borderline.** Clean compliance.

---

### Lecture 2

> **File content:** "GitHub Actions & Coverage" — belongs in Week 10 per index.

**Positives**
- Clear CI/CD definitions with practical framing: "no one merges broken code."
- Complete workflow YAML file using `<CodeBlock language="yaml">` — students can copy this directly.
- Good advice: `npm ci` instead of `npm install` for CI reproducibility.
- Secrets section covers `GitHub Secrets` and warns against committing real secrets — important security lesson.
- "Green check = don't merge until green" habit — simple, powerful.
- `TerminalBlock` for creating the workflow directory and committing — practical.

**Negatives**
- **BUG — Wrong week number**: Header says `week={10}`, function named `Week10Lecture2`. File is in `week-8/`.
- **CRITICAL — Out-of-order content**: CI/CD assumes students have a testable codebase (backend + frontend), but React hasn't been taught yet.
- Short lecture — 4 sections with minimal depth. Could be covered in ~20–30 minutes. Significantly under the 90-minute target.
- No multi-job workflow example (frontend + backend in parallel) despite mentioning it.
- No Docker-based CI example — relevant since students have Docker from Week 6.

**Gaps**
- **Branch protection rules**: Not covered — requiring CI to pass before merge is a critical workflow step.
- No artifact uploading (e.g., coverage reports as PR comments).
- No practical example of a failing workflow and how to debug it.
- The `cache: "npm"` in the YAML is used but not explained.
- No `pytest-cov` YAML example — only the frontend `vitest --coverage` is mentioned with `pytest-cov` as an aside.

**Component Compliance**
1. Lines 49–79: `<CodeBlock language="yaml">` (test.yml) — COMPLIANT
2. Lines 80–86: `<TerminalBlock>` (create workflow) — COMPLIANT

1 CodeBlock + 1 TerminalBlock — all COMPLIANT. **0 violations. 0 borderline.** Clean compliance.

---

### Activity

> **File content:** "Pipeline for Your Repo" — belongs in Week 10 per index.

**Detailing**
- Challenge 1.1 (At Least One Passing Test): 3 tasks — backend test, frontend test, fix existing failures. Brief but clear.
- Challenge 1.2 (Document How to Run Tests): 1 task — README testing section. Minimal.
- Challenge 2.1 (Workflow File): 4 tasks — create file, set triggers, define steps, verify green on Actions tab.
- Challenge 2.2 (Coverage — Optional): 1 task — run with `--coverage` flag.

**Project Connection**
- Weak: No issue to close on the project board. No PR requirement. No board update.
- This is the first Activity since Week 4 that doesn't explicitly connect to the project board workflow.
- The Activity adds testing infrastructure to the project, which is valuable, but the Agile ceremony (PR → close issue → board update) is absent.

**Feasibility**
- Very feasible — only 4 challenges, several with single tasks. Could be completed in 30–45 minutes.
- Significantly lighter than Week 6 and 7 Activities. Feels under-scoped for a 90-minute session.

**Positives**
- Low barrier: "at least one passing test" is achievable for any student.
- README documentation requirement — good practice.
- Coverage is optional — appropriate prioritization.

**Negatives**
- **BUG — Wrong week number**: Header says `week={10}`, function named `Week10Activity`. File is in `week-8/`.
- **CRITICAL — Out-of-order content**: Testing/CI before React means students may not have meaningful frontend code to test.
- Footer nav next: "Vercel, Railway & What Production Means" → `week-9/lecture-1`. Per `index.tsx`, Week 9 is "Auth (JWT, OAuth, Sessions)" — **label mismatch**. The link suggests deployment comes next, but the index says auth does.
- No project board integration (no issue closure, no board update, no PR requirement).
- Under-scoped: only 9 total tasks across 4 challenges. Compare to Week 7 Activity (20+ tasks across 6 challenges).

**Gaps**
- No PR or issue workflow — breaks the Agile cadence established in Weeks 4–7.
- No guidance on where to put test files in the project structure.
- No sample `package.json` test script configuration.

**Component Compliance**
- No code blocks in the Activity. 0 violations. 0 borderline.

---

### Week 8 Overall

**Positives**
- **Perfect component compliance** across all three files: 3 CodeBlocks + 3 TerminalBlocks, all compliant. Zero violations, zero borderline. This is the cleanest week in the entire course for compliance.
- The testing and CI/CD content itself is solid — practical, well-scoped, and focused on the right things (behavior testing, minimal CI, green-before-merge habit).
- Good testing philosophy throughout: prioritize critical paths, test behavior not implementation.

**Negatives**
- **CRITICAL — Entirely wrong content**: All three files contain Week 10 material (Testing & CI/CD) per the `index.tsx` schedule. Week 8 should contain "React Components & Hooks" (L1) and "State Management & API Integration" (L2). The React frontend content is completely missing from the course.
- **All three files have wrong week number** (`week={10}`) and wrong function names (`Week10*`).
- **This breaks the project timeline**: Students have a backend (Week 7) but no frontend instruction. The Activity references testing React components that haven't been taught.
- **Under-scoped Activity**: Only 9 tasks, no project board integration, ~30–45 minutes of work for a 90-minute session.
- **Footer nav mismatches**: Lecture 1's prev label is wrong, Activity's next label is wrong.
- Both lectures are short — combined they might fill one 90-minute lecture rather than two.

**Gaps**
- **React Components & Hooks content is entirely missing** from the course files.
- **State Management & API Integration content is entirely missing** from the course files.
- Without React instruction, students cannot build the frontend for their project, which is referenced in the Week 5 sprint roadmap.
- The Agile workflow (PR → issue → board) is dropped this week.

---

## Week 9 — React & Frontend

> **Note on file locations:** The `index.tsx` lists Week 8 as "React Components & Hooks" / "State Management & API Integration". The actual React content lives in `week-9/` with wrong metadata — function names say `Week7*` and headers say `week={7}`. The `index.tsx` lists Week 9 as "Auth (JWT, OAuth, Sessions)" — that content is in `week-10/`. This audit documents what IS in the `week-9/` files.

### Lecture 1

**Positives**
- Excellent React introduction — "your UI is a function of your state" is the right mental model.
- **9 CodeBlocks** — all using `<CodeBlock>` with correct language tags (tsx, javascript, typescript). Among the best compliance in the course.
- Progressive learning flow: components → props → state → effects → custom hooks → conditional rendering → lists → composition.
- PropsFlowDiagram and UseStateDiagram provide clear visual mental models.
- The `useLocalStorage` custom hook (section 06) is an excellent practical example that ties directly to the project.
- Array/object immutability section explicitly shows right vs wrong patterns with clear ✅/❌ examples.
- Key prop warning with "don't use array index" — catches a common beginner mistake.
- TerminalBlock for `npm create vite@latest` — practical project scaffolding.
- "Sketch your component tree on paper first" tip — excellent advice.
- Virtual DOM and diffing explanations in LectureCallout — appropriate depth.

**Negatives**
- **BUG — Wrong week number**: Header says `week={7}`, function named `Week7Lecture1`. File is in `week-9/`. Per index this is Week 8 content.
- Footer nav prev: "Build Your Backend" → `week-8/activity` — **WRONG link**. The actual `week-8/activity` is "Pipeline for Your Repo" (Testing content). "Build Your Backend" is at `week-7/activity`.
- No mention of TypeScript despite using `.tsx` files — TypeScript hasn't been formally introduced anywhere in the course.

**Gaps**
- No `useContext` hook (mentioned in passing as "Context" but never taught — students will need it for auth in Week 10).
- No `useRef` hook.
- No error boundary discussion.
- No React DevTools introduction.

**Component Compliance**
1. Lines 19–41: PropsFlowDiagram — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
2. Lines 44–60: UseStateDiagram — raw JSX with hardcoded colors. Diagram. FLAG as borderline.
3. Lines 102–119: `<CodeBlock language="tsx">` (Button.tsx) — COMPLIANT
4. Lines 126–144: `<CodeBlock language="tsx">` (JSX rules) — COMPLIANT
5. Lines 153–173: `<CodeBlock language="tsx">` (Button with props) — COMPLIANT
6. Lines 199–216: `<CodeBlock language="tsx">` (Counter) — COMPLIANT
7. Lines 231–249: `<CodeBlock language="javascript">` (state mutations) — COMPLIANT
8. Lines 258–280: `<CodeBlock language="tsx">` (useEffect) — COMPLIANT
9. Lines 296–315: `<CodeBlock language="typescript">` (useLocalStorage) — COMPLIANT
10. Lines 329–338: `<CodeBlock language="tsx">` (conditional rendering) — COMPLIANT
11. Lines 345–364: `<CodeBlock language="tsx">` (list rendering) — COMPLIANT
12. Lines 377–383: `<TerminalBlock>` (Vite setup) — COMPLIANT

9 CodeBlocks + 1 TerminalBlock — all COMPLIANT. **0 violations.** 2 borderline diagrams. Excellent compliance.

---

### Lecture 2

**Positives**
- Excellent Tailwind lecture — comprehensive and practical.
- 4 CodeBlocks using correct components (css, tsx). Good compliance.
- TailwindPreview component provides live visual examples — great for learning utilities.
- Full Tailwind color palette rendered with actual hex values — students see every shade.
- "Dynamic Classes — right vs wrong" section catches the #1 Tailwind+React mistake (don't construct class names dynamically).
- `cn()` utility introduction — standard for the project's stack (shadcn/ui pattern).
- TaskCard example (section 08) ties React (state, conditional rendering) and Tailwind (hover, transition, cn()) together beautifully.
- Connecting to API section (09) bridges frontend to backend — essential for the Activity.
- API keys security warning — important.
- Tailwind IntelliSense VS Code extension recommendation — practical.

**Negatives**
- **BUG — Wrong week number**: Header says `week={7}`, function named `Week7Lecture2`. File is in `week-9/`.
- **VIOLATION — Flexbox class reference** (lines 182–207): CSS class reference rendered as raw JSX with hardcoded colors (`text-emerald-400`, `text-zinc-500`, `bg-zinc-950`). Should use `<CodeBlock>`.
- **VIOLATION — Grid class reference** (lines 214–233): Same pattern. Should use `<CodeBlock>`.
- **VIOLATION — State variants reference** (lines 274–295): Raw JSX with hardcoded colors. Should use `<CodeBlock>`.
- "We cover pipelines in Week 6" (line 403) — **wrong reference**. CI/CD is in Week 8 (per file) or Week 10 (per index).

**Gaps**
- No Tailwind installation instructions in this lecture (only covered in the Activity's Challenge 1.1).
- No `dark:` mode toggle setup explanation.
- No `@apply` discussion (Tailwind discourages it, but beginners ask about it).

**Component Compliance**
1. Lines 77–93: `<CodeBlock language="css">` (traditional vs Tailwind) — COMPLIANT
2. Lines 110–129: Raw JSX — scale system reference with hardcoded `text-orange-600`. Reference. FLAG as borderline.
3. Lines 138–154: Raw JSX — color palette with inline styles. Visual reference. FLAG as borderline.
4. Lines 169–180: TailwindPreview — live demo components. ACCEPTABLE.
5. Lines 182–207: **VIOLATION** — Flexbox class reference as raw JSX. Should use `<CodeBlock>`.
6. Lines 214–233: **VIOLATION** — Grid class reference as raw JSX. Should use `<CodeBlock>`.
7. Lines 242–261: Raw JSX — breakpoints diagram. Diagram. FLAG as borderline.
8. Lines 274–295: **VIOLATION** — State variants reference as raw JSX. Should use `<CodeBlock>`.
9. Lines 308–326: `<CodeBlock language="tsx">` (dynamic classes) — COMPLIANT
10. Lines 339–363: `<CodeBlock language="tsx">` (TaskCard) — COMPLIANT
11. Lines 380–391: `<CodeBlock language="tsx">` (fetch on mount) — COMPLIANT

4 CodeBlocks — COMPLIANT. **3 violations** (flexbox, grid, state variants). 3 borderline.

---

### Activity

**Detailing**
- Challenge 1.1 (Scaffold): 7 tasks for Vite + React + Tailwind setup. TerminalBlock with exact commands. Good.
- Challenge 3.1 (React Router): 4 tasks with hint for basic router setup. Adequate.
- Challenge 3.2 (Fetch Real Data): 4 tasks emphasizing loading and error states. Good.
- Challenge 3.3 (Remaining Views): 3 tasks — thin for the most substantial challenge.
- Challenge 4.1 (E2E Test): 4 tasks for full-stack verification via UI + API /docs. Good.
- Challenge 4.2 (PR and Board Update): 6 tasks — commit, push, PR closing Issue #3, board update, evidence requirements. Excellent.

**Project Connection**
- Directly builds the project frontend — the core Week 9 deliverable.
- PR closes Issue #3 on the project board.
- "All 3 issues should now be in Done" — good milestone checkpoint.
- PR description requires screenshot, data persistence proof, and running URL.

**Feasibility**
- Ambitious but achievable for 90 minutes if students followed the lectures and have the backend running.
- Tailwind configuration step in 1.1 may slow students who haven't used PostCSS before.

**Positives**
- Well-structured: scaffold → router → fetch → views → E2E test → PR.
- 5 clear requirements with checkmarks. Unambiguous.
- "No hardcoded mock data" requirement enforces real API integration.
- Loading and error states requirement enforces production-quality UX.

**Negatives**
- **BUG — Wrong week number**: Header says `week={7}`, function named `Week7Activity`. File is in `week-9/`.
- Broken JSX indentation in header (line 23).
- Activity's next: "Scrum, Kanban & Sprint Cycles" → week-10/lecture-1 — **WRONG label**. The actual week-10/lecture-1 is "JWT, Sessions & Protecting Routes" (Auth).

**Gaps**
- No TypeScript guidance despite `react-ts` template.
- No Tailwind configuration walkthrough (step says "Configure tailwind.config.js" but no example).
- No fetch error handling code example — only prose.
- No React Router link/nav styling guidance.

**Component Compliance**
1. Lines 51–59: `<TerminalBlock>` (Vite + Tailwind) — COMPLIANT
2. Lines 69–82: Requirements checklist — ACCEPTABLE.

1 TerminalBlock — COMPLIANT. 0 violations.

---

### Week 9 Overall

**Positives**
- Excellent React and Tailwind teaching content. Lecture 1 is one of the best lectures in the course (9 CodeBlocks, clear mental models, progressive structure). Lecture 2 covers Tailwind comprehensively with API integration.
- The Activity delivers a real frontend connected to the live backend — a major project milestone.
- Project board integration continues — PR closes Issue #3 with evidence requirements.

**Negatives**
- All three files have wrong week number (`week={7}` instead of `week={9}`) and wrong function names.
- Lecture 2 has 3 violations (CSS reference tables as raw JSX).
- Several footer nav labels are wrong.

**Gaps**
- `useContext` not taught — students need it for auth (next week).
- TypeScript never formally introduced despite `.tsx` usage throughout.

---

### Transition: Week 9 → Week 10

- The Activity's footer nav incorrectly labels the next link as "Scrum, Kanban & Sprint Cycles" but correctly links to `week-10/lecture-1`. The actual content at that URL is "JWT, Sessions & Protecting Routes" (Auth). The label should be updated.
- Students arrive at Week 10 with a running full-stack app (Docker backend + React frontend). Auth is the logical next step.

---

## Week 10 — Auth & Security

> **Note on file locations:** The `index.tsx` lists Week 9 as "Auth (JWT, OAuth, Sessions)" / "Security Best Practices". The actual auth content lives in `week-10/` with wrong metadata — function names say `Week9*` and headers say `week={9}`.

### Lecture 1

**Positives**
- Strong auth lecture covering the full stack: backend JWT creation → protected routes → frontend token storage → protected React routes.
- Clear distinction between authentication ("who are you?") and authorization ("what are you allowed to do?").
- JWT flow explained well: login → issue token → store → send on every request → validate.
- "Never put secrets in the payload" — important security point.
- ProtectedRoute pattern with React Router's Outlet — practical and reusable.
- "Protecting the frontend route only hides the UI — always enforce auth on the backend" — critical security lesson.
- TerminalBlocks for pip install and curl testing — practical.

**Negatives**
- **BUG — Wrong week number**: Header says `week={9}`, function named `Week9Lecture1`. File is in `week-10/`.
- **VIOLATION — Login endpoint** (lines 69–99): Python code rendered as raw JSX `<pre>` with `text-zinc-300`/`bg-zinc-950`. Should use `<CodeBlock language="python" title="auth.py — login and create token">`.
- **VIOLATION — get_current_user** (lines 109–137): Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
- **VIOLATION — Frontend login + fetch** (lines 150–171): JavaScript code as raw JSX `<pre>`. Should use `<CodeBlock language="javascript">`.
- **VIOLATION — ProtectedRoute** (lines 181–202): TSX code as raw JSX `<pre>`. Should use `<CodeBlock language="tsx">`.
- **4 violations** — every substantive code example is raw JSX `<pre>`. Zero CodeBlocks.
- Footer nav prev: "Sprint 1 Review & Backlog for Sprint 2" → week-9/activity — **WRONG label**. week-9/activity is "Build Your Frontend".

**Gaps**
- No refresh token discussion (important for production JWT auth).
- No token expiration handling on the frontend.
- No registration endpoint — only login. Students need a way to create test users.
- No `useContext` tutorial for AuthContext — the ProtectedRoute imports `useAuth()` but that hook is never defined.

**Component Compliance**
1. Lines 62–67: `<TerminalBlock>` (pip install) — COMPLIANT
2. Lines 69–99: **VIOLATION** — Login Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
3. Lines 109–137: **VIOLATION** — get_current_user as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
4. Lines 150–171: **VIOLATION** — Frontend login JS as raw JSX `<pre>`. Should use `<CodeBlock language="javascript">`.
5. Lines 156–162: `<TerminalBlock>` (curl test) — COMPLIANT
6. Lines 181–202: **VIOLATION** — ProtectedRoute TSX as raw JSX `<pre>`. Should use `<CodeBlock language="tsx">`.

2 TerminalBlocks — COMPLIANT. **0 CodeBlocks. 4 violations.**

---

### Lecture 2

**Positives**
- Practical RBAC implementation: `get_current_user` + `require_admin` dependency chain.
- Resource-level authorization ("only owner can update their note") — important pattern.
- Frontend AuthContext pattern with token, useEffect, and logout — practical.
- "Keeping Secrets Safe" section reinforces env vars, .env, .gitignore, bcrypt.
- TerminalBlock for curl testing protected routes — practical.
- "Document your auth flow in the README" tip — good.

**Negatives**
- **BUG — Wrong week number**: Header says `week={9}`, function named `Week9Lecture2`. File is in `week-10/`.
- **VIOLATION — get_current_user + require_admin** (lines 51–86): Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
- **VIOLATION — Protected routes usage** (lines 89–112): Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
- **VIOLATION — AuthContext.tsx** (lines 122–150): React code as raw JSX `<pre>`. Should use `<CodeBlock language="tsx">`.
- **3 violations** — all code examples are raw JSX `<pre>`.
- Significant overlap with Lecture 1 — `get_current_user` dependency is essentially duplicated.
- Relatively short lecture (~25–30 min of content for a 90-min session).

**Gaps**
- No OAuth implementation (mentioned as future extension only).
- No token refresh mechanism.
- No backend logout endpoint.

**Component Compliance**
1. Lines 51–86: **VIOLATION** — Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
2. Lines 89–112: **VIOLATION** — Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
3. Lines 122–150: **VIOLATION** — TSX code as raw JSX `<pre>`. Should use `<CodeBlock language="tsx">`.
4. Lines 156–162: `<TerminalBlock>` (curl test) — COMPLIANT

1 TerminalBlock — COMPLIANT. **0 CodeBlocks. 3 violations.**

---

### Activity

**Detailing**
- Challenge 1.1 (User Model): 3 tasks — users table, bcrypt hashing, user creation mechanism. ActivityHint for FastAPI.
- Challenge 1.2 (Login Endpoint): 4 tasks — POST /login, credential check, JWT with sub/exp, env var for secret.
- Challenge 1.3 (Protected Route): 2 tasks — JWT validation dependency, apply to one endpoint.
- Challenge 2.1 (Frontend Login): 3 tasks — login form, token storage, Authorization header on requests.
- Challenge 2.2 (Protected Route UI): 2 tasks — redirect to login if no token, protected page calls protected API.

**Project Connection**
- Directly adds auth to the project — essential for production-quality app.
- Callout references "Weeks 4–7" — should be adjusted for actual numbering.
- "Bring your project to Coworking for review" — good peer review suggestion.

**Feasibility**
- Moderate scope: 5 challenges with 14 tasks total. Achievable in 90 minutes for students who followed both lectures carefully.
- The lack of a `useContext`/AuthContext tutorial in lectures may slow students at Challenge 2.1.

**Positives**
- Well-structured: backend users → login → protected route → frontend login → protected page.
- Security emphasized: bcrypt, env vars for JWT_SECRET, no plain text passwords.

**Negatives**
- **BUG — Wrong week number**: Header says `week={9}`, function named `Week9Activity`. File is in `week-10/`.
- **No project board integration** — no issue to close, no PR requirement, no board update. Breaks Agile cadence.
- Activity callout says "Weeks 4–7" — should match actual week numbering.

**Gaps**
- No PR or board update — the Agile workflow drops out after Week 9 (Build Frontend).
- No expected test output examples.
- No seed script guidance for creating test users.

**Component Compliance**
No code blocks. 0 violations.

---

### Week 10 Overall

**Positives**
- Comprehensive auth coverage across backend and frontend. Practical patterns students can copy directly.
- Security messaging is strong throughout: bcrypt, env vars, HTTPS, "never trust the client".
- RBAC with resource-level permissions — appropriate depth for this audience.

**Negatives**
- All three files have wrong week number (`week={9}` instead of `week={10}`) and wrong function names.
- **7 violations across the two lectures** — every code example is raw JSX `<pre>`. Zero CodeBlocks in the entire week. This is the worst compliance week tied with Week 7 Lecture 1.
- Lecture 2 overlaps significantly with Lecture 1 (`get_current_user` duplicated).
- No project board integration in the Activity.

**Gaps**
- `useContext` not taught despite being required for AuthContext pattern.
- No refresh tokens, no OAuth implementation, no registration endpoint.

---

### Transition: Week 10 → Week 11

- The Activity's footer nav correctly points to "Vercel, Railway & What Production Means" → `week-11/lecture-1`. Correct link and label.
- Students arrive at Week 11 with a deployed backend, React frontend, and auth. Deployment is the logical final step before polish.

---

## Week 11 — Deployment

### Lecture 1

**Positives**
- **Correct metadata**: `week={11}`, function `Week11Lecture1()` — first correct metadata since Week 5.
- Practical deployment lecture covering frontend (Vercel) and backend (Railway) — the two most common platforms for this stack.
- CORS section for production frontend origin — essential and well-placed.
- "What Can Go Wrong" section (04) covers the 4 most common deployment issues: localhost in production, CORS, 502/503, missing env vars.
- TerminalBlocks for build verification and start command — practical.
- Strong security callout: never commit production secrets.
- `0.0.0.0` binding explanation — catches a common deployment mistake.

**Negatives**
- **VIOLATION — CORS middleware** (lines 63–82): Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
- **VIOLATION — Procfile** (lines 99–107): File content as raw JSX `<pre>`. Should use `<CodeBlock language="bash">`.
- Footer nav prev: "Pipeline for Your Repo" → `week-10/activity` — **WRONG label**. The actual `week-10/activity` is "Auth on Your Project".

**Gaps**
- No custom domain setup walkthrough.
- No HTTPS/SSL discussion.
- No monitoring or logging guidance.
- No rollback strategy.

**Component Compliance**
1. Lines 49–55: `<TerminalBlock>` (build verification) — COMPLIANT
2. Lines 63–82: **VIOLATION** — CORS Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
3. Lines 93–98: `<TerminalBlock>` (start command) — COMPLIANT
4. Lines 99–107: **VIOLATION** — Procfile as raw JSX `<pre>`. Should use `<CodeBlock language="bash">`.

2 TerminalBlocks — COMPLIANT. **0 CodeBlocks. 2 violations.**

---

### Lecture 2

**Positives**
- **Correct metadata**: `week={11}`, function `Week11Lecture2()`.
- Practical production DB concerns: connection strings, env vars, migrations, backups.
- `postgres://` → `postgresql://` fix — catches a real Railway/SQLAlchemy gotcha.
- Alembic workflow in TerminalBlock — comprehensive (init → revision → upgrade → deploy command).
- Production checklist (section 04) — excellent 6-item summary.
- "Keep migrations reversible" tip — production-grade advice.

**Negatives**
- **VIOLATION — DATABASE_URL Python code** (lines 47–68): Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
- Relatively short (4 sections, ~20 min of content).

**Gaps**
- No practical Railway/Render DB provisioning walkthrough (conceptual only).
- No SQL dump/restore commands.
- No migration conflict resolution for teams.

**Component Compliance**
1. Lines 47–68: **VIOLATION** — Python code as raw JSX `<pre>`. Should use `<CodeBlock language="python">`.
2. Lines 79–89: `<TerminalBlock>` (Alembic workflow) — COMPLIANT

1 TerminalBlock — COMPLIANT. **0 CodeBlocks. 1 violation.**

---

### Activity

**Detailing**
- Challenge 1.1 (Backend Live): 3 tasks — deploy to Railway, set env vars, verify /docs.
- Challenge 2.1 (Frontend Live): 4 tasks — deploy to Vercel, set VITE_API_URL, configure CORS, verify.
- Challenge 3.1 (README and Demo): 3 tasks — deployment section in README, live URLs, demo prep.

**Project Connection**
- Directly deploys the project — the culmination of Weeks 4–10.
- Live URLs in README — portfolio-ready.
- Demo prep ties into Week 12.

**Feasibility**
- Moderate: 3 challenges with 10 tasks. Could be done in 45–60 minutes if students have accounts on Vercel/Railway.
- Account creation and platform onboarding may add time.

**Positives**
- Correct metadata: `week={11}`, function `Week11Activity()`.
- Clear 3-step progression: backend → frontend → documentation.
- "Document how you did it so a stranger could reproduce the deploy" — excellent framing.

**Negatives**
- **No project board integration** — no issue to close, no PR requirement, no board update.
- Thin scope for a 90-minute session.
- No troubleshooting guidance (what to do when deploy fails).

**Gaps**
- No verification of existing features working in production (auth, Redis cache, etc.).
- No DNS/HTTPS discussion.
- No post-deploy smoke test checklist.

**Component Compliance**
No code blocks. 0 violations.

---

### Week 11 Overall

**Positives**
- **Correct metadata** across all three files — the first fully correct week since Week 5.
- Practical deployment coverage for the most common platforms (Vercel + Railway).
- Production checklist and Alembic migration workflow are production-grade content.

**Negatives**
- 3 violations across the two lectures (CORS, Procfile, DATABASE_URL — all raw JSX `<pre>`).
- Both lectures are short — combined they might fill one 90-minute lecture.
- No project board integration in the Activity.

**Gaps**
- No HTTPS/custom domains, no monitoring, no rollback strategy.

---

### Transition: Week 11 → Week 12

- The Activity's footer nav correctly points to "README, Docs & Open Source Habits" → `week-12/lecture-1`. Correct label and link.
- Students arrive at Week 12 with a deployed full-stack app. Polish and presentation are the natural final step.

---

## Week 12 — Retrospective & Portfolio Polish

### Lecture 1

**Positives**
- **Correct metadata**: `week={12}`, function `Week12Lecture1()`.
- Excellent README lecture — the complete README template (section 03) is copy-pasteable and covers all 8 essential sections.
- `.env.example` explained with practical example.
- "Write for a stranger" framing — excellent.
- Quick README checklist (section 05) — actionable and verifiable.
- TerminalBlock for first-time setup workflow — practical.
- Open source habits section with contributing guidelines and license — forward-looking.

**Negatives**
- **VIOLATION — README template** (lines 62–131): Markdown file content as raw JSX `<pre>`. Should use `<CodeBlock language="markdown" title="README.md">`.
- **VIOLATION — .env.example** (lines 144–157): File content as raw JSX `<pre>`. Should use `<CodeBlock language="bash" title=".env.example">`.

**Gaps**
- No GitHub README rendering tips (badges, shields.io, etc.).
- No CHANGELOG walkthrough (mentioned in passing only).
- No license file creation.

**Component Compliance**
1. Lines 62–131: **VIOLATION** — README template as raw JSX `<pre>`. Should use `<CodeBlock language="markdown">`.
2. Lines 144–157: **VIOLATION** — .env.example as raw JSX `<pre>`. Should use `<CodeBlock language="bash">`.
3. Lines 159–167: `<TerminalBlock>` (first-time setup) — COMPLIANT

1 TerminalBlock — COMPLIANT. **0 CodeBlocks. 2 violations.**

---

### Lecture 2

**Positives**
- **Correct metadata**: `week={12}`, function `Week12Lecture2()`.
- Practical demo script template (section 02) — students fill in brackets and present. Actionable.
- Polish checklist — every item is verifiable (README, .env.example, tests, CI, live app, demo script).
- Retro template (section 03) is simple and effective.
- "Your one takeaway doesn't have to be technical" — authentic and encouraging.
- "Open the live URL in incognito" — great practical demo advice.
- Sprint 1 vs Final Sprint distinction clearly framed.

**Negatives**
- **VIOLATION — Demo script** (lines 52–77): Template text as raw JSX `<pre>`. Should use `<CodeBlock language="text" title="Demo script (3–5 min)">`.
- **VIOLATION — Retro template** (lines 108–128): Markdown template as raw JSX `<pre>`. Should use `<CodeBlock language="markdown" title="Final retro">`.
- "Week 8 was your first sprint review" (line 31) — per the actual file layout, there is no sprint review in Week 8 (which contains Testing/CI content). This reference is to intended curriculum, not actual content.
- Very short lecture (~15–20 min of content).

**Gaps**
- No peer feedback mechanism beyond "run a short retro with your cohort."
- No grading rubric or evaluation criteria.

**Component Compliance**
1. Lines 52–77: **VIOLATION** — Demo script as raw JSX `<pre>`. Should use `<CodeBlock language="text">`.
2. Lines 108–128: **VIOLATION** — Retro template as raw JSX `<pre>`. Should use `<CodeBlock language="markdown">`.

0 CodeBlocks. 0 TerminalBlocks. **2 violations.**

---

### Activity

**Detailing**
- Challenge 1.1 (Present Your Project): 3 tasks — demo live app, show README, share one takeaway.
- Challenge 1.2 (Celebrate): 2 tasks — acknowledge journey, optional retro.

**Project Connection**
- Final presentation of the project — capstone closure.
- Portfolio callout: "Keep your repo and live app public."
- Footer nav: next = "Back to Introduction to Fundamentals" → class index. Perfect final link.

**Feasibility**
- Very light: 2 challenges, 5 tasks. The activity time is the demo itself (~3–5 min per student) plus group retro.

**Positives**
- Correct metadata: `week={12}`, function `Week12Activity()`.
- Clean closure — "36-session journey from zero to full-stack."
- Portfolio-ready framing is motivating.

**Negatives**
- Very thin as an "activity" — only 5 tasks. Appropriate for a final session but significantly less structured than other weeks.
- No formal feedback mechanism.

**Gaps**
- No portfolio guidance beyond "keep it public" (LinkedIn, resume, etc.).
- No "what's next" roadmap (intermediate courses, open source, etc.).

**Component Compliance**
No code blocks. 0 violations.

---

### Week 12 Overall

**Positives**
- **Correct metadata** across all three files.
- Excellent README lecture with copy-pasteable template — one of the most directly useful lectures in the course.
- Demo prep with script and polish checklist — practical and actionable.
- Retro template closes the 12-week journey with reflection.
- Clean final nav link back to class index.

**Negatives**
- 4 violations across the two lectures (README, .env.example, demo script, retro template — all raw JSX `<pre>`).
- Both lectures are short — combined they fill one 90-minute lecture, not two.
- The Activity is thin (5 tasks), appropriate for a final session but under-scoped as a standalone activity.

**Gaps**
- No portfolio/career guidance.
- No "what's next" roadmap.
- "Week 8 was your first sprint review" reference is inaccurate per actual file content.

---

## Entire Curriculum Assessment

---

### 1. Structural Alignment: `index.tsx` vs Actual File Content

The `index.tsx` defines the schedule students see on the class homepage. The table below maps each week's intended topic (per index) against what actually lives in the `week-N/` directory.

| Week | index.tsx Title (L1 / L2) | Actual File Content | `week={}` in Header | Function Names | Status |
|------|--------------------------|--------------------|--------------------|----------------|--------|
| 1 | Linux & Command Line / Shell Scripting & Cron | Matches | `1` | `Week1*` | ✅ Correct |
| 2 | Trees, Stacks & Queues / Hash Maps, Complexity & Interview Patterns | **Advanced graph algorithms / OOP design patterns (C++)** | `2` | `Week2*` | ❌ Title–content mismatch |
| 3 | Classes, Encapsulation & Inheritance / Polymorphism, STL & System Design | Matches (C++ OOP) | `3` | `Week3*` | ✅ Correct |
| 4 | Version Control with Git / GitHub, Agile & Project Management | Matches | `4` | `Week4*` | ✅ Correct |
| 5 | Scrum, Kanban & Sprint Cycles / Backlog Design & Issue Writing | Matches | `5` | `Week5*` | ✅ Correct |
| 6 | Package Managers & Environments / Docker & Containerization | Matches | **`5`** | **`Week5*`** | ⚠️ Wrong metadata |
| 7 | FastAPI & Python Backends / Databases: SQL, SQLite & Redis | Matches | **`6`** | **`Week6*`** | ⚠️ Wrong metadata |
| 8 | React Components & Hooks / State Management & API Integration | **Testing & CI/CD (Week 10 content)** | **`10`** | **`Week10*`** | ❌ Wrong content entirely |
| 9 | Auth (JWT, OAuth, Sessions) / Security Best Practices | **React Components & Hooks / Tailwind & API** | **`7`** | **`Week7*`** | ❌ Wrong content |
| 10 | Vitest & Testing / GitHub Actions & Coverage | **Auth: JWT, RBAC, User Context** | **`9`** | **`Week9*`** | ❌ Wrong content |
| 11 | Vercel, Railway & Production / DNS, HTTPS & Monitoring | Matches (Deployment + Production DB) | `11` | `Week11*` | ✅ Correct |
| 12 | Retrospective & Portfolio Polish | Matches (README, Demo, Retro) | `12` | `Week12*` | ✅ Correct |

**Summary**: 6 of 12 weeks have fully correct alignment. 1 week (Week 2) has correct metadata but wrong content vs title. 2 weeks (6, 7) have correct content but wrong metadata. 3 weeks (8, 9, 10) have content from a completely different week.

**Root cause hypothesis**: Weeks 6–10 appear to have been renumbered at some point (likely when Sprint Planning was inserted as Week 5), but the renumbering was incomplete — some files were moved to new directories without updating their internal metadata, and some files landed in the wrong directory entirely.

---

### 2. Component Compliance Census

Every code block, terminal command, and file content rendering across all 36 files was checked against the two approved components (`<CodeBlock>` and `<TerminalBlock>`). Below is the per-week violation count.

| Week | Lecture 1 | Lecture 2 | Activity | Total Violations | Total Compliant Blocks | Borderline |
|------|-----------|-----------|----------|-----------------|----------------------|------------|
| 1 | 1 (pkg mgr grid) | 5 (bash scripts) | 0 | **6** | 17 TB | 2 |
| 2 | 0 | 0 | 0 | **0** | ~8 CB | 3 |
| 3 | 0 | 0 | 0 | **0** | ~10 CB | 2 |
| 4 | 2 (conflict markers, .gitignore) | 0 | 0 | **2** | ~14 TB | 2 |
| 5 | 0 | 0 | 0 | **0** | ~3 | 5+ |
| 6 | 1 (package.json) | 0 | 1 (Flask stub) | **2** | 7 TB + 3 CB | 3 |
| 7 | 6 (all Python code) | 0 | 1 (Redis pattern) | **7** | 3 TB + 9 CB | 4 |
| 8 | 0 | 0 | 0 | **0** | 2 CB + 2 TB | 0 |
| 9 | 0 | 3 (flex/grid/variants) | 0 | **3** | 9 CB + 1 TB + 4 CB | 5 |
| 10 | 4 (login, auth, frontend, route) | 3 (auth, routes, context) | 0 | **7** | 2 TB | 0 |
| 11 | 2 (CORS, Procfile) | 1 (DATABASE_URL) | 0 | **3** | 2 TB + 1 TB | 0 |
| 12 | 2 (README, .env.example) | 2 (demo script, retro) | 0 | **4** | 1 TB | 0 |
| **TOTAL** | **18** | **14** | **2** | **34** | | |

> **Note on counting**: "~42" was cited earlier; the refined count is **34 clear violations** plus **~26 borderline cases** (diagrams, cards, visual references using hardcoded colors that are illustrative rather than executable code). The borderline cases are not violations per the audit standard but should be reviewed for design system consistency.

**Violation patterns**:
- **Weeks 1–7**: Raw `<div>/<p>` JSX with hardcoded Tailwind color classes (`text-blue-400`, `text-emerald-300`, etc.) and `select-none`. Used for bash scripts, JSON content, Python code.
- **Weeks 10–12**: Raw `<pre>` blocks with `bg-zinc-950 text-zinc-300` and template literals. Used for Python, JavaScript, TypeScript, YAML, Markdown, and text templates.
- **Week 9**: Mix of both patterns — Lecture 1 uses `<CodeBlock>` correctly (9 blocks), Lecture 2 uses raw JSX for CSS reference tables.

**Best compliance**: Week 7 Lecture 2 (9 CodeBlocks, 0 violations), Week 8 (all 3 files, 0 violations), Week 9 Lecture 1 (9 CodeBlocks, 0 violations).
**Worst compliance**: Week 7 Lecture 1 (6 violations, 0 CodeBlocks), Week 10 full week (7 violations, 0 CodeBlocks across both lectures).

---

### 3. Footer Navigation Audit

Every `LectureFooterNav` was checked for correct URL and correct label. Below are all identified issues.

| File | Link | Label Says | Actual Content at URL | Issue |
|------|------|-----------|----------------------|-------|
| Week 1 Activity | next | "Version Control with Git" | Week 2 L1: Advanced graph algorithms (C++) | Wrong label (or wrong content at URL) |
| Week 4 Activity | next | "Containers with Docker" | Week 5 L1: Scrum, Kanban & Sprint Cycles | Wrong label |
| Week 6 L1 | prev | "Project Kickoff" → week-4/activity | Correct content but skips Week 5 entirely | Wrong URL (should be week-5/activity) |
| Week 8 L1 | prev | "Auth on Your Project" → week-7/activity | Week 7 Activity: "Build Your Backend" | Wrong label |
| Week 8 Activity | next | "Vercel, Railway & What Production Means" → week-9/lecture-1 | Week 9 L1: React Components & Hooks | Wrong label |
| Week 9 Activity | next | "Scrum, Kanban & Sprint Cycles" → week-10/lecture-1 | Week 10 L1: JWT, Sessions & Protecting Routes | Wrong label |
| Week 10 L1 | prev | "Sprint 1 Review & Backlog for Sprint 2" → week-9/activity | Week 9 Activity: "Build Your Frontend" | Wrong label |
| Week 11 L1 | prev | "Pipeline for Your Repo" → week-10/activity | Week 10 Activity: "Auth on Your Project" | Wrong label |

**Pattern**: Most label mismatches are caused by the content shuffle in Weeks 6–10. The URLs are usually correct (pointing to the right sequential file), but the labels describe content that was at that URL *before* the reordering.

---

### 4. The Fundamentals Project Thread

The Fundamentals Project is the course's signature element: a full-stack app built incrementally from Week 4 to Week 12. Below is how the project progresses through the curriculum.

| Week | Project Milestone | Issue Closed | PR Required | Board Update |
|------|------------------|-------------|-------------|--------------|
| 4 | **Project Kickoff**: Choose domain, scaffold repo, GitHub Project board, first PR | — (premature close bug) | ✅ | ✅ |
| 5 | **Sprint Roadmap**: Create all issues for Weeks 6–11 on board | — | — | ✅ (implicit) |
| 6 | **Containerize Backend**: Dockerfile, volumes, base image comparison | Issue #1 | ✅ | ✅ |
| 7 | **Build Backend**: FastAPI + SQLAlchemy + Redis + Docker Compose | Issue #2 | ✅ (with evidence) | ✅ |
| 9* | **Build Frontend**: React + Tailwind + React Router + API integration | Issue #3 | ✅ (with evidence) | ✅ |
| 10* | **Add Auth**: Users table, login, JWT, protected routes (backend + frontend) | — | — | — |
| 8* | **Add Testing/CI**: At least one test + GitHub Actions workflow | — | — | — |
| 11 | **Deploy**: Frontend on Vercel, backend on Railway, production DB | — | — | — |
| 12 | **Final Demo**: Present live app, share README, one takeaway | — | — | — |

> *Weeks marked with asterisks are in their actual file order, not the index order.

**Observations**:
- The Agile cadence (PR → close issue → board update) is strong from Weeks 4–9 (Issues #1–#3 closed via PRs with evidence).
- **Weeks 10–12 drop all project board ceremony**: no issues closed, no PRs required, no board updates. The sprint roadmap created in Week 5 maps issues to Weeks 6–11, but only Weeks 6–9 actually close issues. This means students create issues they never formally close.
- **The "Closes #N" bug** in Week 4 Activity: students are told to write "Closes #1, Closes #2, Closes #3" in their first PR, which would prematurely close Issues #2 and #3 (intended for future weeks).
- **Flask → FastAPI transition**: Week 6 Activity containerizes a Flask stub. Week 7 introduces FastAPI. The transition is never addressed — students need to know to replace the Flask stub.
- **Project timeline references are inconsistent**: Week 4 Activity says "Wk 4–8" in one place and "Wk 4–12" in another.

---

### 5. Pacing & Content Density Analysis

Each session is nominally 90 minutes. Below is an estimated content density assessment.

| Week | Lecture 1 | Lecture 2 | Activity |
|------|-----------|-----------|----------|
| 1 | ●●●●○ (70 min — dense, 8 sections) | ●●●●○ (70 min — 7 sections, scripting) | ●●●●○ (70 min — 5 challenges) |
| 2 | ●●●●● (90+ min — advanced C++ algos) | ●●●●● (90+ min — SOLID, design patterns) | ●●●○○ (50 min — 3 challenges in Python) |
| 3 | ●●●●○ (70 min — C++ classes, inheritance) | ●●●●● (90+ min — polymorphism, STL, Big-O, problem-solving) | ●●●●● (90+ min — ambitious C++ phonebook) |
| 4 | ●●●●● (90 min — comprehensive Git) | ●●●○○ (50 min — GitHub, Agile intro) | ●●●●○ (70 min — project setup) |
| 5 | ●●●●○ (70 min — Agile theory, heavy overlap with 4L2) | ●●○○○ (30 min — short backlog lecture) | ●●○○○ (30 min — issue creation) |
| 6 | ●●●●○ (70 min — 4 package managers + semver) | ●●●●● (90 min — Docker comprehensive) | ●●●●○ (70 min — Dockerfile + volumes) |
| 7 | ●●●●● (90 min — full FastAPI stack) | ●●●●● (90 min — SQL + SQLAlchemy + FastAPI) | ●●●●● (90+ min — backend + Redis + docs + PR) |
| 8* | ●●●○○ (40 min — testing overview) | ●●○○○ (25 min — CI/CD overview) | ●●○○○ (30 min — one test + workflow) |
| 9* | ●●●●● (90 min — React mental model through composition) | ●●●●● (90 min — Tailwind + API integration) | ●●●●○ (70 min — full frontend build) |
| 10* | ●●●●○ (60 min — JWT + protected routes) | ●●●○○ (30 min — RBAC, overlaps with L1) | ●●●○○ (50 min — auth implementation) |
| 11 | ●●●○○ (40 min — Vercel + Railway) | ●●○○○ (25 min — production DB) | ●●○○○ (40 min — deploy + docs) |
| 12 | ●●●○○ (40 min — README + .env.example) | ●●○○○ (20 min — demo prep + retro) | ●○○○○ (10 min + demos) |

> Scale: ○ = ~0 min, ● = ~18 min. Five dots = fills a 90-minute session.

**Observations**:
- **Weeks 2, 3, 7** are overloaded — each has at least one lecture or activity that likely exceeds 90 minutes for the target audience (beginner CS students).
- **Weeks 5, 8, 11, 12** are underloaded — multiple sessions could be completed in under 30 minutes. Week 5 L2 + Activity combined is one 60-minute session. Week 8 (Testing/CI) is one 90-minute lecture spread across three files.
- **Week 7** is the densest week overall: Lecture 1 (full FastAPI), Lecture 2 (full SQL/ORM), Activity (backend + Redis + Docker Compose + API docs + PR). Three 90-minute sessions back to back.
- **Week 12** is the lightest: the Activity is essentially "present and celebrate" — appropriate for a final session but thin if students finish early.

---

### 6. Prerequisite Chain Analysis

Several topics are used before being taught, creating invisible prerequisite gaps.

| Concept | First Used | First Taught | Gap |
|---------|-----------|-------------|-----|
| `echo` command | Week 1 Activity (Challenge 1.4) | Week 1 Lecture 2 (briefly, in scripts) | Partial — used in Activity before formal shell scripting lecture |
| File redirection (`>`, `>>`) | Week 1 Activity (Challenge 1.4) | Never formally taught | **Full gap** |
| C++ syntax (types, main, cout) | Week 2 Lecture 1 (C++ code examples) | Never formally taught | **Full gap** — C++ primer missing |
| BST deletion algorithm | Week 3 Activity (deleteContact) | Never taught | **Full gap** |
| `useContext` hook | Week 10 L1 (ProtectedRoute uses `useAuth()`) | Never taught | **Full gap** |
| TypeScript syntax | Week 9 L1 (all `.tsx` files, interfaces) | Never formally taught | **Full gap** |
| Redis commands (`get`, `setex`, TTL) | Week 7 Activity (Challenge 3.3) | Week 7 L2 (one sentence in a callout) | **Near-full gap** |
| Docker installation | Week 6 L2 + Activity | Never addressed | **Full gap** — assumes Docker Desktop installed |
| React Router | Week 9 Activity (Challenge 3.1) | Week 9 L2 mentions it in passing | **Partial gap** — no dedicated teaching |

---

### 7. Overall Positives

- **Breadth is genuinely impressive**: Linux CLI → shell scripting → DSA → C++ OOP → Git → GitHub → Agile → Docker → FastAPI → SQL → React → Tailwind → Auth → Testing → CI/CD → Deployment → Documentation in 12 weeks. This covers the full modern development stack.
- **The Fundamentals Project** is the course's strongest structural element. Students incrementally build a real, deployed, tested, authenticated full-stack app with a project board. Weeks 4–9 execute this exceptionally well with PR evidence, issue tracking, and accountability.
- **Component library is well-designed**: `LectureTermWithTip`, `LectureCmd`, `LectureCallout`, `ActivityChallenge`, `ActivityTask`, `ActivityHint` provide consistent UX. When used correctly (as in Week 7 L2 and Week 9 L1), the lectures are clear, navigable, and visually polished.
- **Standout lectures**: Week 7 Lecture 2 (SQL/SQLAlchemy — 9 compliant CodeBlocks, textbook progression), Week 9 Lecture 1 (React — 9 compliant CodeBlocks, excellent mental model), Week 6 Lecture 2 (Docker — perfect compliance, Class:Object analogy), Week 4 Lecture 1 (Git — comprehensive, "Three Areas" model), and Week 12 Lecture 1 (README template — copy-pasteable, portfolio-ready).
- **Activity quality (Weeks 4–9)**: Well-detailed challenges with clear tasks, verification steps, hints, and PR/board integration. Week 7 Activity is the strongest single activity in the course.
- **Security messaging** is consistently strong throughout Weeks 7–12: bcrypt, env vars, never commit secrets, CORS, "never trust the client," JWT short expiration, separate auth/authz.
- **Callout usage**: Appropriate and consistent — `info` for context, `tip` for productivity advice, `warning` for dangerous operations. Never overused.
- **The "notes" domain example** is consistent across Weeks 7–10 (FastAPI, SQL, Auth all use the same notes/users schema), making it easy for students to follow the progression.

---

### 8. Overall Negatives

- **Systematic week number bugs**: 7 of 12 weeks have incorrect `week={N}` values and/or wrong function names. Only Weeks 1–5 and 11–12 have correct metadata.
- **Content misplacement is the single biggest issue**: The `index.tsx` schedule and actual file contents are severely misaligned for Weeks 6–10. Testing/CI (Week 10 per index) is in the `week-8/` directory; React (Week 8 per index) is in `week-9/`; Auth (Week 9 per index) is in `week-10/`. This means navigating by the index sends students to the wrong content.
- **34 component compliance violations**: Code, file contents, and reference tables rendered as raw JSX instead of `<CodeBlock>` or `<TerminalBlock>`. The worst offenders are Week 7 L1 (6 violations — all Python) and Week 10 L1+L2 (7 violations — all auth code). Additionally, ~26 borderline cases (diagrams with hardcoded colors).
- **Two distinct violation patterns**: Weeks 1–7 use raw `<div>/<p>` JSX with `select-none` and per-token color classes. Weeks 10–12 use raw `<pre>` blocks with template literals. Both should use `<CodeBlock>`.
- **At least 8 footer nav labels are wrong**: URLs are usually correct, but labels describe content that was at that URL before the week reordering.
- **Agile workflow drops off after Week 9**: Weeks 4–9 Activities include PR → issue closure → board update. Weeks 10–12 have none of this, breaking the cadence the course spent two weeks teaching.
- **Week 2 content is catastrophically misaligned with its titles**: "Trees, Stacks & Queues" contains advanced graph algorithms; "Hash Maps, Complexity & Interview Patterns" contains SOLID principles and OOP design patterns. The Activity covers topics (BST, MinStack, hash map) that neither lecture taught.
- **Content density is wildly uneven**: Week 7 has three 90-minute sessions; Week 12 has three sessions totaling ~70 minutes combined. Some activities take 30 minutes; others might exceed 90 for beginners.
- **Week 10 L1 and L2 overlap significantly**: Both lectures define a `get_current_user` dependency with nearly identical code.

---

### 9. Overall Gaps

**Structural gaps:**
- **React content is displaced**: The `week-8/` directory should contain React (per index) but contains Testing/CI instead. React lives in `week-9/`. There is no "State Management & API Integration" lecture as a standalone — it's partially merged into Week 9 Lecture 2's API connection section.
- **Sprint Review / Retro is missing from the first half**: Week 12 L2 references "Week 8 was your first sprint review" but no sprint review exists in any file before Week 12. The Sprint Planning content is in Week 5 but the corresponding review was never written.
- **Issues #4–#6 are never closed**: The Week 5 Activity creates issues for Weeks 6–11, but only Issues #1–#3 are formally closed (Weeks 6, 7, 9). Auth, Testing, and Deployment don't close issues on the board.

**Pedagogical gaps:**
- **C++ basics primer is absent**: C++ code appears in Week 2 and is the focus of Week 3, but basic syntax (`#include`, `main()`, `cout`/`cin`, types, compilation with `g++`) is never taught.
- **TypeScript is never introduced**: Students use `.tsx` files, TypeScript interfaces, and type annotations throughout the React weeks (9–10) without a formal introduction.
- **`useContext` is never taught**: The AuthContext pattern in Week 10 imports a `useAuth()` hook from an AuthContext that students must create, but React Context is never explained.
- **Redis instruction is critically thin**: The title "Databases: SQL, SQLite & Redis" promises Redis coverage, but Lecture 2 provides only one callout sentence. Students must implement a Redis cache in the Activity with no practical instruction.
- **BST deletion is required but not taught**: The Week 3 Activity requires `deleteContact` using BST deletion, which involves complex node-replacement logic never covered in any lecture.
- **Docker installation is assumed**: The Week 6 lectures and Activity require Docker Desktop but never address installation.
- **React Router is assumed**: The Week 9 Activity requires 3+ routes with React Router but no lecture covers it beyond a brief hint.
- **No formal assessment or rubric**: No grading criteria, no evaluation mechanism, no skill checkpoints beyond self-directed PR evidence.

---

### 10. Recommended Priority Fixes

Organized by impact and effort. Priority 1 items should be fixed before the next cohort runs the course.

**Priority 1 — Structural (blocks students from following the course):**

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1a | **Decide canonical week order**: Either move files to match `index.tsx` OR update `index.tsx` to match the file layout. The current state is untenable — the index sends students to wrong content. | Medium | Critical |
| 1b | **Fix `week={}` and function names** in all 7 affected weeks once order is decided. | Low (find-replace) | Critical |
| 1c | **Fix all 8+ footer nav labels** to match the actual content at each URL. | Low | High |
| 1d | **Fix Week 4 Activity "Closes #1, #2, #3" bug** — remove premature issue closures from the initial PR instructions. | Trivial | High |

**Priority 2 — Component compliance (degrades student experience):**

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 2a | **Convert all 34 violations to `<CodeBlock>`/`<TerminalBlock>`**. Highest density: Week 7 L1 (6 Python blocks), Week 10 L1+L2 (7 auth blocks), Week 9 L2 (3 CSS ref blocks), Week 12 L1+L2 (4 template blocks). | Medium (mechanical) | High |
| 2b | **Convert raw `<pre>` blocks (Weeks 10–12)** to `<CodeBlock>`. These are easier to convert since the code is already in template literals. | Low–Medium | High |
| 2c | **Audit borderline cases** (~26 diagrams/cards with hardcoded colors). Decide per case whether to use a component or leave as visual element. | Low | Medium |

**Priority 3 — Content gaps (affects learning outcomes):**

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 3a | **Add Redis instruction** to Week 7 Lecture 2: `redis-py` setup, `r.get()`, `r.setex()`, TTL concept, connection via Docker Compose hostname. ~2 sections. | Medium | High |
| 3b | **Add C++ basics primer** to Week 3 Lecture 1 (or as a new section 01): `#include`, `main()`, `cout`/`cin`, types, compilation with `g++`. ~1 section. | Medium | High |
| 3c | **Add `useContext` mini-tutorial** to Week 9 Lecture 1 or Week 10 Lecture 1, before students need it for AuthContext. ~1 section. | Low | Medium |
| 3d | **Fix Week 2 lecture titles** to match actual content, OR rewrite content to match titles. If keeping current content: "Graph Algorithms: BFS, DFS & Topological Sort" and "OOP Design: SOLID, Patterns & Smart Pointers". | Low (title fix) or High (content rewrite) | High |
| 3e | **Address Flask → FastAPI transition**: Add a note at the start of Week 7 L1 explaining that students should replace the Flask stub with FastAPI. | Trivial | Medium |
| 3f | **Add TypeScript primer**: Brief section in Week 9 L1 covering interfaces, type annotations, and why `.tsx`. | Low | Medium |

**Priority 4 — Pacing & Agile (polish):**

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 4a | **Restore Agile workflow** to Weeks 10–12 Activities: add PR requirements, issue closure, and board updates for Issues #4–#6. | Low | Medium |
| 4b | **Balance content density**: Consider splitting Week 7 into two weeks (FastAPI week + Database week) and merging Week 5 L2 + Activity into a single session. Similarly, Week 8 (Testing) and Week 11 (Deployment) lectures could each be condensed into one lecture + activity. | High (restructure) | Medium |
| 4c | **Add a Sprint Review session**: Insert between the backend sprint (Weeks 6–7) and the frontend sprint (Week 9) — a session where students demo what they've built so far and plan the second half. | Medium | Medium |
| 4d | **Add Docker installation guidance**: Brief callout or link at the start of Week 6 L2 or L1. | Trivial | Low |
| 4e | **Add "what's next" section** to Week 12 Activity: suggested intermediate courses, open source contribution paths, portfolio tips. | Low | Low |

---

### 11. Summary Statistics

| Metric | Value |
|--------|-------|
| Total weeks audited | 12 |
| Total files audited | 36 (12 × 3) |
| Weeks with correct metadata | 6 of 12 (Weeks 1–5, 11–12) |
| Weeks with misplaced content | 3 (Weeks 8, 9, 10) |
| Total component violations | 34 |
| Total borderline cases | ~26 |
| Total compliant CodeBlocks | ~55 |
| Total compliant TerminalBlocks | ~45 |
| Footer nav label errors | 8+ |
| Prerequisite gaps identified | 9 |
| Project issues created | 6 (per Week 5 roadmap) |
| Project issues formally closed via PR | 3 (#1, #2, #3) |
| Best compliance lecture | Week 7 L2 (9 CodeBlocks, 0 violations) |
| Worst compliance lecture | Week 7 L1 (6 violations, 0 CodeBlocks) |
| Densest week | Week 7 (three 90-min sessions) |
| Lightest week | Week 12 (~70 min across three sessions) |
