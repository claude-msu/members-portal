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

            {/* ── 01 POLYMORPHISM — FROM LECTURE 1 TO HERE ────────────────────── */}
            <LectureSectionHeading number="01" title="Polymorphism — From Lecture 1 to Here" />

            <LectureP>
                Lecture 1 introduced the four OOP principles: encapsulation, inheritance, polymorphism, and abstraction. This lecture focuses on <strong className="text-foreground">polymorphism</strong> in C++ — the same interface (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getType()</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getLoanDays()</code>) working for different types (Book, DVD, Magazine). We'll use virtual and pure virtual methods to build abstract base classes, then survey the STL and a problem-solving framework for interviews.
            </LectureP>

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

            <LectureSubHeading title="Abstract base classes" />
            <LectureP>
                A <LectureTerm>pure virtual</LectureTerm> method is declared with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">= 0</code> and has no implementation in the base class. A class with at least one pure virtual method is <strong className="text-foreground">abstract</strong> — you cannot instantiate it (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">LibraryItem item;</code> is illegal). You can only create concrete derived types (Book, DVD) and use them through pointers or references to the base. Abstract base classes define a contract: "any LibraryItem must implement getLoanDays()." That's the essence of interface-based design in C++.
            </LectureP>

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

            <LectureP>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"map<K,V>"}</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"set<T>"}</code> are implemented as balanced binary search trees (typically red-black). Understanding a BST makes O(log n) and &quot;keys always sorted&quot; intuitive:
            </LectureP>
            <BstDiagram />

            <LectureSubHeading title="STL in action — a quick example" />
            <LectureP>
                Real code leans on the STL for iteration, sorting, and lookups. Here's a typical pattern: fill a vector, sort it, and use a map for counts or caching.
            </LectureP>
            <CppBlock
                title="vector, sort, map — common STL usage"
                lines={[
                    '#include <vector>',
                    '#include <algorithm>',
                    '#include <map>',
                    '#include <string>',
                    'using namespace std;',
                    '',
                    'int main() {',
                    '    vector<int> nums = {3, 1, 4, 1, 5};',
                    '    sort(nums.begin(), nums.end());   // in-place: 1, 1, 3, 4, 5',
                    '',
                    '    map<string, int> count;            // keys sorted lexicographically',
                    '    for (const auto& s : {"apple", "banana", "apple"}) {',
                    '        count[s]++;                    // count["apple"] == 2, count["banana"] == 1',
                    '    }',
                    '',
                    '    // Range-for over map: pairs (key, value)',
                    '    for (const auto& [key, val] : count)',
                    '        cout << key << ": " << val << endl;',
                    '',
                    '    return 0;',
                    '}',
                ]}
            />

            <LectureSubHeading title="Iterators — what begin() and end() are" />
            <LectureP>
                STL containers expose <strong className="text-foreground">iterators</strong>: objects that let you refer to an element and move to the next. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">v.begin()</code> points to the first element; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">v.end()</code> points one past the last (so a loop <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">begin()</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">end()</code> covers every element). <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">sort(nums.begin(), nums.end())</code> takes two iterators and sorts that range. Range-for (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">for (const auto&amp; x : v)</code>) is syntactic sugar: it uses <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">begin()</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">end()</code> under the hood. Many <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">&lt;algorithm&gt;</code> functions take iterator pairs to work on a range.
            </LectureP>

            <LectureSubHeading title="&lt;algorithm&gt; — functions you'll use every day" />
            <LectureP>
                Include <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">#include &lt;algorithm&gt;</code> and use: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">sort(begin, end)</code> — in-place sort; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">find(begin, end, value)</code> — returns iterator to first match or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">end</code>; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">count(begin, end, value)</code> — number of occurrences; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">lower_bound(begin, end, value)</code> — first position where value could be inserted (binary search on sorted range); <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">min_element(begin, end)</code> / <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">max_element(begin, end)</code> — iterator to min/max. All take half-open ranges <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">[begin, end)</code>.
            </LectureP>

            <LectureCallout type="tip">
                <strong className="text-foreground">set vs unordered_set:</strong> Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">set</code> when you need keys in sorted order or range queries; use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_set</code> when you only need O(1) membership and don't care about order. Same idea for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">map</code> vs <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_map</code>.
            </LectureCallout>

            {/* ── 04 TIME & SPACE COMPLEXITY — WHAT BIG-O MEANS IN PRACTICE ──── */}
            <LectureSectionHeading number="04" title="Time & Space Complexity — What Big-O Means in Practice" />

            <LectureP>
                Interviewers expect you to state and justify complexity. Here's the cheat sheet: <strong className="text-foreground">O(1)</strong> — constant (hash lookup, array index). <strong className="text-foreground">O(log n)</strong> — logarithmic (binary search, balanced tree ops; doubles in size add one step). <strong className="text-foreground">O(n)</strong> — linear (one pass over input). <strong className="text-foreground">O(n log n)</strong> — linearithmic (e.g. comparison sort). <strong className="text-foreground">O(n²)</strong> — quadratic (nested loops over the same data). <strong className="text-foreground">O(2ⁿ)</strong> or <strong className="text-foreground">O(n!)</strong> — exponential or factorial (naive recursion; usually a signal to optimize with DP or pruning). For space, same notation applies to extra memory (e.g. a hash map of n elements is O(n) space).
            </LectureP>

            <LectureCallout type="info">
                In interviews, say &quot;O of n squared&quot; and state both time and space. If you use a hash map of size n, that's O(n) space. If you sort in place, that's O(1) extra space (ignoring the sort's own stack/log n for recursion).
            </LectureCallout>

            <LectureSubHeading title="Rough rule of thumb: n = 10⁵" />
            <LectureP>
                In contest or interview problems, n is often 10⁵ or 10⁶. A rule of thumb: O(n²) does about 10¹⁰ operations for n = 10⁵, which is usually too slow in C++; O(n log n) is around 2×10⁶, which is fine. So if your brute force is O(n²), look for a linear pass with a hash map, or sort and use two pointers, or another structure that gets you to O(n) or O(n log n).
            </LectureP>

            <LectureSubHeading title="Recursion in 60 seconds" />
            <LectureP>
                A recursive function has a <strong className="text-foreground">base case</strong> (when to stop) and a <strong className="text-foreground">recurrence</strong> (how the result depends on smaller inputs). Example: Fibonacci, tree traversal, backtracking. Danger: no base case → infinite recursion; overlapping subproblems without memoization → exponential time. Many tree and graph problems are naturally recursive (DFS); if the same subproblem is solved many times, add memoization or switch to DP.
            </LectureP>

            <LectureSubHeading title="Trees and graphs — the big picture" />
            <LectureP>
                A <strong className="text-foreground">tree</strong> is a connected acyclic graph; we'll implement one in the Week 6 activity (library catalog). Traversal: in-order (left, root, right) gives sorted order in a BST; pre-order and post-order for expression trees or structure. A <strong className="text-foreground">graph</strong> has nodes and edges; represent with adjacency list (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"vector<vector<int>>"}</code> or map of neighbors). <strong className="text-foreground">BFS</strong> (queue) gives shortest path in unweighted graphs and level order; <strong className="text-foreground">DFS</strong> (stack or recursion) for cycle detection, topological sort, exploring connected components. You'll practice these in the activity and in Week 7.
            </LectureP>

            {/* ── 05 SYSTEM DESIGN & A FRAMEWORK FOR SOLVING PROBLEMS ─────────── */}
            <LectureSectionHeading number="05" title="System Design & a Framework for Solving Problems" />

            <LectureP>
                Technical interviews aren't just about knowing the right algorithm — they're about demonstrating a systematic thinking process. Here's the framework that works:
            </LectureP>

            <LectureSubHeading title="Classic DSA patterns" />
            <LectureP>
                Most problems reduce to a few patterns. <strong className="text-foreground">Two pointers</strong> — two indices moving in one or opposite directions; great for sorted arrays (pair with sum, remove duplicates). <strong className="text-foreground">Sliding window</strong> — a contiguous subarray of fixed or variable size; for "longest substring with at most k distinct" or "max sum of k consecutive." <strong className="text-foreground">Hash map for lookups</strong> — store seen values or counts to turn O(n²) into O(n) (Two Sum, anagrams). <strong className="text-foreground">Stack</strong> — last-in-first-out for matching (parentheses, valid BST), DFS, or undo. <strong className="text-foreground">Queue / BFS</strong> — level-order, shortest path in unweighted graph. <strong className="text-foreground">Binary search</strong> — not just on arrays; binary search on the answer when you have a monotonic condition. <strong className="text-foreground">Recursion + memo / DP</strong> — overlapping subproblems; define state, recurrence, base case. Spotting the pattern is half the battle.
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

            <LectureSubHeading title="Example: clarifying Two Sum" />
            <LectureP>
                &quot;Given an array of integers and a target, return indices of two numbers that add up to target.&quot; Before coding, clarify: Can the same element be used twice? (Usually no.) Is the array sorted? (If yes, two pointers; if no, hash map.) Are there multiple valid pairs? (Return any one.) What if there's no solution? (Return empty or throw.) Can there be duplicates? (Hash map still works — store index and overwrite or check before.) Stating these shows you think about edge cases and constraints.
            </LectureP>

            <LectureSubHeading title="Worked example: Valid Parentheses" />
            <LectureP>
                Problem: given a string of brackets <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">()[]{}</code>, determine if they're balanced. <strong className="text-foreground">(1) Understand:</strong> Only brackets; empty string is valid. <strong className="text-foreground">(2) Example:</strong> <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">"([])"</code> → push <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">(</code>, push <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">[</code>, see <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">]</code> pop and match. <strong className="text-foreground">(3) Brute force:</strong> repeatedly find and remove matching pairs until string empty or unchanged — O(n²). <strong className="text-foreground">(4) Optimize:</strong> one pass with a stack — push opening brackets, on closing pop and check match; if stack empty when we need to pop, or non-empty at end, invalid. O(n) time, O(n) space. <strong className="text-foreground">(5) Code:</strong> loop over chars, switch on char, push/pop accordingly. <strong className="text-foreground">(6) Test:</strong> <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">""</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">"([)]"</code> (invalid), <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">"()[]{}"</code> (valid). This is the full framework in action.
            </LectureP>

            <LectureSubHeading title="Interview mindset" />
            <LectureP>
                <strong className="text-foreground">Talk out loud:</strong> Explain what you're thinking. &quot;I'll use a hash map to store what we've seen so we can look up the complement in O(1).&quot; <strong className="text-foreground">Start simple:</strong> Get a working brute force first; then optimize. <strong className="text-foreground">Test with your own example:</strong> Walk through your code with the sample input and an edge case (empty, single element, duplicates). <strong className="text-foreground">State complexity:</strong> Before and after optimizing, say time and space. Interviewers are evaluating how you think, not just whether you know the trick.
            </LectureP>

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