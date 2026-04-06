import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { LectureCmd } from '@/components/ui/lecture-cmd';
import {
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { CodeBlock } from '@/components/ui/code-block';

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

const PatternCard = ({ name, color, border, bg, problem, signal, children }: {
    name: string; color: string; border: string; bg: string;
    problem: string; signal: string; children: React.ReactNode;
}) => (
    <div className={`rounded-xl border ${border} overflow-hidden`}>
        <div className={`px-4 py-2.5 ${bg}`}>
            <p className={`text-xs font-black uppercase tracking-widest ${color}`}>{name}</p>
            <p className="text-xs text-foreground mt-1"><strong className="text-foreground">Problem:</strong> {problem}</p>
            <p className="text-xs text-muted-foreground mt-0.5"><strong className="text-foreground">Signal:</strong> {signal}</p>
        </div>
        <div className="px-4 py-2.5">{children}</div>
    </div>
);

export default function Week3Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={3}
                session="Lecture 2"
                title="Polymorphism, STL & System Design"
                description="Abstract base classes, pure virtual methods, STL containers, SOLID principles, design patterns, and smart pointers — the tools you need to design real systems."
                icon={<Cpu className="h-4 w-4" />}
            />

            {/* ── 01 POLYMORPHISM & ABSTRACT BASE CLASSES ────────────────────── */}
            <LectureSectionHeading number="01" title="Polymorphism & Abstract Base Classes" />

            <LectureP>
                Lecture 1 built the foundation: classes, access modifiers, constructors, and inheritance with <LectureCmd tip="Declares a method as overridable by derived classes. The correct version is called at runtime through the vtable, based on the object's actual type.">virtual</LectureCmd> methods. You saw how <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">LibraryItem</code> declares <LectureCmd tip="A virtual method with a default implementation that derived classes may override. If not overridden, the base version runs.">virtual getType()</LectureCmd> and <LectureCmd tip="Pure virtual method — no implementation in the base class. Derived classes MUST override it. Makes the class abstract (cannot be instantiated).">virtual getLoanDays() = 0</LectureCmd>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Book</code> overrides both. This lecture picks up where that left off: we add more derived types to see polymorphism in action, then move into the STL and system design principles.
            </LectureP>

            <LectureSubHeading title="Adding a DVD — polymorphism with multiple types" />
            <LectureP>
                The real power of <LectureTermWithTip tip="Same interface, different behavior. Call getType() on any LibraryItem — each derived class responds differently. Enabled by virtual methods and the vtable.">polymorphism</LectureTermWithTip> shows when you have multiple derived classes behind the same interface. Using the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">LibraryItem</code> base class from Lecture 1, a new type slots in without touching existing code:
            </LectureP>

            <CodeBlock language="cpp"
                title="DVD — another derived type using Lecture 1's base class"
                lines={[
                    'class DVD : public LibraryItem {',
                    'public:',
                    '    DVD(string i, string t) : LibraryItem(i, t) {}',
                    '    string getType()  const override { return "DVD"; }',
                    '    int getLoanDays() const override { return 7; }',
                    '};',
                    '',
                    'class Magazine : public LibraryItem {',
                    'public:',
                    '    Magazine(string i, string t) : LibraryItem(i, t) {}',
                    '    string getType()  const override { return "Magazine"; }',
                    '    int getLoanDays() const override { return 3; }',
                    '};',
                    '',
                    'void printInfo(const LibraryItem& item) {',
                    '    cout << item.getType() << ": " << item.title',
                    '         << " (" << item.getLoanDays() << " day loan)" << endl;',
                    '}',
                    '',
                    '// Usage:',
                    '// Book b("001", "Clean Code");',
                    '// DVD d("002", "Inception");',
                    '// Magazine m("003", "IEEE Spectrum");',
                    '// printInfo(b);  // → "Book: Clean Code (21 day loan)"',
                    '// printInfo(d);  // → "DVD: Inception (7 day loan)"',
                    '// printInfo(m);  // → "Magazine: IEEE Spectrum (3 day loan)"',
                ]}
            />

            <LectureP>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">printInfo</code> takes a <LectureCmd tip="A reference to a LibraryItem that you promise not to modify. Any derived type (Book, DVD, Magazine) can be passed. Virtual dispatch still works through references.">const LibraryItem&</LectureCmd> — it knows nothing about Book, DVD, or Magazine. At runtime, the correct overrides are called through <LectureTermWithTip tip="The runtime mechanism for polymorphism. Each class with virtual methods has a vtable (virtual table) — a lookup table of function pointers. When you call a virtual method through a base pointer, the vtable routes to the correct derived implementation.">virtual dispatch</LectureTermWithTip> (the vtable). This is the <LectureTermWithTip tip="Open for extension (add new derived types), closed for modification (existing code doesn't change). One of the SOLID principles — covered in section 03.">Open/Closed Principle</LectureTermWithTip> at work: you can add new types without modifying <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">printInfo</code> or any other code that works with the base class.
            </LectureP>

            <LectureSubHeading title="Abstract base classes — the contract" />
            <LectureP>
                A <LectureTermWithTip tip="A method declared with = 0. It has no implementation in the base class — derived classes must provide one. Any class with at least one pure virtual method is abstract.">pure virtual</LectureTermWithTip> method (<LectureCmd tip="Syntax for declaring a pure virtual method. No implementation provided. Makes the class abstract — it cannot be instantiated, only derived from.">= 0</LectureCmd>) has no implementation in the base. A class with at least one pure virtual method is <LectureTermWithTip tip="A class that cannot be instantiated directly. It exists only to define an interface that derived classes must implement. Like a blueprint that says 'you must build these rooms' but doesn't build them itself.">abstract</LectureTermWithTip> — you cannot instantiate it. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">LibraryItem item("x", "y");</code> will not compile. You can only create concrete derived types and use them through pointers or references to the base.
            </LectureP>
            <LectureP>
                Think of an abstract base class as a <strong className="text-foreground">contract</strong>: "any LibraryItem must implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getLoanDays()</code>." Derived classes fulfill the contract. Code that works with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">LibraryItem&</code> can rely on the contract without knowing or caring which concrete type it is holding. This is <LectureTermWithTip tip="Designing systems around abstract contracts (interfaces) rather than concrete implementations. Code depends on what objects can do, not what they are. The foundation of SOLID, testability, and plugin architectures.">interface-based design</LectureTermWithTip> in C++, and it is the foundation of everything in this lecture.
            </LectureP>

            <LectureCallout type="tip">
                Use <LectureCmd tip="Placed after a method declaration that overrides a base class virtual. The compiler verifies the base method exists and the signature matches — catches typos and signature mismatches at compile time.">override</LectureCmd> on every method that overrides a virtual. The compiler will catch mistakes — if the base method signature changes, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">override</code> will produce a compilation error instead of silently creating a new method.
            </LectureCallout>

            {/* ── 02 STL CONTAINERS ─────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="STL Containers — Your Toolbox" />

            <LectureP>
                The C++ <LectureTermWithTip tip="Standard Template Library — a collection of template-based containers (vector, map, set...), algorithms (sort, find, count...), and iterators. Ships with every C++ compiler. Production-grade, heavily optimized.">Standard Template Library</LectureTermWithTip> ships production-grade implementations of every data structure you will need. Know these cold:
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
                <LectureCmd tip="Sorted associative container. Keys are always in order (uses operator<). Implemented as a red-black tree. O(log n) insert, find, erase. Use when you need sorted iteration or range queries.">{"map<K,V>"}</LectureCmd> and <LectureCmd tip="Sorted set of unique elements. Same red-black tree as map but stores only keys, no values. O(log n) operations. Use when you need sorted unique elements.">{"set<T>"}</LectureCmd> are implemented as balanced binary search trees (typically red-black). Understanding a BST makes O(log n) and "keys always sorted" intuitive:
            </LectureP>
            <BstDiagram />

            <LectureSubHeading title="STL in action — vectors, maps, and sorting" />
            <LectureP>
                Real code leans on the STL for iteration, sorting, and lookups. A typical pattern: fill a <LectureCmd tip="Dynamic array. Grows automatically. O(1) random access, O(1) amortized push_back, O(n) insert/erase in the middle. The default container for most use cases.">vector</LectureCmd>, sort it, and use a <LectureCmd tip="Sorted key-value store (red-black tree). O(log n) operations. Keys are always sorted — iterating gives them in order.">map</LectureCmd> for counts or caching.
            </LectureP>
            <CodeBlock language="cpp"
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
                    '        count[s]++;                    // count["apple"] == 2',
                    '    }',
                    '',
                    '    for (const auto& [key, val] : count)',
                    '        cout << key << ": " << val << endl;',
                    '',
                    '    return 0;',
                    '}',
                ]}
            />

            <LectureSubHeading title="Stack, queue, and unordered_map" />
            <LectureP>
                Three containers you will use constantly. <LectureCmd tip="Last In, First Out. push() adds to the top, top() reads the top, pop() removes the top. #include <stack>. Adaptor over deque by default. The activity's undo feature uses one.">stack</LectureCmd> is LIFO — the activity's undo feature uses one. <LectureCmd tip="First In, First Out. push() adds to the back, front() reads the front, pop() removes the front. #include <queue>. BFS, task scheduling, message queues.">queue</LectureCmd> is FIFO — BFS, task scheduling. <LectureCmd tip="Hash table with string/int/etc keys. O(1) average insert, lookup, erase. The C++ equivalent of Python's dict. #include <unordered_map>. The go-to for frequency counting and caching.">unordered_map</LectureCmd> is the C++ equivalent of Python's <LectureCmd tip="Python's built-in hash map. dict[key] = value. O(1) average operations. C++ equivalent: unordered_map.">dict</LectureCmd> — O(1) average lookup, the go-to for frequency counting and caching.
            </LectureP>

            <CodeBlock language="cpp"
                title="stack — LIFO (Last In, First Out)"
                lines={[
                    '#include <stack>',
                    '#include <string>',
                    'using namespace std;',
                    '',
                    'int main() {',
                    '    stack<string> undo;',
                    '    undo.push("add Alice");',
                    '    undo.push("add Bob");',
                    '    undo.push("delete Alice");',
                    '',
                    '    // Undo the last action',
                    '    cout << "Undoing: " << undo.top() << endl;  // "delete Alice"',
                    '    undo.pop();',
                    '',
                    '    cout << "Next undo: " << undo.top() << endl; // "add Bob"',
                    '    return 0;',
                    '}',
                ]}
            />

            <CodeBlock language="cpp"
                title="queue — FIFO (First In, First Out)"
                lines={[
                    '#include <queue>',
                    '#include <string>',
                    'using namespace std;',
                    '',
                    'int main() {',
                    '    queue<string> tasks;',
                    '    tasks.push("process order #1");',
                    '    tasks.push("process order #2");',
                    '    tasks.push("process order #3");',
                    '',
                    '    while (!tasks.empty()) {',
                    '        cout << "Handling: " << tasks.front() << endl;',
                    '        tasks.pop();',
                    '    }',
                    '    return 0;',
                    '}',
                ]}
            />

            <CodeBlock language="cpp"
                title="unordered_map — O(1) key lookup"
                lines={[
                    '#include <unordered_map>',
                    '#include <string>',
                    '#include <vector>',
                    'using namespace std;',
                    '',
                    'int main() {',
                    '    vector<string> words = {"apple", "banana", "apple", "cherry", "banana", "apple"};',
                    '',
                    '    unordered_map<string, int> freq;',
                    '    for (const auto& w : words)',
                    '        freq[w]++;',
                    '',
                    '    for (const auto& [word, count] : freq)',
                    '        cout << word << ": " << count << endl;',
                    '',
                    '    // Direct lookup',
                    '    if (freq.count("apple"))',
                    '        cout << "apple appears " << freq["apple"] << " times" << endl;',
                    '',
                    '    return 0;',
                    '}',
                ]}
            />

            <LectureSubHeading title="Iterators — what begin() and end() are" />
            <LectureP>
                STL containers expose <LectureTermWithTip tip="Objects that point to an element in a container and can advance to the next. Like a cursor. Different containers provide different iterator types (random-access for vector, bidirectional for map, etc.).">iterators</LectureTermWithTip>: objects that let you refer to an element and move to the next. <LectureCmd tip="Returns an iterator to the first element of the container. The starting point for iteration.">begin()</LectureCmd> points to the first element; <LectureCmd tip="Returns an iterator to one past the last element. The stopping point for iteration. Never dereference end() — it's a sentinel, not an element.">end()</LectureCmd> points one past the last (so a loop <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">begin()</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">end()</code> covers every element). <LectureCmd tip="Sorts the range [begin, end) in place using operator< by default. O(n log n). Takes two iterators — works on any random-access range.">sort(nums.begin(), nums.end())</LectureCmd> takes two iterators and sorts that range. <LectureCmd tip="Syntactic sugar for iterating from begin() to end(). const auto& avoids copying each element. The compiler rewrites this to an iterator loop.">for (const auto& x : v)</LectureCmd> is syntactic sugar that uses <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">begin()</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">end()</code> under the hood.
            </LectureP>

            <LectureSubHeading title="<algorithm> — functions you'll use every day" />
            <LectureP>
                Include <LectureCmd tip="The STL algorithms header. Provides sort, find, count, lower_bound, min_element, max_element, binary_search, and dozens more. All operate on iterator ranges.">#include &lt;algorithm&gt;</LectureCmd> and use: <LectureCmd tip="In-place sort of [begin, end). O(n log n). Uses introsort (quicksort + heapsort fallback). Custom comparator: sort(b, e, cmp).">sort(begin, end)</LectureCmd>, <LectureCmd tip="Linear search. Returns iterator to first match, or end if not found. O(n). For sorted data, use lower_bound (O(log n)) instead.">find(begin, end, value)</LectureCmd>, <LectureCmd tip="Returns the number of elements equal to value in the range. O(n). For containers like map/set, use the member .count() which is O(log n) or O(1).">count(begin, end, value)</LectureCmd>, <LectureCmd tip="Binary search on a sorted range. Returns iterator to the first position where value could be inserted while keeping sorted order. O(log n). The range must be sorted.">lower_bound(begin, end, value)</LectureCmd>, <LectureCmd tip="Returns iterators to the smallest/largest element in the range. O(n). Dereference the result: *min_element(b, e).">min_element / max_element</LectureCmd>. All take <LectureTermWithTip tip="A range notation: [begin, end) means 'from begin up to but not including end.' begin is included, end is excluded. This is why end() points one past the last element.">half-open ranges</LectureTermWithTip> <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">[begin, end)</code>.
            </LectureP>

            <LectureCallout type="tip">
                <LectureCmd tip="Sorted set. O(log n) insert/find/erase. Keys always in order. Red-black tree. Use when you need sorted iteration or range queries over unique values.">set</LectureCmd> vs <LectureCmd tip="Hash set. O(1) average insert/find/erase. Unordered. Use when you only need fast membership checks and don't care about element order.">unordered_set</LectureCmd>: Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">set</code> when you need keys in sorted order or range queries; use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_set</code> when you only need O(1) membership and do not care about order. Same idea for <LectureCmd tip="Sorted map (red-black tree). O(log n). Keys always sorted.">map</LectureCmd> vs <LectureCmd tip="Hash map. O(1) average. Unordered. Faster for pure lookups.">unordered_map</LectureCmd>.
            </LectureCallout>

            {/* ── 03 SOLID PRINCIPLES ──────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="SOLID Principles" />

            <LectureP>
                <LectureTermWithTip tip="Five design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Named by Robert C. Martin (Uncle Bob). Not rules — lenses for evaluating design decisions.">SOLID</LectureTermWithTip> is a set of five design principles that make object-oriented code easier to maintain, extend, and test. They are not rules to follow blindly — they are lenses for evaluating design decisions. When code is hard to change, one or more SOLID principles are usually being violated.
            </LectureP>

            <div className="my-6 space-y-4">
                {[
                    {
                        letter: 'S', name: 'Single Responsibility',
                        color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', bg: 'bg-blue-50 dark:bg-blue-950/20',
                        def: 'A class should have one reason to change.',
                        violation: 'A Library class that handles searching, printing, file I/O, and user auth.',
                        compliant: 'Separate classes: SearchEngine, Printer, FileStore, AuthService — each owns one concern.',
                    },
                    {
                        letter: 'O', name: 'Open/Closed',
                        color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                        def: 'Open for extension, closed for modification.',
                        violation: 'Adding a new LibraryItem type requires editing a giant if/else chain in processItem().',
                        compliant: 'processItem() takes a LibraryItem& and calls virtual methods — new types just inherit.',
                    },
                    {
                        letter: 'L', name: 'Liskov Substitution',
                        color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', bg: 'bg-orange-100 dark:bg-orange-950/20',
                        def: 'Derived types must be usable wherever the base type is expected.',
                        violation: 'A Square class inheriting from Rectangle that breaks setWidth()/setHeight() contracts.',
                        compliant: 'Book and DVD both honor LibraryItem\'s contract — getType() returns a string, getLoanDays() returns a positive int.',
                    },
                    {
                        letter: 'I', name: 'Interface Segregation',
                        color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', bg: 'bg-purple-50 dark:bg-purple-950/20',
                        def: 'No class should be forced to implement methods it doesn\'t use.',
                        violation: 'An ILibraryItem interface with print(), stream(), serialize(), archive() — most items only need two.',
                        compliant: 'Split into IPrintable, IStreamable, ISerializable — classes implement only what they need.',
                    },
                    {
                        letter: 'D', name: 'Dependency Inversion',
                        color: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800', bg: 'bg-red-50 dark:bg-red-950/20',
                        def: 'High-level modules should depend on abstractions, not concrete implementations.',
                        violation: 'Library class directly creates and calls FileStorage methods — can\'t swap to a database.',
                        compliant: 'Library takes an IStorage& in its constructor — pass FileStorage in production, InMemoryStorage in tests.',
                    },
                ].map((item) => (
                    <div key={item.letter} className={`rounded-xl border ${item.border} overflow-hidden`}>
                        <div className={`px-4 py-2.5 ${item.bg}`}>
                            <p className={`text-xs font-black uppercase tracking-widest ${item.color}`}>
                                <span className="text-base mr-1">{item.letter}</span> — {item.name}
                            </p>
                            <p className="text-xs text-foreground mt-1 italic">{item.def}</p>
                        </div>
                        <div className="px-4 py-2.5 space-y-1.5">
                            <p className="text-xs text-muted-foreground"><span className="font-semibold text-red-500 dark:text-red-400">Violation:</span> {item.violation}</p>
                            <p className="text-xs text-muted-foreground"><span className="font-semibold text-emerald-500 dark:text-emerald-400">Compliant:</span> {item.compliant}</p>
                        </div>
                    </div>
                ))}
            </div>

            <LectureCallout type="info">
                You do not need to memorize the acronym for an exam — you need to recognize when code is violating these principles. If adding a feature requires editing five files, ask which principle is broken and how to restructure.
            </LectureCallout>

            {/* ── 04 DESIGN PATTERNS ───────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Design Patterns" />

            <LectureP>
                <LectureTermWithTip tip="Reusable solutions to common software design problems. Not code to copy-paste — templates for thinking about recurring challenges. Catalogued in the 'Gang of Four' book (1994). The three most common: Singleton, Observer, Factory.">Design patterns</LectureTermWithTip> are reusable solutions to common design problems. They are not code you copy-paste — they are <strong className="text-foreground">templates for thinking</strong> about recurring challenges. Three patterns are especially common in applications and interviews: <LectureTermWithTip tip="Guarantees exactly one instance of a class exists. Use for loggers, config managers, connection pools. Private constructor + static accessor method.">Singleton</LectureTermWithTip>, <LectureTermWithTip tip="When one object changes, it notifies all registered observers automatically. Subject maintains a list; calls notify() on each. Think event buses, UI bindings, pub/sub.">Observer</LectureTermWithTip>, and <LectureTermWithTip tip="Centralizes object creation. A static create() method takes a type indicator and returns the correct derived type through a base pointer. Decouples creation from usage.">Factory</LectureTermWithTip>.
            </LectureP>

            <div className="my-6 space-y-4">
                <PatternCard
                    name="Singleton"
                    color="text-blue-600 dark:text-blue-400"
                    border="border-blue-200 dark:border-blue-800"
                    bg="bg-blue-50 dark:bg-blue-950/20"
                    problem="You need exactly one instance of a class (logger, configuration, database connection pool)."
                    signal="Multiple instances would cause conflicts — duplicate log files, inconsistent config, exhausted connections."
                >
                    <p className="text-xs text-muted-foreground">Private constructor, static method that returns the one instance. In C++, use a <strong className="text-foreground">static local variable</strong> — thread-safe since C++11.</p>
                </PatternCard>

                <PatternCard
                    name="Observer"
                    color="text-emerald-600 dark:text-emerald-400"
                    border="border-emerald-200 dark:border-emerald-800"
                    bg="bg-emerald-50 dark:bg-emerald-950/20"
                    problem="When one object's state changes, multiple other objects need to react."
                    signal="You're passing callbacks everywhere or polling for changes — classic event-driven scenario."
                >
                    <p className="text-xs text-muted-foreground">Subject maintains a list of observers. When state changes, it calls <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">notify()</code> on each observer. Think UI frameworks, event buses, pub/sub systems.</p>
                </PatternCard>

                <PatternCard
                    name="Factory"
                    color="text-orange-600 dark:text-orange-400"
                    border="border-orange-200 dark:border-orange-800"
                    bg="bg-orange-100 dark:bg-orange-950/20"
                    problem="Creating objects requires choosing among several concrete types based on runtime information."
                    signal="You see new Book(...) / new DVD(...) scattered across the codebase with type-switching logic."
                >
                    <p className="text-xs text-muted-foreground">A static <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">create()</code> method takes a type indicator and returns the right derived type through a base pointer. Centralizes creation logic.</p>
                </PatternCard>
            </div>

            <CodeBlock language="cpp"
                title="Singleton — thread-safe since C++11"
                lines={[
                    'class Logger {',
                    'private:',
                    '    Logger() {}  // private constructor prevents external creation',
                    '',
                    'public:',
                    '    Logger(const Logger&) = delete;             // no copying',
                    '    Logger& operator=(const Logger&) = delete;  // no assignment',
                    '',
                    '    static Logger& instance() {',
                    '        static Logger logger;  // created once, on first call',
                    '        return logger;',
                    '    }',
                    '',
                    '    void log(const string& msg) {',
                    '        cout << "[LOG] " << msg << endl;',
                    '    }',
                    '};',
                    '',
                    '// Usage: Logger::instance().log("system started");',
                ]}
            />

            <CodeBlock language="cpp"
                title="Observer — subscribe/notify pattern"
                lines={[
                    'class IObserver {',
                    'public:',
                    '    virtual void onEvent(const string& event) = 0;',
                    '    virtual ~IObserver() {}',
                    '};',
                    '',
                    'class EventBus {',
                    'private:',
                    '    vector<IObserver*> observers;',
                    '',
                    'public:',
                    '    void subscribe(IObserver* obs) {',
                    '        observers.push_back(obs);',
                    '    }',
                    '',
                    '    void emit(const string& event) {',
                    '        for (auto* obs : observers)',
                    '            obs->onEvent(event);',
                    '    }',
                    '};',
                    '',
                    'class ConsoleLogger : public IObserver {',
                    'public:',
                    '    void onEvent(const string& event) override {',
                    '        cout << "[Console] " << event << endl;',
                    '    }',
                    '};',
                ]}
            />

            <CodeBlock language="cpp"
                title="Factory — centralized object creation"
                lines={[
                    'class LibraryItemFactory {',
                    'public:',
                    '    static unique_ptr<LibraryItem> create(',
                    '        const string& type, const string& id, const string& title',
                    '    ) {',
                    '        if (type == "book")     return make_unique<Book>(id, title);',
                    '        if (type == "dvd")      return make_unique<DVD>(id, title);',
                    '        if (type == "magazine") return make_unique<Magazine>(id, title);',
                    '        return nullptr;',
                    '    }',
                    '};',
                    '',
                    '// Usage:',
                    '// auto item = LibraryItemFactory::create("book", "001", "Clean Code");',
                    '// item->getType();  // "Book"',
                ]}
            />

            <LectureCallout type="tip">
                The Factory uses <LectureCmd tip="Smart pointer with exclusive ownership. Automatically deletes the managed object when the unique_ptr goes out of scope. Cannot be copied, only moved. Zero overhead vs raw pointer.">unique_ptr</LectureCmd> (covered in section 06) to return ownership of the created object. The caller owns the memory; no manual <LectureCmd tip="Frees heap memory allocated with new. Calls the object's destructor, then returns memory to the heap. Every new must have a matching delete — or use smart pointers instead." warn>delete</LectureCmd> needed.
            </LectureCallout>

            {/* ── 05 INTERFACES & DEPENDENCY INVERSION ─────────────────────── */}
            <LectureSectionHeading number="05" title="Interfaces & Dependency Inversion" />

            <LectureP>
                C++ does not have a built-in <LectureCmd tip="In Java/C#, interface is a keyword that defines a contract with no implementation. C++ achieves the same thing with a class that has only pure virtual methods and a virtual destructor.">interface</LectureCmd> keyword like Java or C#. Instead, an interface is a class with <strong className="text-foreground">only pure virtual methods</strong> and a <LectureCmd tip="Ensures the correct destructor runs when deleting through a base pointer. Required in any class with virtual methods. virtual ~IStorage() {}">virtual destructor</LectureCmd> — no data, no implementations. Convention: prefix the name with <LectureCmd tip="Convention: prefix interface names with I. IStorage, IObserver, ISerializable. Not enforced by the language — purely a naming convention to signal 'this is a pure abstract contract.'">I</LectureCmd>.
            </LectureP>

            <CodeBlock language="cpp"
                title="IStorage interface — abstract contract for persistence"
                lines={[
                    'class IStorage {',
                    'public:',
                    '    virtual void save(const string& key, const string& value) = 0;',
                    '    virtual string load(const string& key) = 0;',
                    '    virtual bool exists(const string& key) = 0;',
                    '    virtual ~IStorage() {}',
                    '};',
                ]}
            />

            <LectureP>
                Concrete classes implement the interface. Each fulfills the same contract with a different strategy:
            </LectureP>

            <CodeBlock language="cpp"
                title="two concrete implementations of IStorage"
                lines={[
                    'class FileStorage : public IStorage {',
                    'private:',
                    '    string basePath;',
                    'public:',
                    '    FileStorage(const string& path) : basePath(path) {}',
                    '    void save(const string& key, const string& value) override {',
                    '        // write value to basePath + "/" + key',
                    '    }',
                    '    string load(const string& key) override {',
                    '        // read from basePath + "/" + key',
                    '        return "";',
                    '    }',
                    '    bool exists(const string& key) override {',
                    '        // check if file exists',
                    '        return false;',
                    '    }',
                    '};',
                    '',
                    'class InMemoryStorage : public IStorage {',
                    'private:',
                    '    unordered_map<string, string> data;',
                    'public:',
                    '    void save(const string& key, const string& value) override {',
                    '        data[key] = value;',
                    '    }',
                    '    string load(const string& key) override {',
                    '        return data.count(key) ? data[key] : "";',
                    '    }',
                    '    bool exists(const string& key) override {',
                    '        return data.count(key) > 0;',
                    '    }',
                    '};',
                ]}
            />

            <LectureSubHeading title="Dependency injection" />
            <LectureP>
                <LectureTermWithTip tip="The 'D' in SOLID. High-level modules should depend on abstractions (interfaces), not concrete implementations. Enables swapping implementations (e.g. FileStorage for InMemoryStorage) without changing the high-level code.">Dependency Inversion</LectureTermWithTip> (the "D" in SOLID) means high-level modules depend on abstractions. In practice, this means <LectureTermWithTip tip="Passing a dependency into a class (via constructor, method, or setter) rather than creating it internally. The class receives its dependencies from the outside — it doesn't know or care which concrete implementation it gets.">injecting the dependency</LectureTermWithTip> <strong className="text-foreground">into</strong> the class rather than creating it internally:
            </LectureP>

            <CodeBlock language="cpp"
                title="Library depends on IStorage, not a concrete type"
                lines={[
                    'class Library {',
                    'private:',
                    '    IStorage& storage;  // depends on the interface, not a concrete class',
                    'public:',
                    '    Library(IStorage& s) : storage(s) {}',
                    '',
                    '    void addItem(const string& id, const string& data) {',
                    '        storage.save(id, data);',
                    '    }',
                    '    string getItem(const string& id) {',
                    '        return storage.load(id);',
                    '    }',
                    '};',
                    '',
                    '// Production: Library lib(fileStorage);',
                    '// Testing:    Library lib(inMemoryStorage);  — fast, no disk I/O',
                ]}
            />

            <LectureP>
                This is powerful for <strong className="text-foreground">testability</strong>. In tests, pass an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">InMemoryStorage</code> — no file system needed, tests run instantly. In production, pass a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">FileStorage</code>. The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Library</code> class does not change. This pattern scales to any external dependency: databases, network services, APIs.
            </LectureP>

            {/* ── 06 SMART POINTERS ────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Smart Pointers" />

            <LectureP>
                Raw pointers (<LectureCmd tip="Allocates memory on the heap and returns a pointer. You must manually call delete to free it. Forgetting = memory leak. Calling twice = double-free crash." warn>new</LectureCmd> / <LectureCmd tip="Frees heap memory allocated with new. Calls the destructor, then returns memory. Missing delete = leak. Double delete = crash. Use smart pointers instead." warn>delete</LectureCmd>) are the most common source of bugs in C++: memory leaks, double frees, dangling pointers, use-after-free. Smart pointers from <LectureCmd tip="Header that provides unique_ptr, shared_ptr, weak_ptr, make_unique, and make_shared. The modern C++ approach to memory management.">&lt;memory&gt;</LectureCmd> solve all of these by tying the lifetime of heap-allocated memory to the lifetime of the pointer object — this pattern is called <LectureTermWithTip tip="Resource Acquisition Is Initialization. Acquire resources (memory, file handles, locks) in a constructor; release them in the destructor. Since C++ guarantees destructors run when objects go out of scope, resources are automatically cleaned up. The foundation of smart pointers and all modern C++ resource management.">RAII</LectureTermWithTip> (Resource Acquisition Is Initialization).
            </LectureP>

            <LectureSubHeading title="unique_ptr — exclusive ownership" />
            <LectureP>
                <LectureCmd tip="Smart pointer with exclusive ownership. When it goes out of scope, the resource is automatically freed. Cannot be copied (prevents accidental sharing). Can be moved with std::move() to transfer ownership. Zero overhead vs raw pointer.">unique_ptr</LectureCmd> owns the resource exclusively. When it goes out of scope, the resource is freed. It cannot be copied (no accidental sharing), but it can be <LectureCmd tip="Transfers ownership of a resource from one unique_ptr to another. After move, the source becomes nullptr. auto b = move(a); — a is now null, b owns the resource.">moved</LectureCmd> to transfer ownership.
            </LectureP>

            <CodeBlock language="cpp"
                title="unique_ptr — automatic cleanup, no leaks"
                lines={[
                    '#include <memory>',
                    'using namespace std;',
                    '',
                    '// Prefer make_unique over raw new',
                    'auto book = make_unique<Book>("001", "Clean Code");',
                    'cout << book->getTitle() << endl;  // use like a pointer',
                    '',
                    '// Transfer ownership',
                    'auto transferred = move(book);',
                    '// book is now nullptr — transferred owns the resource',
                    '',
                    '// When transferred goes out of scope, the Book is deleted automatically.',
                    '// No manual delete needed. No leaks possible.',
                ]}
            />

            <LectureSubHeading title="shared_ptr — shared ownership" />
            <LectureP>
                <LectureCmd tip="Smart pointer with shared ownership via reference counting. Multiple shared_ptrs can point to the same resource. Freed when the last shared_ptr goes out of scope (ref count hits 0). Slightly more overhead than unique_ptr due to the counter.">shared_ptr</LectureCmd> uses <LectureTermWithTip tip="Each shared_ptr increments a counter when copied and decrements when destroyed. When the counter reaches zero, the resource is freed. Thread-safe counter updates, but the pointed-to object is NOT thread-safe by default.">reference counting</LectureTermWithTip>. Multiple <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">shared_ptr</code>s can point to the same resource; it is freed when the <strong className="text-foreground">last</strong> one goes out of scope. Use when multiple owners genuinely need the same object — for example, an observer list where multiple parts of the system hold references.
            </LectureP>

            <CodeBlock language="cpp"
                title="shared_ptr — reference-counted ownership"
                lines={[
                    'auto item = make_shared<Book>("001", "Clean Code");',
                    '// Reference count: 1',
                    '',
                    'auto copy = item;',
                    '// Reference count: 2 — both point to the same Book',
                    '',
                    'copy.reset();',
                    '// Reference count: 1 — copy released its share',
                    '',
                    '// When item goes out of scope, reference count hits 0 → Book is deleted.',
                ]}
            />

            <LectureSubHeading title="When to use which" />
            <LectureP>
                <strong className="text-foreground">Default to <LectureCmd tip="The right choice 90% of the time. Zero overhead, clear ownership semantics, cannot be accidentally shared. Use shared_ptr only when you truly have shared ownership.">unique_ptr</LectureCmd></strong>. It has zero overhead compared to a raw pointer and expresses single ownership clearly. Use <LectureCmd tip="Only when multiple parts of the code genuinely need to own the same resource. Adds overhead (reference counting, control block). If one part is the clear owner and others just need to use it temporarily, prefer unique_ptr + raw references.">shared_ptr</LectureCmd> only when you genuinely have shared ownership (it adds the cost of reference counting). If a function needs to <strong className="text-foreground">use</strong> an object but not <strong className="text-foreground">own</strong> it, take a raw reference (<LectureCmd tip="A const reference to a Book. The function can read the Book but not modify it and does not own it. The smart pointer stays with the owner; the function just borrows access.">const Book&</LectureCmd>) or raw pointer — the smart pointer stays with the owner.
            </LectureP>

            <LectureCallout type="info">
                Smart pointers make the <LectureTermWithTip tip="If you define a destructor, copy constructor, or copy-assignment operator, you need all three. Smart pointers and STL containers handle this automatically, making the Rule of Three unnecessary for most application code.">Rule of Three</LectureTermWithTip> from Lecture 1 largely unnecessary for most application code. If all your resources are managed by smart pointers and STL containers, the compiler-generated copy/move/destructor will do the right thing. Manual resource management is still relevant for low-level or embedded code, but for application development, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unique_ptr</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">shared_ptr</code> handle it.
            </LectureCallout>

            {/* ── 07 PUTTING IT ALL TOGETHER ────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Putting It All Together" />

            <LectureP>
                In the activity, you will build a <strong className="text-foreground">CLI Phonebook</strong> — a full-featured command-line application that uses almost everything from these two lectures. Here is how the concepts connect:
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs">
                <p className="text-muted-foreground mb-4 font-sans text-xs font-semibold">Architecture — CLI Phonebook</p>
                <div className="space-y-2 text-muted-foreground leading-relaxed">
                    <p><span className="text-blue-500 font-bold">Contact</span> (class) — encapsulates name, phone, email with getters</p>
                    <p className="pl-4">↓ stored in</p>
                    <p><span className="text-emerald-500 font-bold">BST{'<Contact*>'}</span> — binary search tree for sorted storage + O(log n) search</p>
                    <p className="pl-4">↓ indexed by</p>
                    <p><span className="text-orange-500 font-bold">{'unordered_map<string, Contact*>'}</span> — phone → contact lookup for O(1) search by phone</p>
                    <p className="pl-4">↓ actions tracked by</p>
                    <p><span className="text-purple-500 font-bold">{'stack<Action>'}</span> — undo stack records add/delete operations</p>
                    <p className="pl-4">↓ all managed by</p>
                    <p><span className="text-red-500 font-bold">Phonebook</span> (class) — facade that coordinates BST, map, and undo stack</p>
                    <p className="pl-4">↓ driven by</p>
                    <p><span className="text-foreground font-bold">main()</span> — menu loop using cout/cin from Section 01 of Lecture 1</p>
                </div>
            </div>

            <LectureP>
                <strong className="text-foreground">Encapsulation:</strong> Contact hides its data behind getters. <strong className="text-foreground">Composition:</strong> Phonebook <em>has-a</em> BST and <em>has-a</em> stack — it does not inherit from either. <strong className="text-foreground">STL containers:</strong> <LectureCmd tip="LIFO container. push/top/pop. Used for the undo stack — records each add/delete action so the last one can be reversed.">stack</LectureCmd>, <LectureCmd tip="Hash map. O(1) average lookup by phone number. The secondary index for instant search-by-phone.">unordered_map</LectureCmd>, <LectureCmd tip="Dynamic array. Used internally to collect results or temporarily store contact lists.">vector</LectureCmd> for storage and indexing. <strong className="text-foreground">Single Responsibility:</strong> BST handles sorted storage, the map handles phone lookup, the stack handles undo — each class owns one concern.
            </LectureP>

            <LectureCallout type="tip">
                For continued practice with algorithms and data structures, the <strong className="text-foreground">NeetCode 150</strong> is the gold standard problem set for interview prep. It covers every pattern — arrays, two pointers, sliding window, stack, trees, graphs, DP — organized by category so patterns build on each other.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Classes, Encapsulation & Inheritance',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/lecture-1'),
                }}
                next={{
                    label: 'CLI Phonebook',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/activity'),
                }}
            />
        </LectureLayout>
    );
}
