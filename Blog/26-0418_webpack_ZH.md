# 在 webpack 中使用多配置: 导出配置对象数组

如果你做过包含多个入口点或不同构建需求的 Web 项目 —— 例如分别构建 BUNDLE_A、BUNDLE_B 和 BUNDLE_C —— 你可能想过一个问题: 能否只用一套 webpack 配置高效管理全部构建？

答案是可以。webpack 原生支持导出配置对象数组，这���特性称为"多编译器模式"。它能有效简化复杂构建流程，让你的工作流更清晰。

## 我的实践: 从多个配置文件到多配置模式

一开始，我使用多个 webpack 配置文件管理资源:

- `webpack.config.BUNDLE_A.js` 用于 BUNDLE_A
- `webpack.config.BUNDLE_B.js` 用于 BUNDLE_B
- `webpack.config.BUNDLE_C.js` 用于 BUNDLE_C

每个文件都有独立的 build/watch 命令。我经常要开 3 个终端会话 (或在 Docker Compose 中运行 3 个服务) 监听源码变化。这个方案虽然可用，但随着项目变大，维护成本很快上升。

### 转折点

后来我发现，只要在 JavaScript 配置中导出一个数组，就能把 3 份配置合并到同一个文件:

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

这样我就可以一次性构建并监听全部 3 个 bundle:

```bash
npx webpack --config ./scripts/webpack.config.all.js --watch
```

不再需要在多个终端之间切换，也不需要复杂脚本。只用一条命令，webpack 就能处理全部构建。

同时，也仍然支持按目标构建:

```bash
npx webpack --config ./scripts/webpack.config.all.js --config-name BUNDLE_A
```

如果配置中定义了 `name: 'BUNDLE_A'`，你就可以单独触发它。

## 这为什么有用

- 效率更高: 所有配置在同一进程中运行。webpack 会并行监听并构建所有定义的入口和输出，相关文件变化后自动重建。
- 更易维护: 共享插件、公共设置和 loader 规则可以统一定义并复用。
- 更灵活: 每个配置都可以有自己的 `entry`、`output`、plugins 和 loaders。你可以完全隔离，也可以部分共享。

## 它的工作机制

当你导出配置对象数组时，webpack 就会启用"多编译器模式":

```javascript
module.exports = [
  { /* BUNDLE_A 的配置 */ },
  { /* BUNDLE_B 的配置 */ },
  { /* BUNDLE_C 的配置 */ }
];
```

webpack 会在同一进程中独立处理每一份配置。这意味着你可以同时拥有:

- 不同的入口点 (`entry`)
- 不同的输出文件名或输出目录 (`output`)
- 每份配置独立的插件组合

## 使用时的注意事项

- 输出冲突: 确保每份配置输出到不同文件名或不同路径，避免相互覆盖。
- 插件配置: 某些插件 (如 HtmlWebpackPlugin) 在多配置场景下需要单独设置输出文件名，否则可能被覆盖。
- 性能权衡: 对多数项目而言，多配置模式足够快且高效。对于超大型应用，拆分为多个进程有时更合适；但在大多数日常场景中，单进程多配置更优。

## 示例: 多个 HTML 与 JS bundle

下面是一个使用数组模式的 `webpack.config.js` 示例:

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

在 webpack 中导出配置对象数组，是处理复杂构建任务的推荐实践。
它可以简化工作流、减少重复配置，并帮助你高效管理多 bundle 项目。
