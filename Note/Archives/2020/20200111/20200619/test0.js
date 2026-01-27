function wait (ms) {
    return new Promise(resolve => setTimeout(resolve.bind(null, ms), ms))
}

Promise.race([wait(2000), wait(4000), wait(3000)])
    .then(console.log)
// 2 秒后 2000

async function renderGame () {
    const game = await getGame()
    await report() // 等待获取游戏执行完毕
    render(game) // 等待上报执行完毕
}

function renderGame () {
    getGame()
        .then(render)
        .catch(console.error)
    report() // 和获取游戏同步执行
}

function wait (ms) {
    return new Promise(resolve => setTimeout(resolve.bind(null, ms), ms))
}
wait(2000).then(
    res => {
        JSON.parse(null)
    },
    console.error
)
