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

export default function Week6Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={6}
                session="Lecture 1"
                title="Classes, Encapsulation & Inheritance"
                description="C++ OOP from the ground up — classes, access modifiers, constructors, inheritance chains, and the virtual keyword that makes polymorphism possible."
                icon={<Cpu className="h-4 w-4" />}
            />

            {/* ── 01 WHY C++ FOR OOP ──────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Why C++ for OOP?" />

            <LectureP>
                You've been writing Python and TypeScript. C++ gives you direct control over memory and a type system that makes object boundaries explicit. For systems code and technical interviews, C++ OOP — classes, access modifiers, constructors, inheritance — is the reference model. What you learn here maps to every language: Python's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">self</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">super()</code>, TypeScript's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">extends</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">implements</code>, and Java/C# classes all follow the same ideas. C++ makes the machinery visible so you see exactly when constructors run, when virtual dispatch happens, and what &quot;pass by reference&quot; means.
            </LectureP>
            <LectureP>
                This lecture focuses on <strong className="text-foreground">classes, encapsulation, and inheritance</strong>. Next lecture we'll cover polymorphism, abstract base classes, and the STL. Compile with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">g++ -std=c++17 -Wall file.cpp -o file</code>; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-Wall</code> turns on warnings — treat them as bugs.
            </LectureP>

            <LectureCallout type="info">
                <strong className="text-foreground">Encapsulation</strong> means hiding internal state and exposing only a clear interface. It prevents callers from putting your object into an invalid state and lets you change implementation details without breaking the rest of the codebase.
            </LectureCallout>

            {/* ── 02 THE FOUR OOP PRINCIPLES ──────────────────────────────────── */}
            <LectureSectionHeading number="02" title="The Four OOP Principles" />

            <LectureP>
                Object-Oriented Programming organizes software around objects — data bundled with the functions that operate on it. Four principles underpin OOP: <strong className="text-foreground">encapsulation</strong> (hide internal state), <strong className="text-foreground">inheritance</strong> (reuse and extend), <strong className="text-foreground">polymorphism</strong> (same interface, different behavior), and <strong className="text-foreground">abstraction</strong> (expose what, hide how). We focus on encapsulation and inheritance in this lecture.
            </LectureP>

            <div className="my-6 space-y-4">
                {[
                    { principle: 'Encapsulation', color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', bg: 'bg-blue-50 dark:bg-blue-950/20', def: 'Bundle data and methods together. Hide internal state — expose only what users of the class need.', why: 'Prevents external code from putting an object into an invalid state.' },
                    { principle: 'Inheritance', color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50 dark:bg-emerald-950/20', def: 'A derived class gets the data and methods of its base class and can extend or override them.', why: 'Eliminates duplication for related types (e.g. Dog and Cat extending Animal).' },
                    { principle: 'Polymorphism', color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', bg: 'bg-orange-100 dark:bg-orange-950/20', def: 'The same interface works for different types. Call speak() on any Animal — each responds differently.', why: 'Next lecture: virtual methods and abstract base classes.' },
                    { principle: 'Abstraction', color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', bg: 'bg-purple-50 dark:bg-purple-950/20', def: 'Expose what a class does, hide how. Users of std::vector don\'t need to know about resizing.', why: 'Reduces cognitive load; good APIs are abstract.' },
                ].map((item) => (
                    <div key={item.principle} className={`rounded-xl border ${item.border} overflow-hidden`}>
                        <div className={`px-4 py-2.5 ${item.bg}`}>
                            <p className={`text-xs font-black uppercase tracking-widest ${item.color}`}>{item.principle}</p>
                            <p className="text-xs text-foreground mt-1">{item.def}</p>
                        </div>
                        <div className="px-4 py-2.5">
                            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Why:</span> {item.why}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 03 ACCESS MODIFIERS — PUBLIC, PRIVATE, PROTECTED ────────────── */}
            <LectureSectionHeading number="03" title="Access Modifiers — Public, Private, Protected" />

            <LectureP>
                C++ gives you explicit control over who can see what. By default, a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class</code> has private members until you say otherwise; a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">struct</code> has public members by default. The only difference is that default — use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">struct</code> for plain data (POD, no invariants) and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class</code> when you're building an abstraction with an interface.
            </LectureP>

            <div className="my-6 rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-semibold text-foreground">Who can access what</p>
                </div>
                <div className="divide-y divide-border">
                    <div className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground">public:</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Anyone can call or read. Your API — constructors, getters, methods that change state in valid ways.</p>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground">private:</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Only this class. Derived classes cannot see private members. Use for implementation details and invariants.</p>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground">protected:</p>
                        <p className="text-xs text-muted-foreground mt-0.5">This class and derived classes. Lets subclasses access or extend internal state without exposing it to the world. Use sparingly — it tightens coupling between base and derived.</p>
                    </div>
                </div>
            </div>

            <LectureCallout type="tip">
                Prefer <strong className="text-foreground">private</strong> unless you have a clear reason for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">protected</code>. Protected members become part of your inheritance contract; changing them can break every derived class.
            </LectureCallout>

            {/* ── 04 OOP IN C++ — CLASSES, CONSTRUCTORS, INHERITANCE ───────────── */}
            <LectureSectionHeading number="04" title="OOP in C++ — Classes, Constructors & Inheritance" />

            <LectureP>
                A <LectureTerm>class</LectureTerm> bundles data (member variables) and behavior (member functions). Constructors initialize the object; use the <strong className="text-foreground">initializer list</strong> (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">: title(t), author(a)</code>) to set members before the body runs — it's required for <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">const</code> members and references, and often more efficient.
            </LectureP>

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
                    '    // Constructor — initializer list : title(t), author(a)',
                    '    Book(string t, string a) : title(t), author(a) {}',
                    '',
                    '    string getTitle()  const { return title; }',
                    '    string getAuthor() const { return author; }',
                    '    bool isAvailable() const { return !checkedOut; }',
                    '',
                    '    bool checkout() {',
                    '        if (checkedOut) return false;',
                    '        checkedOut = true;',
                    '        return true;',
                    '    }',
                    '    void returnBook() { checkedOut = false; }',
                    '};',
                ]}
            />

            <LectureCallout type="tip">
                Use the <strong className="text-foreground">constructor initializer list</strong> (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">: title(t), author(a)</code>) to initialize members. It runs before the constructor body and is required for const members and references.
            </LectureCallout>

            <LectureSubHeading title="Initializer list order" />
            <LectureP>
                Members are always initialized in the <strong className="text-foreground">order they are declared in the class</strong>, not the order you list them in the initializer list. If your list order doesn't match declaration order, you can get subtle bugs (e.g. member A is initialized using member B, but B isn't initialized yet). Keep declaration order and list order the same, and put base class and members in a logical order (base first, then members top to bottom).
            </LectureP>

            <LectureSubHeading title="Const correctness" />
            <LectureP>
                Mark member functions that don't modify the object with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">const</code> at the end: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string getTitle() const;</code>. That's a promise: "this function won't change any member." Getters and inspectors should be const. Const objects can only call const member functions. When you take a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">const LibraryItem&amp;</code>, you're promising not to modify it — so only const methods are callable. Getting const right from the start makes APIs easier to use and prevents accidental mutations.
            </LectureP>

            <LectureP>
                <LectureTerm>Inheritance</LectureTerm> lets a derived class reuse and extend a base class. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual</code> so that calls through a base pointer invoke the derived class's override. A <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual</code> destructor in the base is required when you delete through a base pointer — otherwise the derived destructor won't run.
            </LectureP>

            <CppBlock
                title="inheritance + virtual methods"
                lines={[
                    'class LibraryItem {',
                    'public:',
                    '    string id, title;',
                    '    LibraryItem(string i, string t) : id(i), title(t) {}',
                    '    virtual string getType() const { return "Item"; }',
                    '    virtual int getLoanDays() const = 0;  // pure virtual — must override',
                    '    virtual ~LibraryItem() {}  // required for correct cleanup',
                    '};',
                    '',
                    'class Book : public LibraryItem {',
                    'public:',
                    '    Book(string i, string t) : LibraryItem(i, t) {}',
                    '    string getType() const override { return "Book"; }',
                    '    int getLoanDays() const override { return 21; }',
                    '};',
                    '',
                    '// Polymorphism: same code works for any LibraryItem',
                    'void printInfo(const LibraryItem& item) {',
                    '    cout << item.getType() << " — " << item.getLoanDays() << " days" << endl;',
                    '}',
                ]}
            />

            <LectureCallout type="warning">
                <strong className="text-foreground">Slicing:</strong> assigning a derived object to a base by value copies only the base part; the derived data is "sliced off." Always pass base classes by reference or pointer (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">const LibraryItem&</code>) to preserve polymorphic behavior.
            </LectureCallout>

            <LectureSubHeading title="Constructor and destructor order" />
            <LectureP>
                When you create a derived object, the base constructor runs first, then the derived constructor. When it's destroyed (e.g. goes out of scope or you <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete</code> a base pointer), the derived destructor runs first, then the base. So: base builds the foundation, derived builds on top; on teardown, derived cleans up first, then base. That's why a non-virtual destructor in the base is dangerous — only the base destructor runs when you delete through a base pointer, and the derived part is never cleaned up.
            </LectureP>

            <LectureCallout type="tip">
                Always declare destructors <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual</code> in base classes that have virtual methods. Without it, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete basePtr</code> only runs the base destructor — the derived destructor won't run, leaking resources.
            </LectureCallout>

            {/* ── 05 COMPOSITION VS INHERITANCE ─────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Composition vs Inheritance" />

            <LectureP>
                Inheritance models an <strong className="text-foreground">is-a</strong> relationship: a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Book</code> is a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">LibraryItem</code>. Composition models <strong className="text-foreground">has-a</strong>: a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Library</code> has a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector&lt;LibraryItem*&gt;</code> and a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_map</code> for loans. Prefer composition when you're reusing behavior or data without needing to substitute one type for another through a common interface. Prefer inheritance when you have a true subtype: multiple classes that share an interface and can be used interchangeably (e.g. passed to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">printInfo(const LibraryItem&)</code>).
            </LectureP>

            <LectureP>
                Deep inheritance hierarchies (A → B → C → D) are hard to maintain and test. If you find yourself going beyond one level of derivation, ask whether composition or a flatter design would work. "Favor composition over inheritance" is a design guideline, not a law — use inheritance where polymorphism is the goal, composition everywhere else.
            </LectureP>

            {/* ── 06 RULE OF THREE & RESOURCE MANAGEMENT ───────────────────────── */}
            <LectureSectionHeading number="06" title="Rule of Three & Resource Management" />

            <LectureP>
                If your class manages a resource (raw pointer, file handle, etc.), the compiler-generated copy constructor and copy-assignment operator do a <strong className="text-foreground">shallow copy</strong> — they copy the pointer, not what it points to. Then two objects think they own the same resource; when one is destroyed, it frees the memory and the other is left with a dangling pointer. The <strong className="text-foreground">rule of three</strong>: if you define one of destructor, copy constructor, or copy-assignment operator, you usually need to define all three (or explicitly delete the copies and use move semantics). For now, prefer STL containers and smart pointers so the compiler-generated behavior is correct; when you write a class that holds <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string</code>, the default copy is deep and correct.
            </LectureP>

            <LectureCallout type="info">
                In C++11 and later, the &quot;rule of five&quot; adds move constructor and move assignment. For interview-level code and most application logic, stick to values and STL types and you rarely need to implement these yourself.
            </LectureCallout>

            {/* ── 07 ANOTHER EXAMPLE — INVARIANTS IN PRACTICE ─────────────────── */}
            <LectureSectionHeading number="07" title="Another Example — Invariants in Practice" />

            <LectureP>
                Encapsulation is about enforcing <strong className="text-foreground">invariants</strong> — conditions that are always true for your object. A bank account balance should never be negative; a connection handle should never be used after close. Expose only operations that preserve the invariant.
            </LectureP>

            <CppBlock
                title="BankAccount — balance never goes negative"
                lines={[
                    'class BankAccount {',
                    'private:',
                    '    double balance = 0.0;   // invariant: balance >= 0',
                    '',
                    'public:',
                    '    bool deposit(double amount) {',
                    '        if (amount <= 0) return false;',
                    '        balance += amount;',
                    '        return true;',
                    '    }',
                    '',
                    '    bool withdraw(double amount) {',
                    '        if (amount <= 0 || amount > balance) return false;',
                    '        balance -= amount;',
                    '        return true;',
                    '    }',
                    '',
                    '    double getBalance() const { return balance; }  // const: does not modify',
                    '};',
                    '',
                    '// Callers cannot set balance directly — only deposit/withdraw.',
                    '// So the invariant "balance >= 0" is always maintained.',
                ]}
            />

            <LectureSubHeading title="Common pitfalls to avoid" />
            <LectureP>
                <strong className="text-foreground">Virtual destructor:</strong> Base class with virtual methods must have a virtual destructor; otherwise <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete basePtr</code> leaks the derived part. <strong className="text-foreground">Slicing:</strong> Passing or assigning by value copies only the base; use reference or pointer. <strong className="text-foreground">Const:</strong> Mark getters and read-only methods <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">const</code> so they work on const objects. <strong className="text-foreground">Initializer list:</strong> Use it for all members when possible; required for const and reference members. <strong className="text-foreground">Protected vs private:</strong> Prefer private; use protected only when derived classes genuinely need access.
            </LectureP>

            <LectureFooterNav
                prev={{
                    label: 'Build Your Frontend',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-5/activity'),
                }}
                next={{
                    label: 'Polymorphism, STL & System Design',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-6/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}