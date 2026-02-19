# 前端页面性能监控接入文档

![前端页面性能监控接入文档](http://blog.mazey.net/wp-content/uploads/2025/09/SDK_SF_7x3.jpg)

介绍了如何通过 JS-SDK 部署前端性能监控，包括项目创建、代码部署和数据查看流程。提供了性能埋点指标及其计算方法，并列出了 Performance API 的关键字段和含义，帮助开发者全面了解网页性能数据的采集与分析。

- [前端页面性能监控接入文档](#前端页面性能监控接入文档)
  - [一、创建项目](#一创建项目)
  - [二、代码部署](#二代码部署)
  - [三、查看数据](#三查看数据)
  - [附录: 性能埋点指标](#附录-性能埋点指标)

## 一、创建项目

首先在[**前端性能**](https://tool.mazey.net/mazey-workspace/#/monitor/perf)栏位新建项目 (Topic):

![](http://blog.mazey.net/wp-content/uploads/2021/08/feperf-20210824-w-600.png)

## 二、代码部署

JS-SDK 地址: `${BaseURL}/feperf/sdk/loader?topic=${topic}&rate=${rate}&action=${action}`

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| topic | String | 项目名称，例如: test |
| rate | Number | 采样率，0.01~1 => 1%~100% |
| action | String | 触发方式，manual 手动 (默认) auto 自动 |

要使用 JS-SDK 上报性能数据，需要在 </body> 标签前添加一段代码:

```html
<script src="${BaseURL}/feperf/sdk/loader?topic=test&rate=0.5&action=auto" id="feperf-sdk" defer></script>
```

如果想更加灵活的使用上报接口，也可以使用手动上报:

```html
<script src="${BaseURL}/feperf/sdk/loader?topic=test&rate=0.5" id="feperf-sdk"></script>
<script>
window.Feperf.ready.then(({ reportPerf }) => {
  reportPerf();
});
</script>
```

或者:

```javascript
import { loadScript } from 'mazey';

loadScript({
    url: '${BaseURL}/feperf/sdk/loader?topic=test&rate=0.77',
    id: 'feperf-sdk'
  }).then(() => {
    window.Feperf &&
      window.Feperf.ready.then(({ reportPerf }) => {
        reportPerf();
      });
  });
```

## 三、查看数据

部署完成后，第二天可查看数据监控曲线，数据每 30 分钟更新一次。

## 附录: 性能埋点指标

| 指标 | 字段 | 计算⽅法 |
| --- | --- | --- |
| * DNS 查询时间 | dns_time | domainLookupEnd - domainLookupStart |
| * 服务器连接时间 | tcp_time | connectEnd - connectStart |
| * 服务器响应时间 | response_time | responseStart - requestStart |
| * ⽩屏时间 | white_time | responseStart - navigationStart |
| * DomReady 总时间 | domready_time  | domContentLoadedEventStart - navigationStart |
| * 页面加载时间 | onload_time | loadEventStart - navigationStart |
| * EventEnd 总时间 | render_time | loadEventEnd -navigationStart |
| 上个⽂档卸载时间 | unload_time | unloadEventEnd - unloadEventStart |
| 重定向时间 | redirect_time | redirectEnd - redirectStart |
| 客户端⽩屏时间 | custom_white_time | renderTiming - navigationStart |
| SSL连接时间 | ssl_time | connectEnd - secureConnectionStart |
| ⽹⻚下载时间 | download_time | responseEnd - responseStart |
| FCP | first_contentful_paint_time | firstPaintTime |

Performance API 字典

| 名称 | 含义(值为时间戳) |
| --- | --- |
| redirectStart | 第⼀个HTTP重定向开始 |
| redirectEnd | 最后⼀个HTTP重定向完成 |
| domLoading | 浏览器开始解析⽹⻚DOM结构的时间 |
| domainLookupStart | 域名查询开始 |
| domainLookupEnd | 域名查询结束 |
| domInteractive | ⽹⻚dom树创建完成，开始加载内嵌资源的时间 |
| connectStart | HTTP请求开始向服务器发送 |
| connectEnd | 浏览器与服务器之间的连接建⽴ |
| requestStart | 浏览器向服务器发出HTTP或者开始读取本地缓存时 |
| responseStart | 浏览器从服务器收到 (或从本地缓存读取) 第⼀个字节 |
| responseEnd | 浏览器从服务器收到 (或从本地缓存读取，或从本地资源读取) 最后⼀个字节 |
| domContentLoadedEventStart | ⽹⻚DOMContentLoaded事件发⽣时，即当解析器发送DOMContentLoaded 事件，即所有需要被执⾏的脚本已经被解析 |
| domContentLoadedEventEnd | 当⽹⻚所有需要⽴即执⾏的脚本已经被执⾏，domReady的时间 (不论执⾏顺序) |
| domComplete | ⽹⻚dom结构⽣成时的时间戳 |
| loadEventStart | 当前⽹⻚load事件的回调函数开始执⾏ |
| loadEventEnd | 当前⽹⻚load事件的回调函数结束运⾏ |
| navigationStart | 浏览器处理当前⽹⻚的启动时间 |
| fetchStart | 浏览器发起http请求读取⽂档的毫秒时间戳 |
| connectStart | http请求开始向服务器发送的时间戳 |

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/5699.html>

(完)
