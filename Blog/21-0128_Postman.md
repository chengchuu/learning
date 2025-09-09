# Postman 使用指南: 请求、变量、Runner 和脚手架 Newman

![Postman 使用指南: 请求、变量、Runner 和脚手架 Newman](http://blog.mazey.net/wp-content/uploads/2021/01/Postman_SF_7x3.jpg)

Postman 是一款 API 开发协作平台，支持变量管理、请求生命周期脚本、抓包代理和集合运行器 (Collection Runner)，并提供命令行工具 Newman 集成 CI / CD。其功能包括调试接口、数据验证和动态变量，付费版本还支持文档与监控等协作功能。

- [Postman 使用指南: 请求、变量、Runner 和脚手架 Newman](#postman-使用指南-请求变量runner-和脚手架-newman)
  - [一、什么是 Postman (前世今生)](#一什么是-postman-前世今生)
  - [二、使用变量](#二使用变量)
    - [2.1 变量作用域适用于 Postman 中不同的场景](#21-变量作用域适用于-postman-中不同的场景)
    - [2.2 编辑全局和环境变量](#22-编辑全局和环境变量)
    - [2.3 编辑集合变量](#23-编辑集合变量)
    - [2.4 使用系统内置动态变量](#24-使用系统内置动态变量)
  - [三、Postman 请求生命周期](#三postman-请求生命周期)
    - [3.1 在前置请求 (pre-request script) 中使用脚本](#31-在前置请求-pre-request-script-中使用脚本)
    - [3.2 发送请求 (request)](#32-发送请求-request)
    - [3.3 接收一个响应 (response)](#33-接收一个响应-response)
    - [3.4 在测试 (tests) 中使用脚本](#34-在测试-tests-中使用脚本)
  - [四、使用 Postman 抓包](#四使用-postman-抓包)
    - [4.1 开启抓包](#41-开启抓包)
    - [4.2 抓包效果](#42-抓包效果)
  - [五、使用代理](#五使用代理)
  - [六、使用 Collection Runner](#六使用-collection-runner)
  - [七、命令行脚手架 Newman](#七命令行脚手架-newman)
  - [八、付费功能](#八付费功能)

## 一、什么是 Postman (前世今生)

[Postman](https://www.postman.com/) 诞生于 2013 年，一开始只是 Abhinav Asthana 着手于解决 **API 测试**的工具，随着这个工具的使用者和需求迅速激增，Abhinav Asthana 找了他的两个前同事 [Ankit Sobti](https://github.com/ankitjaggi) 和 [Abhijit Kane](https://github.com/abhijitkane) 一起创建了公司 Postman Inc。

![创始人](http://blog.mazey.net/wp-content/uploads/2021/01/our-founders.png)

如今 Postman 已经成为一个 API 开发的协作平台。Postman 简化了构建 API 的每个步骤，并简化了协作，这样就可以更快地创建 API。

![Postman API 协作平台](http://blog.mazey.net/wp-content/uploads/2021/01/api-platform-0106.png)

## 二、使用变量

Postman 允许用户在发送和接收时[使用变量](https://learning.postman.com/docs/sending-requests/variables/)，以提高工作效率和可读性 (不过只能保存字符串类型的值，所以复杂数据类型需要借助于 `JSON.stringify()` 和 `JSON.parse()` 来管理)。

例如在不同运行环境中设置*域名地址*为变量:

![在 URL 中设置变量](http://blog.mazey.net/wp-content/uploads/2021/01/url-var-0135.jpg)

![引用变量示例](http://blog.mazey.net/wp-content/uploads/2021/01/reference-var-0136.jpg)

Postman 支持在不同的作用域和上下文中使用变量，遵循就近原则，即如果在 `Global` 和 `Environment` 中都有变量 `name`，则会取 `Environment` 中的 `name`。

![变量作用域示意图](http://blog.mazey.net/wp-content/uploads/2021/01/var-scope-0119.jpg)

### 2.1 变量作用域适用于 Postman 中不同的场景

- Global: 全局变量可以在整个工作空间 (Workspace) 中使用，因为无法控制使用环境和容易造成混淆，应当是不可变的**全局常量**，谨慎使用。

```javascript
pm.globals.set("variable_key", "variable_value");
pm.globals.get("variable_key");
```

- Collection: 集合变量在单个集合 (Collection) 中可用，往往具备通用的业务绑定属性，例如: 商品属性、会员等级、通用秘钥等。

```javascript
pm.collectionVariables.set("variable_key", "variable_value");
pm.collectionVariables.get("variable_key");
```

- Environment: 环境变量允许请求适应不同的环境，例如: 本地、测试、预演和生产环境，常常用来区别请求地址。

```javascript
pm.environment.set("variable_key", "variable_value");
pm.environment.get("variable_key");
```

- Data: 数据变量来自外部 CSV 和 JSON 文件，当通过 Newman 或 Runner 来运行时才用到。

- Local: 局部变量只在单个请求生命周期中可用，运行完成后自动销毁。

```javascript
pm.variables.set("variable_key", "variable_value");
pm.variables.get("variable_key");
```

![变量作用域层次图](http://blog.mazey.net/wp-content/uploads/2021/01/Variables-Chart-0020.png)

### 2.2 编辑全局和环境变量

![环境变量快速查看](http://blog.mazey.net/wp-content/uploads/2021/01/env-quick-look-0027.jpg)

### 2.3 编辑集合变量

![编辑集合变量](http://blog.mazey.net/wp-content/uploads/2021/01/edit-collection-var-0145.jpg)

### 2.4 使用系统内置动态变量

Postman 内置了很多常见场景的[动态变量](https://learning.postman.com/docs/writing-scripts/script-references/variables-list/)。

备注: Postman 支持在 Pre-request Script 和 Tests 中打印调试信息，和浏览器控制台一致，可以使用命令: `console.log()`、`console.info()`、`console.warn()` 和 `console.error()`。

![Postman 控制台](http://blog.mazey.net/wp-content/uploads/2021/01/postman-console-w-800-0056.jpg)

```javascript
console.log('当前时间戳:', pm.variables.replaceIn('{{$timestamp}}'));
console.log('随机颜色:', pm.variables.replaceIn('{{$randomColor}}'));
console.log('随机 IP:', pm.variables.replaceIn('{{$randomIP}}'));
console.log('随机名字:', pm.variables.replaceIn('{{$randomFullName}}'));
console.log('随机职业:', pm.variables.replaceIn('{{$randomJobType}}'));
console.log('随机城市:', pm.variables.replaceIn('{{$randomCity}}'));
console.log('随机图片:', pm.variables.replaceIn('{{$randomImageUrl}}'));
```

输出:

```plain
当前时间戳: 1609060090
随机颜色: azure
随机 IP: 163.140.207.64
随机名字: Chester Funk
随机职业: Coordinator
随机城市: Port Devinborough
随机图片: http://placeimg.com/640/480
```

## 三、Postman 请求生命周期

在 Postman 中，一个完整的 Postman 请求生命周期，除了常规的请求 (request) 和响应 (response)，还包括前置请求脚本 (pre-request script) 和后置测试脚本 (tests script)。Postman 包含一个基于 **Node.js** 的强大运行态 (runtime)，允许用户在 pre-request script 和 tests 事件中编写 JavaScript 代码。

![Postman 请求生命周期示意图](http://blog.mazey.net/wp-content/uploads/2021/01/req-resp-0107.png)

### 3.1 在前置请求 (pre-request script) 中使用脚本

前置请求脚本 (pre-request script) 顾名思义就是在请求发送之前执行的脚本。

![前置请求脚本](http://blog.mazey.net/wp-content/uploads/2021/01/pre-request-script-w-800-0021.jpg)

### 3.2 发送请求 (request)

小技巧一: 在链接中使用 `:id` 自定义路径参数。

![自定义路径参数示例](http://blog.mazey.net/wp-content/uploads/2021/01/path-param-w-800-0054.jpg)

小技巧二: Cookie 可编辑。

![Cookie 管理](http://blog.mazey.net/wp-content/uploads/2021/01/WS-manage-cookies-w-800-0055.jpg)

### 3.3 接收一个响应 (response)

小技巧: 保存响应结果。

![保存响应结果](http://blog.mazey.net/wp-content/uploads/2021/01/save-result-0031.jpg)

保存后的结果可以作为案例或记录以便开发使用。

![示例下拉菜单](http://blog.mazey.net/wp-content/uploads/2021/01/examplesDropdown-0209.jpg)

### 3.4 在测试 (tests) 中使用脚本

Postman 支持在请求响应后通过测试脚本来验证请求是否符合预期。

![测试脚本示例](http://blog.mazey.net/wp-content/uploads/2021/01/example-test-status-0033.jpg)

示例一: 验证响应状态码是否是 200。

```javascript
pm.test("Status test", function () {
  pm.response.to.have.status(200);
});
```

示例二: 验证返回的业务数据 (JSON) 是否符合预期。

```javascript
pm.test("请求成功！", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.message).to.eql('success');
});
```

## 四、使用 Postman 抓包

在 Postman 应用程序中有一个内置代理来捕获 HTTP 请求。

1. Postman 应用程序监听客户端应用程序或设备发出的任何调用。
2. Postman 代理捕获请求并将请求转发给服务器。
3. 服务器通过 Postman 代理将响应返回给客户端。

![Postman 抓包代理流程图](http://blog.mazey.net/wp-content/uploads/2021/01/proxymobile-0035.jpg)

### 4.1 开启抓包

![开启抓包代理设置](http://blog.mazey.net/wp-content/uploads/2021/01/Interceptor-Proxy-w-400-0110.jpg)

本机 IP 地址:

![网络设置](http://blog.mazey.net/wp-content/uploads/2021/01/osx-network-settings-w-800-0117.jpg)

手机设置:

![iOS HTTP 代理设置](http://blog.mazey.net/wp-content/uploads/2021/01/ios-http-proxy-settings-e1611719019165.png)

### 4.2 抓包效果

![抓包效果](http://blog.mazey.net/wp-content/uploads/2021/01/WS-proxy.logs-w-800-0057.png)

## 五、使用代理

代理服务器是一个应用程序或系统，作为计算机和互联网之间的中介，或者更具体地说就是代表着客户端和服务器，向网站、服务器和其他互联网服务发出请求。

除了传递信息，代理可以做更多的事情:

1. 记录你的机器和互联网之间的所有流量。
2. 显示所有请求、响应、Cookie 和标题的内容。
3. 路由流量到指定的因特网位置。
4. 调试接口。
5. 防止直接攻击，保证安全性。
6. DevOps 负载平衡。

![标准代理服务器架构图](http://blog.mazey.net/wp-content/uploads/2021/01/proxy.standard-0043.jpg)

默认情况下，Postman 将使用自带的系统代理，如果自定义了代理，优先级将高于自带的系统代理。

![代理设置](http://blog.mazey.net/wp-content/uploads/2021/01/proxy_global-w-800-0116.jpg)

## 六、使用 Collection Runner

集合运行器 (Collection Runner) 允许以**指定顺序**运行集合里面的请求。Collection Runner 将记录请求测试结果，并且脚本可以在请求之间传递数据。

![Collection Runner 运行结果概览](http://blog.mazey.net/wp-content/uploads/2021/01/collection-run-results-overview-w-800-0046.jpg)

## 七、命令行脚手架 Newman

Postman 提供脚手架工具 Newman 来以命令行的方式来运行集合 (Collection) 请求，其提供和 Postman 桌面端一致的功能，可以集成在工作流的 CI / CD 中。

```bash
# 安装
npm install -g newman

# 运行文件
newman run mycollection.json

# 运行 URL
newman run https://www.postman.com/collections/cb208e7e64056f5294e5 -e dev_environment.json
```

![Newman 命令行运行演示](http://blog.mazey.net/wp-content/uploads/2021/01/newman-cli-w-800-0128.gif)

## 八、付费功能

另外 Postman 提供了很多团队协作需要的[付费功能](https://www.postman.com/pricing/)，例如: 文档、监控、健康检查等。

![Postman 付费功能插件](http://blog.mazey.net/wp-content/uploads/2021/01/add-on-w-800-0048.jpg)

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/1878.html>

(完)
