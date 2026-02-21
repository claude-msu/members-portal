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

// ── Complexity table ──────────────────────────────────────────────────────────
const ComplexityTable = () => (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground">
            {['Structure', 'Access', 'Search', 'Insert', 'Delete'].map(h => (
                <div key={h} className="px-3 py-2.5">{h}</div>
            ))}
        </div>
        {[
            { name: 'Array', access: 'O(1)', search: 'O(n)', insert: 'O(n)', del: 'O(n)', color: 'text-blue-600 dark:text-blue-400' },
            { name: 'Linked List', access: 'O(n)', search: 'O(n)', insert: 'O(1)*', del: 'O(1)*', color: 'text-emerald-600 dark:text-emerald-400' },
            { name: 'Stack', access: 'O(n)', search: 'O(n)', insert: 'O(1)', del: 'O(1)', color: 'text-orange-600 dark:text-orange-400' },
            { name: 'Queue', access: 'O(n)', search: 'O(n)', insert: 'O(1)', del: 'O(1)', color: 'text-purple-600 dark:text-purple-400' },
            { name: 'Hash Map', access: '—', search: 'O(1)**', insert: 'O(1)**', del: 'O(1)**', color: 'text-rose-600 dark:text-rose-400' },
        ].map(row => (
            <div key={row.name} className="grid grid-cols-5 border-b border-border last:border-b-0 text-xs">
                <div className={`px-3 py-2.5 font-semibold ${row.color}`}>{row.name}</div>
                {[row.access, row.search, row.insert, row.del].map((v, i) => (
                    <div key={i} className={`px-3 py-2.5 font-mono ${v === 'O(1)' || v === 'O(1)*' || v === 'O(1)**' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>{v}</div>
                ))}
            </div>
        ))}
        <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/20">
            * at head with pointer &nbsp;|&nbsp; ** average case, O(n) worst case with hash collisions
        </div>
    </div>
);

// ── C++ code block ────────────────────────────────────────────────────────────
// Syntax highlight by injecting inline styles — never Tailwind classes,
// which get purged at build time when only present in dynamic strings.
const KEYWORD_COLOR = '#60a5fa'; // blue-400
const STRING_COLOR = '#fbbf24'; // amber-400
const TYPE_COLOR = '#34d399'; // emerald-400
const FUNCTION_COLOR = '#a78bfa'; // purple-400
const OPERATOR_COLOR = '#f472b6'; // pink-400
const NUMBER_COLOR = '#d4a574'; // warm sand (numbers)
const BRACKET_COLOR = '#94a3b8'; // slate-400
const COMMENT_COLOR = '#71717a'; // zinc-500
const DEFAULT_COLOR = '#d4d4d8'; // zinc-300

function highlightCpp(raw: string): string {
    // Escape HTML entities first so angle-brackets in templates don't break markup
    let s = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Use unique markers with special characters that won't appear in code
    const MARKER_PREFIX = '\u0001';
    const MARKER_SUFFIX = '\u0002';

    // Strings (after escaping so quotes are still literal " chars)
    const stringMarkers: string[] = [];
    s = s.replace(/"([^"]*)"/g, (match) => {
        const marker = `${MARKER_PREFIX}STR${stringMarkers.length}${MARKER_SUFFIX}`;
        stringMarkers.push(match);
        return marker;
    });

    // Numbers (integers and floats)
    const numberMarkers: string[] = [];
    s = s.replace(/\b(\d+\.?\d*)\b/g, (match) => {
        const marker = `${MARKER_PREFIX}NUM${numberMarkers.length}${MARKER_SUFFIX}`;
        numberMarkers.push(match);
        return marker;
    });

    // Keywords (expanded list)
    const keywordMarkers: string[] = [];
    s = s.replace(
        /\b(int|void|bool|string|auto|class|struct|public|private|protected|return|if|else|while|for|new|delete|nullptr|true|false|const|size_t|template|typename|virtual|override|using|namespace|include|char|double|float|long|short|unsigned|signed|static|extern|inline|explicit|friend|operator|this|throw|try|catch|enum|typedef|union|volatile|mutable|register|goto|break|continue|switch|case|default|do|static_cast|dynamic_cast|const_cast|reinterpret_cast)\b/g,
        (match) => {
            const marker = `${MARKER_PREFIX}KW${keywordMarkers.length}${MARKER_SUFFIX}`;
            keywordMarkers.push(match);
            return marker;
        }
    );

    // Preprocessor directives
    s = s.replace(/^(\s*#\w+)/gm, (match) => {
        const marker = `${MARKER_PREFIX}KW${keywordMarkers.length}${MARKER_SUFFIX}`;
        keywordMarkers.push(match);
        return marker;
    });

    // PascalCase identifiers followed by < ( {  → treat as type/class names
    const typeMarkers: string[] = [];
    s = s.replace(/\b([A-Z][A-Za-z0-9]+)\b(?=\s*[&lt;({])/g, (match) => {
        const marker = `${MARKER_PREFIX}TYP${typeMarkers.length}${MARKER_SUFFIX}`;
        typeMarkers.push(match);
        return marker;
    });

    // Function names: camelCase/lowercase identifiers followed by (
    const functionMarkers: string[] = [];
    s = s.replace(/\b([a-z][a-zA-Z0-9_]*)\s*(?=\()/g, (match) => {
        const marker = `${MARKER_PREFIX}FN${functionMarkers.length}${MARKER_SUFFIX}`;
        functionMarkers.push(match.trim());
        return marker;
    });

    // Member access operators (-> and .)
    const operatorMarkers: string[] = [];
    s = s.replace(/(->|\.)/g, (match) => {
        const marker = `${MARKER_PREFIX}OP${operatorMarkers.length}${MARKER_SUFFIX}`;
        operatorMarkers.push(match);
        return marker;
    });

    // Other operators (avoid matching HTML entities)
    s = s.replace(/([+\-*/%=<>!&|^~?:]+)/g, (match) => {
        // Skip HTML entities
        if (match.includes('&') || match.includes(';')) return match;
        const marker = `${MARKER_PREFIX}OP${operatorMarkers.length}${MARKER_SUFFIX}`;
        operatorMarkers.push(match);
        return marker;
    });

    // Parentheses, brackets, braces
    const bracketMarkers: string[] = [];
    s = s.replace(/([(){}[\]]+)/g, (match) => {
        const marker = `${MARKER_PREFIX}BR${bracketMarkers.length}${MARKER_SUFFIX}`;
        bracketMarkers.push(match);
        return marker;
    });

    // Restore all markers with proper spans (in reverse order to avoid conflicts)
    bracketMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}BR${i}${MARKER_SUFFIX}`, `<span style="color:${BRACKET_COLOR}">${val}</span>`);
    });
    operatorMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}OP${i}${MARKER_SUFFIX}`, `<span style="color:${OPERATOR_COLOR}">${val}</span>`);
    });
    functionMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}FN${i}${MARKER_SUFFIX}`, `<span style="color:${FUNCTION_COLOR}">${val}</span>`);
    });
    typeMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}TYP${i}${MARKER_SUFFIX}`, `<span style="color:${TYPE_COLOR}">${val}</span>`);
    });
    keywordMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}KW${i}${MARKER_SUFFIX}`, `<span style="color:${KEYWORD_COLOR}">${val}</span>`);
    });
    numberMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}NUM${i}${MARKER_SUFFIX}`, `<span style="color:${NUMBER_COLOR}">${val}</span>`);
    });
    stringMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}STR${i}${MARKER_SUFFIX}`, `<span style="color:${STRING_COLOR}">${val}</span>`);
    });

    return s;
}

const CppBlock = ({ title, lines }: { title: string; lines: string[] }) => (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
        <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">{title}</div>
        <div
            className="bg-zinc-950 px-5 py-4 space-y-0.5"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
            {lines.map((line, i) =>
                line.trimStart().startsWith('//') ? (
                    // Comments — plain span, no further highlighting needed
                    <p key={i} style={{ color: COMMENT_COLOR, lineHeight: '1.6', whiteSpace: 'pre' }}>{line}</p>
                ) : (
                    <p
                        key={i}
                        style={{ color: DEFAULT_COLOR, lineHeight: '1.6', whiteSpace: 'pre' }}
                        dangerouslySetInnerHTML={{ __html: highlightCpp(line) }}
                    />
                )
            )}
        </div>
    </div>
);

export default function Week6Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={6}
                session="Lecture 1"
                title="Arrays, Linked Lists, Stacks & Queues"
                description="Data structures are the vocabulary of algorithms. Before you can solve problems efficiently, you need to know which structure fits which problem — and understand why, not just what to type. This lecture covers the four foundational structures in C++, their tradeoffs, and the problems they're built for."
                icon={<Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
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

            <ComplexityTable />

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