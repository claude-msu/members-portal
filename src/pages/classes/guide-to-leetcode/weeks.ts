/**
 * Represents a LeetCode-style coding question for the guide.
 *
 * @property id - Unique identifier for the question.
 * @property title - The title of the question.
 * @property difficulty - The difficulty level ('easy', 'medium', or 'hard').
 * @property complexity - Target time and space complexity for the intended solution.
 * @property content - Markdown description and details of the question.
 */
export interface Question {
    id: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    complexity: string;
    content: string;
}

/**
 * Section of a concept sheet containing learning materials or lists.
 *
 * @property title - The section heading.
 * @property items - (Optional) A list of key concepts or examples.
 * @property content - (Optional) Markdown body content for the section.
 */
export interface ConceptSheetSection {
    title: string;
    items?: string[];
    content?: string;
}

/**
 * Week config and questions.
 *
 * Display logic (index.tsx):
 * - Countdown is "time until next Sunday 9:00am" (then it resets to ~6d 23h 59m 59s).
 * - Upper half (> 3.5 days left) OR when the timer just reset: we show QUEUED.
 * - Lower half (≤ 3.5 days left): we show CURRENT.
 *
 * When to make the change (promote QUEUED → CURRENT, set new QUEUED):
 * Do it only after Wednesday (from Wednesday 9:00am onward, until the next Sunday 9:00am).
 *
 * @property number - The week number in the program.
 * @property theme - The overarching conceptual focus/theme for the week.
 * @property title - The display title for the week.
 * @property goal - The main objective for the week.
 * @property rules - The list of rules/guidelines for the week.
 * @property conceptSheets - Array of concept sheet sections (reference, cues, invariants, etc.).
 * @property questions - Array of coding questions for the week (see Question type).
 */
export interface WeekConfig {
    number: number;
    theme: string;
    title: string;
    goal: string;
    rules: string[];
    conceptSheets: ConceptSheetSection[];
    questions: Question[];
}

const WEEK1: WeekConfig = {
    number: 1,
    theme: 'Sliding Window',
    title: 'Week 1 — Arrays, Hashing, Two Pointers',
    goal: 'Recognize the pattern immediately.',
    rules: [
        'Most interview questions are just basic array patterns in disguise.',
        "If you don't instantly know the pattern, you're guessing.",
        'A problem only counts if you submit all 4 artifacts.',
        'No artifacts = no credit.',
    ],
    conceptSheets: [
        {
            title: 'Core Patterns',
            items: [
                'Frequency map (value → count)',
                'Value → index map',
                'Two pointers (toward each other)',
                'Two pointers (same direction)',
                'Sort + sweep',
            ],
        },
        {
            title: 'Recognition Cues',
            items: [
                '"find two numbers…" → hash map or two pointers',
                '"duplicates" → set or frequency map',
                '"in place removal" → slow/fast pointer',
                '"sorted input" → two pointers',
                '"pairs summing to target" → hash map (unsorted) / two pointers (sorted)',
            ],
        },
        {
            title: 'Invariants',
            items: [
                'Hash map holds elements seen so far',
                'Left pointer marks valid region',
                'Window always satisfies condition X',
                'Sorted order lets pointers move one way only',
            ],
        },
    ],
    questions: [
        {
            id: 1,
            title: 'Maximum Average Subarray I',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space — one pass',
            content: `## Problem

You are given an integer array \`nums\` consisting of \`n\` elements, and an integer \`k\`.

Find a contiguous subarray whose **length is equal to** \`k\` that has the maximum average value and return this value. Any answer with a calculation error less than \`10⁻⁵\` will be accepted.

---

**Example 1:**
\`\`\`
Input: nums = [1,12,-5,-6,50,3], k = 4
Output: 12.75000
Explanation: Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [5], k = 1
Output: 5.00000
\`\`\`

---

## Constraints

- \`n == nums.length\`
- \`1 <= k <= n <= 10⁵\`
- \`-10⁴ <= nums[i] <= 10⁴\`
`,
        },
        {
            id: 2,
            title: 'Contains Duplicate II',
            difficulty: 'easy',
            complexity: 'O(n) time, O(n) space — one pass',
            content: `## Problem

Given an integer array \`nums\` and an integer \`k\`, return \`true\` if there are two **distinct indices** \`i\` and \`j\` in the array such that \`nums[i] == nums[j]\` and \`abs(i - j) <= k\`.

---

**Example 1:**
\`\`\`
Input: nums = [1,2,3,1], k = 3
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,0,1,1], k = 1
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,2,3,1,2,3], k = 2
Output: false
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10⁵\`
- \`-10⁹ <= nums[i] <= 10⁹\`
- \`0 <= k <= 10⁵\`
`,
        },
        {
            id: 3,
            title: 'Find All Anagrams in a String',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) or O(p) space',
            content: `## Problem

Given two strings \`s\` and \`p\`, return an array of all the start indices of \`p\`'s anagrams in \`s\`. You may return the answer in **any order**.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

---

**Example 1:**
\`\`\`
Input: s = "cbaebabacd", p = "abc"
Output: [0,6]
Explanation:
The substring at index 0 is "cba", an anagram of "abc".
The substring at index 6 is "bac", an anagram of "abc".
\`\`\`

**Example 2:**
\`\`\`
Input: s = "abab", p = "ab"
Output: [0,1,2]
\`\`\`

---

## Constraints

- \`1 <= s.length, p.length <= 3 * 10⁴\`
- \`s\` and \`p\` consist of lowercase English letters.
`,
        },
        {
            id: 4,
            title: 'Longest Substring Without Repeating Characters',
            difficulty: 'easy',
            complexity: 'O(n) time, O(min(n, charset)) space',
            content: `## Problem

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

---

**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

**Example 2:**
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

**Example 3:**
\`\`\`
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
\`\`\`

---

## Constraints

- \`0 <= s.length <= 5 * 10⁴\`
- \`s\` consists of English letters, digits, symbols and spaces.
`,
        },
        {
            id: 5,
            title: 'Minimum Size Subarray Sum',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space',
            content: `## Problem

Given an array of positive integers \`nums\` and a positive integer \`target\`, return the **minimal length** of a subarray whose sum is greater than or equal to \`target\`. If there is no such subarray, return \`0\` instead.

---

**Example 1:**
\`\`\`
Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.
\`\`\`

**Example 2:**
\`\`\`
Input: target = 4, nums = [1,4,4]
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: target = 11, nums = [1,1,1,1,1,1,1,1]
Output: 0
\`\`\`

---

## Constraints

- \`1 <= target <= 10⁹\`
- \`1 <= nums.length <= 10⁵\`
- \`1 <= nums[i] <= 10⁴\`

---

## Follow-up

If you have figured out the \`O(n)\` solution, try coding another solution of which the time complexity is \`O(n log(n))\`.
`,
        },
    ],
};


/** Current week. Update every Sunday: set to the week that just went live. */
export const CURRENT: WeekConfig = WEEK1;

/** Next drop's week. Shown in upper half of countdown and when timer resets. Null = fallback to CURRENT. */
export const QUEUED: WeekConfig | null = null;
