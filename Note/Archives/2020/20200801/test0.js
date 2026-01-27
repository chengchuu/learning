function reFunc (...rest) {
    console.log(`匹配的子串: ${rest[0]}`)
    console.log(`匹配的 $1: ${rest[1]}`)
    console.log(`匹配的偏移量: ${rest[2]}`)
    console.log(`被匹配的原字符串: ${rest[3]}`)
    return `[[抓到 ${rest[1]}]]`
}

let str = '小薰今年升{{高中}}，有三个{{好朋友}}'
str = str.replace(/\{\{(.+?)\}\}/g, reFunc)
console.log(str) // 小薰今年升[[抓到 高中]]，有三个[[抓到 好朋友]]
// 匹配的子串: {{高中}}
// 匹配的 $1: 高中
// 匹配的偏移量: 5
// 被匹配的原字符串: 小薰今年升{{高中}}，有三个{{好朋友}}