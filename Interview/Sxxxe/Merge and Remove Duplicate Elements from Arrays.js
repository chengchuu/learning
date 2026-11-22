const arr1 = [1, 3, 6, 7, 9];
const arr2 = [9, 3, 4, 7, 10];

function foo (a, b) {
  return [...new Set([...a, ...b])];
}

const aaa = foo(arr1, arr2);

console.log('aaa', aaa);
