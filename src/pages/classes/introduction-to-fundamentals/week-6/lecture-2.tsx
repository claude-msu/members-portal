import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';
import { CppBlock } from '@/components/ui/cpp-block';

// ── BST diagram ───────────────────────────────────────────────────────────────
const BstDiagram = () => (
    <div className="my-8 rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs">
        <p className="text-muted-foreground text-xs mb-4">Binary Search Tree — left child &lt; parent &lt; right child</p>
        <div className="flex flex-col items-center gap-1 select-none">
            <div className="flex justify-center">
                <div className="rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-blue-700 dark:text-blue-300 font-bold">8</div>
            </div>
            <div className="flex justify-center gap-24 relative">
                <span className="text-muted-foreground text-lg">↙</span>
                <span className="text-muted-foreground text-lg">↘</span>
            </div>
            <div className="flex justify-center gap-16">
                <div className="rounded-lg border border-border bg-card px-4 py-2 text-foreground font-bold">3</div>
                <div className="rounded-lg border border-border bg-card px-4 py-2 text-foreground font-bold">10</div>
            </div>
            <div className="flex justify-center gap-2 relative">
                <span className="text-muted-foreground">↙ ↘</span>
                <span className="text-muted-foreground ml-12">↘</span>
            </div>
            <div className="flex justify-center gap-4">
                <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-muted-foreground text-xs">1</div>
                <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-muted-foreground text-xs">6</div>
                <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-muted-foreground text-xs ml-4">14</div>
            </div>
        </div>
        <div className="mt-4 space-y-1 text-muted-foreground">
            <p>Search 6: start at 8 → go left (6 &lt; 8) → reach 3 → go right (6 &gt; 3) → found. <span className="text-emerald-500">O(log n)</span></p>
            <p>In-order traversal (left → root → right): 1, 3, 6, 8, 10, 14 — always sorted.</p>
        </div>
    </div>
);

export default function Week6Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={6}
                session="Lecture 2"
                title="Polymorphism, STL & System Design"
                description="Abstract base classes, pure virtual methods, and STL containers — the tools you need to design a real system where types can be extended without rewriting the core."
                icon={<Cpu className="h-4 w-4" />}
            />

            {/* ── 01 POLYMORPHISM & THE FOUR OOP PRINCIPLES ───────────────────── */}
            <LectureSectionHeading number="01" title="Polymorphism & the Four OOP Principles" />

            <LectureP>
                Object-Oriented Programming organizes software around objects — data bundled with the functions that operate on it. C++ has full OOP support. These four principles are the vocabulary of software design interviews and the foundation of every large codebase you'll work in.
            </LectureP>

            <div className="my-6 space-y-4">
                {[
                    {
                        principle: 'Encapsulation',
                        color: 'text-blue-600 dark:text-blue-400',
                        border: 'border-blue-200 dark:border-blue-800',
                        bg: 'bg-blue-50 dark:bg-blue-950/20',
                        def: 'Bundle data and methods together. Hide internal state — expose only what users of the class need to know.',
                        why: 'Prevents external code from putting an object into an invalid state. You control all mutations.',
                    },
                    {
                        principle: 'Inheritance',
                        color: 'text-emerald-600 dark:text-emerald-400',
                        border: 'border-emerald-200 dark:border-emerald-800',
                        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                        def: 'A derived class automatically gets the data and methods of its base class and can extend or override them.',
                        why: 'Eliminates code duplication for related types. A Dog and Cat share Animal behavior without copying it.',
                    },
                    {
                        principle: 'Polymorphism',
                        color: 'text-orange-600 dark:text-orange-400',
                        border: 'border-orange-200 dark:border-orange-800',
                        bg: 'bg-orange-50 dark:bg-orange-950/20',
                        def: 'The same interface works for different underlying types. Call speak() on any Animal — each concrete type responds differently.',
                        why: 'Write code that works generically on a base type, and it automatically works for any derived type — without rewriting.',
                    },
                    {
                        principle: 'Abstraction',
                        color: 'text-purple-600 dark:text-purple-400',
                        border: 'border-purple-200 dark:border-purple-800',
                        bg: 'bg-purple-50 dark:bg-purple-950/20',
                        def: 'Expose what a class does, hide how it does it. Users of std::vector don\'t know about dynamic array resizing — and shouldn\'t need to.',
                        why: 'Reduces cognitive load. You can use a hash map without understanding hash functions. Good APIs are abstract.',
                    },
                ].map((item) => (
                    <div key={item.principle} className={`rounded-xl border ${item.border} overflow-hidden`}>
                        <div className={`px-4 py-2.5 ${item.bg}`}>
                            <p className={`text-xs font-black uppercase tracking-widest ${item.color}`}>{item.principle}</p>
                            <p className="text-xs text-foreground mt-1">{item.def}</p>
                        </div>
                        <div className="px-4 py-2.5">
                            <p className="text-xs text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">Why it matters:</span> {item.why}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 02 OOP IN C++ — VIRTUAL & PURE VIRTUAL ──────────────────────── */}
            <LectureSectionHeading number="02" title="OOP in C++ — Virtual & Pure Virtual" />

            <CppBlock
                title="encapsulation — Book class with private state"
                lines={[
                    'class Book {',
                    'private:',
                    '    string title;',
                    '    string author;',
                    '    bool checkedOut = false;',
                    '',
                    'public:',
                    '    // Constructor',
                    '    Book(string t, string a) : title(t), author(a) {}',
                    '',
                    '    // Getters — read-only access to private data',
                    '    string getTitle()  const { return title; }',
                    '    string getAuthor() const { return author; }',
                    '    bool isAvailable() const { return !checkedOut; }',
                    '',
                    '    // Methods that enforce valid state transitions',
                    '    bool checkout() {',
                    '        if (checkedOut) return false;  // already out',
                    '        checkedOut = true;',
                    '        return true;',
                    '    }',
                    '    void returnBook() { checkedOut = false; }',
                    '};',
                ]}
            />

            <CppBlock
                title="inheritance + polymorphism — virtual methods"
                lines={[
                    'class LibraryItem {',
                    'public:',
                    '    string id;',
                    '    string title;',
                    '    LibraryItem(string i, string t) : id(i), title(t) {}',
                    '',
                    '    // virtual = can be overridden by derived classes',
                    '    virtual string getType() const { return "Item"; }',
                    '    virtual int getLoanDays() const = 0;  // pure virtual = must override',
                    '',
                    '    // virtual destructor — always needed with inheritance',
                    '    virtual ~LibraryItem() {}',
                    '};',
                    '',
                    'class Book : public LibraryItem {',
                    'public:',
                    '    Book(string i, string t) : LibraryItem(i, t) {}',
                    '    string getType()  const override { return "Book"; }',
                    '    int getLoanDays() const override { return 21; }',
                    '};',
                    '',
                    'class DVD : public LibraryItem {',
                    'public:',
                    '    DVD(string i, string t) : LibraryItem(i, t) {}',
                    '    string getType()  const override { return "DVD"; }',
                    '    int getLoanDays() const override { return 7; }',
                    '};',
                    '',
                    '// Polymorphism in action — same code works for any LibraryItem',
                    'void printInfo(const LibraryItem& item) {',
                    '    cout << item.getType() << ": " << item.title',
                    '         << " — " << item.getLoanDays() << " day loan" << endl;',
                    '}',
                    '',
                    '// Usage:',
                    '// Book b("001", "Clean Code");',
                    '// DVD d("002", "Inception");',
                    '// printInfo(b);  → "Book: Clean Code — 21 day loan"',
                    '// printInfo(d);  → "DVD: Inception — 7 day loan"',
                ]}
            />

            <LectureCallout type="tip">
                Always declare destructors <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual</code> in base classes that have virtual methods. Without it, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete basePtr</code> will only call the base destructor — the derived class's destructor won't run, leaking memory.
            </LectureCallout>

            {/* ── 03 STL CONTAINERS ───────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="STL Containers — Your Toolbox" />

            <LectureP>
                The C++ Standard Template Library ships production-grade implementations of every data structure you'll need. Know these cold:
            </LectureP>

            <div className="my-6 rounded-xl border border-border overflow-hidden">
                {[
                    { container: 'vector<T>', use: 'Dynamic array. Use for ordered sequences, random access, iteration.', when: 'Default choice for a list of things.' },
                    { container: 'unordered_map<K,V>', use: 'Hash map. O(1) avg lookup/insert by key.', when: 'Counting frequencies, caching computed values, fast key lookup.' },
                    { container: 'unordered_set<T>', use: 'Hash set. O(1) avg membership test.', when: 'Deduplication, cycle detection, seen-before checks.' },
                    { container: 'map<K,V>', use: 'Sorted map (red-black tree). O(log n) ops. Keys always sorted.', when: 'Need keys in sorted order, range queries.' },
                    { container: 'stack<T>', use: 'LIFO adapter over deque. push/pop/top.', when: 'Parentheses matching, DFS, undo stacks.' },
                    { container: 'queue<T>', use: 'FIFO adapter. push/pop/front.', when: 'BFS, processing items in arrival order.' },
                    { container: 'priority_queue<T>', use: 'Max-heap by default. O(log n) push/pop.', when: 'Top-k elements, Dijkstra\'s algorithm, scheduling.' },
                ].map(row => (
                    <div key={row.container} className="flex items-start gap-4 px-4 py-3 border-b border-border last:border-b-0">
                        <code className="text-orange-600 dark:text-orange-400 text-xs font-bold shrink-0 w-44">{row.container}</code>
                        <div>
                            <p className="text-xs text-foreground">{row.use}</p>
                            <p className="text-xs text-muted-foreground mt-0.5"><span className="font-semibold">Reach for it when:</span> {row.when}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 04 SYSTEM DESIGN & SOLVING PROBLEMS ────────────────────────── */}
            <LectureSectionHeading number="04" title="System Design & a Framework for Solving Problems" />

            <LectureP>
                Technical interviews aren't just about knowing the right algorithm — they're about demonstrating a systematic thinking process. Here's the framework that works:
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                {[
                    { step: '01', title: 'Understand the problem', desc: 'Repeat it back in your own words. Ask for clarifying questions: what are the input types? Can there be duplicates? What are the constraints on n? What should I return for edge cases (empty input, single element)?' },
                    { step: '02', title: 'Work through examples by hand', desc: 'Take the given example and trace through it manually before writing a single line of code. Then come up with your own edge case and trace that too.' },
                    { step: '03', title: 'State the brute force', desc: 'Describe the simplest possible solution, even if it\'s O(n²). State its time and space complexity. This shows you understand the problem and establishes a baseline.' },
                    { step: '04', title: 'Optimize', desc: 'Ask: what\'s the bottleneck? Is there repeated work a hash map could cache? Could sorting unlock a two-pointer approach? Does the problem have overlapping subproblems (DP)?' },
                    { step: '05', title: 'Code it up cleanly', desc: 'Write the solution with readable variable names. Use helper functions for clarity. Handle edge cases explicitly. Don\'t optimize the code itself until it\'s correct.' },
                    { step: '06', title: 'Test and trace', desc: 'Walk through your code with the given example. Then test at least one edge case. State the final time and space complexity.' },
                ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 p-4 border-b border-border last:border-b-0">
                        <span className="text-2xl font-black text-primary/70 shrink-0 select-none">{item.step}</span>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <LectureCallout type="info">
                The NeetCode 150 is the gold standard problem set for interview prep. It covers every pattern you need: Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search, Linked List, Trees, Tries, Heap, Backtracking, Graphs, Dynamic Programming. Work through it category by category, not randomly — the patterns build on each other.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Classes, Encapsulation & Inheritance',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-6/lecture-1'),
                }}
                next={{
                    label: 'CLI Phonebook — Part 1',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-6/activity'),
                }}
            />
        </LectureLayout>
    );
}