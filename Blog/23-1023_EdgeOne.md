# 玩转 EdgeOne｜深度探索并应用腾讯云边缘安全加速平台的缓存功能

![玩转 EdgeOne](http://blog.mazey.net/wp-content/uploads/2023/10/edge-blog-banner-v3-w1400.jpg)

腾讯云 EdgeOne 提供一体化加速与安全解决方案，支持 DDoS 防护、缓存优化等功能。默认缓存规则结合 HTTP 响应头信息，自定义规则引擎则允许精细化配置，如页面重定向、静态资源扩展和查询字符串过滤，提升性能与安全性。

- [玩转 EdgeOne｜深度探索并应用腾讯云边缘安全加速平台的缓存功能](#玩转-edgeone深度探索并应用腾讯云边缘安全加速平台的缓存功能)
  - [一、EdgeOne 产品简介](#一edgeone-产品简介)
    - [1.1 开通服务](#11-开通服务)
    - [1.2 部署服务](#12-部署服务)
  - [二、EdgeOne 的缓存功能详解](#二edgeone-的缓存功能详解)
    - [2.1 默认缓存配置](#21-默认缓存配置)
  - [2.2 自定义策略](#22-自定义策略)
    - [案例 1：指定页面不缓存](#案例-1指定页面不缓存)
    - [案例 2：指定页面重定向](#案例-2指定页面重定向)
    - [案例 3：扩展静态资源后缀](#案例-3扩展静态资源后缀)
    - [案例 4：过滤查询字符串](#案例-4过滤查询字符串)

## 一、EdgeOne 产品简介

腾讯云边缘安全加速平台 EdgeOne（Tencent cloud EdgeOne），基于腾讯边缘计算节点，提供了一体化的加速和安全解决方案。EdgeOne 服务不仅可以提供 DDoS 防护、Rate Limit、WEB 安全防护、API 安全防护等不同的安全防护服务，更重要的是，他具备强大的缓存功能，可以大大提升数据访问的速度和稳定性。

### 1\.1 开通服务

开通流程可以跟随官方文档「[从零开始快速接入 EdgeOne](https://cloud.tencent.com/document/product/1552/87601 "从零开始快速接入 EdgeOne")」。

![EdgeOne 提供安全加速一站式服务，为业务保驾护航](http://blog.mazey.net/wp-content/uploads/2023/10/EdgeOne-20231016-144707-w800.jpg)

### 1\.2 部署服务

待状态全面开“绿灯”后，就代表服务正常运行了。

![添加域名](http://blog.mazey.net/wp-content/uploads/2023/10/EdgeOne-20231016-152657-w800.jpg)

## 二、EdgeOne 的缓存功能详解

当客户端向 EdgeOne 边缘节点发起 HTTP 请求后，节点将判断当前文件是否命中缓存。如果未命中，则回源向源站发起请求获取最新文件。在源站正确响应文件后，EdgeOne 将根据用户设置的缓存规则结合平台默认缓存策略，对文件进行缓存。

这种缓存策略既保证了数据的实时性，又提高了数据访问的效率。由于边缘节点更贴近用户，这种策略有效地降低了数据访问时间延迟，避免了数据传输抖动，保障了大量数据传输的稳定性和有效性。

### 2\.1 默认缓存配置

![缓存配置](http://blog.mazey.net/wp-content/uploads/2023/10/EdgeOne-capture_054_w1000.jpg)

EdgeOne 的默认缓存策略基于 HTTP 响应头部信息。如果 `Cache-Control: private` 出现时，文件不被缓存。如果 `Cache-Control: s-maxage` 出现时，文件按设定时间缓存，多个响应头存在时，按 `s-maxage` > `max-age` > `Expires` 优先级决定缓存时间。无以上头部时，执行配置规则：若有 `Last-Modified`，根据其值计算缓存时间；若无 `Last-Modified`，则按文件后缀应用平台默认缓存规则，不同文件类型有不同默认缓存时间。

![默认文件缓存时间](http://blog.mazey.net/wp-content/uploads/2023/10/edge_one_images-w800-v1.png)

更多详情可见文档：[EdgeOne 内容缓存规则](https://cloud.tencent.com/document/product/1552/87651)

## 2\.2 自定义策略

EdgeOne 的规则引擎是一个强大的工具，他支持更细粒度的自定义配置。这意味着可以针对特定的子域名或请求 URL，配置与全局设置不同的缓存、访问和回源等规则。这种自定义配置的优先级更高，可以确保对特定请求的精细控制。规则引擎不仅可以自定义缓存规则，还支持其他配置功能。例如，可以使用 URL 重写功能来改变请求 URL 的结构，也可以修改 HTTP 头部信息，以改变服务器和客户端之间的交互方式。此外，规则引擎还允许自定义错误页面，以提供更个性化的用户体验。

![规则引擎支持更细粒度自定义配置](http://blog.mazey.net/wp-content/uploads/2023/10/EdgeOne-20231016-160103-w1100.png)

规则引擎关键术语：

![关键术语](http://blog.mazey.net/wp-content/uploads/2023/10/edge-one-ifelse-w600.png)

### 案例 1：指定页面不缓存

例如期望留言板页面 `http://blog.mazey.net/message-board` 永远是最新的内容。

![指定页面不缓存](http://blog.mazey.net/wp-content/uploads/2023/10/EdgeOne-20231016-161559-w1000.png)

### 案例 2：指定页面重定向

例如：

1. `http://blog.mazey.net/xmlrpc.php` 重定向至 `http://i.mazey.net/x/markdown/`。
2. `http://blog.mazey.net/wp-login.php` 重定向至 `http://i.mazey.net/bootstrap-blueprints/`。

![指定页面重定向](http://blog.mazey.net/wp-content/uploads/2023/10/EdgeOne-20231016-163005-w1000.png)

### 案例 3：扩展静态资源后缀

常规情况下，可以将静态资源的类型和缓存时间适当扩大些。

静态资源后缀：

```text
gif;png;bmp;jpeg;jpg;html;htm;shtml;xml;json;mp3;wma;flv;mp4;wmv;ogg;avi;doc;docx;xls;xlsx;ppt;pptx;txt;pdf;zip;exe;tat;ico;css;js;swf;apk;m3u8;ts
```

![静态资源后缀](http://blog.mazey.net/wp-content/uploads/2023/10/EdgeOne-20231016-164717-w1200.png)

### 案例 4：过滤查询字符串

因为 `http://blog.mazey.net/?s=123` 只需要保留查询参数 `s`，所以可以过滤掉不需要的查询参数，提升网站的性能，并规避部分 DDoS 攻击和安全问题。

![匹配类型](http://blog.mazey.net/wp-content/uploads/2023/10/edge-one-type-w800-v2.png)

另外，匹配类型也支持其他各种自定义需求。

![匹配类型](http://blog.mazey.net/wp-content/uploads/2023/10/edge-one-type-w800-v2.png)

总的来说，规则引擎是一个强大而灵活的工具，可以帮助网站更好地控制和优化网络服务。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/4114.html>

(完)
