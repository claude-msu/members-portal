import { useNavigate } from 'react-router-dom';
import { Binary } from 'lucide-react';
import { LectureLayout } from '@/components/ui/lecture-layout';
import { LectureHeader } from '@/components/ui/lecture-header';
import { LectureFooterNav } from '@/components/ui/lecture-footer-nav';
import { LectureCallout } from '@/components/ui/lecture-callout';
import {
    LectureSectionHeading,
    LectureP,
    LectureTerm,
} from '@/components/ui/lecture-typography';
import { CppBlock } from '@/components/ui/cpp-block';

// ── BFS vs DFS diagram ────────────────────────────────────────────────────────
const BfsDfsDiagram = () => (
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
            {
                label: 'BFS — Breadth-First Search',
                color: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-800',
                header: 'bg-blue-50 dark:bg-blue-950/30',
                order: ['1 (root)', '2, 3', '4, 5, 6, 7'],
                orderLabel: 'Visit order by level',
                structure: 'Queue (FIFO)',
                use: 'Shortest path, level-order problems',
                note: 'Explores all nodes at depth d before any at depth d+1.',
            },
            {
                label: 'DFS — Depth-First Search',
                color: 'text-orange-600 dark:text-orange-400',
                border: 'border-orange-200 dark:border-orange-800',
                header: 'bg-orange-50 dark:bg-orange-950/30',
                order: ['1 (root)', '2 → 4 → 5', 'back to 3 → 6 → 7'],
                orderLabel: 'Visit order (pre-order)',
                structure: 'Stack / call stack (recursion)',
                use: 'Path existence, cycle detection, topological sort',
                note: 'Goes as deep as possible down one branch before backtracking.',
            },
        ].map((item) => (
            <div key={item.label} className={`rounded-xl border ${item.border} overflow-hidden`}>
                <div className={`px-4 py-2.5 ${item.header}`}>
                    <p className={`text-xs font-bold ${item.color}`}>{item.label}</p>
                </div>
                <div className="p-4 space-y-2.5">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">{item.orderLabel}</p>
                        <div className="space-y-1">
                            {item.order.map((step, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className={`text-xs font-mono font-bold w-4 shrink-0 ${item.color}`}>{i + 1}.</span>
                                    <code className="text-xs text-foreground">{step}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-1 border-t border-border space-y-1">
                        <p className="text-xs"><span className="text-muted-foreground">Data structure: </span><span className="font-semibold text-foreground">{item.structure}</span></p>
                        <p className="text-xs"><span className="text-muted-foreground">Best for: </span><span className="text-foreground">{item.use}</span></p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.note}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function Week7Lecture1() {
    const navigate = useNavigate();

    return (
        <LectureLayout>
            <LectureHeader
                week={7}
                session="Lecture 1"
                title="Trees, Stacks & Queues"
                description="Binary trees, BSTs, in-order traversal, stacks, and queues — the non-linear structures that show up in databases, compilers, and every technical interview you will ever take."
                icon={<Binary className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
            />

            {/* ── 01 THE CALL STACK IS A STACK ────────────────────────────────── */}
            <LectureSectionHeading number="01" title="The Call Stack Is Literally a Stack" />

            <LectureP>
                Before diving into tree algorithms, there's an insight worth making explicit: your program's own execution uses a stack. Every time you call a function, a <LectureTerm>stack frame</LectureTerm> is pushed — containing the function's local variables, parameters, and the return address. When the function returns, the frame is popped.
            </LectureP>
            <LectureP>
                This is why recursion <em>is</em> DFS. A recursive tree traversal doesn't manage an explicit stack — it uses the call stack. The two are mechanically identical. Understanding this means you can always convert a recursive DFS to an iterative one using an explicit <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">std::stack</code> — and vice versa.
            </LectureP>

            <CppBlock
                title="recursive DFS vs iterative DFS — same result, different mechanism"
                lines={[
                    '// Recursive — uses the call stack implicitly',
                    'void dfsRecursive(TreeNode* node) {',
                    '    if (!node) return;',
                    '    cout << node->val << " ";   // pre-order: process before children',
                    '    dfsRecursive(node->left);',
                    '    dfsRecursive(node->right);',
                    '}',
                    '',
                    '// Iterative — uses an explicit stack',
                    'void dfsIterative(TreeNode* root) {',
                    '    if (!root) return;',
                    '    stack<TreeNode*> st;',
                    '    st.push(root);',
                    '    while (!st.empty()) {',
                    '        TreeNode* node = st.top(); st.pop();',
                    '        cout << node->val << " ";',
                    '        // push right first so left is processed first',
                    '        if (node->right) st.push(node->right);',
                    '        if (node->left)  st.push(node->left);',
                    '    }',
                    '}',
                    '// Both produce the same pre-order output: root → left → right',
                ]}
            />

            <LectureCallout type="tip">
                When a recursive solution causes a stack overflow (very deep trees or graphs), convert it to iterative with an explicit stack. The logic is the same — you just manage memory yourself instead of letting the runtime do it.
            </LectureCallout>

            {/* ── 02 BFS VS DFS ───────────────────────────────────────────────── */}
            <LectureSectionHeading number="02" title="BFS vs. DFS — Choosing the Right One" />

            <LectureP>
                BFS and DFS are the two fundamental graph traversal strategies. The choice between them isn't arbitrary — each is optimal for different classes of problems. The key difference is the data structure: BFS uses a <LectureTerm>queue</LectureTerm> (processes nodes level by level), DFS uses a <LectureTerm>stack</LectureTerm> (goes deep before wide).
            </LectureP>

            <BfsDfsDiagram />

            <CppBlock
                title="BFS — level-order traversal with a queue"
                lines={[
                    '#include <queue>',
                    '',
                    'void bfs(TreeNode* root) {',
                    '    if (!root) return;',
                    '    queue<TreeNode*> q;',
                    '    q.push(root);',
                    '    while (!q.empty()) {',
                    '        int levelSize = q.size();  // snapshot: nodes at this level',
                    '        for (int i = 0; i < levelSize; i++) {',
                    '            TreeNode* node = q.front(); q.pop();',
                    '            cout << node->val << " ";',
                    '            if (node->left)  q.push(node->left);',
                    '            if (node->right) q.push(node->right);',
                    '        }',
                    '        cout << endl;  // new line between levels',
                    '    }',
                    '}',
                    '// Guarantees shortest path in unweighted graphs',
                ]}
            />

            {/* ── 03 GRAPHS ───────────────────────────────────────────────────── */}
            <LectureSectionHeading number="03" title="Graphs — The General Case" />

            <LectureP>
                A <LectureTerm>tree</LectureTerm> is a special case of a <LectureTerm>graph</LectureTerm>: a connected, acyclic graph with n nodes and n-1 edges. Real-world problems often involve general graphs: social networks, road maps, dependency systems. The same BFS and DFS algorithms apply — with one critical addition: a <LectureTerm>visited</LectureTerm> set to prevent infinite loops on cycles.
            </LectureP>

            <LectureP>
                Graphs are typically represented as an <LectureTerm>adjacency list</LectureTerm> — a map from each node to its neighbors. For a graph with n nodes and e edges, this uses O(n + e) space, far better than the O(n²) adjacency matrix for sparse graphs.
            </LectureP>

            <CppBlock
                title="graph BFS — shortest path in an unweighted graph"
                lines={[
                    '#include <queue>',
                    '#include <unordered_map>',
                    '#include <unordered_set>',
                    '',
                    '// Adjacency list: node → list of neighbors',
                    'using Graph = unordered_map<int, vector<int>>;',
                    '',
                    '// Returns shortest distance from start to target (-1 if unreachable)',
                    'int bfsShortestPath(Graph& g, int start, int target) {',
                    '    unordered_set<int> visited;',
                    '    queue<pair<int, int>> q;  // {node, distance}',
                    '    q.push({start, 0});',
                    '    visited.insert(start);',
                    '    while (!q.empty()) {',
                    '        auto [node, dist] = q.front(); q.pop();',
                    '        if (node == target) return dist;',
                    '        for (int neighbor : g[node]) {',
                    '            if (!visited.count(neighbor)) {',
                    '                visited.insert(neighbor);',
                    '                q.push({neighbor, dist + 1});',
                    '            }',
                    '        }',
                    '    }',
                    '    return -1;  // target unreachable',
                    '}',
                ]}
            />

            <CppBlock
                title="graph DFS — find if path exists between two nodes"
                lines={[
                    'bool dfsHasPath(Graph& g, int curr, int target, unordered_set<int>& visited) {',
                    '    if (curr == target) return true;',
                    '    visited.insert(curr);',
                    '    for (int neighbor : g[curr]) {',
                    '        if (!visited.count(neighbor)) {',
                    '            if (dfsHasPath(g, neighbor, target, visited)) return true;',
                    '        }',
                    '    }',
                    '    return false;',
                    '}',
                    '',
                    '// Entry point',
                    'bool hasPath(Graph& g, int start, int target) {',
                    '    unordered_set<int> visited;',
                    '    return dfsHasPath(g, start, target, visited);',
                    '}',
                ]}
            />

            {/* ── 04 CONNECTED COMPONENTS ─────────────────────────────────────── */}
            <LectureSectionHeading number="04" title="Connected Components" />

            <LectureP>
                A <LectureTerm>connected component</LectureTerm> is a subgraph where every node is reachable from every other node, but no node is connected to any node outside the component. Counting components is a classic interview problem — the pattern is: iterate over all nodes, and for any unvisited node, run DFS/BFS to mark everything reachable from it as one component.
            </LectureP>

            <CppBlock
                title="count connected components — O(n + e)"
                lines={[
                    'int countComponents(int n, Graph& g) {',
                    '    unordered_set<int> visited;',
                    '    int components = 0;',
                    '    for (int node = 0; node < n; node++) {',
                    '        if (!visited.count(node)) {',
                    '            // Found an unvisited node — new component',
                    '            dfsHasPath(g, node, -1, visited);  // -1 = no target, just flood fill',
                    '            components++;',
                    '        }',
                    '    }',
                    '    return components;',
                    '}',
                    '// Same pattern works for: islands in a grid, union-find problems',
                ]}
            />

            {/* ── 05 CYCLE DETECTION ──────────────────────────────────────────── */}
            <LectureSectionHeading number="05" title="Cycle Detection" />

            <LectureP>
                Detecting cycles in a graph is essential for dependency resolution (does this package import itself?), deadlock detection, and validating DAGs. The approach differs for directed vs. undirected graphs.
            </LectureP>

            <CppBlock
                title="cycle detection in a directed graph — DFS with state tracking"
                lines={[
                    '// Three states per node:',
                    '// 0 = unvisited, 1 = currently in stack (gray), 2 = fully processed (black)',
                    'bool dfsCycleCheck(int node, Graph& g, vector<int>& state) {',
                    '    state[node] = 1;  // mark as in-progress',
                    '    for (int neighbor : g[node]) {',
                    '        if (state[neighbor] == 1) return true;  // back edge = cycle',
                    '        if (state[neighbor] == 0) {',
                    '            if (dfsCycleCheck(neighbor, g, state)) return true;',
                    '        }',
                    '    }',
                    '    state[node] = 2;  // mark as done',
                    '    return false;',
                    '}',
                    '',
                    'bool hasCycle(int n, Graph& g) {',
                    '    vector<int> state(n, 0);',
                    '    for (int i = 0; i < n; i++)',
                    '        if (state[i] == 0 && dfsCycleCheck(i, g, state)) return true;',
                    '    return false;',
                    '}',
                ]}
            />

            {/* ── 06 TOPOLOGICAL SORT ─────────────────────────────────────────── */}
            <LectureSectionHeading number="06" title="Topological Sort" />

            <LectureP>
                <LectureTerm>Topological sort</LectureTerm> orders the nodes of a <LectureTerm>DAG</LectureTerm> (Directed Acyclic Graph) so that every edge points from earlier to later in the ordering. It's the algorithm behind course prerequisites, build systems, and package dependency resolution: "you must install A before B, and B before C."
            </LectureP>
            <LectureP>
                The most common implementation uses <LectureTerm>Kahn's algorithm</LectureTerm> (BFS-based): repeatedly remove nodes with no incoming edges, adding them to the result. If you can remove all nodes, the graph is acyclic and you have a valid ordering. If nodes remain, there's a cycle.
            </LectureP>

            <CppBlock
                title="topological sort — Kahn's algorithm (BFS)"
                lines={[
                    '#include <queue>',
                    '',
                    'vector<int> topoSort(int n, Graph& g) {',
                    '    // Count incoming edges for each node',
                    '    vector<int> inDegree(n, 0);',
                    '    for (auto& [node, neighbors] : g)',
                    '        for (int nb : neighbors) inDegree[nb]++;',
                    '',
                    '    // Start with all nodes that have no prerequisites',
                    '    queue<int> q;',
                    '    for (int i = 0; i < n; i++)',
                    '        if (inDegree[i] == 0) q.push(i);',
                    '',
                    '    vector<int> order;',
                    '    while (!q.empty()) {',
                    '        int node = q.front(); q.pop();',
                    '        order.push_back(node);',
                    '        for (int nb : g[node]) {',
                    '            if (--inDegree[nb] == 0) q.push(nb);  // neighbor ready',
                    '        }',
                    '    }',
                    '    // If order.size() != n, there was a cycle',
                    '    return order.size() == n ? order : vector<int>{};',
                    '}',
                ]}
            />

            <LectureCallout type="info">
                Topological sort only works on DAGs. The cycle detection and topological sort algorithms are closely related — if Kahn's algorithm can't process all nodes, the remaining nodes form a cycle. Course Schedule II on LeetCode is the canonical problem.
            </LectureCallout>

            {/* ── 07 MONOTONIC STACK ──────────────────────────────────────────── */}
            <LectureSectionHeading number="07" title="Monotonic Stack" />

            <LectureP>
                A <LectureTerm>monotonic stack</LectureTerm> is a stack that maintains elements in sorted order (either always increasing or always decreasing). It's the key insight behind a family of problems that ask "what's the next greater/smaller element?" — problems that look O(n²) at first but become O(n) with this pattern.
            </LectureP>

            <CppBlock
                title="next greater element — O(n) with monotonic stack"
                lines={[
                    '// For each element, find the next element to its right that is greater.',
                    '// Result[i] = next greater element for nums[i], or -1 if none.',
                    'vector<int> nextGreaterElement(vector<int>& nums) {',
                    '    int n = nums.size();',
                    '    vector<int> result(n, -1);',
                    '    stack<int> st;  // stores indices, maintains decreasing order of values',
                    '',
                    '    for (int i = 0; i < n; i++) {',
                    '        // Pop all elements smaller than nums[i]',
                    '        // nums[i] is their "next greater element"',
                    '        while (!st.empty() && nums[st.top()] < nums[i]) {',
                    '            result[st.top()] = nums[i];',
                    '            st.pop();',
                    '        }',
                    '        st.push(i);',
                    '    }',
                    '    return result;  // remaining indices in stack have no next greater',
                    '}',
                    '// [2,1,2,4,3] → [4,2,4,-1,-1]',
                ]}
            />

            <LectureCallout type="tip">
                The monotonic stack pattern solves: Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, and Trapping Rain Water. Recognize the pattern: "for each element, find the nearest element satisfying some comparison." That's a monotonic stack.
            </LectureCallout>

            <LectureFooterNav
                prev={{
                    label: 'Library Management System',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-6/activity'),
                }}
                next={{
                    label: 'OOP in Practice — C++ Project',
                    onClick: () => navigate('/classes/introduction-to-fundamentals/week-7/lecture-2'),
                }}
            />
        </LectureLayout>
    );
}