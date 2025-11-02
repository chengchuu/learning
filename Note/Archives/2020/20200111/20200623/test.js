const data = {
    name: 'mazey',
    age: 18
}

let str = '哈哈，我是{name}，今年{age}岁啦。'

str = str.replace(/\{(.+?)\}/g, (...rest) => {
    console.log(rest)

    return data[rest[1]]
})

console.log(str)