import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

// ── Class hierarchy diagram ───────────────────────────────────────────────────
const ClassDiagram = () => (
    <div className="my-6 rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs space-y-2">
        <p className="text-muted-foreground text-xs mb-3">Target class hierarchy for the Library Management System</p>
        <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 px-6 py-3 text-center">
                <p className="text-blue-700 dark:text-blue-300 font-bold">LibraryItem</p>
                <p className="text-muted-foreground text-xs mt-1">id, title, isCheckedOut</p>
                <p className="text-muted-foreground text-xs">+ getType(), getLoanDays() [pure virtual]</p>
                <p className="text-muted-foreground text-xs">+ checkout(), returnItem()</p>
            </div>
            <div className="flex justify-center gap-8 text-muted-foreground">
                <span>↙</span><span>↓</span><span>↘</span>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
                {[
                    { name: 'Book', extra: 'author, pages\nloanDays: 21' },
                    { name: 'DVD', extra: 'director, runtime\nloanDays: 7' },
                    { name: 'Magazine', extra: 'issue, month\nloanDays: 3' },
                ].map(item => (
                    <div key={item.name} className="rounded-lg border border-border bg-card px-4 py-2.5 text-center min-w-[120px]">
                        <p className="text-orange-600 dark:text-orange-400 font-bold">{item.name}</p>
                        <p className="text-muted-foreground text-xs mt-1 whitespace-pre-line">{item.extra}</p>
                    </div>
                ))}
            </div>
            <div className="text-muted-foreground text-xs mt-1">↓</div>
            <div className="rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-6 py-3 text-center">
                <p className="text-emerald-700 dark:text-emerald-300 font-bold">Library</p>
                <p className="text-muted-foreground text-xs mt-1">{"vector<LibraryItem*> catalog"}</p>
                <p className="text-muted-foreground text-xs">{"unordered_map<string, string> loans"}</p>
                <p className="text-muted-foreground text-xs">+ addItem(), search(), checkout(), returnItem()</p>
            </div>
        </div>
    </div>
);

export default function Week7Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={7}
                session="Activity"
                title="Library Management System"
                description="You'll build a complete Library Management System in C++ from scratch — using every concept from both lectures: abstract base classes, inheritance, polymorphism through virtual methods, and STL containers for catalog and loan tracking. Then you'll close out with a curated set of interview problems."
                icon={<Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
            />

            <LectureCallout type="info">
                Compile after every challenge: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">g++ -std=c++17 -Wall library.cpp -o library && ./library</code>. Don't write the whole system before checking if it compiles — fix errors as they appear.
            </LectureCallout>

            {/* ── 01 BASE CLASS ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="The Base Class" />

            <LectureP>
                The target architecture for the whole system:
            </LectureP>

            <ClassDiagram />

            <ActivityChallenge
                number="1.1"
                title="Define LibraryItem"
                description="The abstract base class all item types inherit from."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">library.cpp</code> with includes: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">iostream</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_map</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">algorithm</code></ActivityTask>
                    <ActivityTask>Define <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class LibraryItem</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">protected</code> fields: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string id</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string title</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bool isCheckedOut = false</code></ActivityTask>
                    <ActivityTask>Add a constructor, public getters for all fields, and two pure virtual methods: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual string getType() const = 0</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual int getLoanDays() const = 0</code></ActivityTask>
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bool checkout()</code> (sets <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">isCheckedOut = true</code>, returns false if already checked out) and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void returnItem()</code> (sets it back to false) in the base class</ActivityTask>
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual ~LibraryItem() { }</code></ActivityTask>
                </div>

                <ActivityHint label="pure virtual makes the class abstract">
                    Any class with at least one pure virtual method (<code className="bg-muted px-1 rounded">= 0</code>) is abstract — you can't instantiate it directly with <code className="bg-muted px-1 rounded">new LibraryItem(...)</code>. You can only use it through pointers to derived types.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 02 DERIVED CLASSES ──────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Derived Item Types" />

            <ActivityChallenge
                number="2.1"
                title="Book, DVD, Magazine"
                description="Three concrete types that inherit LibraryItem and add their own fields."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask><code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Book</code>: adds <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string author</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int pages</code>. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getType()</code> → <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">"Book"</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getLoanDays()</code> → <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">21</code></ActivityTask>
                    <ActivityTask><code className="text-xs bg-muted px-1.5 py-0.5 rounded border">DVD</code>: adds <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string director</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int runtimeMinutes</code>. Loan: 7 days</ActivityTask>
                    <ActivityTask><code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Magazine</code>: adds <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int issueNumber</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string month</code>. Loan: 3 days</ActivityTask>
                    <ActivityTask>Add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">virtual void display() const</code> to each that prints all fields (type-specific ones included)</ActivityTask>
                    <ActivityTask>Test polymorphism: store a Book, DVD, and Magazine in a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"vector<LibraryItem*>"}</code> and loop calling <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getType()</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getLoanDays()</code> — verify each prints its own values</ActivityTask>
                </div>

                <ActivityHint label="chaining to base constructor">
                    <code className="bg-muted px-1 rounded">{"Book(string id, string title, string author, int pages)\n    : LibraryItem(id, title), author(author), pages(pages) {}"}</code>
                </ActivityHint>
                <ActivityHint label="always use override">
                    Write <code className="bg-muted px-1 rounded">override</code> after every overriding method signature. The compiler will error if you mistype the base method name — a lifesaver.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 03 LIBRARY CLASS ────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="The Library Class" />

            <ActivityChallenge
                number="3.1"
                title="Catalog and Loan Tracking"
                description="The central class that manages all items and active loans."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class Library</code> with private: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"vector<LibraryItem*> catalog"}</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"unordered_map<string, string> loans"}</code> (item ID → patron name)</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void addItem(LibraryItem* item)</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void listAll()</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">LibraryItem* findById(string id)</code> (returns <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">nullptr</code> if not found)</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bool checkout(string itemId, string patronName)</code> — find the item, verify it's available, call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'item->checkout()'}</code>, record the loan</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bool returnItem(string itemId)</code> — find it, call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{'item->returnItem()'}</code>, erase from loans map</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"vector<LibraryItem*> searchByTitle(string query)"}</code> — case-insensitive substring match</ActivityTask>
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void listLoans()</code> — print every active loan with patron name, item title, type, and loan duration</ActivityTask>
                    <ActivityTask>Add a destructor that <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete</code>s every pointer in the catalog</ActivityTask>
                </div>

                <ActivityHint label="case-insensitive search">
                    <code className="bg-muted px-1 rounded">{"auto lower = [](string s) { transform(s.begin(), s.end(), s.begin(), ::tolower); return s; };\nif (lower(item->getTitle()).find(lower(query)) != string::npos) { ... }"}</code>
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="Interactive Menu"
                description="Wire it all together with a main() that loops on user input."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Write a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main()</code> that pre-populates the library with 6+ items (mix of all three types) and loops on a menu</ActivityTask>
                    <ActivityTask>Menu: (1) List all, (2) Search by title, (3) Checkout, (4) Return, (5) View loans, (0) Exit</ActivityTask>
                    <ActivityTask>Test the full cycle: search → checkout → try again (fails) → return → checkout again (succeeds)</ActivityTask>
                </div>

                <ActivityHint label="cin with spaces for patron names">
                    After reading a menu int with <code className="bg-muted px-1 rounded">{'cin >> choice'}</code>, call <code className="bg-muted px-1 rounded">cin.ignore()</code> before any <code className="bg-muted px-1 rounded">getline(cin, name)</code> calls — otherwise the leftover newline gets consumed immediately.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 04 DSA PROBLEMS ─────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="DSA Problem Set" />

            <LectureP>
                Solve each in its own <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.cpp</code> file. Write the time and space complexity as a comment at the top before you start coding.
            </LectureP>

            <ActivityChallenge
                number="4.1"
                title="Arrays & Hashing"
                description="Three problems — target O(n) for all three."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask><strong>Contains Duplicate</strong> — return true if any value appears more than once. Use an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_set</code></ActivityTask>
                    <ActivityTask><strong>Best Time to Buy and Sell Stock</strong> — one pass: track the minimum price seen so far and the maximum profit achievable at each step</ActivityTask>
                    <ActivityTask><strong>Two Sum</strong> — return indices of two numbers summing to target. Use an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_map</code> mapping value → index</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.2"
                title="Two Pointers & Sliding Window"
                description="Two patterns that eliminate nested loops."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask><strong>3Sum</strong> — find all unique triplets summing to zero. Sort first, then for each element use two pointers on the remainder. Skip duplicates to avoid repeated triplets in output</ActivityTask>
                    <ActivityTask><strong>Longest Substring Without Repeating Characters</strong> — sliding window with an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_set</code>: expand right, shrink left when a duplicate enters the window</ActivityTask>
                </div>

                <ActivityHint label="3Sum two-pointer loop">
                    Sort the array. Outer loop index <code className="bg-muted px-1 rounded">i</code> from 0 to n-3. Skip if <code className="bg-muted px-1 rounded">nums[i] == nums[i-1]</code> (duplicate outer). Inner: <code className="bg-muted px-1 rounded">left = i+1</code>, <code className="bg-muted px-1 rounded">right = n-1</code>. When triplet found, advance both pointers past duplicates.
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="4.3"
                title="Stack & Trees"
                description="One stack problem, two tree problems."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask><strong>Valid Parentheses</strong> — use a stack: push opening brackets, pop and match on closing brackets</ActivityTask>
                    <ActivityTask><strong>Maximum Depth of Binary Tree</strong> — return <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">1 + max(depth(left), depth(right))</code> recursively</ActivityTask>
                    <ActivityTask><strong>Validate BST</strong> — pass min/max bounds down recursively; a node is invalid if its value falls outside the bounds its ancestors impose</ActivityTask>
                </div>

                <ActivityHint label="validate BST bounds">
                    <code className="bg-muted px-1 rounded">{"bool validate(TreeNode* node, long minVal, long maxVal) {\n    if (!node) return true;\n    if (node->val <= minVal || node->val >= maxVal) return false;\n    return validate(node->left, minVal, node->val)\n        && validate(node->right, node->val, maxVal);\n}"}</code> — call with <code className="bg-muted px-1 rounded">validate(root, LONG_MIN, LONG_MAX)</code>.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── BONUS ────────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Bonus Challenges" />

            <ActivityChallenge
                number="★"
                title="Add Due Date Tracking"
                description="Record when each loan is due and flag overdue items — no hints."
            >
                <LectureP>
                    When a patron checks out an item, calculate a due date: today + <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">getLoanDays()</code>. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"<ctime>"}</code> for the current date. Store due dates in the loans map. Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void listOverdue()</code> that prints any loans past their due date. Add it as menu option (6).
                </LectureP>
            </ActivityChallenge>

            <ActivityChallenge
                number="★"
                title="Min Stack"
                description="Design a stack that supports getMin() in O(1) using two stacks."
            >
                <LectureP>
                    Implement a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">MinStack</code> class in a separate file with: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void push(int val)</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void pop()</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int top()</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int getMin()</code> — all O(1). The trick: maintain a second stack that tracks the minimum at each level of the main stack.
                </LectureP>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Trees, Hash Maps & OOP',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/lecture-2'),
                }}
                next={{
                    label: 'Week 8 — Agile & Software Engineering',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/lecture-1'),
                }}
            />
        </LectureLayout>
    );
}