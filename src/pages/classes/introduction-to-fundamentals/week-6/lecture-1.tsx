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
import { DataTable } from '@/components/ui/data-table';

export default function Week6Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={6}
                session="Lecture 1"
                title="Classes, Encapsulation & Inheritance"
                description="C++ OOP from the ground up — classes, access modifiers, constructors, inheritance chains, and the virtual keyword that makes polymorphism possible."
                icon={<Cpu className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
            />

            {/* ── 01 WHY C++ ──────────────────────────────────────────────────── */}
            <LectureSectionHeading number="01" title="Why C++ for DSA?" />

            <LectureP>
                You've been writing Python and TypeScript. Why switch to C++ now? Two reasons. First, C++ forces you to think about memory explicitly — you can't ignore the difference between stack and heap allocation when you're managing pointers yourself. Second, technical interviews at top companies almost universally accept C++, and the standard library's STL gives you production-grade implementations of every data structure you'll ever need as a reference.
            </LectureP>
            <LectureP>
                C++ is also where computer science concepts map most directly to machine reality. When you write a linked list in C++, you're actually manipulating memory addresses. In Python, you're using an abstraction of an abstraction. Understanding it at the C++ level makes the higher-level versions make sense.
            </LectureP>

            <LectureCallout type="info">
                For this course, you'll compile with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">g++ -std=c++17 -Wall file.cpp -o file</code>. The <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">-Wall</code> flag enables all warnings — pay attention to them. C++ warnings are often bugs.
            </LectureCallout>

            {/* ── 02 BIG-O ────────────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="Big-O Notation" />

            <LectureP>
                <LectureTerm>Big-O notation</LectureTerm> describes how an algorithm's runtime or memory usage grows as input size grows. It's not about exact speed — it's about the <em>shape</em> of growth. An O(n) algorithm doubles its work when you double the input. An O(n²) algorithm quadruples its work.
            </LectureP>

            <div className="my-6 rounded-xl border border-border bg-muted/30 overflow-hidden">
                {[
                    { complexity: 'O(1)', name: 'Constant', example: 'Array index access: arr[5]', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                    { complexity: 'O(log n)', name: 'Logarithmic', example: 'Binary search on a sorted array', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                    { complexity: 'O(n)', name: 'Linear', example: 'Linear search, single loop through array', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
                    { complexity: 'O(n log n)', name: 'Linearithmic', example: 'Merge sort, heap sort', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20' },
                    { complexity: 'O(n²)', name: 'Quadratic', example: 'Nested loops, bubble sort', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20' },
                ].map(row => (
                    <div key={row.complexity} className={`flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0 ${row.bg}`}>
                        <code className={`text-sm font-black w-24 shrink-0 ${row.color}`}>{row.complexity}</code>
                        <span className="text-xs font-semibold text-foreground w-28 shrink-0">{row.name}</span>
                        <span className="text-xs text-muted-foreground">{row.example}</span>
                    </div>
                ))}
            </div>

            <LectureCallout type="tip">
                When analyzing your own code: a single loop is O(n). A loop inside a loop is O(n²). Cutting the problem in half each iteration (like binary search) is O(log n). These patterns cover 90% of what you'll encounter in interviews.
            </LectureCallout>

            {/* ── 03 ARRAYS ───────────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Arrays" />

            <LectureP>
                An <LectureTerm>array</LectureTerm> is a contiguous block of memory holding elements of the same type. Because all elements are the same size and sit next to each other in memory, accessing any element by index is O(1) — the CPU computes the address directly: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">base_address + index * element_size</code>.
            </LectureP>
            <LectureP>
                The tradeoff: inserting or deleting in the middle requires shifting everything after the insertion point — O(n). Fixed-size arrays (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">int arr[10]</code>) live on the stack. Dynamic arrays (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::vector</code>) live on the heap and resize automatically.
            </LectureP>

            <CppBlock
                title="arrays in C++ — raw and vector"
                lines={[
                    '#include <iostream>',
                    '#include <vector>',
                    '#include <algorithm>',
                    'using namespace std;',
                    '',
                    'int main() {',
                    '    // Stack-allocated fixed array',
                    '    int scores[5] = {90, 85, 92, 78, 95};',
                    '    cout << scores[2] << endl;  // 92 — O(1) access',
                    '',
                    '    // Heap-allocated dynamic array (prefer this)',
                    '    vector<int> grades = {88, 72, 95, 61};',
                    '    grades.push_back(100);       // O(1) amortized',
                    '    grades.insert(grades.begin(), 50);  // O(n) — shifts everything',
                    '',
                    '    // Common operations',
                    '    sort(grades.begin(), grades.end());  // O(n log n)',
                    '    int n = grades.size();',
                    '',
                    '    // Range-based for loop (prefer over index)',
                    '    for (int g : grades) {',
                    '        cout << g << " ";',
                    '    }',
                    '    return 0;',
                    '}',
                ]}
            />

            <LectureSubHeading title="Two-pointer technique" />
            <LectureP>
                The <LectureTerm>two-pointer technique</LectureTerm> is one of the most important array patterns. Use two index variables — often one starting at each end — moving them toward each other based on conditions. Turns many O(n²) brute-force solutions into O(n).
            </LectureP>

            <CppBlock
                title="two pointers — check if array has a pair summing to target"
                lines={[
                    '// Precondition: array is sorted',
                    'bool hasPairWithSum(vector<int>& arr, int target) {',
                    '    int left = 0, right = arr.size() - 1;',
                    '    while (left < right) {',
                    '        int sum = arr[left] + arr[right];',
                    '        if (sum == target) return true;',
                    '        if (sum < target) left++;   // need bigger sum, move left pointer right',
                    '        else right--;               // need smaller sum, move right pointer left',
                    '    }',
                    '    return false;',
                    '}',
                    '// O(n) time, O(1) space — vs O(n²) brute force nested loop',
                ]}
            />

            {/* ── 04 LINKED LISTS ─────────────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Linked Lists" />

            <LectureP>
                A <LectureTerm>linked list</LectureTerm> stores elements as separate <LectureTerm>nodes</LectureTerm>, each containing a value and a pointer to the next node. Nodes live at arbitrary memory addresses — there's no contiguity requirement. This makes insertion and deletion at a known position O(1): just update pointers. But it makes access O(n): to get the 5th element, you have to walk from the head through 4 pointers.
            </LectureP>

            <CppBlock
                title="singly linked list — implementation from scratch"
                lines={[
                    'struct Node {',
                    '    int data;',
                    '    Node* next;',
                    '    Node(int val) : data(val), next(nullptr) {}',
                    '};',
                    '',
                    'class LinkedList {',
                    'public:',
                    '    Node* head = nullptr;',
                    '',
                    '    // Insert at front — O(1)',
                    '    void prepend(int val) {',
                    '        Node* newNode = new Node(val);',
                    '        newNode->next = head;',
                    '        head = newNode;',
                    '    }',
                    '',
                    '    // Delete first occurrence of val — O(n)',
                    '    void remove(int val) {',
                    '        if (!head) return;',
                    '        if (head->data == val) {',
                    '            Node* temp = head;',
                    '            head = head->next;',
                    '            delete temp;  // free the memory!',
                    '            return;',
                    '        }',
                    '        Node* curr = head;',
                    '        while (curr->next && curr->next->data != val)',
                    '            curr = curr->next;',
                    '        if (curr->next) {',
                    '            Node* temp = curr->next;',
                    '            curr->next = temp->next;',
                    '            delete temp;',
                    '        }',
                    '    }',
                    '',
                    '    // Traverse — O(n)',
                    '    void print() {',
                    '        Node* curr = head;',
                    '        while (curr) {',
                    '            cout << curr->data << " -> ";',
                    '            curr = curr->next;',
                    '        }',
                    '        cout << "null" << endl;',
                    '    }',
                    '};',
                ]}
            />

            <LectureCallout type="warning">
                Every <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">new</code> in C++ must eventually be paired with a <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">delete</code>. If you allocate a node and lose the pointer to it (by overwriting the variable), the memory is leaked — it's allocated but unreachable for the rest of the program's lifetime. In interviews this is acceptable; in production code you'd use smart pointers (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::unique_ptr</code>).
            </LectureCallout>

            <LectureSubHeading title="Fast & slow pointer (Floyd's cycle detection)" />
            <LectureP>
                The <LectureTerm>fast/slow pointer</LectureTerm> technique uses two pointers moving at different speeds through a linked list. The slow pointer moves one node at a time; the fast moves two. If there's a cycle, the fast pointer will eventually lap the slow one and they'll meet. If there's no cycle, the fast pointer reaches null.
            </LectureP>

            <CppBlock
                title="detect cycle in a linked list — O(n) time, O(1) space"
                lines={[
                    'bool hasCycle(Node* head) {',
                    '    Node* slow = head;',
                    '    Node* fast = head;',
                    '    while (fast && fast->next) {',
                    '        slow = slow->next;',
                    '        fast = fast->next->next;',
                    '        if (slow == fast) return true;  // they met — cycle exists',
                    '    }',
                    '    return false;',
                    '}',
                ]}
            />

            {/* ── 05 STACKS ───────────────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Stacks" />

            <LectureP>
                A <LectureTerm>stack</LectureTerm> is a <LectureTerm>LIFO</LectureTerm> (Last In, First Out) structure. The last element pushed is the first element popped. Think of a stack of plates — you add and remove from the top only. Push and pop are both O(1).
            </LectureP>
            <LectureP>
                Stacks appear everywhere: function call frames (the call stack), undo/redo in text editors, expression evaluation, balancing parentheses, depth-first graph traversal. Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::stack</code> from the STL — don't implement your own unless asked to in an interview.
            </LectureP>

            <CppBlock
                title="stack — valid parentheses (classic interview problem)"
                lines={[
                    '#include <stack>',
                    '#include <unordered_map>',
                    '',
                    'bool isValid(string s) {',
                    '    stack<char> st;',
                    '    unordered_map<char, char> pairs = {',
                    '        {")", "("},',
                    '        {"}", "{"},',
                    '        {"]", "["}',
                    '    };',
                    '    for (char c : s) {',
                    '        if (c == "(" || c == "{" || c == "[") {',
                    '            st.push(c);           // opening bracket: push',
                    '        } else {',
                    '            if (st.empty() || st.top() != pairs[c])',
                    '                return false;     // no match',
                    '            st.pop();             // closing bracket matches top: pop',
                    '        }',
                    '    }',
                    '    return st.empty();  // valid only if all brackets matched',
                    '}',
                    '// "([])" → true   "([)]" → false   "{[]}" → true',
                ]}
            />

            {/* ── 06 QUEUES ───────────────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Queues" />

            <LectureP>
                A <LectureTerm>queue</LectureTerm> is a <LectureTerm>FIFO</LectureTerm> (First In, First Out) structure. Elements are added to the back and removed from the front — like a line at a coffee shop. Enqueue and dequeue are both O(1).
            </LectureP>
            <LectureP>
                Queues appear in breadth-first search (BFS), task scheduling, print queues, and any system that needs to process items in the order they arrive. The STL provides <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::queue</code> and the more flexible <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::deque</code> (double-ended queue).
            </LectureP>

            <CppBlock
                title="queue — BFS level-order traversal of a binary tree"
                lines={[
                    '#include <queue>',
                    '',
                    'struct TreeNode {',
                    '    int val;',
                    '    TreeNode* left;',
                    '    TreeNode* right;',
                    '    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}',
                    '};',
                    '',
                    '// Returns nodes level by level',
                    'vector<vector<int>> levelOrder(TreeNode* root) {',
                    '    vector<vector<int>> result;',
                    '    if (!root) return result;',
                    '    queue<TreeNode*> q;',
                    '    q.push(root);',
                    '    while (!q.empty()) {',
                    '        int levelSize = q.size();',
                    '        vector<int> level;',
                    '        for (int i = 0; i < levelSize; i++) {',
                    '            TreeNode* node = q.front();',
                    '            q.pop();',
                    '            level.push_back(node->val);',
                    '            if (node->left)  q.push(node->left);',
                    '            if (node->right) q.push(node->right);',
                    '        }',
                    '        result.push_back(level);',
                    '    }',
                    '    return result;',
                    '}',
                ]}
            />

            {/* ── 07 HASH MAPS ────────────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Hash Maps" />

            <LectureP>
                A <LectureTerm>hash map</LectureTerm> (<code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::unordered_map</code> in C++) maps keys to values in O(1) average time. Internally it runs a <LectureTerm>hash function</LectureTerm> on the key to compute an index into a backing array. When two keys hash to the same index (a <LectureTerm>collision</LectureTerm>), the map resolves it via chaining or open addressing — hence the O(n) worst case.
            </LectureP>
            <LectureP>
                In interviews, reaching for a hash map is often the key insight that drops an O(n²) brute force to O(n). The pattern: use the map to remember what you've seen so you can look it up in O(1) instead of scanning again.
            </LectureP>

            <CppBlock
                title="hash map — two sum (most common interview problem)"
                lines={[
                    '// Given an array and target, return indices of two numbers that sum to target',
                    'vector<int> twoSum(vector<int>& nums, int target) {',
                    '    unordered_map<int, int> seen;  // value → index',
                    '    for (int i = 0; i < nums.size(); i++) {',
                    '        int complement = target - nums[i];',
                    '        if (seen.count(complement)) {',
                    '            return {seen[complement], i};  // found it',
                    '        }',
                    '        seen[nums[i]] = i;  // remember this value and its index',
                    '    }',
                    '    return {};',
                    '}',
                    '// twoSum([2,7,11,15], 9) → [0, 1]  (2+7=9)',
                    '// O(n) time, O(n) space — vs O(n²) brute force',
                ]}
            />

            <DataTable
                columns={[
                    { key: 'name', label: 'Structure' },
                    { key: 'access', label: 'Access' },
                    { key: 'search', label: 'Search' },
                    { key: 'insert', label: 'Insert' },
                    { key: 'delete', label: 'Delete' },
                ]}
                rows={[
                    {
                        name: <span className="font-semibold text-blue-600 dark:text-blue-400">Array</span>,
                        access: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)</span>,
                        search: <span className="font-mono text-muted-foreground">O(n)</span>,
                        insert: <span className="font-mono text-muted-foreground">O(n)</span>,
                        delete: <span className="font-mono text-muted-foreground">O(n)</span>,
                    },
                    {
                        name: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Linked List</span>,
                        access: <span className="font-mono text-muted-foreground">O(n)</span>,
                        search: <span className="font-mono text-muted-foreground">O(n)</span>,
                        insert: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)*</span>,
                        delete: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)*</span>,
                    },
                    {
                        name: <span className="font-semibold text-orange-600 dark:text-orange-400">Stack</span>,
                        access: <span className="font-mono text-muted-foreground">O(n)</span>,
                        search: <span className="font-mono text-muted-foreground">O(n)</span>,
                        insert: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)</span>,
                        delete: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)</span>,
                    },
                    {
                        name: <span className="font-semibold text-purple-600 dark:text-purple-400">Queue</span>,
                        access: <span className="font-mono text-muted-foreground">O(n)</span>,
                        search: <span className="font-mono text-muted-foreground">O(n)</span>,
                        insert: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)</span>,
                        delete: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)</span>,
                    },
                    {
                        name: <span className="font-semibold text-rose-600 dark:text-rose-400">Hash Map</span>,
                        access: <span className="font-mono text-muted-foreground">—</span>,
                        search: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)**</span>,
                        insert: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)**</span>,
                        delete: <span className="font-mono text-emerald-600 dark:text-emerald-400">O(1)**</span>,
                    },
                ]}
                footer={<span>* at head with pointer &nbsp;|&nbsp; ** average case, O(n) worst case with hash collisions</span>}
            />

            {/* ── 08 C++ ESSENTIALS ───────────────────────────────────────────── */}
            <LectureSectionHeading number="08" title="C++ Essentials for DSA" />

            <LectureP>
                A quick reference for the C++ syntax and idioms that come up constantly in DSA problems:
            </LectureP>

            <CppBlock
                title="C++ quick reference — patterns you'll use constantly"
                lines={[
                    '// References — avoid copying large objects',
                    'void process(vector<int>& v) { /* modifies original */ }',
                    'void inspect(const vector<int>& v) { /* read-only */ }',
                    '',
                    '// INT_MAX / INT_MIN — useful sentinels',
                    '#include <climits>',
                    'int minSoFar = INT_MAX;',
                    '',
                    '// String operations',
                    '#include <string>',
                    'string s = "hello";',
                    's.length();         // 5',
                    's.substr(1, 3);     // "ell"',
                    's[0];               // "h"',
                    'to_string(42);      // "42"',
                    'stoi("42");         // 42',
                    '',
                    '// Structured bindings (C++17) — clean map iteration',
                    'unordered_map<string, int> freq;',
                    'for (auto& [key, val] : freq) {',
                    '    cout << key << ": " << val << endl;',
                    '}',
                    '',
                    '// Priority queue (max-heap by default)',
                    '#include <queue>',
                    'priority_queue<int> maxHeap;',
                    'priority_queue<int, vector<int>, greater<int>> minHeap;',
                ]}
            />

            <LectureFooterNav
                prev={{
                    label: 'Build the Notes API',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-5/activity'),
                }}
                next={{
                    label: 'Trees, Hash Maps & OOP',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-6/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}