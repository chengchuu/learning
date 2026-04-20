# [ZH] webpack 中使用多配置: 导出配置对象数组

![webpack 多配置](http://blog.mazey.net/wp-content/uploads/2025/09/webpack_SF_7x3.jpg)

通过导出配置对象数组，可在 webpack 中启用多编译器模式，实现多入口与多 bundle 的统一构建与监听。该方式简化流程、降低维护成本，并支持共享配置与按需执行 (config-name)，适用于复杂项目的高效管理与扩展。

- [前言](#前言)
- [从多文件配置到多配置模式](#从多文件配置到多配置模式)
  - [关键调整](#关键调整)
- [价值与收益](#价值与收益)
- [工作机制说明](#工作机制说明)
- [实施注意事项](#实施注意事项)
- [示例: 多个 HTML 与 JS bundle](#示例-多个-html-与-js-bundle)
- [总结](#总结)

## 前言

在包含多个入口点或差异化构建需求的 Web 项目中，例如分别构建 BUNDLE_A、BUNDLE_B 和 BUNDLE_C，常见问题是能否仅用一套 webpack 配置管理全部构建任务。

答案是可以。webpack 原生支持导出配置对象数组，这一特性称为"多编译器模式"。该能力可用于简化复杂构建流程，并降低日常维护成本。

## 从多文件配置到多配置模式

早期方案通常是使用多个 webpack 配置文件管理资源:

- `webpack.config.BUNDLE_A.js` 用于 BUNDLE_A
- `webpack.config.BUNDLE_B.js` 用于 BUNDLE_B
- `webpack.config.BUNDLE_C.js` 用于 BUNDLE_C

在这种方式下，每个文件都对应独立的 build/watch 命令。实际执行时，往往需要同时运行 3 个终端会话 (或在 Docker Compose 中运行 3 个服务) 以监听源码变更。该方式能够工作，但项目规模扩大后，复杂度会明显上升。

### 关键调整

通过在 JavaScript 配置中导出数组，可将 3 份配置整合到同一文件:

```javascript
// webpack.config.all.js
const BUNDLE_A = require('./webpack.config.BUNDLE_A');
const BUNDLE_B = require('./webpack.config.BUNDLE_B');
const BUNDLE_C = require('./webpack.config.BUNDLE_C');

module.exports = [
  BUNDLE_A,
  BUNDLE_B,
  BUNDLE_C,
];
```

完成整合后，可一次性构建并监听全部 3 个 bundle:

```bash
npx webpack --config ./scripts/webpack.config.all.js --watch
```

该方式避免了多终端切换和复杂脚本编排。通过一条命令，webpack 即可处理全部构建任务。

同时，目标化构建仍然可用:

```bash
npx webpack --config ./scripts/webpack.config.all.js --config-name BUNDLE_A
```

若配置中声明了 `name: 'BUNDLE_A'`，即可按名称单独触发对应构建。

## 价值与收益

- 效率: 全部配置在同一进程中运行。webpack 可并行监听并构建所有定义的入口与输出，相关文件变更后自动重建。
- 可维护性: 共享插件、公共设置与 `loader` 规则可集中定义并复用。
- 灵活性: 每份配置均可独立声明 `entry`、`output`、`plugins` 与 `loaders`。可实现完全隔离，也可实现部分共享。

## 工作机制说明

当配置文件导出配置对象数组时，webpack 将启用"多编译器模式":

```javascript
module.exports = [
  { /* BUNDLE_A 的配置 */ },
  { /* BUNDLE_B 的配置 */ },
  { /* BUNDLE_C 的配置 */ }
];
```

在该模式下，webpack 会在同一进程中独立处理每一份配置。因此可同时具备以下能力:

- 不同入口点 (`entry`)
- 不同输出文件名或输出目录 (`output`)
- 按配置定制的插件集合

## 实施注意事项

- 输出冲突: 应确保各配置输出到不同文件名或不同目录，避免相互覆盖。
- 插件设置: 某些插件 (例如 HtmlWebpackPlugin) 在多配置场景下需要单独指定输出文件名，否则可能发生覆盖。
- 性能考量: 对大多数项目，多配置模式具备较高效率。对于超大型应用，拆分为多进程在部分场景下更合适；在常见工作流中，单进程多配置通常更具综合优势。

## 示例: 多个 HTML 与 JS bundle

以下为采用数组模式的 `webpack.config.js` 示例:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    name: 'BUNDLE_A',
    entry: './src/BUNDLE_A.js',
    output: { filename: 'BUNDLE_A.bundle.js', path: path.resolve(__dirname, 'dist') },
    plugins: [
      new HtmlWebpackPlugin({ filename: 'BUNDLE_A.html', template: './src/BUNDLE_A.html' }),
    ],
  },
  {
    name: 'BUNDLE_B',
    entry: './src/BUNDLE_B.js',
    output: { filename: 'BUNDLE_B.bundle.js', path: path.resolve(__dirname, 'dist') },
    plugins: [
      new HtmlWebpackPlugin({ filename: 'BUNDLE_B.html', template: './src/BUNDLE_B.html' }),
    ],
  },
];
```

## 总结

在 webpack 中导出配置对象数组，是面向复杂构建任务的推荐实践。该方法能够简化工作流、减少重复配置，并提升多 bundle 项目的管理效率。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/6302.html>

<!-- ID: 26-0418_webpack_ZH -->

(完)
