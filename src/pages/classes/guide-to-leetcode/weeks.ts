/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Represents a LeetCode-style coding question for the guide.
 *
 * @property id - Unique identifier for the question.
 * @property title - The title of the question.
 * @property difficulty - The difficulty level ('easy', 'medium', or 'hard').
 * @property complexity - Target time and space complexity for the intended solution.
 * @property content - Markdown description and details of the question.
 * @property optional - When true, an "Optional" badge is shown next to the difficulty badge.
 * @property premium - When true, the question is LeetCode Premium only.
 */
export interface Question {
    id: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    complexity: string;
    content: string;
    optional?: boolean;
    premium?: boolean;
}

/**
 * Section of a concept sheet containing learning materials or lists.
 *
/**
 * Week config and questions.
 *
 * Current week is determined by getCurrent() from the active semester (index.tsx).
 * Countdown is "time until next Sunday 9:00am" (then it resets).
 *
 * @property number - The week number in the program (internal indexing, not rendered in title).
 * @property title - The display title for the week (no "Week N —" prefix).
 * @property goal - The main objective for the week.
 * @property rules - The list of rules/guidelines for the week.
 * @property questions - Array of coding questions for the week (see Question type).
 */
export interface WeekConfig {
    number: number;
    title: string;
    goal: string;
    rules: string[];
    questions: Question[];
}

const WEEK1: WeekConfig = {
    number: 1,
    title: 'Arrays & Hashing',
    goal: 'Recognize the pattern immediately.',
    rules: [
        'Most interview questions are just basic array patterns in disguise.',
        "If you don't instantly know the pattern, you're guessing.",
        'A problem only counts if you submit all 4 artifacts.',
        'No artifacts = no credit.',
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
            title: 'Group Anagrams',
            difficulty: 'medium',
            complexity: 'O(n * k) time, O(n) space',
            content: `
## Problem

Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

---

**Example 1:**
\`\`\`
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
\`\`\`

**Example 2:**
\`\`\`
Input: strs = [""]
Output: [[""]]
\`\`\`

**Example 3:**
\`\`\`
Input: strs = ["a"]
Output: [["a"]]
\`\`\`

---

## Constraints

- \`1 <= strs.length <= 10^4\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` consists of lowercase English letters.
`,
        },
        {
            id: 5,
            title: 'Two Sum III - Data structure design',
            difficulty: 'easy',
            premium: true,
            complexity: 'O(1) add, O(n) find',
            content: `
## Problem (LeetCode Premium)

Design a data structure that accepts a stream of integers and checks if it has a pair of integers that sum up to a particular value.

Implement the \`TwoSum\` class:
- \`TwoSum()\` Initializes the \`TwoSum\` object, with an empty array initially.
- \`void add(int number)\` Adds \`number\` to the data structure.
- \`boolean find(int value)\` Returns \`true\` if there exists any pair of numbers whose sum is equal to \`value\`, otherwise, it returns \`false\`.

---

**Example 1:**
\`\`\`
Input: ["TwoSum", "add", "add", "add", "find", "find"]
[[], [1], [3], [5], [4], [7]]
Output: [null, null, null, null, true, false]
\`\`\`

---

## Constraints

- \`-10^5 <= number <= 10^5\`
- \`-2^31 <= value <= 2^31 - 1\`
- At most \`10^4\` calls will be made to \`add\` and \`find\`.
`,
        },
    ],
};

// ─── Week 2: Two Pointers ─────────────────────────────────────────────────────

const WEEK2: WeekConfig = {
    number: 2,
    title: 'Two Pointers',
    goal: 'Use two indices to traverse or partition in one pass.',
    rules: [
        'Converging pointers: move the side that cannot improve the answer.',
        'Same-direction: slow writer, fast reader for in-place or subarray.',
        'A problem only counts if you submit all 4 artifacts.',
        'No artifacts = no credit.',
    ],
    questions: [
        {
            id: 1,
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
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2. It does not matter what you leave beyond the returned k.
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
            id: 2,
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
Explanation: After squaring, the array becomes [16,1,0,9,100]. After sorting, it becomes [0,1,9,16,100].
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
            id: 3,
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
Explanation: s is an empty string "" after removing non-alphanumeric characters. An empty string reads the same forward and backward.
\`\`\`

---

## Constraints

- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists only of printable ASCII characters.
`,
        },
        {
            id: 4,
            title: 'Shortest Word Distance',
            difficulty: 'easy',
            premium: true,
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem (LeetCode Premium)

Given an array of strings \`wordsDict\` and two different strings \`word1\` and \`word2\`, return the shortest distance between these two words in the list.

---

**Example 1:**
\`\`\`
Input: wordsDict = ["practice", "makes", "perfect", "coding", "makes"], word1 = "coding", word2 = "practice"
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: wordsDict = ["practice", "makes", "perfect", "coding", "makes"], word1 = "makes", word2 = "coding"
Output: 1
\`\`\`

---

## Constraints

- \`1 <= wordsDict.length <= 3 * 10^4\`
- \`1 <= wordsDict[i].length <= 10\`
- \`word1\` and \`word2\` are in \`wordsDict\`.
`,
        },
        {
            id: 5,
            title: 'Two Sum II (Input Array Is Sorted)',
            difficulty: 'medium',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number. Let these two numbers be \`numbers[index1]\` and \`numbers[index2]\` where \`1 <= index1 < index2 <= numbers.length\`.

Return the indices of the two numbers, \`index1\` and \`index2\`, **added by one** as an integer array \`[index1, index2]\` of length 2.

The tests are generated such that there is **exactly one solution**. You may not use the same element twice. Your solution must use only **constant extra space**.

---

**Example 1:**
\`\`\`
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.
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
- **Exactly one solution exists.**
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
Explanation:
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
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

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the **maximum amount of water** a container can store.

**Notice** that you may not slant the container.

---

**Example 1:**
\`\`\`
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.
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

// ─── Week 3: Binary Search ───────────────────────────────────────────────────

const WEEK3: WeekConfig = {
    number: 3,
    title: 'Binary Search',
    goal: 'Halve the search space every step; find the boundary.',
    rules: [
        'If sorted (or can be framed as sorted), think binary search.',
        'Decide: find exact match vs. find boundary (first true, last false, etc.).',
        'A problem only counts if you submit all 4 artifacts.',
        'No artifacts = no credit.',
    ],
    questions: [
        {
            id: 1,
            title: 'Binary Search',
            difficulty: 'easy',
            complexity: 'O(log n) time, O(1) space',
            content: `
## Problem

Given an array of integers \`nums\` which is sorted in **ascending order**, and an integer \`target\`, search for \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

---

**Example 1:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1.
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10^4\`
- \`-10^4 < nums[i], target < 10^4\`
- All the integers in \`nums\` are **unique**.
- \`nums\` is sorted in ascending order.
`,
        },
        {
            id: 2,
            title: 'Search Insert Position',
            difficulty: 'easy',
            complexity: 'O(log n) time, O(1) space',
            content: `
## Problem

Given a sorted array of **distinct** integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with \`O(log n)\` runtime complexity.

---

**Example 1:**
\`\`\`
Input: nums = [1,3,5,6], target = 5
Output: 2
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,3,5,6], target = 2
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,3,5,6], target = 7
Output: 4
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10^4\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`nums\` contains **distinct** values sorted in ascending order.
- \`-10^4 <= target <= 10^4\`
`,
        },
        {
            id: 3,
            title: 'Find Minimum in Rotated Sorted Array',
            difficulty: 'medium',
            complexity: 'O(log n) time, O(1) space',
            content: `
## Problem

Suppose an array of length \`n\` sorted in ascending order is **rotated** between \`1\` and \`n\` times. For example, the array \`nums = [0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\` if it was rotated 4 times.

Given the sorted rotated array \`nums\` of **unique** elements, return the **minimum element** of this array.

You must write an algorithm that runs in \`O(log n)\` time.

---

**Example 1:**
\`\`\`
Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2]
Output: 0
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [11,13,15,17]
Output: 11
Explanation: The array was not rotated.
\`\`\`

---

## Constraints

- \`n == nums.length\`
- \`1 <= n <= 5000\`
- \`-5000 <= nums[i] <= 5000\`
- All the integers of \`nums\` are **unique**.
- \`nums\` is sorted and rotated between 1 and n times.
`,
        },
        {
            id: 4,
            title: 'Search in Rotated Sorted Array',
            difficulty: 'medium',
            complexity: 'O(log n) time, O(1) space',
            content: `
## Problem

There is an integer array \`nums\` sorted in ascending order (with **distinct** values). Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\` (\`1 <= k < nums.length\`) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\`.

Given the array \`nums\` **after** the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

---

**Example 1:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1], target = 0
Output: -1
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 5000\`
- \`-10^4 <= nums[i] <= 10^4\`
- All values of \`nums\` are **unique**.
- \`nums\` is an ascending array that is possibly rotated.
- \`-10^4 <= target <= 10^4\`
`,
        },
        {
            id: 5,
            title: 'Time Based Key-Value Store',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(log n) set, O(log n) get',
            content: `
## Problem (LeetCode Premium)

Design a time-based key-value data structure that can store multiple values for the same key at different timestamps and retrieve the key's value at a certain timestamp.

Implement the \`TimeMap\` class:
- \`TimeMap()\` Initializes the object.
- \`void set(String key, String value, int timestamp)\` Stores the key \`key\` with the value \`value\` at the given time \`timestamp\`.
- \`String get(String key, int timestamp)\` Returns a value such that \`set\` was called previously, with \`timestamp_prev <= timestamp\`. If there are multiple such values, return the value associated with the largest \`timestamp_prev\`. If there are no values, return \`""\`.

---

**Example 1:**
\`\`\`
Input: ["TimeMap", "set", "get", "get", "set", "get", "get"]
[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
Output: [null, null, "bar", "bar", null, "bar2", "bar2"]
Explanation:
TimeMap timeMap = new TimeMap();
timeMap.set("foo", "bar", 1);  // store "bar" with timestamp 1
timeMap.get("foo", 1);         // return "bar"
timeMap.get("foo", 3);         // return "bar" (no value at 3, so previous value at 1)
timeMap.set("foo", "bar2", 4); // store "bar2" with timestamp 4
timeMap.get("foo", 4);         // return "bar2"
timeMap.get("foo", 5);         // return "bar2"
\`\`\`

---

## Constraints

- \`key\` and \`value\` consist of lowercase English letters and digits.
- \`1 <= key.length, value.length <= 100\`
- \`timestamp\` is strictly increasing across all \`set\` calls.
- At most \`2 * 10^5\` calls will be made to \`set\` and \`get\`.
`,
        },
    ],
};

// ─── Week 4: Stack ───────────────────────────────────────────────────────────

const WEEK4: WeekConfig = {
    number: 4,
    title: 'Stack',
    goal: 'LIFO and monotonic stacks for next-greater and validation.',
    rules: [
        'Use a stack when you need "last in, first out" or "next greater/smaller".',
        'Monotonic stack: keep only elements that can still be "next" candidates.',
        'A problem only counts if you submit all 4 artifacts.',
        'No artifacts = no credit.',
    ],
    questions: [
        {
            id: 1,
            title: 'Valid Parentheses',
            difficulty: 'easy',
            complexity: 'O(n) time, O(n) space',
            content: `
## Problem

Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

---

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(]"
Output: false
\`\`\`

**Example 4:**
\`\`\`
Input: s = "([)]"
Output: false
\`\`\`

---

## Constraints

- \`1 <= s.length <= 10^4\`
- \`s\` consists of parentheses only \`'()[]{}'\`.
`,
        },
        {
            id: 2,
            title: 'Min Stack',
            difficulty: 'medium',
            complexity: 'O(1) per operation',
            content: `
## Problem

Design a stack that supports push, pop, top, and retrieving the **minimum element** in constant time.

Implement the \`MinStack\` class:
- \`MinStack()\` initializes the stack object.
- \`void push(int val)\` pushes the element \`val\` onto the stack.
- \`void pop()\` removes the element on the top of the stack.
- \`int top()\` gets the top element of the stack.
- \`int getMin()\` retrieves the minimum element in the stack.

You must implement a solution with \`O(1)\` time complexity for each function.

---

**Example 1:**
\`\`\`
Input: ["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]
Output: [null,null,null,null,-3,null,0,-2]
Explanation:
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2
\`\`\`

---

## Constraints

- \`-2^31 <= val <= 2^31 - 1\`
- At most \`3 * 10^4\` calls will be made to \`push\`, \`pop\`, \`top\`, and \`getMin\`.
`,
        },
        {
            id: 3,
            title: 'Evaluate Reverse Polish Notation',
            difficulty: 'medium',
            complexity: 'O(n) time, O(n) space',
            content: `
## Problem

You are given an array of strings \`tokens\` that represents an arithmetic expression in **Reverse Polish Notation** (RPN).

Evaluate the expression. Return **an integer** that represents the value of the expression.

**Note that:**
- The valid operators are \`'+'\`, \`'-'\`, \`'*'\`, and \`'/'\`.
- Each operand may be an integer or another expression.
- The division between two integers always **truncates toward zero**.
- There will not be any division by zero.
- The input represents a valid arithmetic expression in RPN.

---

**Example 1:**
\`\`\`
Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
\`\`\`

**Example 2:**
\`\`\`
Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
\`\`\`

**Example 3:**
\`\`\`
Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
\`\`\`

---

## Constraints

- \`1 <= tokens.length <= 10^4\`
- \`tokens[i]\` is either an operator: \`"+"\`, \`"-"\`, \`"*"\`, or \`"/"\`, or an integer in the range \`[-200, 200]\`.
`,
        },
        {
            id: 4,
            title: 'Daily Temperatures',
            difficulty: 'medium',
            complexity: 'O(n) time, O(n) space',
            content: `
## Problem

Given an array of integers \`temperatures\` representing the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i\`-th day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.

---

**Example 1:**
\`\`\`
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
\`\`\`

**Example 2:**
\`\`\`
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
\`\`\`

**Example 3:**
\`\`\`
Input: temperatures = [30,60,90]
Output: [1,1,0]
\`\`\`

---

## Constraints

- \`1 <= temperatures.length <= 10^5\`
- \`30 <= temperatures[i] <= 100\`
`,
        },
        {
            id: 5,
            title: 'Design Hit Counter',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(1) hit, O(1) getHits amortized',
            content: `
## Problem (LeetCode Premium)

Design a hit counter which counts the number of hits received in the past 5 minutes (300 seconds).

Your system should accept a \`timestamp\` parameter (in seconds granularity), and you may assume that calls are being made to the system in chronological order (i.e., \`timestamp\` is monotonically increasing). Several hits may arrive roughly at the same time.

Implement the \`HitCounter\` class:
- \`HitCounter()\` Initializes the hit counter system.
- \`void hit(int timestamp)\` Records a hit that happened at \`timestamp\` (in seconds). Several hits may happen at the same \`timestamp\`.
- \`int getHits(int timestamp)\` Returns the number of hits in the past 5 minutes from \`timestamp\` (i.e., the past 300 seconds).

---

**Example 1:**
\`\`\`
Input: ["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"]
[[], [1], [2], [3], [4], [300], [300], [301]]
Output: [null, null, null, null, 3, null, 4, 3]
Explanation:
HitCounter hitCounter = new HitCounter();
hitCounter.hit(1);       // hit at timestamp 1
hitCounter.hit(2);       // hit at timestamp 2
hitCounter.hit(3);       // hit at timestamp 3
hitCounter.getHits(4);   // get hits at timestamp 4, return 3
hitCounter.hit(300);     // hit at timestamp 300
hitCounter.getHits(300); // get hits at timestamp 300, return 4
hitCounter.getHits(301); // get hits at timestamp 301, return 3
\`\`\`

---

## Constraints

- \`1 <= timestamp <= 2 * 10^9\`
- All the calls are being made to the system in chronological order (i.e., \`timestamp\` is monotonically increasing).
- At most \`300\` calls will be made to \`hit\` and \`getHits\`.
`,
        },
    ],
};

// ─── Week 5: Sliding Window ──────────────────────────────────────────────────

const WEEK5: WeekConfig = {
    number: 5,
    title: 'Sliding Window',
    goal: 'Grow right greedily, shrink left only when the window breaks.',
    rules: [
        'Sliding window = expand right until condition fails, then shrink left.',
        'Fixed-size window: maintain length; variable-size: maintain invariant.',
        'A problem only counts if you submit all 4 artifacts.',
        'No artifacts = no credit.',
    ],
    questions: [
        {
            id: 1,
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
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
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
        {
            id: 2,
            title: 'Longest Substring Without Repeating Characters',
            difficulty: 'medium',
            complexity: 'O(n) time, O(min(n, alphabet)) space',
            content: `
## Problem

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
Explanation: The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
\`\`\`

---

## Constraints

- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.
`,
        },
        {
            id: 3,
            title: 'Minimum Size Subarray Sum',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem (LeetCode Premium)

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

- \`1 <= target <= 10^9\`
- \`1 <= nums.length <= 10^5\`
- \`1 <= nums[i] <= 10^4\`
`,
        },
        {
            id: 4,
            title: 'Sliding Window Maximum',
            difficulty: 'hard',
            optional: true,
            complexity: 'O(n) time, O(k) space',
            content: `
## Problem

You are given an array of integers \`nums\`, there is a **sliding window** of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the **max sliding window** — an array of the maximum element in each window.

---

**Example 1:**
\`\`\`
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation:
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1], k = 1
Output: [1]
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`1 <= k <= nums.length\`
`,
        },
    ],
};

// ─── Week 6: Linked List ──────────────────────────────────────────────────────

const WEEK6: WeekConfig = {
    number: 6,
    title: 'Linked List',
    goal: 'Pointer manipulation and dummy nodes.',
    rules: ['Use a dummy head when the real head might change.', 'Draw the "before and after" for each pointer update.', 'A problem only counts if you submit all 4 artifacts.', 'No artifacts = no credit.'],
    questions: [
        {
            id: 1,
            title: 'Reverse Linked List',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.

---

**Example 1:**
\`\`\`
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2]
Output: [2,1]
\`\`\`

**Example 3:**
\`\`\`
Input: head = []
Output: []
\`\`\`

---

## Constraints

- The number of nodes in the list is the range \`[0, 5000]\`.
- \`-5000 <= Node.val <= 5000\`
`,
        },
        {
            id: 2,
            title: 'Merge Two Sorted Lists',
            difficulty: 'easy',
            complexity: 'O(n + m) time, O(1) space',
            content: `
## Problem

You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.

---

**Example 1:**
\`\`\`
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
\`\`\`

**Example 2:**
\`\`\`
Input: list1 = [], list2 = []
Output: []
\`\`\`

**Example 3:**
\`\`\`
Input: list1 = [], list2 = [0]
Output: [0]
\`\`\`

---

## Constraints

- The number of nodes in both lists is in the range \`[0, 50]\`.
- \`-100 <= Node.val <= 100\`
- Both \`list1\` and \`list2\` are sorted in **non-decreasing** order.
`,
        },
        {
            id: 3,
            title: 'Linked List Cycle',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

Given \`head\`, the head of a linked list, determine if the linked list has a **cycle** in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer.

Return \`true\` *if there is a cycle in the linked list*. Otherwise, return \`false\`.

---

**Example 1:**
\`\`\`
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle where the tail connects to the 0th node.
\`\`\`

**Example 3:**
\`\`\`
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.
\`\`\`

---

## Constraints

- The number of the nodes in the list is in the range \`[0, 10^4]\`.
- \`-10^5 <= Node.val <= 10^5\`
- \`pos\` is \`-1\` or a **valid index** in the linked list.
`,
        },
        {
            id: 4,
            title: 'Reorder List',
            difficulty: 'medium',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

You are given the head of a singly linked-list. The list can be represented as:

\`L0 → L1 → … → Ln - 1 → Ln\`

*Reorder the list to be on the following form:*

\`L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …\`

You may not modify the values in the list's nodes. Only nodes themselves may be changed.

---

**Example 1:**
\`\`\`
Input: head = [1,2,3,4]
Output: [1,4,2,3]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]
\`\`\`

---

## Constraints

- The number of nodes in the list is in the range \`[1, 5 * 10^4]\`.
- \`1 <= Node.val <= 1000\`
`,
        },
        {
            id: 5,
            title: 'Copy List with Random Pointer',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem (LeetCode Premium)

A linked list of length \`n\` is given such that each node contains an additional random pointer, which could point to any node in the list, or \`null\`.

Construct a **deep copy** of the list. The deep copy should consist of exactly \`n\` **brand new** nodes, where each new node has its value set to the value of its corresponding original node. Both the \`next\` and \`random\` pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state.

Return *the head of the copied linked list*.

---

**Example 1:**
\`\`\`
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
\`\`\`

---

## Constraints

- \`0 <= n <= 1000\`
- \`-10^4 <= Node.val <= 10^4\`
- \`Node.random\` is \`null\` or is pointing to some node in the linked list.
`,
        },
    ],
};

const WEEK7: WeekConfig = {
    number: 7,
    title: 'Trees & BFS/DFS',
    goal: 'Recursion and level-order; know when to use which.',
    rules: ['Tree recursion: base case (null), left, right, combine.', 'BFS for level-order or shortest path in a tree.', 'A problem only counts if you submit all 4 artifacts.', 'No artifacts = no credit.'],
    questions: [
        {
            id: 1,
            title: 'Maximum Depth of Binary Tree',
            difficulty: 'easy',
            complexity: 'O(n) time, O(h) space',
            content: `
## Problem

Given the \`root\` of a binary tree, return *its maximum depth*.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.

---

**Example 1:**
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: 3
Explanation: The tree has depth 3 (path 3 → 20 → 15 or 3 → 20 → 7).
\`\`\`

**Example 2:**
\`\`\`
Input: root = [1,null,2]
Output: 2
\`\`\`

---

## Constraints

- The number of nodes in the tree is in the range \`[0, 10^4]\`.
- \`-100 <= Node.val <= 100\`
`,
        },
        {
            id: 2,
            title: 'Same Tree',
            difficulty: 'easy',
            complexity: 'O(n) time, O(h) space',
            content: `
## Problem

Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

---

**Example 1:**
\`\`\`
Input: p = [1,2,3], q = [1,2,3]
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: p = [1,2], q = [1,null,2]
Output: false
\`\`\`

**Example 3:**
\`\`\`
Input: p = [1,2,1], q = [1,1,2]
Output: false
\`\`\`

---

## Constraints

- The number of nodes in both trees is in the range \`[0, 100]\`.
- \`-10^4 <= Node.val <= 10^4\`
`,
        },
        {
            id: 3,
            title: 'Invert Binary Tree',
            difficulty: 'easy',
            complexity: 'O(n) time, O(h) space',
            content: `
## Problem

Given the \`root\` of a binary tree, **invert** the tree, and return *its root*.

---

**Example 1:**
\`\`\`
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
\`\`\`

**Example 2:**
\`\`\`
Input: root = [2,1,3]
Output: [2,3,1]
\`\`\`

**Example 3:**
\`\`\`
Input: root = []
Output: []
\`\`\`

---

## Constraints

- The number of nodes in the tree is in the range \`[0, 100]\`.
- \`-100 <= Node.val <= 100\`
`,
        },
        {
            id: 4,
            title: 'Binary Tree Level Order Traversal',
            difficulty: 'medium',
            complexity: 'O(n) time, O(w) space',
            content: `
## Problem

Given the \`root\` of a binary tree, return the **level order traversal** of its nodes' values. (i.e., from left to right, level by level).

---

**Example 1:**
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
\`\`\`

**Example 2:**
\`\`\`
Input: root = [1]
Output: [[1]]
\`\`\`

**Example 3:**
\`\`\`
Input: root = []
Output: []
\`\`\`

---

## Constraints

- The number of nodes in the tree is in the range \`[0, 2000]\`.
- \`-1000 <= Node.val <= 1000\`
`,
        },
        {
            id: 5,
            title: 'Serialize and Deserialize Binary Tree',
            difficulty: 'hard',
            premium: true,
            complexity: 'O(n) time, O(n) space',
            content: `
## Problem (LeetCode Premium)

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to **serialize** and **deserialize** a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

---

**Example 1:**
\`\`\`
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]
\`\`\`

**Example 2:**
\`\`\`
Input: root = []
Output: []
\`\`\`

---

## Constraints

- The number of nodes in the tree is in the range \`[0, 10^4]\`.
- \`-1000 <= Node.val <= 1000\`
`,
        },
    ],
};

const WEEK8: WeekConfig = {
    number: 8,
    title: 'Tries',
    goal: 'Prefix trees for string prefix and autocomplete.',
    rules: ['Use a trie when you need prefix lookups or word completion.', 'Each node holds children and an end-of-word flag.', 'A problem only counts if you submit all 4 artifacts.', 'No artifacts = no credit.'],
    questions: [
        {
            id: 1,
            title: 'Longest Common Prefix',
            difficulty: 'easy',
            complexity: 'O(n * m) time, O(1) space',
            content: `
## Problem

Write a function to find the **longest common prefix** string amongst an array of strings.

If there is no common prefix, return an empty string \`""\`.

---

**Example 1:**
\`\`\`
Input: strs = ["flower","flow","flight"]
Output: "fl"
\`\`\`

**Example 2:**
\`\`\`
Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
\`\`\`

**Example 3:**
\`\`\`
Input: strs = ["a"]
Output: "a"
\`\`\`

---

## Constraints

- \`1 <= strs.length <= 200\`
- \`0 <= strs[i].length <= 200\`
- \`strs[i]\` consists of only lowercase English letters.
`,
        },
        {
            id: 2,
            title: 'Implement Trie (Prefix Tree)',
            difficulty: 'medium',
            complexity: 'O(m) insert/search, O(m) startsWith',
            content: `
## Problem

A **trie** (pronounced as "try") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

Implement the Trie class:
- \`Trie()\` Initializes the trie object.
- \`void insert(String word)\` Inserts the string \`word\` into the trie.
- \`boolean search(String word)\` Returns \`true\` if the string \`word\` is in the trie (i.e., was inserted before), and \`false\` otherwise.
- \`boolean startsWith(String prefix)\` Returns \`true\` if there is a previously inserted string \`word\` that has the prefix \`prefix\`, and \`false\` otherwise.

---

**Example 1:**
\`\`\`
Input: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output: [null, null, true, false, true, null, true]
Explanation:
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // return True
trie.search("app");     // return False
trie.startsWith("app"); // return True
trie.insert("app");
trie.search("app");     // return True
\`\`\`

---

## Constraints

- \`1 <= word.length, prefix.length <= 2000\`
- \`word\` and \`prefix\` consist only of lowercase English letters.
- At most \`3 * 10^4\` calls **in total** will be made to \`insert\`, \`search\`, and \`startsWith\`.
`,
        },
        {
            id: 3,
            title: 'Design Add and Search Words Data Structure',
            difficulty: 'medium',
            complexity: 'O(m) add, O(m * 26) search with wildcard',
            content: `
## Problem

Design a data structure that supports adding new words and finding if a string matches any previously added string.

Implement the \`WordDictionary\` class:
- \`WordDictionary()\` Initializes the object.
- \`void addWord(word)\` Adds \`word\` to the data structure, it can be matched later.
- \`bool search(word)\` Returns \`true\` if there is any string in the data structure that matches \`word\` or \`false\` otherwise. \`word\` may contain dots \`'.'\` where dots can be matched with any letter.

---

**Example 1:**
\`\`\`
Input: ["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]
Output: [null,null,null,null,false,true,true,true]
Explanation:
WordDictionary wordDictionary = new WordDictionary();
wordDictionary.addWord("bad");
wordDictionary.addWord("dad");
wordDictionary.addWord("mad");
wordDictionary.search("pad"); // return False
wordDictionary.search("bad"); // return True
wordDictionary.search(".ad"); // return True
wordDictionary.search("b.."); // return True
\`\`\`

---

## Constraints

- \`1 <= word.length <= 25\`
- \`word\` in \`addWord\` consists of lowercase English letters.
- \`word\` in \`search\` consists of \`'.'\` or lowercase English letters.
- There will be at most \`2\` dots in \`word\` for \`search\` queries.
- At most \`10^4\` calls will be made to \`addWord\` and \`search\`.
`,
        },
        {
            id: 4,
            title: 'Maximum XOR of Two Numbers in an Array',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(n * 32) time, O(n * 32) space',
            content: `
## Problem (LeetCode Premium)

Given an integer array \`nums\`, return *the maximum result of \`nums[i] XOR nums[j]\`*, where \`0 <= i <= j < n\`.

---

**Example 1:**
\`\`\`
Input: nums = [3,10,5,25,2,8]
Output: 28
Explanation: The maximum result is 5 XOR 25 = 28.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [14,70,53,83,49,91,36,80,92,51,66,70]
Output: 127
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 2 * 10^5\`
- \`0 <= nums[i] <= 2^31 - 1\`
`,
        },
        {
            id: 5,
            title: 'Word Search II',
            difficulty: 'hard',
            optional: true,
            complexity: 'O(m * n * 4 * 3^(L-1))',
            content: `
## Problem

Given an \`m x n\` \`board\` of characters and a list of strings \`words\`, return *all words on the board*.

Each word must be constructed from letters of sequentially adjacent cells, where **adjacent cells** are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

---

**Example 1:**
\`\`\`
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
\`\`\`

**Example 2:**
\`\`\`
Input: board = [["a","b"],["c","d"]], words = ["abcb"]
Output: []
\`\`\`

---

## Constraints

- \`m == board.length\`
- \`n == board[i].length\`
- \`1 <= m, n <= 12\`
- \`board[i][j]\` is a lowercase English letter.
- \`1 <= words.length <= 3 * 10^4\`
- \`1 <= words[i].length <= 10\`
- \`words[i]\` consists of lowercase English letters.
- All the strings of \`words\` are unique.
`,
        },
    ],
};

const WEEK9: WeekConfig = {
    number: 9,
    title: 'Heap / Priority Queue',
    goal: 'Extract min/max and maintain order efficiently.',
    rules: ['Use a heap when you need repeated min/max or top K.', 'A problem only counts if you submit all 4 artifacts.', 'No artifacts = no credit.'],
    questions: [
        {
            id: 1,
            title: 'Last Stone Weight',
            difficulty: 'easy',
            complexity: 'O(n log n) time, O(n) space',
            content: `
## Problem

You are given an array of integers \`stones\` where \`stones[i]\` is the weight of the \`i\`-th stone.

We are playing a game with the stones. On each turn, we choose the **heaviest two stones** and smash them together. Suppose the heaviest two stones have weights \`x\` and \`y\` with \`x <= y\`. The result of this smash is:
- If \`x == y\`, both stones are destroyed.
- If \`x != y\`, the stone of weight \`x\` is destroyed, and the stone of weight \`y\` has new weight \`y - x\`.

At the end of the game, there is **at most one** stone left. Return the weight of the last remaining stone. If there are no stones left, return \`0\`.

---

**Example 1:**
\`\`\`
Input: stones = [2,7,4,1,8,1]
Output: 1
Explanation:
We combine 7 and 8 to get 1 so the array converts to [2,4,1,1,1],
then we combine 2 and 4 to get 2 so the array converts to [2,1,1,1],
then we combine 2 and 1 to get 1 so the array converts to [1,1,1],
then we combine 1 and 1 to get 0 so the array converts to [1], then that's the value of the last stone.
\`\`\`

**Example 2:**
\`\`\`
Input: stones = [1]
Output: 1
\`\`\`

---

## Constraints

- \`1 <= stones.length <= 30\`
- \`1 <= stones[i] <= 1000\`
`,
        },
        {
            id: 2,
            title: 'Kth Largest Element in an Array',
            difficulty: 'medium',
            complexity: 'O(n log k) time, O(k) space',
            content: `
## Problem

Given an integer array \`nums\` and an integer \`k\`, return *the \`k\`-th **largest** element in the array*.

Note that it is the \`k\`-th largest element in the **sorted order**, not the \`k\`-th distinct element.

Can you solve it without sorting?

---

**Example 1:**
\`\`\`
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
\`\`\`

---

## Constraints

- \`1 <= k <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
`,
        },
        {
            id: 3,
            title: 'Task Scheduler',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem (LeetCode Premium)

Given a characters array \`tasks\` representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.

However, there is a non-negative integer \`n\` that represents the **cooldown period** between two **same tasks** — the same letter — so that the CPU has to wait \`n\` units of time before it can do the same task again.

Return *the **least** number of units of times that the CPU will take to finish all the given tasks*.

---

**Example 1:**
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A -> B -> idle -> A -> B -> idle -> A -> B
\`\`\`

**Example 2:**
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 0
Output: 6
\`\`\`

**Example 3:**
\`\`\`
Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2
Output: 16
\`\`\`

---

## Constraints

- \`1 <= task.length <= 10^4\`
- \`tasks[i]\` is upper-case English letter.
- \`0 <= n <= 100\`
`,
        },
        {
            id: 4,
            title: 'Find Median from Data Stream',
            difficulty: 'hard',
            complexity: 'O(log n) add, O(1) findMedian',
            content: `
## Problem

The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value. So the median is the mean of the two middle values.

For example, for \`arr = [2,3,4]\`, the median is \`3\`.
For example, for \`arr = [2,3]\`, the median is \`(2 + 3) / 2 = 2.5\`.

Implement the MedianFinder class:
- \`MedianFinder()\` initializes the \`MedianFinder\` object.
- \`void addNum(int num)\` adds the integer \`num\` from the data stream to the data structure.
- \`double findMedian()\` returns the median of all elements so far. Answers within \`10^-5\` of the actual answer will be accepted.

---

**Example 1:**
\`\`\`
Input: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output: [null, null, null, 1.5, null, 2.0]
Explanation:
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
\`\`\`

---

## Constraints

- \`-10^5 <= num <= 10^5\`
- There will be at least one element in the data structure before calling \`findMedian\`.
- At most \`5 * 10^4\` calls will be made to \`addNum\` and \`findMedian\`.
`,
        },
        {
            id: 5,
            title: 'Merge k Sorted Lists',
            difficulty: 'hard',
            optional: true,
            complexity: 'O(N log k) time, O(k) space',
            content: `
## Problem

You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return it.*

---

**Example 1:**
\`\`\`
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are [1->4->5], [1->3->4], and [2->6]. Merging them into one sorted list: 1->1->2->3->4->4->5->6.
\`\`\`

**Example 2:**
\`\`\`
Input: lists = []
Output: []
\`\`\`

**Example 3:**
\`\`\`
Input: lists = [[]]
Output: []
\`\`\`

---

## Constraints

- \`k == lists.length\`
- \`0 <= k <= 10^4\`
- \`0 <= lists[i].length <= 500\`
- \`-10^4 <= lists[i][j] <= 10^4\`
- \`lists[i]\` is sorted in ascending order.
- The sum of \`lists[i].length\` will not exceed \`10^4\`.
`,
        },
    ],
};

const WEEK10: WeekConfig = {
    number: 10,
    title: 'Backtracking',
    goal: 'Try choices, recurse, undo.',
    rules: ['Template: choose, recurse, unchoose.', 'Prune early when the path cannot lead to a solution.', 'A problem only counts if you submit all 4 artifacts.', 'No artifacts = no credit.'],
    questions: [
        {
            id: 1,
            title: 'Subsets',
            difficulty: 'medium',
            complexity: 'O(n * 2^n) time',
            content: `
## Problem

Given an integer array \`nums\` of **unique** elements, return *all possible subsets (the power set)*.

The solution set **must not** contain duplicate subsets. Return the solution in **any order**.

---

**Example 1:**
\`\`\`
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0]
Output: [[],[0]]
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10\`
- \`-10 <= nums[i] <= 10\`
- All the numbers of \`nums\` are **unique**.
`,
        },
        {
            id: 2,
            title: 'Combination Sum',
            difficulty: 'medium',
            complexity: 'O(2^target) time',
            content: `
## Problem

Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return *a list of all **unique combinations** of \`candidates\` where the chosen numbers sum to \`target\`*. You may return the combinations in **any order**.

The **same** number may be chosen from \`candidates\` an **unlimited number of times**. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

---

**Example 1:**
\`\`\`
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation: 2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times. 7 is a candidate, and 7 = 7.
\`\`\`

**Example 2:**
\`\`\`
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]
\`\`\`

**Example 3:**
\`\`\`
Input: candidates = [2], target = 1
Output: []
\`\`\`

---

## Constraints

- \`1 <= candidates.length <= 30\`
- \`2 <= candidates[i] <= 40\`
- All elements of \`candidates\` are **distinct**.
- \`1 <= target <= 40\`
`,
        },
        {
            id: 3,
            title: 'Permutations',
            difficulty: 'medium',
            complexity: 'O(n! * n) time',
            content: `
## Problem

Given an array \`nums\` of distinct integers, return *all the possible **permutations***. You can return the answer in **any order**.

---

**Example 1:**
\`\`\`
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0,1]
Output: [[0,1],[1,0]]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1]
Output: [[1]]
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 6\`
- \`-10 <= nums[i] <= 10\`
- All the integers of \`nums\` are **unique**.
`,
        },
        {
            id: 4,
            title: 'Subsets II',
            difficulty: 'medium',
            complexity: 'O(n * 2^n) time',
            content: `
## Problem

Given an integer array \`nums\` that may contain **duplicates**, return *all possible subsets (the power set)*.

The solution set **must not** contain duplicate subsets. Return the solution in **any order**.

---

**Example 1:**
\`\`\`
Input: nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0]
Output: [[],[0]]
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10\`
- \`-10 <= nums[i] <= 10\`
`,
        },
        {
            id: 5,
            title: 'Word Search',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(m * n * 4^L) time',
            content: `
## Problem (LeetCode Premium)

Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` *if \`word\` exists in the grid*.

The word can be constructed from letters of sequentially adjacent cells, where **adjacent** cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

---

**Example 1:**
\`\`\`
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
Output: false
\`\`\`

---

## Constraints

- \`m == board.length\`
- \`n = board[i].length\`
- \`1 <= m, n <= 6\`
- \`1 <= word.length <= 15\`
- \`board\` and \`word\` consist of only lowercase and uppercase English letters.
`,
        },
    ],
};

const WEEK11: WeekConfig = {
    number: 11,
    title: 'Graphs',
    goal: 'BFS for shortest path, DFS for connectivity and cycles.',
    rules: ['Representation: adjacency list (or matrix for dense).', 'BFS from source for unweighted shortest path; DFS for visit all / cycles.', 'A problem only counts if you submit all 4 artifacts.', 'No artifacts = no credit.'],
    questions: [
        {
            id: 1,
            title: 'Flood Fill',
            difficulty: 'easy',
            complexity: 'O(m * n) time, O(m * n) space',
            content: `
## Problem

An image is represented by an \`m x n\` integer grid \`image\` where \`image[i][j]\` represents the pixel value of the image.

You are also given three integers \`sr\`, \`sc\`, and \`color\`. You should perform a **flood fill** on the image starting from the pixel \`image[sr][sc]\`.

To perform a flood fill, consider the starting pixel, plus any pixels connected **4-directionally** to the starting pixel of the same color as the starting pixel, plus any pixels connected **4-directionally** to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with \`color\`.

Return *the modified image after performing the flood fill*.

---

**Example 1:**
\`\`\`
Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
Explanation: From the center of the image with position (sr, sc) = (1, 1), all pixels connected by a path of the same color as the starting pixel are colored with the new color. Note the bottom corner is not colored 2, because it is not 4-directionally connected to the starting pixel.
\`\`\`

**Example 2:**
\`\`\`
Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
Output: [[0,0,0],[0,0,0]]
Explanation: The starting pixel is already colored 0, so no changes are made.
\`\`\`

---

## Constraints

- \`m == image.length\`
- \`n == image[i].length\`
- \`1 <= m, n <= 50\`
- \`0 <= image[i][j], color < 2^16\`
- \`0 <= sr < m\`
- \`0 <= sc < n\`
`,
        },
        {
            id: 2,
            title: 'Number of Islands',
            difficulty: 'medium',
            complexity: 'O(m * n) time, O(m * n) space',
            content: `
## Problem

Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of **islands***.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.

---

**Example 1:**
\`\`\`
Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
Output: 1
\`\`\`

**Example 2:**
\`\`\`
Input: grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]
Output: 3
\`\`\`

---

## Constraints

- \`m == grid.length\`
- \`n == grid[i].length\`
- \`1 <= m, n <= 300\`
- \`grid[i][j]\` is \`'0'\` or \`'1'\`.
`,
        },
        {
            id: 3,
            title: 'Clone Graph',
            difficulty: 'medium',
            complexity: 'O(V + E) time',
            content: `
## Problem

Given a reference of a node in a **connected** undirected graph, return a **deep copy** (clone) of the graph.

Each node in the graph contains a value (\`int\`) and a list (\`List[Node]\`) of its neighbors.

---

**Example 1:**
\`\`\`
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: The graph has 4 nodes. 1 and 2 are connected, 2 and 3 are connected, 3 and 4 are connected, 4 and 1 are connected.
\`\`\`

**Example 2:**
\`\`\`
Input: adjList = [[]]
Output: [[]]
\`\`\`

**Example 3:**
\`\`\`
Input: adjList = []
Output: []
\`\`\`

---

## Constraints

- The number of nodes in the graph is in the range \`[0, 100]\`.
- \`1 <= Node.val <= 100\`
- \`Node.val\` is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The Graph is connected and all nodes can be visited starting from the given node.
`,
        },
        {
            id: 4,
            title: 'Course Schedule',
            difficulty: 'medium',
            complexity: 'O(V + E) time',
            content: `
## Problem

There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` indicates that you **must** take course \`b_i\` first if you want to take course \`a_i\`.

For example, the pair \`[0, 1]\`, indicates that to take course \`0\` you have to first take course \`1\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.

---

**Example 1:**
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.
\`\`\`

**Example 2:**
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.
\`\`\`

---

## Constraints

- \`1 <= numCourses <= 2000\`
- \`0 <= prerequisites.length <= 5000\`
- \`prerequisites[i].length == 2\`
- \`0 <= a_i, b_i < numCourses\`
- All the pairs \`prerequisites[i]\` are **unique**.
`,
        },
        {
            id: 5,
            title: 'Pacific Atlantic Water Flow',
            difficulty: 'medium',
            complexity: 'O(m * n) time',
            content: `
## Problem

There is an \`m x n\` rectangular island that borders both the **Pacific Ocean** and **Atlantic Ocean**. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an \`m x n\` integer array \`heights\` where \`heights[r][c]\` represents the height above sea level of the cell at coordinate \`(r, c)\`.

Rain water can flow to neighboring cells directly north, south, east, and west if the height of the neighboring cell is **less than or equal to** the height of the current cell.

Return *a **2D list** of grid coordinates \`result\` where \`result[i] = [r_i, c_i]\` denotes that rain water can flow from cell \`(r_i, c_i)\` to **both** the Pacific and Atlantic oceans*.

---

**Example 1:**
\`\`\`
Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
\`\`\`

**Example 2:**
\`\`\`
Input: heights = [[2,1],[1,2]]
Output: [[0,0],[0,1],[1,0],[1,1]]
\`\`\`

---

## Constraints

- \`m == heights.length\`
- \`n == heights[r].length\`
- \`1 <= m, n <= 200\`
- \`0 <= heights[r][c] <= 10^5\`
`,
        },
        {
            id: 6,
            title: 'Number of Connected Components in an Undirected Graph',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(V + E) time',
            content: `
## Problem (LeetCode Premium)

Given \`n\` nodes labeled from \`0\` to \`n - 1\` and a list of undirected edges (each edge is a pair of nodes), write a function to find the number of **connected components** in an undirected graph.

---

**Example 1:**
\`\`\`
Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
Explanation: 0-1-2 form one component, 3-4 form another.
\`\`\`

**Example 2:**
\`\`\`
Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1
\`\`\`

---

## Constraints

- \`1 <= n <= 2000\`
- \`1 <= edges.length <= 5000\`
- \`edges[i].length == 2\`
- \`0 <= a_i, b_i < n\`
- \`a_i != b_i\`
- No repeated edges.
`,
        },
    ],
};

const WEEK12: WeekConfig = {
    number: 12,
    title: '1-D DP, Intervals & Greedy',
    goal: 'Memoize or tabulate; merge intervals; choose greedily when safe.',
    rules: ['DP: define state, recurrence, base case, order of iteration.', 'Intervals: sort by start or end; merge or schedule.', 'Greedy: prove the choice is safe.', 'A problem only counts if you submit all 4 artifacts.', 'No artifacts = no credit.'],
    questions: [
        {
            id: 1,
            title: 'Climbing Stairs',
            difficulty: 'easy',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many **distinct ways** can you climb to the top?

---

**Example 1:**
\`\`\`
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
\`\`\`

**Example 2:**
\`\`\`
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
\`\`\`

---

## Constraints

- \`1 <= n <= 45\`
`,
        },
        {
            id: 2,
            title: 'Jump Game',
            difficulty: 'medium',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

You are given an integer array \`nums\`. You are initially positioned at the array's **first index**, and each element in the array represents your maximum jump length at that position.

Return \`true\` *if you can reach the last index, or \`false\` otherwise*.

---

**Example 1:**
\`\`\`
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10^4\`
- \`0 <= nums[i] <= 10^5\`
`,
        },
        {
            id: 3,
            title: 'Maximum Subarray',
            difficulty: 'medium',
            complexity: 'O(n) time, O(1) space',
            content: `
## Problem

Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

---

**Example 1:**
\`\`\`
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1]
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.
\`\`\`

---

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
`,
        },
        {
            id: 4,
            title: 'Merge Intervals',
            difficulty: 'medium',
            complexity: 'O(n log n) time',
            content: `
## Problem

Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.

---

**Example 1:**
\`\`\`
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
\`\`\`

---

## Constraints

- \`1 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\`
- \`0 <= start_i <= end_i <= 10^4\`
`,
        },
        {
            id: 5,
            title: 'Coin Change',
            difficulty: 'medium',
            complexity: 'O(amount * coins) time',
            content: `
## Problem

You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the **fewest** number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.

---

**Example 1:**
\`\`\`
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
\`\`\`

**Example 2:**
\`\`\`
Input: coins = [2], amount = 3
Output: -1
\`\`\`

**Example 3:**
\`\`\`
Input: coins = [1], amount = 0
Output: 0
\`\`\`

---

## Constraints

- \`1 <= coins.length <= 12\`
- \`1 <= coins[i] <= 2^31 - 1\`
- \`0 <= amount <= 10^4\`
`,
        },
        {
            id: 6,
            title: 'Insert Interval',
            difficulty: 'medium',
            premium: true,
            complexity: 'O(n) time',
            content: `
## Problem (LeetCode Premium)

You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` represent the start and the end of the \`i\`-th interval and \`intervals\` is sorted in ascending order by \`start_i\`. You are also given an interval \`newInterval = [start, end]\` that represents the start and end of another interval.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` *after the insertion*.

---

**Example 1:**
\`\`\`
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].
\`\`\`

---

## Constraints

- \`0 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\`
- \`0 <= start_i <= end_i <= 10^5\`
- \`newInterval.length == 2\`
- \`0 <= start <= end <= 10^5\`
`,
        },
    ],
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const WEEKS: WeekConfig[] = [WEEK1, WEEK2, WEEK3, WEEK4, WEEK5, WEEK6, WEEK7, WEEK8, WEEK9, WEEK10, WEEK11, WEEK12];

export async function getCurrent(): Promise<number> {
    const week = await import('@/lib/semester').then((m) => m.getCurrent());
    return Math.min(Math.max(week, 1), WEEKS.length);
}
