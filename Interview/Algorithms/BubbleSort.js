function bubbleSort (nums) {
  let len = nums.length;
  for (let i = 0; i < len - 1; ++i) {
    for (let j = len; j >= i; --j) {
      if (nums[j + 1] < nums[j]) {
        let temp = nums[j];
        nums[j] = nums[j + 1];
        nums[j + 1] = temp;
      }
    }
  }
  return nums;
}

function bubbleSort1 (arr) {
  const len = arr.length
  for (let i = 0; i < len; ++i) {
      for (let j = 0; j < len - 1 - i; ++j) {
          if (arr[j] > arr[j + 1]) {
              const temp = arr[j]
              arr[j] = arr[j + 1]
              arr[j + 1] = temp
          }
      }
  }
  return arr
}

const b1 = bubbleSort([ 2, 6, 1, 2, 4, 7, 0 ]).toString();

console.log('b1', b1);
