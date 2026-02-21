import { useNavigate } from 'react-router-dom';
import { Binary } from 'lucide-react';
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
    LectureTerm,
} from '@/components/ui/lecture-typography';

export default function Week7Activity() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={7}
                session="Activity"
                title="CLI Phonebook — Part 2"
                description="Your OOP foundation from Week 6 is solid. Now add the data structures on top — a BST for alphabetically sorted lookups, a stack for undo, and an unordered_map for O(1) search."
                icon={<Binary className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
            />

            <LectureCallout type="info">
                Open your Week 6 phonebook project. Every challenge in this activity extends that codebase — do not start from scratch. Compile after every challenge: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">g++ -std=c++17 -Wall phonebook.cpp -o phonebook && ./phonebook</code>
            </LectureCallout>

            {/* ── 01 BST FOR ALPHABETICAL STORAGE ─────────────────────────────── */}
            <LectureSectionHeading number="01" title="BST for Alphabetical Storage" />

            <LectureP>
                Right now your contacts are stored in a vector — insertion order, not sorted order. Replace the storage layer with a BST so that listing all contacts always comes out alphabetically without sorting.
            </LectureP>

            {/* BST diagram */}
            <div className="my-6 rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                <p className="text-xs text-muted-foreground mb-4">BST structure showing how contacts are organized:</p>
                <div className="flex justify-center">
                    <div className="text-center">
                        <div className="rounded-lg border border-border bg-card px-4 py-2 font-semibold text-sm">Johnson</div>
                        <div className="flex justify-center gap-8 mt-3 text-muted-foreground">
                            <span>↙</span>
                            <span>↘</span>
                        </div>
                        <div className="flex justify-around mt-2 max-w-sm mx-auto">
                            <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm">Davis</div>
                            <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm">Martinez</div>
                        </div>
                        <div className="flex justify-around mt-2 max-w-sm mx-auto text-xs text-muted-foreground">
                            <div>
                                <div>↙</div>
                                <div className="rounded-lg border border-border bg-card px-2 py-1 mt-1">Chen</div>
                            </div>
                            <div>
                                <div>↘</div>
                                <div className="rounded-lg border border-border bg-card px-2 py-1 mt-1">Wilson</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ActivityChallenge
                number="1.1"
                title="Define the BST Node"
                description="Create the foundation for tree-based storage."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode</code> struct with: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Contact* data</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode* left</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode* right</code>, a constructor that initializes all three</ActivityTask>
                    <ActivityTask>Do not delete the Contact class — ContactNode wraps it</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="1.2"
                title="BST Insert"
                description="Replace vector storage with recursive tree insertion."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add a private <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">insert(ContactNode* node, Contact* contact)</code> recursive method to your PhoneBook class</ActivityTask>
                    <ActivityTask>Compare by last name (case-insensitive)</ActivityTask>
                    <ActivityTask>Replace your vector with a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">ContactNode* root</code> initialized to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">nullptr</code></ActivityTask>
                    <ActivityTask>Update your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">addContact</code> method to call <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">insert</code></ActivityTask>
                </div>

                <ActivityHint label="recursive insert pattern">
                    <code className="bg-muted px-1 rounded text-xs">Base case: if (node == nullptr) return new ContactNode(contact). Recursive: if (contact name &lt; node name) node-&gt;left = insert(node-&gt;left, contact). Else node-&gt;right = insert(node-&gt;right, contact).</code>
                </ActivityHint>
            </ActivityChallenge>

            <ActivityChallenge
                number="1.3"
                title="In-Order Traversal"
                description="Print contacts in alphabetical order."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Implement <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">inOrder(ContactNode* node)</code> — left, visit, right</ActivityTask>
                    <ActivityTask>Call it from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">listAll()</code></ActivityTask>
                    <ActivityTask>Verify that adding contacts in random order still prints them alphabetically</ActivityTask>
                </div>

                <LectureCallout type="info">
                    <span title="Visits a BST in left → root → right order. For a BST sorted by key, this always produces keys in ascending sorted order — which is why it is the standard way to print a BST.">in-order traversal</span> is the standard way to print a BST in sorted order.
                </LectureCallout>
            </ActivityChallenge>

            {/* ── 02 STACK-BASED UNDO ─────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Stack-Based Undo" />

            <LectureP>
                Every add and delete operation should be reversible. A stack is the right structure — last action undone.
            </LectureP>

            <ActivityChallenge
                number="2.1"
                title="Define the Action Stack"
                description="Create a record of every change."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Create an <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Action</code> struct with: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">string type</code> ("add" or "delete"), <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Contact contactSnapshot</code> (a copy of the contact at time of action)</ActivityTask>
                    <ActivityTask>Add a private <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">stack&lt;Action&gt; history</code> to PhoneBook using <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::stack</code></ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.2"
                title="Push on Add and Delete"
                description="Record every operation."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">addContact</code>: after inserting, push <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Action{"{"}"add", *newContact{"}"}</code> onto history</ActivityTask>
                    <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">deleteContact</code>: before deleting, push <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Action{"{"}"delete", *contactToDelete{"}"}</code> onto history</ActivityTask>
                    <ActivityTask>Compile and verify the stack size grows as you add contacts</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="2.3"
                title="Implement Undo"
                description="Reverse the most recent operation."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">void undo()</code> to PhoneBook</ActivityTask>
                    <ActivityTask>If history is empty, print "Nothing to undo." and return</ActivityTask>
                    <ActivityTask>Otherwise pop the top action</ActivityTask>
                    <ActivityTask>If type == "add", delete the contact you just added</ActivityTask>
                    <ActivityTask>If type == "delete", re-add the contact from the snapshot</ActivityTask>
                    <ActivityTask>Add "undo" as a menu option in <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main()</code></ActivityTask>
                </div>

                <ActivityHint label="why a stack and not a queue">
                    Undo is always the most recent action first. A stack's LIFO order matches this exactly. A queue would undo your oldest action first — the opposite of what you want.
                </ActivityHint>
            </ActivityChallenge>

            {/* ── 03 HASH MAP FOR O(1) SEARCH ─────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Hash Map for O(1) Search" />

            <LectureP>
                BST search is O(log n). For a phonebook that might have thousands of contacts, you also want O(1) lookup by phone number.
            </LectureP>

            <ActivityChallenge
                number="3.1"
                title="Add the Index"
                description="Create a secondary index for phone number lookups."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add a private <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">unordered_map&lt;string, Contact*&gt; phoneIndex</code> to PhoneBook where the key is the phone number string</ActivityTask>
                    <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">addContact</code>, also insert into <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">phoneIndex</code></ActivityTask>
                    <ActivityTask>In <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">deleteContact</code>, also erase from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">phoneIndex</code></ActivityTask>
                </div>

                <LectureCallout type="info">
                    <span title="Constant time — the operation takes the same amount of time regardless of how many contacts are in the phonebook. Hash maps achieve this by computing a hash of the key and jumping directly to the bucket.">O(1) lookup</span> means instant access no matter how large your data gets.
                </LectureCallout>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.2"
                title="Search by Phone Number"
                description="Implement instant phone number lookups."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Contact* findByPhone(string number)</code> that checks <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">phoneIndex</code></ActivityTask>
                    <ActivityTask>If found, return the pointer</ActivityTask>
                    <ActivityTask>If not, return <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">nullptr</code></ActivityTask>
                    <ActivityTask>Add "search by phone" as a menu option</ActivityTask>
                    <ActivityTask>Print the full contact details if found, or "Not found." if not</ActivityTask>
                </div>
            </ActivityChallenge>

            <ActivityChallenge
                number="3.3"
                title="Final Menu"
                description="Put it all together."
            >
                <div className="mt-4 space-y-1">
                    <ActivityTask>Your <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">main()</code> menu should now offer: 1) Add contact, 2) Delete contact, 3) List all (alphabetical), 4) Search by phone, 5) Undo last action, 6) Quit</ActivityTask>
                    <ActivityTask>Compile the full program and run through all 6 options to verify everything works together</ActivityTask>
                </div>
            </ActivityChallenge>

            <LectureFooterNav
                prev={{
                    label: 'Hash Maps, Complexity & Interview Patterns',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/lecture-2'),
                }}
                next={{
                    label: 'Scrum, Kanban & Sprint Cycles',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-8/lecture-1'),
                }}
            />
        </LectureLayout>
    );
}
