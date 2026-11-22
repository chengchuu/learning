## Computer/计算机基础

### Stack and Heap/栈和堆的区别

1\. Stack/栈

由系统自动分配和释放，当定义一个作用域内的变量脱离作用域则释放，数据结构先进后出，类似于数据结构中的栈。

2\. Heap/堆

由程序员分配和释放，若不手动释放，则在程序运行结束时回收，没有固定的排序，数据结构类似于链表。

### 为什么有序列表省空间

https://henleylee.github.io/posts/2019/b8928e0e.html

- 顺序存储结构：一段连续的内存空间。优点：随机访问；缺点：插入删除效率低，大小固定。
- 链式存储结构：不连续的内存空间。优点：大小动态扩展，插入删除效率高；缺点：不能随机访问。
- 索引存储结构：为了方便查找，整体无序，但索引块之间有序，需要额外空间，存储索引表。优点：对顺序查找的一种改进，查找效率高；缺点：需额外空间存储索引。
- 散列存储结构：选取某个函数，数据元素根据函数计算存储位置可能存在多个数据元素存储在同一位置，引起地址冲。优点：查找基于数据本身即可找到，查找效率高，存取效率高；缺点：存取随机，不便于顺序查找。

## Browser/浏览器

### Process and Threads/浏览器的进程和线程

https://thiluxan.medium.com/how-web-browsers-use-process-threads-a5e560d42037

Like Chrome, Firefox also using the concepts of multi-threading inside each process. With the release of Firefox 54, Mozilla has completed its transition to a multi-threaded web browser. But the multi-threading concept in Firefox is bit different with that of Chrome. In Chrome it initialize separate process for each tabs. If 5 tabs are opened, then there will be 5 render processes running. It will result it consuming memory, when the no. of processes get increased.

For this problem, Firefox implemented a conservative approach. There will be 4 new processes created for 4 new processes. If an additional tab is opened, it will run using threads within the existing processes. Multiple tabs within a process share the browser engine that already exists in memory, instead of each creating their own. This will reduce the consumption of memory, as more memory needed if no. of processes increased.

### Browser Cache and Server Cache/前端有几种缓存方式/浏览器端的缓存

https://www.bigcommerce.com/ecommerce-answers/what-browser-cache-and-why-it-important/

Caching improves and speeds up browsing. Once you've downloaded an asset, it lives (for a time) on your machine. Retrieving files from your hard drive will always be faster than retrieving them from a remote server, no matter how fast your Internet connection.

https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching

Shared Caches: it is used for more than one user. Gateway caches, CDN, reverse proxy caches. `Last-Modified` header.

Private Caches: A single user. Browser. Except for first requests.

### Local Storage vs. Session Storage vs. Cookies/说说浏览器缓存 `localStorage`、`sessionStorage` 和 `cookie`/讲讲 Cookie

https://mazey.cn/t/gh

![Differences](https://blog.mazey.net/wp-content/uploads/2022/04/comparison-table.png)

### What happens when you type a URL into your browser?/浏览器输入地址后做了哪些事情

https://mazey.cn/t/gg

- look up the location of the server hosting the website
- make the connection to the server
- send a request to get the specific page
- handle the response from the server and
- how it renders the page so you, the viewer, can interact with the website

### 页面渲染的过程

### PWA Cache/PWA 中如何做缓存，遇到不更新的情况怎么办

https://developer.chrome.com/docs/workbox/caching-strategies-overview/

1. Cache only
2. Network only
3. Cache first, falling back to network
4. Network first, falling back to cache
5. Stale-while-revalidate

### 如何实现浏览器内多个标签页之间的通信

1\. localStorage

使用 `localStorage.setItem(key,value);` 添加内容，使用 `storage` 事件监听添加、修改、删除的动作。

```
window.addEventListener("storage", function(event){
    $("#name").val(event.key + '=' + event.newValue);
});
```

2\. Cookie

动态获取 Cookie 中的内容。

## Network/网络协议

### HTTP Headers/Http 有哪些请求头

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

### 了解 HTTP 协议吗

### HTTP vs. HTTPS/HTTP 和 HTTPS 的区别，HTTPS 如何做的加密/HTTPS 与 HTTP 有什么区别

1. HTTPS 协议需要到 CA 申请证书，⼀般免费证书很少，需要交费。
2. HTTP 协议运⾏在 TCP 之上，所有传输的内容都是明⽂，HTTPS 运⾏在 SSL/TLS 之上，SSL/TLS 运⾏在 TCP 之上，所有传输的内容将被加密。
3. HTTP 和 HTTPS 使⽤的是完全不同的连接⽅式，⽤的端⼝也不⼀样，前者是 80，后者是 443。
4. HTTPS 可以有效的防⽌运营商劫持，解决了防劫持的⼀个⼤问题。

https://juejin.cn/post/6844903608421449742

![https://blog.mazey.net/wp-content/uploads/2022/05/image-https.png]

### HTTPS 和 HTTP 的区别/HTTP3 了解吗，HTTP 和 (web)socket 区别，为什么要三次握手/TCP 为何要进行三次握手/HTTP2.0 和 HTTP1.X相比的新特性有哪些

https://www.zhihu.com/question/24853633

1. 新的二进制格式（Binary Format），HTTP1.x的解析是基于文本。
2. 多路复用（MultiPlexing），即连接共享，即每一个request都是是用作连接共享机制的。
3. header 压缩。
4. 服务端推送（server push）。

### Manage Headers of CDN/管理 CDN 资源的时候如何设置 Header 头

```
ExamplesSetting cache expiry timeYou can control cache expiry time of your content.# 30 DAYS
<FilesMatch "\.(ico|pdf|flv|jpg|jpeg|png|gif|js|css|swf)$">
    Header add Cache-Control "max-age=2592000, public"
</FilesMatch>

# 2 DAYS
<FilesMatch "\.(xml|txt)$">
    Header add Cache-Control "max-age=172800, public, must-revalidate"
</FilesMatch>

# 2 HOURS
<FilesMatch "\.(html|htm)$">
    Header add Cache-Control "max-age=7200, must-revalidate"
</FilesMatch>

# NO CACHE
<FilesMatch "\.(html|htm)$">
    Header add Cache-Control "no-cache"
</FilesMatch>
After changing origin HTTP headers you might need to purge your content from the CDN cache as it is cached with the old HTTP headers. Please refer to Setting a Cache Expiry Time for more details on cache control on CDN end.Setting CORSYou can enable Cross Origin Resource Sharing (CORS).<FilesMatch ".(eot|ttf|otf|woff)$">
        Header set Access-Control-Allow-Origin "*"
</FilesMatch>
After changing origin HTTP headers you might need to purge your content from the CDN cache as it is cached with the old HTTP headers. Please refer here for more details.
```

### Cross-Origin/除了设置 Headers 还需要设置什么/跨域问题/如何实现跨域通信/什么是浏览器的同源策略

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

For security reasons, browsers restrict cross-origin HTTP requests initiated from scripts. For example, XMLHttpRequest and the Fetch API follow the same-origin policy. This means that a web application using those APIs can only request resources from the same origin the application was loaded from unless the response from other origins includes the right CORS headers.

In response, the server returns a Access-Control-Allow-Origin header with Access-Control-Allow-Origin: *, which means that the resource can be accessed by any origin.

```
*1. 通过 jsonp 跨域
2. document.domain + iframe 跨域
3. location.hash + iframe
*4. window.name + iframe 跨域
*5. postMessage 跨域
6. 跨域资源共享（CORS）
*7. nginx 代理跨域（同个域名）
8. nodejs 中间件代理跨域
*9. WebSocket 协议跨域
```

所谓同源是指，域名，协议，端口相同。同源策略可防止 JavaScript 发起跨域请求。此策略可防止页面上的恶意脚本通过该页面的文档对象模型，访问另一个网页上的敏感数据。
同源策略，它是由 Netscape 提出的一个著名的安全策略，现在所有支持JavaScript 的浏览器都会使用这个策略。

### 跨域哪种情况前端没有办法

### Simple Rquest/什么是简单请求和复杂请求/跨域的情况何时要进行 `options` 请求

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests

https://medium.com/@f2004392/cors-preflight-request-options-9d05b9248e5a

As per the W3C specification(For HTTP request methods in particular, other than GET or POST with certain content types), browsers first makes the preflight (OPTIONS request ) in order to validate whether the supported methods are valid from the server. 

### HTTP Cache/如何理解 HTTP 缓存策略

https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching

The Cache-Control HTTP/1.1 general-header field is used to specify directives for caching mechanisms in both requests and responses. Use this header to define your caching policies with the variety of directives it provides.

You can use a large max-age value for files that rarely or never change. This might include images, HTML, CSS files, and JavaScript files.

---

When a validation request is made, the server can either ignore the validation request and respond with a normal 200 OK, or it can return 304 Not Modified (with an empty body) to instruct the browser to use its cached copy. The latter response can also include headers that update the expiration time of the cached resource.

### 协商缓存和强制缓存区别/什么是浏览器的强缓存和协商缓存

https://blog.mazey.net/1609.html

强缓存

1. Expires（该字段是 http1.0 时的规范，值为一个绝对时间的 GMT 格式的时间字符串，代表缓存资源的过期时间）
2. Cache-Control:max-age（该字段是 http1.1 的规范，强缓存利用其 max-age 值来判断缓存资源的最大生命周期，它的值单位为秒）

协商缓存

1. Last-Modified（值为资源最后更新时间，随服务器response返回）
2. If-Modified-Since（通过比较两个时间来判断资源在两次请求期间是否有过修改，如果没有修改，则命中协商缓存）
3. ETag（表示资源内容的唯一标识，随服务器response返回）
4. If-None-Match（服务器通过比较请求头部的If-None-Match与当前资源的ETag是否一致来判断资源是否在两次请求之间有过修改，如果没有修改，则命中协商缓存）

### HTTP 常见的状态码是什么

1XX 信息性状态码（Informational）服务器正在处理请求
2XX 成功状态码（Success）请求已正常处理完毕
3XX 重定向状态码（Redirection）需要进行额外操作以完成请求
4XX 客户端错误状态码（Client Error）客户端原因导致服务器无法处理请求
5XX 服务器错误状态码（Server Error）服务器原因导致处理请求出错

## HTML

### BOM 和 DOM 有什么区别

BOM 即浏览器对象模型，BOM 没有相关标准，BOM 的最核⼼对象是 window 对象。
DOM 即⽂档对象模型，DOM 是 W3C 标准，DOM 的最根本对象是 document（window.document）

### 请描述 `<script>`、`<script async>` 和 `<script defer>` 的区别

1. 没有 `defer` 或 `async`，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 `script` 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。
2. 有 `async`，加载和渲染后续文档元素的过程将和 `<script>` 的加载与执行并行进行（异步）。
3. 有 `defer`，加载后续文档元素的过程将和 `<script>` 的加载并行进行（异步），但是 `<script>` 的执行要在所有元素解析完成之后，`DOMContentLoaded` 事件触发之前完成。

### HTML 中 DOCTYPE 的用途是什么

DOCTYPE 是 "document type" 的缩写。它是 HTML 中用来区分标准模式和怪异模式的声明，用来告知浏览器使用标准模式渲染页面。

## CSS

### Transitions vs. Animations/CSS 过渡和动画区别

https://blog.hubspot.com/website/css-transition-vs-animation

### `:before` vs. `:after`/`:before` 和 `:after` 区别

The `::before` and `::after` pseudo-elements allow you to add content to a specific part of an element you have selected in a CSS rule. For instance, the `::before` selector could be used to add text before a link. The `::after` selector could be used to add an emoji after a paragraph of text.

### Pseudo-Elements/有哪些伪类

https://www.w3schools.com/css/css_pseudo_elements.asp

### CSS Box Model/谈谈你对 CSS 盒模型的认识

https://mazey.cn/t/ge

### BFC/了解 CSS 的 BFC 吗/BFC 如何产生，以及有什么特性

https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context

https://blog.mazey.net/2068.html

### 浮动元素引起的问题和解决办法

https://blog.mazey.net/903.html

### FLEX/讲讲 Flex Box 弹性布局/`display: flex` 轴是什么意思

https://mazey.cn/t/gf

The Flexible Box Module, usually referred to as flexbox, was designed as a one-dimensional layout model, and as a method that could offer space distribution between items in an interface and powerful alignment capabilities. 

When we describe flexbox as being one dimensional we are describing the fact that flexbox deals with layout in one dimension at a time — either as a row or as a column. This can be contrasted with the two-dimensional model of CSS Grid Layout, which controls columns and rows together.

### Flex 布局和 Grid 布局的区别

Flex 是 Flexible Box（弹性布局）的简写，是一个一维系统，用来为盒状模型提供最大的灵活性。
Grid 是 Gird Layout（网格布局）是 CSS 中最强大的布局系统，是一个二维系统，可以同时处理行和列，可以通过将 CSS 规则用于父元素（网格容器）和该元素的子元素（网格元素）来使用网格布局。

### REM/移动端中如何做设配/CSS 的 REM 是什么

https://www.sitepoint.com/understanding-and-using-rem-units-in-css/

CSS rem stands for “root em”.

### VW VH/CSS 中的 VW 和 VH 是什么

https://www.w3schools.com/cssref/css_units.asp

### CSS `HLS` 最后两个参数是干嘛用的

### CSS 三列布局

### CSS 布局，等高左边固定宽度

### 三行布局顶部吸顶

### 如何控制元素的层级

### CSS 如何实现垂直居中

### 如何隐藏一个元素

### 渐进增强和优雅降级

https://segmentfault.com/a/1190000008860347

### 回流和重绘，重绘会导致回流吗/哪些重绘会导致回流/CSS 重排和重绘之间有什么区别

https://segmentfault.com/a/

重排：部分渲染树（或者整个渲染树）需要重新分析并且节点尺⼨需要重新计算。
重绘：由于节点的⼏何属性发⽣改变或者由于样式发⽣改变，例如改变元素背景⾊时，屏幕上的部分内容需要更新。

### 重置（resetting）CSS 和 标准化（normalizing）CSS 的区别是什么

重置（Resetting）： 重置意味着除去所有的浏览器默认样式。对于页面所有的元素，像 `margin`、`padding`、`font-size` 这些样式全部置成一样。你将必须重新定义各种元素的样式。
标准化（Normalizing）： 标准化没有去掉所有的默认样式，而是保留了有用的一部分，同时还纠正了一些常见错误。

## JavaScript

### Check the Type/JavaScript 数据类型检测有几种方法

The best way is to use the `typeof` keyword.

https://www.cnblogs.com/lvyier/p/13962868.html

1. `typeof`
2. `instanceof`
3. `constructor`
4. `Object.prototype.toString.call()`

### `instanceof`/`instanceof` 用法

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof

The instanceof operator tests to see if the prototype property of a constructor appears anywhere in the prototype chain of an object. The return value is a boolean value.

```
object instanceof constructor

console.log([] instanceof Array);
// true
let literalString = 'This is a literal string';
let stringObject  = new String('String created with constructor');
literalString instanceof String;  // false, string literal is not a String
stringObject  instanceof String;  // true
literalString instanceof Object;  // false, string literal is not an Object
stringObject  instanceof Object;  // true
stringObject  instanceof Date;    // false
```

### Bubbling and Capturing/先触发冒泡还是先触发捕获/冒泡和捕获，父元素和子元素点击顺序/事件冒泡和事件捕获/什么是事件冒泡

当⼀个事件在 DOM 元素上触发时，如果有事件监听器，它将尝试处理该事件，然后事件冒泡到其⽗级元素，并发⽣同样的事情；直到对象层次的最顶层，即 document 对象。

https://javascript.info/bubbling-and-capturing

![Bubbling and Capturing](https://i.mazey.net/asset/default/eventflow.svg)

1\. 事件冒泡

触发顺序自内向外。

2\. 事件捕获

触发顺序自外向内。

3\. 阻止事件冒泡

绑定事件方法（`addEventListener`）的第三个参数，就是控制事件触发顺序是否为事件捕获。`true`，事件捕获；`false`,事件冒泡。默认 `false`,即事件冒泡。

`event.stopPropagation()` 方法将停止事件的传播，阻止它被分派到其他 Document 节点。

### Event Delegation/事件委托/代理是怎么回事/请解释什么是事件代理/什么是事件委托，使用事件委托的好处是什么

https://medium.com/@bretdoucette/part-4-what-is-event-delegation-in-javascript-f5c8c0de2983

Without event delegation you would have to rebind the click event listener to each new input loaded to the page. Coding this is complicated and burdensome. For one, it would drastically increase the amount of event listeners on your page, and more event listeners would increase the total memory footprint of your page. Having a larger memory footprint decreases performance… and poor performance is a bad thing. Second, there can be memory leak issues associated with binding and unbinding event listeners and removing elements from the dom. But that is beyond the scope of this article!

事件委托是利用事件的冒泡原理来实现的，何为事件冒泡呢？就是事件从最深的节点开始，然后逐步向上传播事件，举个例子：页面上有这么一个节点树，`div`>`ul`>`li`>`a`;比如给最里面的 `a` 加一个 `click` 点击事件，那么这个事件就会一层一层的往外执行，执行顺序 `a`>`li`>`ul`>`div`，有这样一个机制，那么我们给最外面的 `div` 加点击事件，那么里面的 `ul`，`li`，`a` 做点击事件的时候，都会冒泡到最外层的 `div` 上，所以都会触发，这就是事件委托，委托它们父级代为执行事件。

https://www.cnblogs.com/liugang-vip/p/5616484.html

事件委托是将事件监听器添加到父元素，而不是每个子元素单独设置事件监听器。当触发子元素时，事件会冒泡到父元素，监听器就会触发。这种技术的好处是：

1. 内存占用减少，因为只需要一个父元素的事件处理程序，而不必为每个后代都添加事件处理程序。
2. 无需从已删除的元素中解绑处理程序，也无需将处理程序绑定到新元素上。

### 讲讲 `this`/`this` 在函数中指向问题

### `new` 一个函数后发生了什么/函数形式模拟实现 `new`

https://blog.mazey.net/1612.html

### Promise and Async/Await/Promise 解决了什么问题，和 Async/Await 的区别

### Map and WeakMap/Map 和 WeakMap 的区别

https://blog.mazey.net/878.html

### Closures/什么时候会用到闭包/什么时候用闭包，用闭包会存在的问题

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

### Microtask and Macrotask/宏任务和微任务的区别

https://stackoverflow.com/questions/38752620/promise-vs-settimeout

Promise.resolve schedules a microtask and the setTimeout schedules a macrotask. And the microtasks are executed before running the next macrotask.

### Thread/JavaScript 是单线程还是多线程/JavaScript 中的多线程

https://developer.mozilla.org/en-US/docs/Glossary/Thread

The main thread is the one used by the browser to handle user events, render and paint the display, and to run the majority of the code that comprises a typical web page or app. Because these things are all happening in one thread, a slow website or app script slows down the entire browser; worse, if a site or app script enters an infinite loop, the entire browser will hang. This results in a frustrating, sluggish (or worse) user experience.

### Why `0.1 + 0.2 !== 0.3`/为什么 `0.1 + 0.2 !== 0.3`/为什么以下代码在 JavaScript 中返回 `false`

在 JavaScript 中，数字只有 `number` 这一种类型；JavaScript 采用了 IEEE-745 浮点数表示法。我们先把 0.1 和 0.2 转换成二进制就是：

- 0.1 => 0.0001 1001 1001 1001…（无限循环）
- 0.2 => 0.0011 0011 0011 0011…（无限循环）

双精度浮点数的小数部分最多支持 52 位，所以两者相加之后，再把它转换为十进制，就成了 0.30000000000000004。

### Prototype Chain and Scope/说说作用域和原型链/原型的理解

https://mazey.cn/t/gd

JavaScript is a bit confusing for developers experienced in class-based languages (like Java or C++), as it is dynamic and does not provide a class implementation per se (the class keyword is introduced in ES2015, but is syntactical sugar, JavaScript remains prototype-based).

When it comes to inheritance, JavaScript only has one construct: objects. Each object has a private property which holds a link to another object called its prototype. That prototype object has a prototype of its own, and so on until an object is reached with null as its prototype. By definition, null has no prototype, and acts as the final link in this prototype chain.

Nearly all objects in JavaScript are instances of Object which sits just below null on the top of a prototype chain.

https://developer.mozilla.org/en-US/docs/Glossary/Scope

The current context of execution. The context in which values and expressions are "visible" or can be referenced. If a variable or other expression is not "in the current scope," then it is unavailable for use. Scopes can also be layered in a hierarchy, so that child scopes have access to parent scopes, but not vice versa.

### Event Loop/讲讲 JavaScript 中的事件循环机制/事件循环/怎么理解 JavaScript 的并发模型

https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop

JavaScript has a runtime model based on an event loop, which is responsible for executing the code, collecting and processing events, and executing queued sub-tasks. This model is quite different from models in other languages like C and Java.

A JavaScript runtime uses a message queue, which is a list of messages to be processed. Each message has an associated function that gets called to handle the message.

At some point during the event loop, the runtime starts handling the messages on the queue, starting with the oldest one. To do so, the message is removed from the queue and its corresponding function is called with the message as an input parameter. As always, calling a function creates a new stack frame for that function's use.

The processing of functions continues until the stack is once again empty. Then, the event loop will process the next message in the queue (if there is one).

JavaScript 主线程在运行时，如果发现异步方法，会将它们放入异步队列中，同步方法则放入同步执行栈中依次执行。
异步队列中的代码只有在同步执行栈被清空后才有机会执行。
异步队列又分为 Macro Tasks 队列（宏任务队列）和 Micro Tasks 队列（微任务队列），在执行每一个 Macro Task 之前，总是会先执行 Micro Tasks 队列中的代码（若有），当 Micro Tasks 被清空之后，再去执行 Macro Task。

### Fetch 的 Promise 对象返回什么，`resolve` 还是 `reject`

如果遇到网络故障，`fetch() promise` 将会 `reject`，带上一个 `TypeError` 对象。虽然这个情况经常是遇到了权限问题或类似问题——比如 `404` 不是一个网络故障。想要精确的判断 `fetch()` 是否成功，需要包含 `promise resolved` 的情况，此时再判断 `Response.ok` 是不是为 `true`。

```
fetch('flowers.jpg').then(function(response) {
  if(response.ok) {
    return response.blob();
  }
  throw new Error('Network response was not ok.');
}).then(function(myBlob) { 
  var objectURL = URL.createObjectURL(myBlob); 
  myImage.src = objectURL; 
}).catch(function(error) {
  console.log('There has been a problem with your fetch operation: ', error.message);
});
```

### Fetch API 相对于传统的 Ajax 有哪些改进

1. Fetch 返回 Promise 对象。
2. 在默认情况下 Fetch 不会接受或者发送 Cookies。

### 讲一讲箭头函数不适用的场景

### ES6 对数组新增了哪些功能/讲讲 ES6 熟悉的部分

### 描述一下暂时性死区，并写一个例子，`typeof` 是一个安全操作符吗

### 了解 Proxy 吗

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

### `for...of` 和普通 `for` 在 `async` 和 `await` 时区别（顺序，乱序）

### 各种循环哪个性能更好/`for` 相关问题

### 词法分析和词法作用域生成什么

### 如何模拟多线程（Worker）

### 什么是高阶函数（higher-order），有什么应用场景

高阶函数是将一个或多个函数作为参数的函数，它用于数据处理，也可能将函数作为返回结果。高阶函数是为了抽象一些重复执行的操作。一个典型的例子是 map，它将一个数组和一个函数作为参数。map 使用这个函数来转换数组中的每个元素，并返回一个包含转换后元素的新数组。JavaScript 中的其他常见示例是 forEach、filter 和 reduce。高阶函数不仅需要操作数组的时候会用到，还有许多函数返回新函数的用例。Function.prototype.bind 就是一个例子。

### JavaScript 和原生如何交互（桥接）

### 如何跳出 `reduce`

https://blog.mazey.net/1666.html

### 如何迭代一个未知对象

https://blog.mazey.net/1562.html

### 如何判断一个动画何时结束

```
// animationend 事件在 CSS 动画完成后触发。(IE9及更早 IE 版本不支持)
var x = document.getElementById("myDIV");
// Chrome, Safari 和 Opera 代码
x.addEventListener("webkitAnimationEnd", myStartFunction);
// 标准语法
x.addEventListener("animationend", myStartFunction);
// transitionend 事件在 CSS 完成过渡后触发。 (IE9及更早 IE 版本不支持)
// Safari 3.1 到 6.0 代码
document.getElementById("myDIV").addEventListener("webkitTransitionEnd", myFunction);
// 标准语法 document.getElementById("myDIV").addEventListener("transitionend", myFunction);
// 其他注意:
// Internet Explorer 8 及更早 IE 版本不支持 addEventListener()方法。
```

### 如何判断⼀个对象是否为数组

如果浏览器⽀持 `Array.isArray()` 可以直接判断，否则需进⾏必要判断。

```
/**
 * 判断⼀个对象是否是数组，参数不是对象或者不是数组，返回false
 *
 * @param {Object} arg 需要测试是否为数组的对象
 * @return {Boolean} 传⼊参数是数组返回true，否则返回false
 */
function isArray(arg) {
    if (typeof arg === 'object') {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return false
}
```

### `call`、`apply`、`bind` 的区别是什么

1\. `call`、`apply` 的区别：

第⼀个参数都是要改变上下⽂的对象，⽽ `call` 从第⼆个参数开始以参数列表的形式展现，`apply` 则是把除了改变上下⽂对象的参数放在⼀个数组里面。

2\. `call`、`apply` 与 `bind` 的区别：

`call` 和 `apply` 改变了函数的 `this` 上下⽂后便执⾏该函数，⽽ `bind` 则是返回改变了上下⽂后的⼀个函数。

### 什么是 JavaScript 的深拷⻉，如何实现⼀个深拷⻉

深拷⻉是指创建⼀个新的对象和数组，将原对象的各项属性的“值”（数组的所有元素）拷⻉过来，是“值”⽽不是“引⽤”。

```
// 最简单粗暴的深拷⻉
// 但是函数和正则不能被正确处理
JSON.parse(JSON.stringify([1, 2, 3, 4]))
```

### JavaScript 最常⻅的垃圾回收⽅式是什么

1\. 标记清除

当变量进⼊执⾏环境是，就标记这个变量为“进⼊环境”。当变量离开环境时，则将其标记为“离开环境”。

2\. 引⽤计数

跟踪记录每个值被引⽤的次数。当声明了⼀个变量并将⼀个引⽤类型赋值给该变量时，则这个值的引⽤次数就是 1。相反，如果包含对这个值引用次数变成 0 时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间回收回来。

### 宿主对象（host objects）和原生对象（native objects）的区别是什么

原生对象是由 ECMAScript 规范定义的 JavaScript 内置对象，比如 String、Math、RegExp、Object、Function 等等。

宿主对象是由运行时环境（浏览器或 Node）提供，比如 window、XMLHTTPRequest 等等。

### 什么是变量提升

变量提升（hoisting）是用于解释代码中变量声明行为的术语。使用 `var` 关键字声明或初始化的变量，会将声明语句“提升”到当前作用域的顶部。但是，只有声明才会触发提升，赋值语句（如果有的话）将保持原样。

### JavaScript 有哪些基本数据类型

```
undefined / null / string / boolean / number / symbol(ES6)
```

### 什么是 Typed Arrays，和传统数组有什么区别

JavaScript 类型数组（JavaScript Typed Arrays）是一种类似数组的对象，它由 ArrayBuffer 、 TypedArray 、 DataView 三类对象构成，通过这些对象为 JavaScript 提供了访问二进制数据的能力。

它们速度快、效率高、健壮，在内存分配时也足够智能。

## Security/前端安全

### Front-End Security/前端安全问题有哪些/前端常见的安全问题/前端安全相关，邮件中链接（XSS、XSF?）攻击如何预防/常⻅的 Web 安全漏洞有哪些，如何防范

1\. XSS (Cross Site Script)，跨站脚本攻击

原理：恶意攻击者往 Web ⻚⾯⾥插⼊恶意可执⾏⽹⻚脚本代码，当⽤户浏览该⻚之时，嵌⼊其中 Web ⾥⾯的脚本代码会被执⾏，从⽽可以达到恶意攻击用户的目的。

防范：对能接受⽤户输⼊的参数进⾏过滤和转义，并且严格管理 cookie 的读写权限。

2\. CSRF (Cross-Site Request Forgery) 跨站请求伪造攻击

原理：利⽤⽹站对于⽤户⽹⻚浏览器的信任，挟持⽤户当前已登陆的 Web 应⽤程序，去执⾏并⾮⽤户本意的操作。

防范：验证 HTTP Referer 字段，并且为每个⽤户⽣成⼀个唯⼀的 token 进⾏验证。

## React

### The Order of Lifecycle Events among Components/父组件和子组件渲染顺序，其中埋点打印顺序

https://stackoverflow.com/questions/58352375/what-is-the-correct-order-of-execution-of-useeffect-in-react-parent-and-child-co

You can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined.

So all of these lifecycle methods are called after the component is mounted and when component is mounted the child components inside that component have already been mounted and their lifeCycle have been called already.

https://stackoverflow.com/questions/44654982/in-which-order-are-parent-child-components-rendered

```
Parent constructor
Parent componentWillMount
Parent render start
Parent render end
Child1 constructor
Child1 componentWillMount
Child1 render
Child2 constructor
Child2 componentWillMount
Child2 render
Child1 componentDidMount
Child2 componentDidMount
Parent componentDidMount
```

### Virtual DOM vs. Real Dom/虚拟 Dom 与直接操作 Dom 的区别，什么时候用直接操作 Dom，什么时候用虚拟 Dom/虚拟 Dom 的性能一定最优吗

https://medium.com/devinder/react-virtual-dom-vs-real-dom-23749ff7adc9

### React `useEffect`、`useLayoutEffect`、`render()` 执行顺序

### React Hooks 和 Class Component 区别

### React Hooks 如何模拟生命周期，用的方法名叫什么

### Optimizing React Component/工作中做过哪些组件优化/怎么减少组件更新频率

https://juejin.cn/post/6965747225154732069

Fiber 本质上是一个虚拟的堆栈帧，新的调度器会按照优先级自由调度这些帧，从而将之前的同步渲染改成了异步渲染，在不影响体验的情况下去分段计算更新。

- 组件卸载前进行清理操作。
- 减少渲染。

1\. 纯组件 `PureComponent`

纯组件会对组件输入数据进行浅层比较，如果当前输入数据和上次输入数据相同，组件不会重新渲染。
比较引用数据类型在内存中的地址是否相同，比较基本数据类型的值是否相同。
类组件继承 `PureComponent`，函数组件使用 `memo` 方法。

```
class PureChildComponent extends React.PureComponent { render() { console.log("PureChildComponent") return <div>{this.props.name}</div> } }
```

和进行 diff 比较操作相比，浅层比较将消耗更小的性能。diff 操作会重新遍历整棵 virtualDOM 树，而浅层比较只操作当前组件的 `state` 和 `props`。

2\. 深层比较 `shouldComponentUpdate`

纯组件只能进行浅层比较，要进行深层比较，使用 `shouldComponentUpdate`，它用于编写自定义逻辑。

```
shouldComponentUpdate(nextProps, nextState) { if (this.state.name !== nextState.name || this.state.age !== nextState.age) { return true } return false }
```

3\. 函数组件变成纯组件 `React.memo` vs. `Hooks`

将函数组件变成纯组件，将当前 `props` 和上一次的 `props` 进行浅层比较，如果相同就阻止组件重新渲染。

```
function ShowName({ name }) { console.log("showName render...") return <div>{name}</div> } const ShowNameMemo = memo(ShowName)
```

4\. 组件懒加载 `lazy()`

```
const Home = lazy(() => import(/* webpackChunkName: "Home" */ "./Home"))
const List = lazy(() => import(/* webpackChunkName: "List" */ "./List"))
```

5\. 使用 `Fragment` 避免额外标记

```
import { Fragment } from "react" function App() { return ( <Fragment> <div>message a</div> <div>message b</div> </Fragment> ) }
```

6\. 不要使用内联函数定义

在使用内联函数后，`render` 方法每次运行时都会创建该函数的实例，导致 React 在进行 Virtual DOM 对比时，新旧函数对比不相等，导致 React 总是为元素绑定新的函数，而旧的函数实例又要交给垃圾回收器处理。

7\. 避免使用内联样式属性

当使用内联 `style` 为元素添加样式时，内联 `style` 会被编译成 JavaScript 代码，通过 JavaScript 代码将样式规则映射到元素的身上，浏览器就会花费更多的时间执行脚本和渲染 UI，从而增加了组件的渲染时间。

8\. 避免重复无限渲染

当应用程序状态发生更改时，React 会调用 `render` 方法，如果在 `render` 方法中继续更改应用程序的状态，就会发生 `render` 方法递归调用导致应用报错。

9\. 优化渲染条件

频繁地挂载和卸载组件是一项很耗性能的操作，为了确保应用程序的性能，应该减少组件挂载和卸载的次数。

10\. 为组件创建错误边界 优化用户体验

错误边界是一个 React 组件，可以捕获子级组件在渲染时发生的错误，当错误发生时，可以将错误记录下来，可以显示备用 UI 界面。

11\. 为列表数据添加唯一标识 `key`

当需要渲染列表数据时，我们应该为每一个列表项添加 `key` 属性，`key` 属性的值必须是唯一的。

`key` 属性可以让 React 直接了当地知道哪些列表项发生了变化，从而避免了 React 内部逐一遍历 Virtual DOM 查找变化所带来的性能消耗，避免了元素因为位置变化而导致的重新创建。

12\. 依赖优化

NPM 依赖按需加载。

### React communication between Components

1\. 父子通信

父组件通过 `props` 传递数据给子组件，子组件通过调用父组件传来的函数传递数据给父组件，这两种方式是最常用的父子通信实现办法。

这种父子通信方式也就是典型的单向数据流，父组件通过 `props` 传递数据，子组件不能直接修改 `props`，而是必须通过调用父组件函数的方式告知父组件修改数据。

2\. 兄弟组件通信

对于这种情况可以通过共同的父组件来管理状态和事件函数。比如说其中一个兄弟组件调用父组件传递过来的事件函数修改父组件中的状态，然后父组件将状态传递给另一个兄弟组件。

3\. 跨多层次组件通信

如果你使用 16.3 以上版本的话，对于这种情况可以使用 Context API。

4\. 任意组件

这种方式可以通过 Redux 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况。

### Redux Introduction

https://medium.com/leanjs/introduction-to-redux-redux-explained-with-very-simple-examples-b39d7967ceb8

The three principles

1. The state of the app is stored in one JavaScript object.
2. The state is read-only, but we can change the state by describing a change with another JavaScript object called action.
3. Changes are executed by pure functions called reducers. A reducer accepts the current state and an action and returns a new state or the same state.

## Vue

### Vue 生命周期，渲染顺序

![](https://blog.mazey.net/wp-content/uploads/2022/04/lifecycle-e1650872947145.png)

### Vue 和 React 和渲染更新有什么不同/React 和 Vue 区别，各有什么优缺点

### Vue3 有用过吗

### 了解过 Vite 吗

### Vue Communication/Vue 里面有几种通信方式

https://blog.mazey.net/982.html

### `v-for` and `v-if` in Vue/Vue 中 `v-for` 和 `v-if` 如何组合使用

https://vuejs.org/guide/essentials/conditional.html#v-if-with-v-for

When `v-if` and `v-for` are both used on the same element, `v-if` will be evaluated first.

https://stackoverflow.com/questions/48933606/v-for-and-v-if-not-working-together-in-vue-js

Why don't use the power of Computed Properties ?

If you don't mind your view continuing in the html with "display:none" you can use `v-show` together with `v-for` without any problems.

### `v-model`/Vue 中的 `v-model` 原理/讲讲 Vue 里面 `v-model`

https://learnvue.co/2021/01/everything-you-need-to-know-about-vue-v-model/#what-is-vue-v-model

Vue `v-model` is a directive that provides two-way data binding between an input and form data or between two components.

The difference between the two is that v-model provides two-way data binding.

However, `v-bind` only binds data one way.

By default, `v-model` syncs with the state of the Vue instance (data properties) on every input event. This includes things like gaining/losing focus, being blurred, etc.

---

We have our parent component setup, so let's access it from our child component.

There are two things we have to do inside CustomTextInput.vue:

- Accept our v-model value as a prop
- Emit an update event when our input changes

### From `template` to VDOM/`template` 模板中的字符串如何进行解析

https://vuejs.org/guide/extras/rendering-mechanism.html#rendering-mechanism

Here, vnode is a plain JavaScript object (a "virtual node") representing a `<div>` element. It contains all the information that we need to create the actual element. It also contains more children vnodes, which makes it the root of a virtual DOM tree.

A runtime renderer can walk a virtual DOM tree and construct a real DOM tree from it. This process is called mount.

If we have two copies of virtual DOM trees, the renderer can also walk and compare the two trees, figuring out the differences, and apply those changes to the actual DOM. This process is called patch, also known as "diffing" or "reconciliation".

The main benefit of virtual DOM is that it gives the developer the ability to programmatically create, inspect and compose desired UI structures in a declarative way, while leaving the direct DOM manipulation to the renderer.

---

```
<div>
  <div>foo</div> <!-- hoisted -->
  <div>bar</div> <!-- hoisted -->
  <div>{{ dynamic }}</div>
</div>
```

The foo and bar divs are static - re-creating vnodes and diffing them on each re-render is unnecessary. The Vue compiler automatically hoists their vnode creation calls out of the render function, and reuses the same vnodes on every render. The renderer is also able to completely skip diffing them when it notices the old vnode and the new vnode are the same one.

In addition, when there are enough consecutive static elements, they will be condensed into a single "static vnode" that contains the plain HTML string for all these nodes (Example). These static vnodes are mounted by directly setting innerHTML. They also cache their corresponding DOM nodes on initial mount - if the same piece of content is reused elsewhere in the app, new DOM nodes are created using native cloneNode(), which is extremely efficient.

### 自己封装过哪些组件

### `vue-router` 的实现

### Virtual Dom 优势/Virtual Dom 的优势，Node 树如何 Diff 差异，复杂度是什么

### Vue 的原理

### Vue 中的 `key` 有什么作用

https://juejin.im/post/5dbbecadf265da4d1d32f575

### 如何定制 UI 组件

### Vue（相对于其他框架）有什么优势

### 两个不相关的组件通信（EventBus 观察者/被观察者）

## Webpack

### Webpack 打包构建速度如何优化

### Loader vs. Plugin/Webpack 中 Loader 和 Plugin 区别

### Frequently-Used Loader and Plugin/有哪些常用的 Loader 和 Plugin

https://linguinecode.com/post/top-webpack-plugins

### Babel 如何工作（AST）

### Webpack 如何做 tree shaking

### Webpack 和 Rollup、Gulp 区别/每个打包工具使用的理由，Webpack 相对于 Rollup 的优势

### Webpack 热更新实现原理是什么

1. Webpack 编译期，为需要热更新的 entry 注入热更新代码(EventSource 通信)
2. 页面首次打开后，服务端与客户端通过 EventSource 建立通信渠道，把下一次的 hash 返回前端
3. 客户端获取到 hash，这个 hash 将作为下一次请求服务端 hot-update.js 和 hot-update.json 的 hash
4. 修改页面代码后，Webpack 监听到文件修改后，开始编译，编译完成后，发送 build 消息给客户端
5. 客户端获取到hash，成功后客户端构造 hot-update.js script 链接，然后插入主文档
6. hot-update.js 插入成功后，执行 hotAPI 的 createRecord 和 reload 方法，获取到 Vue 组件的 render方法，重新 render 组件， 继而实现 UI 无刷新更新。

## NPM

### `peerDependencies` 和 `dependencies` 的区别

https://blog.mazey.net/1623.html

### NPM Test/NPM 的单测做过吗

https://github.com/facebook/jest

### How to update NPM/如何进行的升级/NPM 如何更新版本

https://bytearcher.com/articles/semver-explained-why-theres-a-caret-in-my-package-json/

- y.x.x - major - backward-incompatible change increments the major number
- x.y.x - minor - new functionality that is backward compatible increments the minor number
- x.x.y - patch - simple bug fix to existing functionality increments the patch number

首次 `npm install`：

caret (^) - ^3.9.2 - 3.*.*
tilde (~) - ~3.9.2 - 3.9.*

如果已经安装过了，需要 `npm update` 来更新。

## Node.js

### Node.js 和 Golang 处理多线程的区别

### Node.js 如何进行多线程工作，数据如何共享传递

### Node.js 需要考虑哪些风险，面对 DDOS 怎么办

### `import` vs. `require`/`import` 和 `require` 的区别，esModule 的原理

https://stackoverflow.com/questions/46677752/the-difference-between-requirex-and-import-x

1\. Load/加载

You can't selectively load only the pieces you need with require but with import, you can selectively load only the pieces you need, which can save memory.Loading is synchronous(step by step) for require on the other hand import can be asynchronous(without waiting for previous import) so it can perform a little better than require.

2\. Size/体积

Major difference is in require, entire JS file is called or included. Even if you don't need some part of it.

### Egg.js and Koa/Egg.js 与 Koa 的关系

https://www.eggjs.org/intro/egg-and-koa

Egg is built around the Koa. On the basis of Koa model, Egg implements enhancements one step further.

### Koa Onion Model/讲一讲 Koa 的洋葱模型

https://developpaper.com/node-koas-onion-model-in-simple-terms/

The onion model refers to `next()` The function is a split point, which is executed from outside to inside first Request And then execute from the inside out Response The logic of. Through the onion model, the communication between multiple middleware becomes more feasible and simple. The principle of its implementation is not very complex, mainly compose method.

![Koa Onion Model](https://blog.mazey.net/wp-content/uploads/2022/04/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67.png)

All the requests will be executed twice during one middleware. Compared to Express middleware, it is very easy to implement post-processing logic. You can obviously feel the advantage of Koa middleware model by comparing the compress middleware implementatio in Koa and Express.

### Node 和浏览器端 JavaScript 事件管理机制的区别

## MySQL

### MySQL 中如何解决性能问题，如何建索引

### MySQL 慢查询如何解决

## Design/系统设计/技术方案

### 如何处理异步，比如队列进行，一直有 10 个任务在运行

https://blog.xizhibei.me/2019/07/15/asynchronous-task-queue-in-golang/

Worker Pool

### 你会如何优化一个前端项目/前端项目怎么优化/如何优化一个页面

### 国际化是如何实现的/多语言是动态获取还是编译阶段实现的

### 点击一个按钮页面卡顿住了，如何排查原因

### MVC 和 MVVM 的区别（单向 双向）

### 埋点上报如何优化

### OOP 的三大特征

### 实现轮播，大数据量的情况下设计数据结构

### 设计点赞和踩的前后端

### 如何写/设计一个组件

### 什么是单向数据流和双向数据绑定

Angular 1.x 基于双向数据绑定，而 React，Vue，Elm 等基于单向数据流架构。

单向数据流指只能从一个方向来修改状态。与单向数据流对对应的是双向数据流（也叫双向绑定）。在双向数据流中，Model（可以理解为状态的集合） 中可以修改自己或其他 Model 的状态， 用户的操作（如在输入框中输入内容）也可以修改状态。

## Code/编程题

### 实现 `template`

https://blog.mazey.net/1664.html

```
str = "my name is {{name}}, age is {{age}}"
data = { name: 'tom', age: '15'}
template(str, data)
```

### 实现 `Promise.all`

```
//let myPromiseAll
Promise.all = (promises) => {
  let responses = [];
  let errorResp = [];
  return new Promise((resolve, reject) => {
    /** Loop over promises array **/
    promises.forEach(async (singlePromise, i) => {
      try {
        /** wait for resolving 1 promise **/
        let res = await singlePromise;
        responses.push(res);
        if (i == promises.length - 1) {
          if (errorResp.length > 0) {
            reject(errorResp);
          } else {
            // resolve(esponses)
            // To know our cutom promise function returning result
            resolve("custom promise ::" + responses);
          }
        }
      } catch (err) {
        errorResp.push(err);
        reject(err);
      }
    });
  });
};

let p1 = Promise.resolve("Promise1 resolved");

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 2 resolved after 2 seconds");
  }, 1000);
});

Promise.all([p1, p2]).then(
  (res) => {
    console.log("Response => ", res);
    document.write("<b>Response => </b>" + res);
  },
  (err) => {
    console.log("error =>", err);
  }
);
```

### 实现 `JSON.parse`

https://blog.mazey.net/2751.html

### 模拟实现 `Array.prototype.flat()`/数组方法的 Polyfill 实现

### 对 `Ajax` 请求进行封装

### 实现 `reduce`

### 什么是 JavaScript 函数防抖，如何实现防抖

函数防抖（Debounce）：当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。

```
function debounce(func, wait) {
    var timeout
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait)
    }
}
```

## Algorithm/算法

### 回溯算法

### 能说一下快速排序的思路吗

```
const arr = [5, 2, 1, 5, 3, 9]
function quickSort (arr) {
    // 数组只有一个元素的时候，lesser 和 greater 返回空数组。
    if (arr.length === 0) {
        return []
    }
    const [lesser, greater] = [[], []]
    const pivot = arr[0]
    for (let v of arr.filter((v, i) => i > 0)) {
        if (v < pivot) {
            lesser.push(v)
        } else {
            greater.push(v)
        }
    }
    return quickSort(lesser).concat(pivot, quickSort(greater))
}
console.log(quickSort(arr))
```

### 如何判断一个字符串是回文，说一下思路/最大回文数乘积

### 合并两个有序链表，返回合并后的有序链表

```
/*
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
https://leetcode.com/problems/merge-two-sorted-lists/solution/
*/

// Node类
function Node (element) {
  this.element = element;
  this.next = null;
}

const mergeTwoLists = function(l1, l2) {
  let list = new Node()
  let head = list
  
  while (l1 !== null && l2 !== null) {

  // Select the smallest value from either linked list,
  // then increment that list forward.
      if (l1.val < l2.val) {
          list.next = new Node(l1.val)
          l1 = l1.next
      } else {
          list.next = new Node(l2.val)
          l2 = l2.next
      }
      
      list = list.next
  }
  
// It's possible that one linked list is shorter than the other so we just
// add on the remainder of the last linked list. It's already sorted :)
  if (l1 !== null)
      list.next = l1
  if (l2 !== null)
      list.next = l2
  
// return .next because this first element in the linkedlist is empty
  return head.next
};
```

### Input: nums = [-1,0,3,5,9,12], target = 9 Output: 4

Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.

```
// Example 1:
// Input: nums = [-1,0,3,5,9,12], target = 9
// Output: 4
// Explanation: 9 exists in nums and its index is 4

// Example 2:
// Input: nums = [-1,0,3,5,9,12], target = 2
// Output: -1
// Explanation: 2 does not exist in nums so return -1

// O(log n)
function bar({ nums = [], target, start, end } = {}) {
  // verf
  // ...

  if (typeof start === 'undefined' && typeof end === 'undefined') {
    const len = nums.length;
    start = 0;
    end = len - 1;
  }

  if (start > end) {
    return -1;
  }

  
  const pointIndex = Math.floor(start + (end - start) / 2);
  if (target === nums[pointIndex]) {
    return pointIndex;
  } else if (target < nums[pointIndex]) {
    return bar({ nums, target, start: start, end: pointIndex - 1 });
  } else if (target > nums[pointIndex]) {
    return bar({ nums, target, start: start + 1, end });
  }
}
```

### LRU: Least Recently Used/缓存淘汰算法

### Merge and Remove Duplicate Elements from Arrays

```
const arr1 = [1, 3, 6, 7, 9];
const arr2 = [9, 3, 4, 7, 10];

function foo (a, b) {
  return [...new Set([...a, ...b])];
}

const aaa = foo(arr1, arr2);

console.log('aaa', aaa);
```

### 二叉树的后序遍历

### 子序列宽度之和

### 排序，二分，边界情况怎么办

### 反转二叉树/旋转红黑树

### 多个直线构建最大多边形

### 二叉树最大宽度

## Project/项目经历

### 讲一讲 XXXX 的优化，折损率是什么意思

### XXXX 是公益性质的吗

### XXXX 里面的错误监控怎么做的

### 讲讲 XXXX 你都做了什么，如果继续做，你有什么优化方案

### XXXX 中数据是真实的吗

### 最近有没有做什么涉及系统设计方面的工作

## Soft Skills/软技能/其他问题

### How do programmers approach a new project?/接手一个新项目你会怎么做/刚接手一个项目，你会怎么做

https://blog.csdn.net/qq_37177115/article/details/114028440

1. 沟通，问一下业务重点、难点。
2. 看文档，就重点和难点，系统的看下技术文档和需求文档，迅速了解整个项目。
3. 运行代码，将代码运行起来，验证文档和沟通中的内容。

https://www.quora.com/How-do-programmers-approach-a-new-project

There are 2 approaches:

1. Top down.
2. Bottom up.

![](https://blog.mazey.net/wp-content/uploads/2022/04/main-qimg-7dea78cd132261dec439672325472270.gif)

### What are the things most important to you in a job?/一份工作，你更注重什么

https://everydayinterviewtips.com/common-interview-question-what-are-the-three-things-most-important-to-you-in-a-job/

1\.Positive Environment

Growth potential is the most important thing to me in any role, within my own role, or within the company in line with the company's overall growth. I'd love to work for a company that is innovative and always looking for new opportunities to expand. And I look for companies who have a positive and adaptive culture, and trust.

2\. Other Potential Answers

- Job is stimulating & challenging
- Able to learn new things and develop your skill set
- Achieve measurable results
- Feel valued and a core part of the team
- Opportunities to grow and progress within the company
- Be part of a positive culture where contributions are appreciated
- Learn from peers and supervisors
- Achieve a healthy work/life balance

### What new skills did you learn recently?/最近学习什么新技术/最近有研究哪些新技术/最近在学习什么

https://www.indeed.com/career-advice/interviewing/what-is-one-thing-you-learned-recently

1\. Reflect using the STAR method

- Situation: The first step is providing background information and providing context about the situation or challenge that you're explaining to the interviewer.
- Task: Next, define your responsibility in the scenario mentioned above.
- Action: After explaining your task, explain the steps you took to address the challenging situation.
- Result: Finally, describe the result your actions achieved.

2\. Example answer: Learned new technology

"Last year, my supervisor mentioned that no one had updated our company's website in quite some time, so I volunteered to improve it for them. I signed up for an eight-week web designing course and spent my evenings completing the coursework. By the time I finished the course, I had already started updating the website by making the interface easier for consumers to browse.

I also included more general information regarding the company's history and the products we sell. My supervisor's manager thanked me for making the changes, and they've offered several other technology-based courses for me to attend in the time since I finished the website."

### Cultivate Engineers/工作中如何让组员按需发展，如何培养组员/在带领新人的过程中有哪些自豪的事情

https://daily.dev/blog/how-to-introduce-a-new-developer-to-a-project

https://www.linkedin.com/pulse/how-cultivate-engineers-industry-thought-leaders-rob-hawse

https://www.indeed.com/career-advice/career-development/team-management-skills

Team management is a manager or organization's ability to lead a group of people in accomplishing a task or common goal. Effective team management involves supporting, communicating with and uplifting team members so they perform to the best of their abilities and continue to grow as professionals. 

1\. Focus on serving rather than managing

Achieving both individual/ˌɪndɪˈvɪdʒuəl/ and team goals. 

As opposed/əˈpəʊzd/ to merely/ˈmɪəli/ giving orders/'ɔːdərs/ and delegating/ˈdelɪɡət/ tasks/tɑːsk/.

2\. Don't always assume you're right

Keep an open mind.

Have a constructive/kənˈstrʌktɪv/ discussion/dɪˈskʌʃn/.

3\. Make transparency a priority

Practicing/ˈpræktɪsɪŋ/ transparency/trænsˈpærənsi/ through open and consistent/kənˈsɪstənt/ communication allows your team members to feel a sense of respect which is important for overall job satisfaction/ˌsætɪsˈfækʃn/ and productivity/ˌprɒdʌkˈtɪvəti/. 

4\. Set boundaries

Team members should know that your job is to ensure/ɪnˈʃʊə(r)/ their work gets done efficiently/ɪˈfɪʃ(ə)ntli/ and that, when necessary, you will take disciplinary/ˌdɪsəˈplɪnəri/ action.

5\. Provide a positive workspace

Brighten your team's day and foster a culture of happiness within the workspace.

6\. Emphasize constant and effective communication within the workplace

Provide encourage feedback from your employees. 

7\. Encourage and nurture your team's growth

Assist team members in their professional development.

8\. Be open to change

Different team members may have different approaches and ways of doing things.

---

Bad answer: Be Happy. Shame on it.

### The product manager makes a lot of demands./如果产品经理，提很多需求，你会怎么办/产品的不合理需求如何处理

http://www.woshipm.com/pmd/131254.html

### Collaborate between Departments/如何跨部门协作，如何让别人协作你

https://www.workzone.com/blog/9-ways-to-improve-collaboration-between-departments/

### Knowledge Breadth and Time Management/如果你学习其他技能的话，那你的自身技能（前端）不就落后其他人了吗，毕竟每个人的精力是有限的

跨界会给你带来难以估量的好处，一个角色做久了，难免会产生一些盲点。这时候，换个视角，从其他角色的角度来看待你的工作，又会有很多新的发现。而且不仅如此，很可能你会发现之前很麻烦，很难搞定的事情，在新的方法/视角下变得很容易。

### What have you learned from your work?/从最近工作中学到什么/那你在最近这份工作有获得什么成长吗

https://www.quora.com/What-have-you-learned-from-your-previous-job-personally-and-professionally

Don't constrain your life only to the job.

### Career Planning/你的职业发展如何计划的/职业规划

https://zhuanlan.zhihu.com/p/134299187

你个人的成功是建立在你对集体的价值之上的，所以对你来说重要的事，往往对其他人也是重要的。除了你自己的立场，你还必须站在其他人的立场，判断某件事是否重要。

Business and Skills.

### Challenging Things/做过比较有成就性/挑战性的事情是什么，有什么事情是可以改善的/讲讲做的比较亮点的项目/谈谈遇到过的难解决的问题

- SDK Front-End and Back-End. Gray + People Bags.
- Account Center, + Node.js&Docker. 
- Community FE Performance.
- IDAP Data Visualization, Compatibility among Different Browsers.

### Owner Project/让你主导一个需求该怎么做

https://upstreamplugin.com/difference-project-owner-project-manager/

What's the difference between these two roles? Here's the short version:

- The Project Owner looks at the big picture.
- The Project Manager looks at the daily details of the project.

Here's a slightly different way to look at it:

- The Project Owner is in charge of defining the scope of the project, the “What?” and the “Why?”. They are responsible for collecting all the requirements for a product.
- The Project Manager is in charge of getting things done, the “How?” and the “Who?”. The Project Manager is responsible for completing the project within an established time and budget.

### Reason of Leaving/你为何离职

- Don't like work content. I have done repeatitive content about consulting service for one year because the changing of organization.
- My leader and work content changed.

### Reason of Changing jobs/之前为何换工作这么频繁

- It's my reasons. I try different skills that i may like, because i don't know what skill i like.(PHP to FE)
- Change Cities for work and live. Arrange life routine. Nanjing is not so friendly for youngers and internet development.(Expensive House Price and Few Companies)
- Try to continue working for company. But I can't stand the changing of organization.(Work Content, Leader Communication and Internal Power Struggle)

### Project Personnel/现在的项目组多少人，前端和后端各多少人

### 你的前端深度如何

### 说说最近项目中比较有技术含量的是哪个

### 遇到的比较难受的事情

### 最近的看的哪些书呢

### Other Offers/手上还有在谈的 Offer 吗，面试情况如何

Yes, I have some offers this month. 2022-05-23

### XX 公司给你的薪资构成是怎么样的，Base 是多少，可以接受股票吗，可以接受什么比例呢

### XX 行业最近招聘也不少啊，你是怎么打算的

## 既然你现在有多个 Offer，那你对我司入职意愿如何呢

### 你的期望薪资是多少

### 喜欢玩游戏吗

### 对经纪人怎么看，觉得经纪人有哪些特征是最重要的

### 兴趣爱好

### 能接受加班吗

### 现在的薪资

### 日常有使用 XXX 吗

(end)
