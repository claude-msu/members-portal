/**
 * Represents a LeetCode-style coding question for the guide.
 *
 * @property id - Unique identifier for the question.
 * @property title - The title of the question.
 * @property difficulty - The difficulty level ('easy', 'medium', or 'hard').
 * @property complexity - Target time and space complexity for the intended solution.
 * @property content - Markdown description and details of the question.
 * @property optional - When true, an "Optional" badge is shown next to the difficulty badge.
 */
export interface Question {
    id: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    complexity: string;
    content: string;
    optional?: boolean;
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
            title: 'Two Sum',
            difficulty: 'easy',
            complexity: 'O(n) time, O(n) space',
            content: `
## Problem

Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

---

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

---

## Constraints

- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- **Only one valid answer exists.**
`,
        },
        {
            id: 2,
            title: 'Contains Duplicate',
            difficulty: 'easy',
            complexity: 'O(n) time, O(n) space',
            content: `## Problem

Given an integer array \`nums\`, return \`true\` if **any value** appears **at least twice** in the array, and return \`false\` if every element is distinct.

---

**Example 1:**
\`\`\`
Input: nums = [1,2,3,1]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,2,3,4]
Output: false
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`
`,
        },
        {
            id: 3,
            title: 'Valid Anagram',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) or O(n) space',
            content: `
## Problem

Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

---

**Example 1:**
\`\`\`
Input: s = "anagram", t = "nagaram"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "rat", t = "car"
Output: false
\`\`\`

---

## Constraints

- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters.
`,
        },
        {
            id: 4,
            title: 'Remove Duplicates from Sorted Array',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

Given an integer array \`nums\` **sorted in non-decreasing order**, remove the duplicates **in-place** such that each unique element appears only once. The **relative order** of the elements should be kept the same.

After removing the duplicates, return the new length \`k\` of the array and modify \`nums\` in-place so that the first \`k\` elements of \`nums\` contain the unique elements.

**You must not allocate extra space for another array; you must do this by modifying the input array in-place with O(1) extra memory.**

---

**Example 1:**
\`\`\`
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively. It does not matter what you leave beyond the returned k.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 3 * 10^4\`
- \`-100 <= nums[i] <= 100\`
- \`nums\` is sorted in non-decreasing order.
`,
        },
        {
            id: 5,
            title: 'Squares of a Sorted Array',
            difficulty: 'easy',
            complexity: 'O(n) time, O(n) space',
            content: `
## Problem

Given an integer array \`nums\` **sorted in non-decreasing order**, return **an array of the squares of each number** sorted in non-decreasing order.

---

**Example 1:**
\`\`\`
Input: nums = [-4,-1,0,3,10]
Output: [0,1,9,16,100]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [-7,-3,2,3,11]
Output: [4,9,9,49,121]
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10^4\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`nums\` is sorted in non-decreasing order.
`,
        },
        {
            id: 6,
            title: '3Sum',
            difficulty: 'medium',
            optional: true,
            complexity: 'O(n^2) time, O(1) space (excluding output)',
            content: `
## Problem

Given an integer array \`nums\`, return **all the triplets** \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

**Notice that the solution set must not contain duplicate triplets.**

---

**Example 1:**
\`\`\`
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0,1,1]
Output: []
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [0,0,0]
Output: [[0,0,0]]
\`\`\`

---

## Constraints

- \`3 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\`
`,
        },
        {
            id: 7,
            title: 'Container With Most Water',
            difficulty: 'medium',
            optional: true,
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`-th line are at \`(i, 0)\` and \`(i, height[i])\`.

Find **two lines** that together with the x-axis form a container, such that the container contains the most water.

Return the **maximum amount of water a container can store**.

**Notice that you may not slant the container.**

---

**Example 1:**
\`\`\`
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.
\`\`\`

**Example 2:**
\`\`\`
Input: height = [1,1]
Output: 1
\`\`\`

---

## Constraints

- \`n == height.length\`
- \`2 <= n <= 10^5\`
- \`0 <= height[i] <= 10^4\`
`,
        },
    ],
};


const WEEK2: WeekConfig = {
    number: 2,
    theme: 'Two Pointers & Sliding Window',
    title: 'Week 2 — Two Pointers & Sliding Window',
    goal: 'Move pointers with purpose, never by accident.',
    rules: [
        'Two pointers only work when you can justify why each pointer moves.',
        'Sliding window = grow right greedily, shrink left only when the window breaks.',
        'A problem only counts if you submit all 4 artifacts.',
        'No artifacts = no credit.',
    ],
    conceptSheets: [
        {
            title: 'Core Patterns',
            items: [
                'Two pointers — converging (left from start, right from end)',
                'Two pointers — same direction (slow writer, fast reader)',
                'Sliding window — variable size (expand right, shrink left on violation)',
                'Prefix tracking — running min/max to avoid inner loops',
            ],
        },
        {
            title: 'Recognition Cues',
            items: [
                '"palindrome / reads the same" → two pointers from both ends',
                '"sorted array, find pair summing to target" → converging two pointers',
                '"buy low sell high, single transaction" → running minimum scan',
                '"longest subarray with property X" → dynamic sliding window',
            ],
        },
        {
            title: 'Invariants',
            items: [
                'Converging pointers: move the side that cannot improve the answer',
                'Sorted two-pointer: sum too small → move left right; sum too large → move right left',
                'Sliding window: window always satisfies the condition before recording an answer',
            ],
        },
    ],
    questions: [
        {
            id: 1,
            title: 'Valid Palindrome',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

---

**Example 1:**
\`\`\`
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
\`\`\`

**Example 2:**
\`\`\`
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
\`\`\`

**Example 3:**
\`\`\`
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.
\`\`\`

---

## Constraints

- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists only of printable ASCII characters.
`,
        },
        {
            id: 2,
            title: 'Two Sum II (Input Array Is Sorted)',
            difficulty: 'medium',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number. Let these two numbers be \`numbers[index1]\` and \`numbers[index2]\` where \`1 <= index1 < index2 <= numbers.length\`.

Return the indices of the two numbers, \`index1\` and \`index2\`, **added by one** as an integer array \`[index1, index2]\` of length 2.

The tests are generated such that there is **exactly one solution**. You may not use the same element twice.

Your solution must use only **constant extra space**.

---

**Example 1:**
\`\`\`
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2.
\`\`\`

**Example 2:**
\`\`\`
Input: numbers = [2,3,4], target = 6
Output: [1,3]
\`\`\`

**Example 3:**
\`\`\`
Input: numbers = [-1,0], target = -1
Output: [1,2]
\`\`\`

---

## Constraints

- \`2 <= numbers.length <= 3 * 10^4\`
- \`-1000 <= numbers[i] <= 1000\`
- \`numbers\` is sorted in non-decreasing order.
- \`-1000 <= target <= 1000\`
- The tests are generated such that there is **exactly one solution**.
`,
        },
        {
            id: 3,
            title: 'Best Time to Buy and Sell Stock',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`-th day.

You want to **maximize your profit** by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the **maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

---

**Example 1:**
\`\`\`
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.
Note: Buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
\`\`\`

**Example 2:**
\`\`\`
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.
\`\`\`

---

## Constraints

- \`1 <= prices.length <= 10^5\`
- \`0 <= prices[i] <= 10^4\`
`,
        },
    ],
};


/** Current week. Update every Sunday: set to the week that just went live. */
export const CURRENT: WeekConfig = WEEK2;

/** Next drop's week. Shown in upper half of countdown and when timer resets. Null = fallback to CURRENT. */
export const QUEUED: WeekConfig | null = null;
