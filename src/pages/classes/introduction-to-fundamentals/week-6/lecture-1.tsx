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
                You've been writing Python and TypeScript. C++ gives you direct control over memory and a type system that makes object boundaries explicit. For systems code and technical interviews, C++ OOP — classes, access modifiers, constructors, inheritance — is the reference model. What you learn here maps to every language.
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
                    { principle: 'Polymorphism', color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', bg: 'bg-orange-50 dark:bg-orange-950/20', def: 'The same interface works for different types. Call speak() on any Animal — each responds differently.', why: 'Next lecture: virtual methods and abstract base classes.' },
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

            {/* ── 03 OOP IN C++ — CLASSES, CONSTRUCTORS, INHERITANCE ───────────── */}
            <LectureSectionHeading number="03" title="OOP in C++ — Classes, Constructors & Inheritance" />

            <LectureP>
                In C++, a <LectureTerm>class</LectureTerm> bundles data (member variables) and behavior (member functions). <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">private:</code> members are only accessible inside the class; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">public:</code> members form the interface. Constructors initialize the object; use the <strong className="text-foreground">initializer list</strong> to set members before the body runs.
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

            <LectureCallout type="tip">
                Always declare destructors <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual</code> in base classes that have virtual methods. Without it, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete basePtr</code> only runs the base destructor — the derived destructor won't run, leaking resources.
            </LectureCallout>


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