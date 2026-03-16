import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import { ActivityHint } from '@/components/ui/activity-hint';
import { ActivityChallenge } from '@/components/ui/activity-challenge';
import { ActivityTask, ActivityTaskListProvider } from '@/components/ui/activity-task';
import {
    LectureSectionHeading,
    LectureP,
} from '@/components/ui/lecture-typography';

export default function Week8Activity() {
    const navigate = useNavigate();

    return (
        <ActivityTaskListProvider>
            <LectureLayout>
                <LectureHeader
                    week={8}
                    session="Activity"
                    title="CLI Phonebook"
                    description="Build a full CLI Phonebook in C++ in two parts: Part 1 is the OOP foundation (Contact, PhoneBook, add/delete/list). Part 2 adds data structures — BST for sorted order, stack for undo, and a hash map for O(1) search by phone."
                    icon={<Cpu className="h-4 w-4" />}
                />

                <LectureCallout type="info">
                    Use one codebase for the whole activity. Compile after every challenge: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">g++ -std=c++17 -Wall phonebook.cpp -o phonebook && ./phonebook</code>. Fix errors as they appear.
                </LectureCallout>

                {/* ── PART 1: OOP FOUNDATION ─────────────────────────────────── */}
                <LectureSectionHeading number="01" title="Part 1 — Contact and PhoneBook" />

                <LectureP>
                    Create the Contact class and a PhoneBook manager that stores contacts in a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector</code>. You'll replace the vector with a BST in Part 2.
                </LectureP>

                <ActivityChallenge
                    number="1.1"
                    title="Contact Class"
                    description="A simple struct or class to hold one contact."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">phonebook.cpp</code> with includes: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">iostream</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector</code></ActivityTask>
                        <ActivityTask>Define <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">struct Contact</code> (or class) with: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string firstName</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string lastName</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string phone</code></ActivityTask>
                        <ActivityTask>Add a constructor and a helper to print the contact (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void print() const</code>)</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.2"
                    title="PhoneBook with vector"
                    description="Manager class with add, delete, list."
                >
                    <div className="space-y-1">
                        <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">class PhoneBook</code> with private <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector&lt;Contact&gt; contacts</code> (or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector&lt;Contact*&gt;</code> if you prefer)</ActivityTask>
                        <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void addContact(Contact c)</code> — push onto the vector</ActivityTask>
                        <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void listAll()</code> — loop and print each contact</ActivityTask>
                        <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void deleteContact(size_t index)</code> or delete by name/phone — remove from the vector</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="1.3"
                    title="Interactive Menu"
                    description="Wire Part 1 together."
                >
                    <div className="space-y-1">
                        <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main()</code>, create a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PhoneBook</code> and loop on a menu</ActivityTask>
                        <ActivityTask>Menu: (1) Add contact, (2) Delete contact, (3) List all, (0) Quit</ActivityTask>
                        <ActivityTask>For add: read first name, last name, phone from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">cin</code> and call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">addContact</code></ActivityTask>
                        <ActivityTask>For delete: list with indices and ask for index to delete (or search by name), then call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">deleteContact</code></ActivityTask>
                        <ActivityTask>Compile and run; verify add, list, and delete work before moving to Part 2</ActivityTask>
                    </div>

                    <ActivityHint label="cin and getline">
                        After <code className="bg-muted px-1 rounded">cin &gt;&gt; choice</code>, call <code className="bg-muted px-1 rounded">cin.ignore()</code> before <code className="bg-muted px-1 rounded">getline(cin, name)</code> so the newline isn't consumed as the name.
                    </ActivityHint>
                </ActivityChallenge>

                {/* ── PART 2: BST FOR ALPHABETICAL STORAGE ────────────────────── */}
                <LectureSectionHeading number="02" title="Part 2 — BST for Alphabetical Storage" />

                <LectureP>
                    Replace the vector with a BST so that listing all contacts always comes out alphabetically (by last name) without sorting.
                </LectureP>

                <ActivityChallenge
                    number="2.1"
                    title="BST Node"
                    description="Create the tree structure."
                >
                    <div className="space-y-1">
                        <ActivityTask>Add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode</code> struct with: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Contact* data</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode* left</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode* right</code>, and a constructor</ActivityTask>
                        <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PhoneBook</code>, replace <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">vector&lt;Contact&gt;</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode* root = nullptr</code></ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="2.2"
                    title="BST Insert and In-Order List"
                    description="Recursive insert and traversal."
                >
                    <div className="space-y-1">
                        <ActivityTask>Add private <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">insert(ContactNode* node, Contact* contact)</code> — compare by last name (case-insensitive); go left if smaller, right if larger; create new node at nullptr</ActivityTask>
                        <ActivityTask>Update <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">addContact</code> to call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">insert(root, ...)</code> and update root if needed</ActivityTask>
                        <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">inOrder(ContactNode* node)</code> — left, visit (print contact), right</ActivityTask>
                        <ActivityTask>Call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">inOrder(root)</code> from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">listAll()</code>; verify contacts print alphabetically</ActivityTask>
                    </div>

                    <ActivityHint label="recursive insert">
                        Base case: if (node == nullptr) return new ContactNode(contact). Else if (name &lt; node's name) node-&gt;left = insert(node-&gt;left, contact); else node-&gt;right = insert(node-&gt;right, contact). Return node.
                    </ActivityHint>
                </ActivityChallenge>

                {/* ── PART 2: STACK UNDO ──────────────────────────────────────── */}
                <LectureSectionHeading number="03" title="Part 2 — Stack-Based Undo" />

                <LectureP>
                    Record every add and delete on a stack so the last action can be undone.
                </LectureP>

                <ActivityChallenge
                    number="3.1"
                    title="Action Stack"
                    description="Record and undo."
                >
                    <div className="space-y-1">
                        <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">#include &lt;stack&gt;</code></ActivityTask>
                        <ActivityTask>Create <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">struct Action</code> with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string type</code> ("add" or "delete") and <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Contact contactSnapshot</code></ActivityTask>
                        <ActivityTask>Add private <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">stack&lt;Action&gt; history</code> to PhoneBook</ActivityTask>
                        <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">addContact</code>: after inserting, push <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"Action{\"add\", *contact}"}</code></ActivityTask>
                        <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">deleteContact</code>: before deleting, push <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"Action{\"delete\", *contact}"}</code></ActivityTask>
                        <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void undo()</code>: if history empty print "Nothing to undo."; else pop top — if "add" remove that contact, if "delete" re-add from snapshot</ActivityTask>
                        <ActivityTask>Add "Undo" as a menu option</ActivityTask>
                    </div>
                </ActivityChallenge>

                {/* ── PART 2: HASH MAP FOR O(1) SEARCH ─────────────────────────── */}
                <LectureSectionHeading number="04" title="Part 2 — Hash Map for O(1) Search by Phone" />

                <LectureP>
                    Add a secondary index: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_map&lt;string, Contact*&gt;</code> keyed by phone number so lookup by phone is O(1).
                </LectureP>

                <ActivityChallenge
                    number="4.1"
                    title="Phone Index and Search"
                    description="Maintain the index and add search by phone."
                >
                    <div className="space-y-1">
                        <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">#include &lt;unordered_map&gt;</code></ActivityTask>
                        <ActivityTask>Add private <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_map&lt;string, Contact*&gt; phoneIndex</code> to PhoneBook</ActivityTask>
                        <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">addContact</code>, insert into <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">phoneIndex[phone] = pointer</code>; in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">deleteContact</code>, erase from phoneIndex</ActivityTask>
                        <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Contact* findByPhone(string number)</code> — return phoneIndex[number] or nullptr</ActivityTask>
                        <ActivityTask>Add "Search by phone" to the menu; print contact or "Not found."</ActivityTask>
                    </div>
                </ActivityChallenge>

                <ActivityChallenge
                    number="4.2"
                    title="Final Menu"
                    description="All options in one place."
                >
                    <div className="space-y-1">
                        <ActivityTask>Menu: (1) Add contact, (2) Delete contact, (3) List all (alphabetical), (4) Search by phone, (5) Undo, (0) Quit</ActivityTask>
                        <ActivityTask>Compile and run through all options to verify the full phonebook works</ActivityTask>
                    </div>
                </ActivityChallenge>

                <LectureFooterNav
                    prev={{
                        label: 'Polymorphism, STL & System Design',
                        onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/lecture-2'),
                    }}
                    next={{
                        label: 'Introduction to Fundamentals',
                        onClick: () => navigate('/classes/introduction-to-fundamentals'),
                    }}
                />
            </LectureLayout>
        </ActivityTaskListProvider>
    );
}
