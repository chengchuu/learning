let defer = () => {
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

function foo () {
    let d = defer()
    setTimeout(() => {
        d.resolve('foo setTimeout')
    }, 3000)
    return d
}

foo().then(res => {
    console.log(res)
})

foo().then(res => {
    console.log('second')
})

console.log('script end')