const defer = () => {
    let pending = []
    return {
        resolve: (value) => {
            if (pending) {
                pending.forEach(callback => callback(value))
                pending = undefined
            }
        },
        then: (callback) => {
            if (pending) {
                pending.push(callback)
            } else {
                callback(value)
            }
        }
    }
}

const mockPromise = () => {
    let p = defer()
    setTimeout(() => {
        p.resolve('success!')
    }, 3000)
    return p
}

mockPromise().then(res => {
    console.log(res)
})

console.log('script end')
// script end
// 3 秒后
// success!