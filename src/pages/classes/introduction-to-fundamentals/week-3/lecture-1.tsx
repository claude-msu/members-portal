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

export default function Week3Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={3}
                session="Lecture 1"
                title="Classes, Encapsulation & Inheritance"
                description="C++ OOP from the ground up — classes, access modifiers, constructors, inheritance chains, and the virtual keyword that makes polymorphism possible."
                icon={<Cpu className="h-4 w-4" />}
            />

            {/* ── 01 C++ ESSENTIALS ────────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="C++ Essentials" />

            <LectureP>
                C++ is a <LectureTermWithTip tip="Types are declared at compile time — the compiler checks them before the program runs. Catches type errors early instead of at runtime like Python.">statically typed</LectureTermWithTip>, <LectureTermWithTip tip="Source code is translated into machine code by a compiler before execution. Faster than interpreted languages but requires a compile step.">compiled</LectureTermWithTip> language. Unlike Python, where you run <LectureCmd tip="Invokes the Python interpreter to execute the script directly. No compile step — types are checked at runtime.">python script.py</LectureCmd> and the interpreter figures out types at runtime, C++ requires you to declare types up front and compile your code into a binary before running it. This gives you direct control over memory and performance — which is why operating systems, game engines, databases, and embedded systems are written in C++.
            </LectureP>

            <LectureSubHeading title="Types" />

            <LectureP>
                Every variable must have a type declared at creation. The core types: <LectureCmd tip="Whole numbers: -2, 0, 42. 32-bit signed integer on most systems. Range: roughly ±2 billion.">int</LectureCmd>, <LectureCmd tip="Floating-point decimals: 3.14, -0.5. 64-bit, ~15 digits of precision. Use for money? No — use integers of cents.">double</LectureCmd>, <LectureCmd tip="true or false. 1 byte. Used in conditions, flags, and return values. In C++, 0 is false, anything else is true.">bool</LectureCmd>, <LectureCmd tip="A single character: 'A', '7', '\\n'. 1 byte. Use single quotes. A string is a sequence of chars.">char</LectureCmd>, and <LectureCmd tip="Text type from <string>. Dynamically sized, heap-allocated. Use double quotes. Unlike C strings (char*), std::string manages its own memory.">string</LectureCmd> (from <LectureCmd tip="Standard library header that provides the std::string type. Always #include this when using strings.">&lt;string&gt;</LectureCmd>). Once declared, a variable's type cannot change — <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int x = 5;</code> cannot later become a string. Use <LectureCmd tip="Let the compiler infer the type from the right-hand side. auto x = 5; is int. auto s = string('hi'); is string. Useful with complex types like iterators.">auto</LectureCmd> to let the compiler infer the type when it is obvious from context.
            </LectureP>

            <LectureSubHeading title="Includes, main, and namespaces" />

            <LectureP>
                C++ uses <LectureCmd tip="Preprocessor directive that copies the contents of a header file into your source. Like Python's import, but it literally pastes the header's text into your file before compilation.">#include</LectureCmd> to import library headers. <LectureCmd tip="Input/Output stream library. Provides cout (output), cin (input), cerr (error output), and endl (newline + flush).">&lt;iostream&gt;</LectureCmd> gives you <LectureCmd tip="Character output stream. Use << to insert values: cout << 'Hello' << endl; Chains left to right.">cout</LectureCmd> and <LectureCmd tip="Character input stream. Use >> to extract values: cin >> x; Reads one whitespace-delimited token. Stops at spaces.">cin</LectureCmd>. <LectureCmd tip="Provides the std::string type for text manipulation. Always include this — string is not a built-in type like int.">&lt;string&gt;</LectureCmd> gives you the string type. <LectureCmd tip="Dynamic array that grows automatically. The default container for lists of things. #include <vector> to use it.">&lt;vector&gt;</LectureCmd> gives you dynamic arrays. Every C++ program starts at <LectureCmd tip="The entry point. The OS calls this function when your program launches. Returns int — 0 means success, non-zero means error.">int main()</LectureCmd> and conventionally ends with <LectureCmd tip="Tells the OS the program succeeded. Non-zero values indicate errors. Required by the int return type of main().">return 0;</LectureCmd> to indicate success.
            </LectureP>
            <LectureP>
                Standard library names live in the <LectureCmd tip="The namespace that contains all standard library names: cout, string, vector, map, etc. Short for 'standard.'">std</LectureCmd> namespace. Without <LectureCmd tip="Imports all names from the std namespace into global scope so you can write cout instead of std::cout. Convenient for learning; avoid in headers or large projects to prevent name collisions.">using namespace std;</LectureCmd>, you would have to write <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::cout</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::string</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::vector</code> everywhere. In production code, explicit <LectureCmd tip="The scope resolution operator. std::cout means 'cout from the std namespace.' Preferred in production to avoid name collisions between libraries.">std::</LectureCmd> is preferred to avoid name collisions, but for learning and in single-file programs, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">using namespace std;</code> is fine. All examples in this course use it.
            </LectureP>

            <CodeBlock language="cpp"
                title="hello.cpp — your first complete C++ program"
                lines={[
                    '#include <iostream>',
                    '#include <string>',
                    'using namespace std;',
                    '',
                    'int main() {',
                    '    string name = "world";',
                    '    int year = 2026;',
                    '    double pi = 3.14159;',
                    '    bool enrolled = true;',
                    '',
                    '    cout << "Hello, " << name << "!" << endl;',
                    '    cout << "Year: " << year << endl;',
                    '    cout << "Pi: " << pi << endl;',
                    '    cout << "Enrolled: " << (enrolled ? "yes" : "no") << endl;',
                    '',
                    '    return 0;',
                    '}',
                ]}
            />

            <LectureSubHeading title="Input with cin" />

            <LectureP>
                <LectureCmd tip="Character output. << inserts values into the stream, left to right. cout << a << b << endl; prints a then b then a newline.">cout &lt;&lt;</LectureCmd> writes to the terminal. <LectureCmd tip="Character input. >> extracts one whitespace-delimited token. cin >> x reads the next word or number. Stops at spaces, tabs, newlines.">cin &gt;&gt;</LectureCmd> reads from the terminal — it reads one whitespace-delimited token at a time. For full lines (including spaces), use <LectureCmd tip="Reads an entire line of input including spaces. Takes the stream and a string variable: getline(cin, name). Use instead of cin >> when input has spaces.">getline(cin, variable)</LectureCmd>. A common pitfall: after <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">cin &gt;&gt;</code>, a newline remains in the buffer — call <LectureCmd tip="Discards the next character in the input buffer. Call after cin >> and before getline() to prevent the leftover newline from being consumed as an empty line.">cin.ignore()</LectureCmd> before <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getline()</code> to discard it.
            </LectureP>

            <CodeBlock language="cpp"
                title="input.cpp — reading user input"
                lines={[
                    '#include <iostream>',
                    '#include <string>',
                    'using namespace std;',
                    '',
                    'int main() {',
                    '    cout << "Enter your age: ";',
                    '    int age;',
                    '    cin >> age;',
                    '    cin.ignore();  // discard leftover newline',
                    '',
                    '    cout << "Enter your full name: ";',
                    '    string name;',
                    '    getline(cin, name);  // reads the whole line, spaces included',
                    '',
                    '    cout << name << " is " << age << " years old." << endl;',
                    '    return 0;',
                    '}',
                ]}
            />

            <LectureSubHeading title="Compilation" />

            <LectureP>
                Unlike Python, C++ code must be compiled before it can run. The compiler (<LectureCmd tip="GNU C++ compiler. Translates .cpp source files into executable binaries. Part of the GCC (GNU Compiler Collection). On macOS, g++ is actually clang++ by default.">g++</LectureCmd>) translates your source code into machine code. Compile and run with:
            </LectureP>

            <CodeBlock language="bash"
                title="compile and run"
                lines={[
                    'g++ -std=c++17 -Wall hello.cpp -o hello',
                    './hello',
                ]}
            />

            <LectureP>
                <LectureCmd tip="Sets the C++ standard version. c++17 gives you structured bindings, if-init, optional, filesystem, and more. Always specify a standard.">-std=c++17</LectureCmd> enables modern C++ features. <LectureCmd tip="Warns All — enables all common compiler warnings. Treat every warning as a bug. Also consider -Wextra and -Werror (treats warnings as errors).">-Wall</LectureCmd> turns on all warnings — treat every warning as a bug. <LectureCmd tip="Names the output binary. Without -o, g++ produces a.out by default. Convention: name it after your source file.">-o hello</LectureCmd> names the output binary. If compilation fails, the compiler will tell you the exact line and the problem — read the first error message and fix it before worrying about the rest.
            </LectureP>

            <LectureSubHeading title="Key syntax differences from Python" />

            <LectureP>
                <strong className="text-foreground">Braces</strong> <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'{}'}</code> delimit blocks instead of indentation (though you should still indent for readability). <strong className="text-foreground">Semicolons</strong> end every statement. <strong className="text-foreground">Types are explicit</strong>: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int x = 5;</code> not <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">x = 5</code>. <strong className="text-foreground">Logical operators</strong> are <LectureCmd tip="Logical AND. Both sides must be true. Short-circuits: if the left side is false, the right side is not evaluated. Python equivalent: and.">&&</LectureCmd>, <LectureCmd tip="Logical OR. At least one side must be true. Short-circuits: if the left side is true, the right side is not evaluated. Python equivalent: or.">||</LectureCmd>, <LectureCmd tip="Logical NOT. Flips true to false and vice versa. Python equivalent: not.">!</LectureCmd> instead of <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">and</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">or</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">not</code>. <strong className="text-foreground">Comments</strong> use <LectureCmd tip="Single-line comment. Everything after // on that line is ignored by the compiler.">//</LectureCmd> for single-line and <LectureCmd tip="Multi-line (block) comment. Everything between /* and */ is ignored. Cannot be nested.">/* */</LectureCmd> for multi-line.
            </LectureP>

            <LectureCallout type="info">
                From this point forward, most code examples omit <LectureCmd tip="Preprocessor directive that copies header contents into your file. Required at the top of every .cpp file for the libraries you use.">#include</LectureCmd> directives and <LectureCmd tip="Program entry point. The OS calls main() when the binary runs. Must return int (0 = success).">int main()</LectureCmd> for brevity. To compile any example, wrap it in the template from this section: add your includes at the top, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">using namespace std;</code>, and place the code inside <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int main() {'{ ... return 0; }'}</code>.
            </LectureCallout>

            {/* ── 02 WHY C++ FOR OOP ──────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Why C++ for OOP?" />

            <LectureP>
                You have been writing Python and TypeScript. C++ gives you direct control over memory and a type system that makes object boundaries explicit. For systems code and technical interviews, C++ OOP — classes, access modifiers, constructors, inheritance — is the reference model. What you learn here maps to every language: Python's <LectureCmd tip="In Python, self is the explicit reference to the current object instance, passed as the first argument to every method. C++ uses 'this' implicitly.">self</LectureCmd> and <LectureCmd tip="In Python, super() calls the parent class's method. In C++, you call the base class by name: Base::method().">super()</LectureCmd>, TypeScript's <LectureCmd tip="TypeScript keyword for class inheritance: class Dog extends Animal. Same concept as C++'s : public Base.">extends</LectureCmd> and <LectureCmd tip="TypeScript keyword for implementing an interface contract. In C++, you implement an interface by inheriting from a class with only pure virtual methods.">implements</LectureCmd>, and Java/C# classes all follow the same ideas. C++ makes the machinery visible so you see exactly when constructors run, when <LectureTermWithTip tip="The runtime mechanism that routes a virtual method call to the correct override based on the actual (runtime) type of the object, not the declared (compile-time) type of the pointer/reference.">virtual dispatch</LectureTermWithTip> happens, and what "pass by reference" means.
            </LectureP>
            <LectureP>
                This lecture focuses on <strong className="text-foreground">classes, encapsulation, and inheritance</strong>. Next lecture covers polymorphism, abstract base classes, the STL, and system design principles.
            </LectureP>

            <LectureCallout type="info">
                <LectureTermWithTip tip="Bundling data and methods together, hiding internal state behind a public interface. Callers use the interface; they cannot directly touch or break internal state. The defining principle of good class design.">Encapsulation</LectureTermWithTip> means hiding internal state and exposing only a clear interface. It prevents callers from putting your object into an invalid state and lets you change implementation details without breaking the rest of the codebase.
            </LectureCallout>

            {/* ── 03 THE FOUR OOP PRINCIPLES ──────────────────────────────────── */}
            <LectureSectionHeading number="03" title="The Four OOP Principles" />

            <LectureP>
                Object-Oriented Programming organizes software around objects — data bundled with the functions that operate on it. Four principles underpin OOP: <LectureTermWithTip tip="Bundle data and methods together. Hide internal state — expose only what users of the class need. Prevents invalid states.">encapsulation</LectureTermWithTip>, <LectureTermWithTip tip="A derived class gets the data and methods of its base class and can extend or override them. Models 'is-a' relationships.">inheritance</LectureTermWithTip>, <LectureTermWithTip tip="Same interface, different behavior. Call getType() on any LibraryItem — each derived class responds differently via virtual dispatch.">polymorphism</LectureTermWithTip>, and <LectureTermWithTip tip="Expose what a class does, hide how it does it. Users of std::vector don't need to know about memory reallocation.">abstraction</LectureTermWithTip>. We focus on encapsulation and inheritance in this lecture.
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

            {/* ── 04 ACCESS MODIFIERS — PUBLIC, PRIVATE, PROTECTED ────────────── */}
            <LectureSectionHeading number="04" title="Access Modifiers — Public, Private, Protected" />

            <LectureP>
                C++ gives you explicit control over who can see what. By default, a <LectureCmd tip="Defines a type with private members by default. Use when you're building an abstraction with invariants to protect. Has constructors, methods, access control.">class</LectureCmd> has private members until you say otherwise; a <LectureCmd tip="Same as class but members are public by default. Use for plain data (POD) with no invariants to protect — just data, no encapsulation needed.">struct</LectureCmd> has public members by default. The only difference is that default — use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">struct</code> for <LectureTermWithTip tip="Plain Old Data — a struct with no invariants, no methods that enforce rules, just public fields. Think of it as a named tuple.">plain data</LectureTermWithTip> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class</code> when you are building an abstraction with an interface.
            </LectureP>

            <div className="my-6 rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-semibold text-foreground">Who can access what</p>
                </div>
                <div className="divide-y divide-border">
                    <div className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground"><LectureCmd tip="Accessible by anyone — the class itself, derived classes, and all external code. Your API surface: constructors, getters, methods that change state in valid ways.">public:</LectureCmd></p>
                        <p className="text-xs text-muted-foreground mt-0.5">Anyone can call or read. Your API — constructors, getters, methods that change state in valid ways.</p>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground"><LectureCmd tip="Accessible only by this class's own methods. Not even derived classes can see private members. Use for implementation details and data that must be protected by invariants.">private:</LectureCmd></p>
                        <p className="text-xs text-muted-foreground mt-0.5">Only this class. Derived classes cannot see private members. Use for implementation details and invariants.</p>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground"><LectureCmd tip="Accessible by this class and all derived classes, but not external code. Use sparingly — it creates a coupling contract between base and derived classes.">protected:</LectureCmd></p>
                        <p className="text-xs text-muted-foreground mt-0.5">This class and derived classes. Lets subclasses access or extend internal state without exposing it to the world. Use sparingly — it tightens coupling between base and derived.</p>
                    </div>
                </div>
            </div>

            <LectureCallout type="tip">
                Prefer <LectureCmd tip="Only this class can access. The strongest encapsulation level. Default for all members unless you have a reason to expose them.">private</LectureCmd> unless you have a clear reason for <LectureCmd tip="This class + derived classes. Creates a coupling contract — changing protected members can break every subclass.">protected</LectureCmd>. Protected members become part of your inheritance contract; changing them can break every derived class.
            </LectureCallout>

            {/* ── 05 OOP IN C++ — CLASSES, CONSTRUCTORS, INHERITANCE ───────────── */}
            <LectureSectionHeading number="05" title="OOP in C++ — Classes, Constructors & Inheritance" />

            <LectureP>
                A <LectureTerm>class</LectureTerm> bundles data (member variables) and behavior (member functions). Constructors initialize the object; use the <LectureTermWithTip tip="Syntax: ClassName(params) : member1(val1), member2(val2) {}. Runs BEFORE the constructor body. Required for const members and references. More efficient than assigning in the body.">initializer list</LectureTermWithTip> (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">: title(t), author(a)</code>) to set members before the body runs — it is required for <LectureCmd tip="A member marked const cannot be changed after construction. Must be initialized in the initializer list — you cannot assign to a const member in the constructor body.">const</LectureCmd> members and references, and often more efficient.
            </LectureP>

            <CodeBlock language="cpp"
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
                Use the <LectureTermWithTip tip="Constructor initializer list syntax: Book(string t) : title(t) {}. Initializes members before the constructor body runs. Required for const and reference members.">constructor initializer list</LectureTermWithTip> (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">: title(t), author(a)</code>) to initialize members. It runs before the constructor body and is required for const members and references.
            </LectureCallout>

            <LectureSubHeading title="Initializer list order" />
            <LectureP>
                Members are always initialized in the <strong className="text-foreground">order they are declared in the class</strong>, not the order you list them in the initializer list. If your list order does not match declaration order, you can get subtle bugs (e.g. member A is initialized using member B, but B is not initialized yet). Keep declaration order and list order the same.
            </LectureP>

            <LectureSubHeading title="Const correctness" />
            <LectureP>
                Mark member functions that do not modify the object with <LectureCmd tip="After a method signature: string getTitle() const; — a promise that this function will not modify any member variable. Const objects can only call const methods. Always mark getters and inspectors const.">const</LectureCmd> at the end: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string getTitle() const;</code>. That is a promise: "this function will not change any member." Getters and inspectors should always be const. Const objects can only call const member functions. When you take a <LectureCmd tip="A reference to a LibraryItem that you promise not to modify. Only const methods are callable through it. Use for function parameters when you want to read but not change.">const LibraryItem&amp;</LectureCmd>, you are promising not to modify it — so only const methods are callable.
            </LectureP>

            <LectureP>
                <LectureTerm>Inheritance</LectureTerm> lets a derived class reuse and extend a base class. Use <LectureCmd tip="Declares a method as overridable. When called through a base pointer/reference, the derived class's version runs instead of the base class's. Enables polymorphism via the vtable.">virtual</LectureCmd> so that calls through a base pointer invoke the derived class's override. A <LectureCmd tip="virtual ~ClassName() {} — ensures the correct destructor runs when deleting through a base pointer. Without it, only the base destructor runs and derived resources leak.">virtual destructor</LectureCmd> in the base is required when you delete through a base pointer — otherwise the derived destructor will not run.
            </LectureP>

            <CodeBlock language="cpp"
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
                <LectureTermWithTip tip="Assigning a derived object to a base variable by value copies only the base class's data — the derived part is 'sliced off' and lost. The object becomes just a base, losing its polymorphic identity. Always use references or pointers.">Slicing</LectureTermWithTip>: assigning a derived object to a base by value copies only the base part; the derived data is "sliced off." Always pass base classes by reference or pointer (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">const LibraryItem&</code>) to preserve polymorphic behavior.
            </LectureCallout>

            <LectureSubHeading title="Constructor and destructor order" />
            <LectureP>
                When you create a derived object, the base constructor runs first, then the derived constructor. When it is destroyed, the derived destructor runs first, then the base. Base builds the foundation, derived builds on top; on teardown, derived cleans up first, then base. A non-virtual destructor in the base is dangerous — only the base destructor runs when you <LectureCmd tip="Frees heap memory allocated with new. delete basePtr calls the destructor and returns memory. If the destructor is not virtual, only the base destructor runs — the derived part leaks." warn>delete basePtr</LectureCmd>, and the derived part is never cleaned up.
            </LectureP>

            <LectureCallout type="tip">
                Always declare destructors <LectureCmd tip="Makes the destructor polymorphic — the correct (most-derived) destructor is called even when deleting through a base pointer. Required in any class with virtual methods.">virtual</LectureCmd> in base classes that have virtual methods. Without it, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete basePtr</code> only runs the base destructor — the derived destructor will not run, leaking resources.
            </LectureCallout>

            {/* ── 06 COMPOSITION VS INHERITANCE ─────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Composition vs Inheritance" />

            <LectureP>
                <LectureTermWithTip tip="A derived class IS-A base class. Book IS-A LibraryItem. Use when you need polymorphism — multiple types substitutable through a common interface.">Inheritance</LectureTermWithTip> models an <strong className="text-foreground">is-a</strong> relationship: a Book is a LibraryItem. <LectureTermWithTip tip="A class HAS-A member of another class. Library HAS-A vector of items. Use when you're reusing behavior without needing to substitute types through a shared interface.">Composition</LectureTermWithTip> models <strong className="text-foreground">has-a</strong>: a Library has a <LectureCmd tip="A vector of pointers to LibraryItem. Allows polymorphic storage — the vector holds pointers to Book, DVD, Magazine, etc. through the base type.">{"vector<LibraryItem*>"}</LectureCmd> and an <LectureCmd tip="Hash map with string keys and arbitrary values. O(1) average lookup. The C++ equivalent of Python's dict.">unordered_map</LectureCmd> for loans. Prefer composition when you are reusing behavior or data without needing to substitute one type for another through a common interface. Prefer inheritance when you have a true subtype: multiple classes that share an interface and can be used interchangeably.
            </LectureP>

            <LectureP>
                Deep inheritance hierarchies (A → B → C → D) are hard to maintain and test. If you find yourself going beyond one level of derivation, ask whether composition or a flatter design would work. "Favor composition over inheritance" is a design guideline, not a law — use inheritance where polymorphism is the goal, composition everywhere else.
            </LectureP>

            {/* ── 07 RULE OF THREE & RESOURCE MANAGEMENT ───────────────────────── */}
            <LectureSectionHeading number="07" title="Rule of Three & Resource Management" />

            <LectureP>
                If your class manages a resource (raw pointer, file handle, etc.), the compiler-generated copy constructor and copy-assignment operator do a <LectureTermWithTip tip="Copies the pointer value (the memory address), not the data it points to. Both objects now point to the same memory. When one frees it, the other has a dangling pointer.">shallow copy</LectureTermWithTip> — they copy the pointer, not what it points to. Then two objects think they own the same resource; when one is destroyed, it frees the memory and the other is left with a <LectureTermWithTip tip="A pointer that still holds an address, but the memory at that address has been freed. Accessing it causes undefined behavior — crashes, corrupted data, or silent bugs.">dangling pointer</LectureTermWithTip>. The <LectureTermWithTip tip="If you define any one of: destructor, copy constructor, or copy-assignment operator, you almost certainly need all three. They work together to manage resource ownership correctly.">rule of three</LectureTermWithTip>: if you define one of destructor, copy constructor, or copy-assignment operator, you usually need to define all three (or explicitly delete the copies and use move semantics). For now, prefer STL containers and smart pointers so the compiler-generated behavior is correct.
            </LectureP>

            <LectureCallout type="info">
                In C++11 and later, the <LectureTermWithTip tip="Rule of Three + move constructor + move-assignment operator. Move semantics transfer resource ownership efficiently (no deep copy). Smart pointers and STL types handle this for you.">rule of five</LectureTermWithTip> adds move constructor and move assignment. For interview-level code and most application logic, stick to values and STL types and you rarely need to implement these yourself. Lecture 2 introduces smart pointers, which automate resource management entirely.
            </LectureCallout>

            {/* ── 08 ANOTHER EXAMPLE — INVARIANTS IN PRACTICE ─────────────────── */}
            <LectureSectionHeading number="08" title="Another Example — Invariants in Practice" />

            <LectureP>
                Encapsulation is about enforcing <LectureTermWithTip tip="Conditions that are always true for a correctly-constructed object. A bank balance is never negative. A connection is never used after close. The class's methods must maintain these guarantees.">invariants</LectureTermWithTip> — conditions that are always true for your object. A bank account balance should never be negative; a connection handle should never be used after close. Expose only operations that preserve the invariant.
            </LectureP>

            <CodeBlock language="cpp"
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
                <strong className="text-foreground">Virtual destructor:</strong> Base class with <LectureCmd tip="A method that can be overridden by derived classes. The correct version is called at runtime based on the object's actual type, not the pointer's declared type.">virtual</LectureCmd> methods must have a virtual destructor; otherwise <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete basePtr</code> leaks the derived part. <strong className="text-foreground">Slicing:</strong> Passing or assigning by value copies only the base; use reference or pointer. <strong className="text-foreground">Const:</strong> Mark getters and read-only methods <LectureCmd tip="After a method: string getTitle() const; — promises not to modify any member. Always use for getters, inspectors, and any method that reads but doesn't write.">const</LectureCmd> so they work on const objects. <strong className="text-foreground">Initializer list:</strong> Use it for all members when possible; required for const and reference members. <strong className="text-foreground">Protected vs private:</strong> Prefer private; use protected only when derived classes genuinely need access.
            </LectureP>

            <LectureFooterNav
                prev={{
                    label: 'Data Structures in Practice',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-2/activity'),
                }}
                next={{
                    label: 'Polymorphism, STL & System Design',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-3/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}
