import { useNavigate } from 'react-router-dom';
import { Binary } from 'lucide-react';
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

// ── Design pattern cards ──────────────────────────────────────────────────────
const PatternCards = () => (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
            {
                name: 'Singleton',
                category: 'Creational',
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
                problem: 'You need exactly one instance of a class — a database connection, a config manager, a logger.',
                signal: 'When you find yourself passing the same object everywhere, or using global variables to share state.',
            },
            {
                name: 'Observer',
                category: 'Behavioral',
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800',
                problem: 'One object changes state and multiple other objects need to be notified automatically.',
                signal: 'Event systems, UI state changes, notification systems. React\'s useState is Observer at the framework level.',
            },
            {
                name: 'Factory',
                category: 'Creational',
                color: 'text-orange-600 dark:text-orange-400',
                bg: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
                problem: 'You need to create objects without specifying the exact class — the type is determined at runtime.',
                signal: 'When you have if/else or switch on a type to decide which object to create. Replace that with a factory.',
            },
        ].map((p) => (
            <div key={p.name} className={`rounded-xl border ${p.bg} overflow-hidden`}>
                <div className="px-4 py-3 border-b border-inherit">
                    <p className={`text-xs font-black ${p.color}`}>{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                    <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">Problem it solves</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.problem}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">Recognize it when</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.signal}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function Week7Lecture2() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={7}
                session="Lecture 2"
                title="Hash Maps, Complexity & Interview Patterns"
                description="Hash maps, Big-O analysis, two-pointer and sliding window patterns — the toolkit for turning O(n²) brute-force solutions into O(n) answers."
                icon={<Binary className="h-4 w-4" />}
            />

            {/* ── 01 DESIGN BEFORE CODE ───────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Design Before Code" />

            <LectureP>
                The most expensive bugs in software are design bugs — wrong abstractions, wrong relationships between classes, wrong assumptions about what will change. A design bug found in the planning phase costs an hour to fix. Found in production, it costs weeks of refactoring.
            </LectureP>
            <LectureP>
                Good OOP design starts with three questions: <strong className="text-foreground">What are the entities?</strong> (nouns → classes), <strong className="text-foreground">What do they do?</strong> (verbs → methods), and <strong className="text-foreground">What changes, and what stays the same?</strong> The answer to the third question determines where you use interfaces and abstraction.
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                <p className="text-xs font-semibold text-foreground">Design exercise: Library Management System</p>
                {[
                    { q: 'What are the entities?', a: 'Book, DVD, Magazine, Member, Loan, Library — each becomes a class' },
                    { q: 'What do they do?', a: 'checkout(), returnItem(), search(), addMember(), getLoanHistory() — these become methods' },
                    { q: 'What changes?', a: 'New item types will be added. Loan durations differ per type. New payment methods might be added for fines.' },
                    { q: 'What stays the same?', a: 'The checkout/return flow is always the same regardless of item type. This is the interface.' },
                ].map((row) => (
                    <div key={row.q} className="rounded-lg border border-border bg-card p-3">
                        <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">{row.q}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{row.a}</p>
                    </div>
                ))}
            </div>

            {/* ── 02 SOLID PRINCIPLES ─────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="SOLID — The Five Design Principles" />

            <LectureP>
                <LectureTerm>SOLID</LectureTerm> is the standard vocabulary for OOP design quality. You'll hear these in code reviews and design discussions throughout your career. You don't need to memorize the names — you need to recognize the problems they solve.
            </LectureP>

            <div className="my-6 space-y-3">
                {[
                    {
                        letter: 'S',
                        name: 'Single Responsibility',
                        rule: 'A class should have one reason to change.',
                        bad: 'A User class that handles authentication, database persistence, AND email sending.',
                        good: 'UserAuth, UserRepository, EmailService — each focused, independently changeable.',
                    },
                    {
                        letter: 'O',
                        name: 'Open/Closed',
                        rule: 'Open for extension, closed for modification.',
                        bad: 'Adding a new item type requires editing a switch statement inside Library.',
                        good: 'New item type inherits from LibraryItem — no existing code changes.',
                    },
                    {
                        letter: 'L',
                        name: 'Liskov Substitution',
                        rule: 'A derived class must be substitutable for its base class without breaking the program.',
                        bad: 'A Square inheriting Rectangle and overriding setWidth to also set height — breaks Rectangle callers.',
                        good: 'DVD and Book both work anywhere a LibraryItem is expected, no surprises.',
                    },
                    {
                        letter: 'I',
                        name: 'Interface Segregation',
                        rule: 'Don\'t force classes to implement methods they don\'t use.',
                        bad: 'A Printable interface with print(), fax(), and scan() — most classes only need print().',
                        good: 'Separate Printable, Faxable, Scannable interfaces — implement only what applies.',
                    },
                    {
                        letter: 'D',
                        name: 'Dependency Inversion',
                        rule: 'Depend on abstractions, not concrete implementations.',
                        bad: 'Library holds a vector<SQLiteDatabase*> — now you can\'t swap databases.',
                        good: 'Library depends on a Database interface — works with SQLite, Postgres, or a mock in tests.',
                    },
                ].map((p) => (
                    <div key={p.letter} className="rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
                            <span className="text-2xl font-black text-primary/20 select-none">{p.letter}</span>
                            <div>
                                <p className="text-xs font-bold text-foreground">{p.name} Principle</p>
                                <p className="text-xs text-muted-foreground">{p.rule}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                            <div className="px-4 py-2.5">
                                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">❌ Violation</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{p.bad}</p>
                            </div>
                            <div className="px-4 py-2.5">
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">✅ Compliant</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{p.good}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 03 DESIGN PATTERNS ──────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Design Patterns" />

            <LectureP>
                <LectureTerm>Design patterns</LectureTerm> are named, reusable solutions to recurring design problems. They're not code you copy — they're vocabulary for describing structures. When a senior engineer says "use a Factory here," they mean a specific structure with known tradeoffs. Learn the three most common:
            </LectureP>

            <PatternCards />

            <LectureSubHeading title="Singleton in C++" />

            <CppBlock
                title="Singleton — thread-safe with static local (C++11+)"
                lines={[
                    'class Logger {',
                    'public:',
                    '    // Delete copy constructor and assignment — no duplicates',
                    '    Logger(const Logger&) = delete;',
                    '    Logger& operator=(const Logger&) = delete;',
                    '',
                    '    static Logger& getInstance() {',
                    '        static Logger instance;  // initialized once, guaranteed thread-safe',
                    '        return instance;',
                    '    }',
                    '',
                    '    void log(const string& message) {',
                    '        cout << "[LOG] " << message << endl;',
                    '    }',
                    '',
                    'private:',
                    '    Logger() {}  // private constructor — prevent direct instantiation',
                    '};',
                    '',
                    '// Usage — no new, no pointer, no global variable',
                    '// Logger::getInstance().log("System started");',
                ]}
            />

            <LectureSubHeading title="Observer in C++" />

            <CppBlock
                title="Observer — event subscription and notification"
                lines={[
                    '// Abstract observer — anything that wants to be notified',
                    'class Observer {',
                    'public:',
                    '    virtual void onEvent(const string& event) = 0;',
                    '    virtual ~Observer() {}',
                    '};',
                    '',
                    '// Subject — holds observers and fires events',
                    'class EventEmitter {',
                    'private:',
                    '    vector<Observer*> observers;',
                    'public:',
                    '    void subscribe(Observer* obs) { observers.push_back(obs); }',
                    '',
                    '    void emit(const string& event) {',
                    '        for (Observer* obs : observers) obs->onEvent(event);',
                    '    }',
                    '};',
                    '',
                    '// Concrete observer — e.g. the Library notifying members on overdue items',
                    'class EmailNotifier : public Observer {',
                    'public:',
                    '    void onEvent(const string& event) override {',
                    '        cout << "Email sent: " << event << endl;',
                    '    }',
                    '};',
                ]}
            />

            <LectureSubHeading title="Factory in C++" />

            <CppBlock
                title="Factory — create objects without specifying the concrete class"
                lines={[
                    '// Without factory: the caller knows too much',
                    '// if (type == "book")    item = new Book(...);',
                    '// else if (type == "dvd") item = new DVD(...);',
                    '// This switch lives everywhere. Adding a new type = update all callsites.',
                    '',
                    '// With factory: creation logic in one place',
                    'class ItemFactory {',
                    'public:',
                    '    static LibraryItem* create(const string& type, const string& id, const string& title) {',
                    '        if (type == "book")     return new Book(id, title, "Unknown", 0);',
                    '        if (type == "dvd")      return new DVD(id, title, "Unknown", 0);',
                    '        if (type == "magazine") return new Magazine(id, title, 0, "Unknown");',
                    '        return nullptr;',
                    '    }',
                    '};',
                    '',
                    '// Usage — caller never touches Book/DVD/Magazine constructors directly',
                    '// LibraryItem* item = ItemFactory::create("book", "001", "Clean Code");',
                ]}
            />

            {/* ── 04 INTERFACES IN C++ ────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Interfaces via Pure Abstract Classes" />

            <LectureP>
                C++ has no <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">interface</code> keyword — interfaces are implemented as classes where every method is pure virtual. This is the primary tool for the Dependency Inversion Principle: your high-level code depends on the interface, not the concrete implementation.
            </LectureP>

            <CppBlock
                title="interface pattern — swappable implementations"
                lines={[
                    '// The interface — what Library cares about',
                    'class IStorage {',
                    'public:',
                    '    virtual void save(const string& id, const string& data) = 0;',
                    '    virtual string load(const string& id) = 0;',
                    '    virtual ~IStorage() {}',
                    '};',
                    '',
                    '// Concrete implementation 1 — file system',
                    'class FileStorage : public IStorage {',
                    'public:',
                    '    void save(const string& id, const string& data) override { /* write to file */ }',
                    '    string load(const string& id) override { return ""; /* read from file */ }',
                    '};',
                    '',
                    '// Concrete implementation 2 — in-memory (great for tests)',
                    'class InMemoryStorage : public IStorage {',
                    '    unordered_map<string, string> store;',
                    'public:',
                    '    void save(const string& id, const string& data) override { store[id] = data; }',
                    '    string load(const string& id) override { return store.count(id) ? store[id] : ""; }',
                    '};',
                    '',
                    '// Library depends on the interface, not the concrete type',
                    'class Library {',
                    '    IStorage* storage;  // pointer to interface — could be either implementation',
                    'public:',
                    '    Library(IStorage* s) : storage(s) {}',
                    '    // ... now swapping storage requires zero changes to Library',
                    '};',
                ]}
            />

            <LectureCallout type="tip">
                Depending on interfaces instead of concrete classes makes your code <LectureTerm>testable</LectureTerm>. In tests, inject <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">InMemoryStorage</code> — no disk I/O, runs instantly, always clean. In production, inject <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">FileStorage</code> or a database implementation. Same Library code. This is called <strong className="text-foreground">dependency injection</strong>.
            </LectureCallout>

            {/* ── 05 SMART POINTERS ───────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Smart Pointers — Automatic Memory Management" />

            <LectureP>
                Raw pointers (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">new</code> / <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete</code>) are error-prone. Forget to delete and you leak memory. Delete twice and you crash. C++11 introduced <LectureTerm>smart pointers</LectureTerm> that manage memory automatically through RAII (Resource Acquisition Is Initialization).
            </LectureP>

            <CppBlock
                title="unique_ptr and shared_ptr — prefer over raw pointers"
                lines={[
                    '#include <memory>',
                    '',
                    '// unique_ptr — sole owner. Memory freed when pointer goes out of scope.',
                    '// Use for: class members, factory return values, anything with one owner.',
                    'unique_ptr<Book> book = make_unique<Book>("001", "Clean Code", "Martin", 431);',
                    '// book->getTitle() works normally',
                    '// No delete needed — freed automatically when book leaves scope',
                    '',
                    '// shared_ptr — reference counted. Freed when last owner is gone.',
                    '// Use for: shared ownership, observer lists, graph nodes.',
                    'shared_ptr<LibraryItem> item = make_shared<Book>("002", "SICP", "Abelson", 657);',
                    'shared_ptr<LibraryItem> copy = item;  // ref count = 2',
                    '// item freed only when both item and copy go out of scope',
                    '',
                    '// In your Library class — prefer this over raw vector<LibraryItem*>',
                    'vector<unique_ptr<LibraryItem>> catalog;',
                    'catalog.push_back(make_unique<Book>("003", "The Pragmatic Programmer", "Hunt", 352));',
                    '// Destructor frees everything automatically — no manual cleanup needed',
                ]}
            />

            {/* ── 06 PUTTING IT TOGETHER ──────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="The Complete Design" />

            <LectureP>
                Here's the full architecture of the system you'll build in the activity, applying everything from this lecture:
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden font-mono text-xs">
                {[
                    { label: 'IStorage', note: 'interface — save/load abstract operations', color: 'text-purple-600 dark:text-purple-400' },
                    { label: '  ↳ FileStorage, InMemoryStorage', note: 'concrete implementations', color: 'text-muted-foreground' },
                    { label: 'LibraryItem', note: 'abstract base — id, title, checkout(), pure virtual getType()/getLoanDays()', color: 'text-blue-600 dark:text-blue-400' },
                    { label: '  ↳ Book, DVD, Magazine', note: 'concrete items — override type and loan period', color: 'text-muted-foreground' },
                    { label: 'ItemFactory', note: 'static factory — create(type, id, title) → LibraryItem*', color: 'text-orange-600 dark:text-orange-400' },
                    { label: 'Observer / EventEmitter', note: 'notification when items go overdue or are checked out', color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Library', note: 'orchestrator — holds catalog (vector<unique_ptr<LibraryItem>>), depends on IStorage', color: 'text-rose-600 dark:text-rose-400' },
                    { label: 'Logger (Singleton)', note: 'single shared log for all operations', color: 'text-zinc-500' },
                ].map((row) => (
                    <div key={row.label} className="flex items-start gap-4 px-4 py-2.5 border-b border-border last:border-b-0">
                        <code className={`shrink-0 w-72 ${row.color}`}>{row.label}</code>
                        <span className="text-muted-foreground text-xs">{row.note}</span>
                    </div>
                ))}
            </div>

            <LectureCallout type="info">
                You won't implement every layer in the activity — the storage interface and full observer system are bonus challenges. But designing with this architecture in mind from the start means the code is <em>ready</em> for those extensions. That's the point of good design: it makes change cheap.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Trees, Stacks & Queues',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/lecture-1'),
                }}
                next={{
                    label: 'CLI Phonebook — Part 2',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/activity'),
                }}
            />
        </LectureLayout>
    );
}