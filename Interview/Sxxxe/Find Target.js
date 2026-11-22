// Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.

// Example 1:
// Input: nums = [-1,0,3,5,9,12], target = 9
// Output: 4
// Explanation: 9 exists in nums and its index is 4

// Example 2:
// Input: nums = [-1,0,3,5,9,12], target = 2
// Output: -1
// Explanation: 2 does not exist in nums so return -1

// O(n)
function foo({ nums = [], target } = {}) {
  let ret = -1;
  if (!Array.isArray(nums) || !nums.length || typeof target !== 'number') {
    return ret;
  }
  // for
  // let len = nums.length;
  // for (let i = 0; i < len; ++i) {
  // if (nums[i] === target) {
  // ret = i;
  // break;
  // }
  // }

  // some
  nums.some((num, i) => {
    if (num === target) {
      ret = i;
      return true;
    }
    return false;
  })
  return ret;
}

const f1 = foo({ nums: [-1,0,3,5,9,12], target: 9 });

console.log('f1', f1);

const f2 = foo({ nums: [-1,0,3,5,9,12], target: 2 });

console.log('f2', f2);

// O(log n)
function bar({ nums = [], target, start, end } = {}) {
  // verf
  // ...

  if (typeof start === 'undefined' && typeof end === 'undefined') {
    const len = nums.length;
    start = 0;
    end = len - 1;
  }

  if (start > end) {
    return -1;
  }

  
  const pointIndex = Math.floor(start + (end - start) / 2);
  if (target === nums[pointIndex]) {
    return pointIndex;
  } else if (target < nums[pointIndex]) {
    return bar({ nums, target, start: start, end: pointIndex - 1 });
  } else if (target > nums[pointIndex]) {
    return bar({ nums, target, start: start + 1, end });
  }
}

const b1 = bar({ nums: [-1,0,3,5,9,12], target: 9 });

console.log('b1', b1);

const b2 = bar({ nums: [-1,0,3,5,9,12], target: 2 });

console.log('b2', b2);
