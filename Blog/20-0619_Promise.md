# Promise: 异步编程的理解和使用

Promise 最早出现在 1988 年，由 Barbara Liskov、Liuba Shrira 首创（论文：Promises: Linguistic Support for Efficient Asynchronous Procedure Calls in Distributed Systems）。并且在语言 MultiLisp 和 Concurrent Prolog 中已经有了类似的实现。

- [Promise: 异步编程的理解和使用](#promise-异步编程的理解和使用)
  - [一、什么是 `Promise`](#一什么是-promise)
    - [1.1 `Promise` 的背景介绍](#11-promise-的背景介绍)
      - [1.1.1 旨在解决的问题](#111-旨在解决的问题)
    - [1.2 实现一个超简易版的 `Promise`](#12-实现一个超简易版的-promise)
  - [二、`Promise` 怎么用](#二promise-怎么用)
    - [2.1 使用 `Promise` 异步编程](#21-使用-promise-异步编程)
    - [2.2 链式调用](#22-链式调用)
    - [2.3 管理多个 `Promise` 实例](#23-管理多个-promise-实例)
    - [2.4 `Promise` 和 `async`\&`await`](#24-promise-和-asyncawait)
      - [2.4.1 使用 `async`\&`await` 的优势](#241-使用-asyncawait-的优势)
        - [2.4.1.1 简洁干净](#2411-简洁干净)
        - [2.4.1.2 处理条件语句](#2412-处理条件语句)
        - [2.4.1.3 处理中间值](#2413-处理中间值)
        - [2.4.1.4 靠谱的 `await`](#2414-靠谱的-await)
      - [2.4.2 避免滥用 `async`\&`await`](#242-避免滥用-asyncawait)
      - [2.4.3 ES2021 新特性：Top-level `await`](#243-es2021-新特性top-level-await)
    - [2.5 错误处理](#25-错误处理)
    - [2.6 取消一个 `Promise`](#26-取消一个-promise)
    - [2.7 迭代器的应用](#27-迭代器的应用)
  - [三、总结](#三总结)

## 一、什么是 `Promise`

### 1.1 `Promise` 的背景介绍

`Promise` 最早出现在 1988 年，由 [Barbara Liskov](https://dl.acm.org/profile/81100323833)、[Liuba Shrira](https://dl.acm.org/profile/81100088703) 首创（论文：[Promises: Linguistic Support for Efficient Asynchronous Procedure Calls in Distributed Systems](https://dl.acm.org/doi/10.1145/960116.54016)）。并且在语言 [MultiLisp](https://dl.acm.org/doi/10.1145/4472.4478) 和 [Concurrent Prolog](https://en.wikipedia.org/wiki/Prolog) 中已经有了类似的实现。

| 时间线 | 里程碑 |
| --- | --- |
| 1949 | 回调函数的概念诞生 |
| 1958 | 回调函数在 Fortran II 中应用 |
| **1988** | **`Promise` 的概念诞生** |
| 1995 | JavaScript 诞生 |
| 2009 | JavaScript 的非官方 `Promise` 库 Q 诞生  |
| 2011 | jQuery 1.5 新增 `Deferred()` 方法 |
| 2015 | ECMAScript 官方添加了 `Promise` 特性 |

JavaScript 中，`Promise` 的流行是得益于 jQuery 的方法 [`jQuery.Deferred()`](https://api.jquery.com/category/deferred-object/)，其他也有一些更精简独立的 `Promise` 库，例如：[Q](https://github.com/kriskowal/q)、[When](https://github.com/cujojs/when)、[Bluebird](https://github.com/petkaantonov/bluebird)。

```
// Q/2009-2017
import Q from 'q'

function wantOdd () {
    const defer = Q.defer()
    const num = Math.floor(Math.random() * 10)
    if (num % 2) {
        defer.resolve(num)
    } else {
        defer.reject(num)
    }
    return defer.promise
}

wantOdd()
    .then(num => {
        console.log(`Success: ${num} is odd.`) // Success: 7 is odd.
    })
    .catch(num => {
        console.log(`Fail: ${num} is not odd.`)
    })
```

由于 jQuery 并没有严格按照规范来制定接口，促使了官方对 `Promise` 的实现标准进行了一系列重要的澄清，该实现规范被命名为 [Promise/A+](https://promisesaplus.com/)。后来 ES6（也叫 ES2015，2015 年 6 月正式发布）也在 Promise/A+ 的标准上官方实现了一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 接口。

```
new Promise( function(resolve, reject) {...} /* 执行器 */  )
```

想要实现一个 `Promise`，必须要遵循如下规则：

1. `Promise` 是一个提供符合[标准](https://promisesaplus.com/#the-then-method)的 `then()` 方法的对象。
2. 初始状态是 `pending`，能够转换成 `fulfilled` 或 `rejected` 状态。
3. 一旦 `fulfilled` 或 `rejected` 状态确定，再也不能转换成其他状态。
4. 一旦状态确定，必须要返回一个值，并且这个值是不可修改的。

![状态](http://blog.mazey.net/wp-content/uploads/2022/09/Promise-Pending-0911-800x422-1.jpg)

> ECMAScript's Promise global is just one of many Promises/A+ implementations.

主流语言对于 `Promise` 的实现：[Golang/promise](https://github.com/chebyrash/promise)、[Python/promise](https://github.com/syrusakbary/promise)、[C#/Real-Serious-Games/c-sharp-promise](https://github.com/Real-Serious-Games/c-sharp-promise)、[PHP/Guzzle Promises](https://github.com/guzzle/promises)、[Java/IOU](https://github.com/ioweyou/iou-java)、[Objective-C/PromiseKit](https://github.com/dizzus/PromiseKit)、[Swift/FutureLib](https://github.com/couchdeveloper/FutureLib)、[Perl/stevan/promises-perl](https://github.com/stevan/promises-perl)。

```
// Golang Example
func main() {
  p1 := promise.New(func(resolve func(int), reject func(error)) {
    factorial := findFactorial(20)
    resolve(factorial)
  })
  p2 := promise.New(func(resolve func(string), reject func(error)) {
    ip, err := fetchIP()
    if err != nil {
      reject(err)
      return
    }
    resolve(ip)
  })
  factorial, _ := p1.Await()
  fmt.Println(factorial)
  IP, _ := p2.Await()
  fmt.Println(IP)
}
// Other Code...
```

#### 1.1.1 旨在解决的问题

由于 JavaScript 是单线程[事件驱动](https://zh.wikipedia.org/wiki/%E4%BA%8B%E4%BB%B6%E9%A9%85%E5%8B%95%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88)的编程语言，通过回调函数管理多个任务。在快速迭代的开发中，因为回调函数的滥用，很容易产生被人所诟病的[回调地狱](http://callbackhell.com/)问题。`Promise` 的异步编程解决方案比回调函数更加合理，可读性更强。

传说中比较夸张的回调：

![回调地狱](http://blog.mazey.net/wp-content/uploads/2020/06/js-callback-hell.png)

现实业务中依赖关系比较强的回调：

```
// 回调函数
function renderPage() {
  const secret = genSecret()
  // 获取用户登录态
  getUserToken({
    secret,
    success: token => {
      // 获取游戏列表
      getGameList({
        token,
        success: data => {
          // 渲染游戏列表
          render({
            list: data.list,
            success: () => {
              // 埋点数据上报
              report()
            },
            fail: err => {
              console.error(err)
            }
          })
        },
        fail: err => {
          console.error(err)
        }
      })
    },
    fail: err => {
      console.error(err)
    }
  })
}
```

实际上更真实的情况，往往是一个回调函数在多个文件间透传，要搞清楚最终在哪里触发需要翻越整个项目。

使用 `Promise` 梳理流程后：

```
// Promise
function renderPage() {
  const secret = genSecret()
  // 获取用户登录态
  getUserToken(token)
    .then(token => {
      // 获取游戏列表
      return getGameList(token)
    })
    .then(data => {
      // 渲染游戏列表
      return render(data.list)
    })
    .then(() => {
      // 埋点数据上报
      report()
    })
    .catch(err => {
      console.error(err)
    })
}
```

若其中某个流程需要复用，单独把它抽离出来即可。

```
// 获取游戏列表
// 仅为示例，与实际业务无关
function getGameXYZ() {
  const secret = genSecret()
  // 获取用户登录态
  return getUserToken(token)
    .then(token => {
      // 获取游戏列表
      return getGameList(token)
    })
}
// 渲染页面
function renderPage() {
  getGameXYZ()
    .then(data => {
      // 渲染游戏列表
      return render(data.list)
    })
    .then(() => {
      // 埋点数据上报
      report()
    })
    .catch(err => {
      console.error(err)
    })
}
// 其他场景
function doABC() {
  getGameXYZ()
    .then(data => {
      // ...
    })
    .then(data => {
      // ...
    })
    .catch(err => {
      console.error(err)
    })
}
```

### 1.2 实现一个超简易版的 `Promise`

`Promise` 的运转实际上是一个观察者模式，`then()` 中的匿名函数充当观察者，`Promise` 实例充当被观察者。

```
const p = new Promise(resolve => setTimeout(resolve.bind(null, 'from promise'), 3000))

p.then(console.log.bind(null, 1))
p.then(console.log.bind(null, 2))
p.then(console.log.bind(null, 3))
p.then(console.log.bind(null, 4))
p.then(console.log.bind(null, 5))
// 3 秒后
// 1 2 3 4 5 from promise
```

![观察者模式](http://blog.mazey.net/wp-content/uploads/2022/09/Watch-0908-800x412-1.jpg)

```
// 实现
const defer = () => {
  let pending = [] // 充当状态并收集观察者
  let value = undefined
  return {
    resolve: (_value) => { // FulFilled!
      value = _value
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

// 模拟
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
```

## 二、`Promise` 怎么用

### 2.1 使用 `Promise` 异步编程

在 `Promise` 出现之前往往使用回调函数管理一些异步程序的状态。

![回调函数](http://blog.mazey.net/wp-content/uploads/2022/09/Callback-0908-e1662652831315.jpeg)

```
// 常见的异步 Ajax 请求格式
ajax(url, successCallback, errorCallback)
```

`Promise` 出现后使用 `then()` 接收事件的状态，且只会接收一次。

**案例：插件初始化**

工作中使用封装好的插件时，往往需要等待插件初始化成功后进行下一步操作。

使用回调函数：

```
<!-- 1. <script... -->
<script src="https://example.com/pplugin@latest/pplugin.min.js"></script>
<script>
  // PPlugin Init
  PPlugin.init(data => {
    console.log('初始化完成', data)
  })
</script>

// 2. NPM
import PPlugin from 'PPlugin'

// ...
// 其他代码
// ...
PPlugin.init(data => {
  console.log('初始化完成', data)
})
```

插件代码：

```
const PPlugin = {/* Pass */ }
// 此处为理想情况，随着业务快速迭代，会变得不可控，往往需要多个状态判断
let ppInitStatus = false
let ppInitCallback = null
PPlugin.init = callback => {
  if (ppInitStatus) {
    callback && callback(/* 数据 */)
  } else {
    ppInitCallback = callback
  }
}
// 客户端桥接...
// 服务端接口...
// 经历了一系列同步异步程序后初始化完成
ppInitCallback && ppInitCallback(/* 数据 */)
ppInitStatus = true
```

使用 `Promise`：

```
<!-- 使用方式同上 -->
<script src="https://example.com/pplugin@latest/pplugin.min.js"></script>
<script>
  // PPlugin Init
  PPlugin.init(data => {
    console.log('初始化完成', data)
  })
</script>
<!-- 其余省略 -->
```

插件代码：

```
const PPlugin = {/* Pass */ }
let initOk = null
const ppInitStatus = new Promise(resolve => initOk = resolve)
PPlugin.init = callback => {
  ppInitStatus.then(callback).catch(console.error)
}
// 客户端桥接...
// 服务端接口...
// 经历了一系列同步异步程序后初始化完成
initOk(/* 数据 */)
```

相对于使用回调函数，逻辑更清晰，什么时候初始化完成和触发回调一目了然，不再需要重复判断状态和回调函数。当然更好的做法是只给使用方输出**状态**和**数据**，至于如何使用由使用方决定。

插件代码：

```
const PPlugin = {/* Pass */ }
let initOk = null
PPlugin.init = new Promise(resolve => initOk = resolve)
// 客户端桥接...
// 服务端接口...
// 经历了一系列同步异步程序后初始化完成
initOk(/* 数据 */)
```

使用插件：

```
<!-- 使用方式已变化 -->
<script src="https://example.com/pplugin@latest/pplugin.min.js"></script>
<script>
  PPlugin.init.then(callback).catch(console.error)
</script>
```

### 2.2 链式调用

`then()` 必然返回一个 `Promise` 对象，`Promise` 对象又拥有一个 `then()` 方法，这正是 `Promise` 能够链式调用的原因。

```
const p = new Promise(r => r(1))
  .then(res => {
    console.log(res) // 1
    return Promise.resolve(2)
      .then(res => res + 10) // === new Promise(r => r(1))
      .then(res => res + 10) // 由此可见，每次返回的是实例后面跟的最后一个 then
  })
  .then(res => {
    console.log(res) // 22
    return 3 // === Promise.resolve(3)
  })
  .then(res => {
    console.log(res) // 3
  })
  .then(res => {
    console.log(res) // undefined
    return '最强王者'
  })

p.then(console.log.bind(null, '是谁活到了最后:')) // 是谁活到了最后: 最强王者
```

由于返回一个 `Promise` 结构体永远返回的是链式调用的最后一个 `then()`，所以在处理封装好的 `Promise` 接口时没必要在外面再包一层 `Promise`。

```
// 包一层 Promise
function api() {
  return new Promise((resolve, reject) => {
    axios.get(/* 链接 */).then(data => {
      // ...
      // 经历了一系列数据处理
      resolve(data.xxx)
    })
  })
}

// 更好的做法：利用链式调用
function api() {
  return axios.get(/* 链接 */).then(data => {
    // ...
    // 经历了一系列数据处理
    return data.xxx
  })
}
```

### 2.3 管理多个 `Promise` 实例

`Promise.all()` / `Promise.race()` 可以将多个 `Promise` 实例包装成一个 Promise 实例，在处理并行的、没有依赖关系的请求时，能够节约大量的时间。

```
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve.bind(null, ms), ms))
}

// Promise.all
Promise.all([wait(2000), wait(4000), wait(3000)])
  .then(console.log)
// 4 秒后 [ 2000, 4000, 3000 ]

// Promise.race
Promise.race([wait(2000), wait(4000), wait(3000)])
  .then(console.log)
// 2 秒后 2000
```

### 2.4 `Promise` 和 `async`&`await`

`async`&`await` 实际上只是建立在 `Promise` 之上的语法糖，让异步代码**看上去**更像同步代码，所以 `async`&`await` 在 JavaScript 线程中是非阻塞的，但在当前函数作用域内具备阻塞性质。

```
let ok = null
async function foo() {
  console.log(1)
  console.log(await new Promise(resolve => ok = resolve))
  console.log(3)
}
foo() // 1
ok(2) // 2 3
```

#### 2.4.1 使用 `async`&`await` 的优势

##### 2.4.1.1 简洁干净

写更少的代码，不需要特地创建一个匿名函数，放入 `then()` 方法中等待一个响应。

```
// Promise
function getUserInfo() {
  return getData().then(
    data => {
      return data
    }
  )
}

// async / await
async function getUserInfo() {
  return await getData()
}
```

##### 2.4.1.2 处理条件语句

当一个异步返回值是另一段逻辑的判断条件，链式调用将随着层级的叠加变得更加复杂，很容易让人混淆。使用 `async`&`await` 将使代码可读性变得更好。

```
// Promise
function getGameInfo() {
  getUserAbValue().then(
    abValue => {
      if (abValue === 1) {
        return getAInfo().then(
          data => {
            // ...
          }
        )
      } else {
        return getBInfo().then(
          data => {
            // ...
          }
        )
      }
    }
  )
}

// async / await
async function getGameInfo() {
  const abValue = await getUserAbValue()
  if (abValue === 1) {
    const data = await getAInfo()
    // ...
  } else {
    // ...
  }
}
```

##### 2.4.1.3 处理中间值

异步函数常常存在一些异步返回值，作用仅限于成为下一段逻辑的入场券，如果经历层层链式调用，很容易成为另一种形式的“回调地狱”。

```
// Promise
function getGameInfo() {
  getToken().then(
    token => {
      getLevel(token).then(
        level => {
          getInfo(token, level).then(
            data => {
              // ...
            }
          )
        }
      )
    }
  )
}

// async / await
async function getGameInfo() {
  const token = await getToken()
  const level = await getLevel(token)
  const data = await getInfo(token, level)
  // ...
}
```

对于**多个**异步返回中间值，搭配 `Promise.all` 使用能够提升逻辑性和性能。

```
// async / await & Promise.all
async function foo() {
  // ...
  const [a, b, c] = await Promise.all([promiseFnA(), promiseFnB(), promiseFnC()])
  const d = await promiseFnD()
  // ...
}
```

##### 2.4.1.4 靠谱的 `await`

`await 'str'` 等于 `await Promise.resolve('str')`，`await` 会把任何不是 `Promise` 的值包装成 `Promise`，看起来貌似没有什么用，但是在处理第三方接口的时候可以 “Hold” 住同步和异步返回值，否则对一个非 `Promise` 返回值使用 `then()` 链式调用则会报错。
    
#### 2.4.2 避免滥用 `async`&`await`

`await` 阻塞 `async` 函数中的代码执行，在上下文关联性不强的代码中略显累赘。

```
// async / await
async function initGame() {
  render(await getGame()) // 等待获取游戏执行完毕再去获取用户信息
  report(await getUserInfo())
}

// Promise
function initGame() {
  getGame()
    .then(render)
    .catch(console.error)
  getUserInfo() // 获取用户信息和获取游戏同步进行
    .then(report)
    .catch(console.error)
}
```

#### 2.4.3 ES2021 新特性：Top-level `await`

Node.js 14+ 版本后，可以在 [JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 中使用 `await` 操作符。在这之前，只能通过在 `async` 声明的场景中使用 `await` 操作符。

[MDN 官方案例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)：

```
// fetch request
const colors = fetch('../data/colors.json')
  .then((response) => response.json())

export default await colors
```

### 2.5 错误处理

1\. 链式调用中尽量结尾跟 `catch` 捕获错误，而不是第二个匿名函数。因为规范里注明了若 `then()` 方法里面的参数不是函数则什么都不做，所以 `catch(rejectionFn)` 其实就是 `then(null, rejectionFn)` 的别名。

```
anAsyncFn().then(
  resolveSuccess, // 无法捕获
  rejectError // `rejectError` 捕获 `anAsyncFn`
)
```

↑在以上代码中，`anAsyncFn()` 抛出来的错误 `rejectError` 会正常接住，但是 `resolveSuccess` 抛出来的错误将无法捕获，所以更好的做法是永远使用 `catch`。

```
anAsyncFn()
  .then(resolveSuccess)
  .catch(rejectError) // 尽量使用 `catch`
```

若想错误管理精细一点，也可以通过 `rejectError` 来捕获 `anAsyncFn()` 的错误，`catch` 捕获 `resolveSuccess` 的错误。

```
anAsyncFn()
  .then(
    resolveSuccess,
    rejectError // 捕获 `anAsyncFn()`
  )
  .catch(handleError) // 捕获 `resolveSuccess`
```

2\. 通过全局属性监听未被处理的 `Promise` 错误。

浏览器环境（`window`）的拒绝状态监听事件：
- [`unhandledrejection`](https://developer.mozilla.org/zh-CN/docs/Web/Events/unhandledrejection) 当 Promise 被拒绝，并且没有提供拒绝处理程序时，触发该事件。
- [`rejectionhandled`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/rejectionhandled_event) 当 Promise 被拒绝时，若拒绝处理程序被调用，触发该事件。

```
// 初始化列表
const unhandledRejections = new Map()
// 监听未处理拒绝状态
window.addEventListener('unhandledrejection', e => {
  unhandledRejections.set(e.promise, e.reason)
})
// 监听已处理拒绝状态
window.addEventListener('rejectionhandled', e => {
  unhandledRejections.delete(e.promise)
})
// 循环处理拒绝状态
setInterval(() => {
  unhandledRejections.forEach((reason, promise) => {
    console.log('handle: ', reason.message)
    promise.catch(e => {
      console.log(`I catch u!`, e.message)
    })
  })
  unhandledRejections.clear()
}, 5000)
```
    
注意：`Promise.reject()` 和 `new Promise((resolve, reject) => reject())` 这种方式不能直接触发 `unhandledrejection` 事件，必须是满足已经进行了 `then()` 链式调用的 `Promise` 对象才行。

### 2.6 取消一个 `Promise`

当执行一个超级久的异步请求时，若超过了能够忍受的最大时长，往往需要取消此次请求，但是 `Promise` 并没有类似于 `cancel()` 的取消方法，想结束一个 `Promise` 只能通过 `resolve` 或 `reject` 来改变其状态，社区已经有了满足此需求的开源库 [Speculation](https://github.com/ericelliott/speculation)。

或者利用 `Promise.race()` 的机制来同时注入一个会超时的异步函数，但是 `Promise.race()` 结束后主程序其实还在 `pending` 中，占用的资源并没有释放。

```
Promise.race([anAsyncFn(), timeout(5000)])
```

### 2.7 迭代器的应用

若想按顺序执行一堆异步程序，可使用 `reduce`。每次遍历返回一个 `Promise` 对象，在下一轮 `await` 住从而依次执行。相同的场景，也可以使用递归实现，但是在 JavaScript 中随着数量增加，超出调用栈最大次数，便会报错。

```
function wasteTime(ms) {
  return new Promise(resolve => setTimeout(() => {
    resolve(ms)
    console.log('waste', ms)
  }, ms))
}

// 依次浪费 3 4 5 3 秒 === 15 秒
const arr = [3000, 4000, 5000, 3000]
arr.reduce(async (last, curr) => {
  await last
  return wasteTime(curr)
}, undefined)
```

## 三、总结

1. 每当要使用异步代码时，请考虑使用 `Promise`。
2. `Promise` 中所有方法的返回类型都是 `Promise`。
3. `Promise` 中的状态改变是一次性的，建议在 `reject()` 方法中传递 `Error` 对象。
4. 尽量为所有的 `Promise` 添加 `then()` 和 `catch()` 方法。
5. 使用 `Promise.all()` 去运行多个 `Promise`。
6. 倘若想在 `then()` 或 `catch()` 后都做点什么，可使用 `finally()`。
7. 可以将多个 `then()` 挂载在同一个 `Promise` 上。
8. `async` （异步）函数返回一个 `Promise`，所有返回 `Promise` 的函数也可以被视作一个异步函数。
9. `await` 用于调用异步函数，直到其状态改变（`fulfilled` or `rejected`）。
10. 使用 `async` / `await` 时要考虑上下文的依赖性，避免造成不必要的阻塞。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/1642.html>

(完)
