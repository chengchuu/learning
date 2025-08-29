# 插件代码
let initOk = null
PP.init = new Promise(resolve => initOk = resolve)
// ...
// ...
// 经历了一系列同步异步代码后初始化完成
initOk(/* 数据 */)

# 第三方调用
PP.init.then(callback).catch(console.error)