// const arr = [0, 1, 2, 3, 4]
// const sum = arr.reduce((prev, curr, index, currArr) => {
//     prev += curr
//     if (curr === 3) currArr.length = 0
//     return prev
// }, 0)
// console.log(sum)

// const arr = [0, 1, 2, 3, 4]
// const sum = arr.reduce((prev, curr, index, currArr) => {
//     if (index >= 4) {
//         return prev
//     } else {
//         prev += curr
//         return prev
//     }
    
// }, 0)
// console.log(sum)

const arr = [0, 1, 2, 3, 4]
let sum = 0
arr.some((curr, index, currArr) => {
    sum += curr
    return curr === 3
})
console.log(sum)