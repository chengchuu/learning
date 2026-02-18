# 使用 webpack-bundle-analyzer 分析与优化构建体积

![使用 webpack-bundle-analyzer 分析与优化构建体积](http://blog.mazey.net/wp-content/uploads/2025/09/webpack_SF_7x3.jpg)

**内容声明**

本文仅用于技术分享和学习交流，内容不包含任何广告、推广、引流、付费课程或外链信息。所有示例和配置均为技术实践，欢迎参考和自定义。

---

使用 webpack-bundle-analyzer 可可视化分析构建产物并生成 stats.json，帮助定位体积来源。结合 ESBuild 或 SWC 加速转译、优化 Terser 参数、配置 Tree Shaking 与 sideEffects、压缩图片、替换大型依赖，可有效缩小最终 bundle 并提升构建性能。

- [使用 webpack-bundle-analyzer 分析与优化构建体积](#使用-webpack-bundle-analyzer-分析与优化构建体积)
  - [安装](#安装)
  - [配置示例](#配置示例)
  - [运行分析](#运行分析)
  - [常用的构建体积优化项](#常用的构建体积优化项)
    - [使用 ESBuild/SWC 作为 JS/TS 转译器](#使用-esbuildswc-作为-jsts-转译器)
    - [使用 TerserPlugin 的 parallel + compress](#使用-terserplugin-的-parallel--compress)
    - [Tree Shaking 结合 sideEffects](#tree-shaking-结合-sideeffects)
    - [压缩 \& 优化图片](#压缩--优化图片)
    - [减少 Moment、Lodash 等大体积依赖](#减少-momentlodash-等大体积依赖)

## 安装

```bash
npm i -D webpack-bundle-analyzer
```

## 配置示例

`webpack.analyzer.js`
```javascript
const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',     // 交互式可视化界面
      openAnalyzer: true,         // 自动打开浏览器
      generateStatsFile: true,    // 输出 stats.json 便于深度分析
      statsFilename: 'stats.json'
    })
  ]
});
```

## 运行分析

```bash
npx webpack --config webpack.analyzer.js
```

![Analyzer](http://blog.mazey.net/wp-content/uploads/2021/01/webpack-bundle-analyzer-result-e1609757079109.png)

## 常用的构建体积优化项

### 使用 ESBuild/SWC 作为 JS/TS 转译器

替代 Babel 可显著降低构建时间与输出体积。

```plain
loader: 'esbuild-loader'
```

### 使用 TerserPlugin 的 parallel + compress

webpack5 默认已集成 Terser，但可调整参数进一步缩小体积。

### Tree Shaking 结合 sideEffects

确保 package.json 中声明:

```plain
"sideEffects": false
```

如果有副作用的文件，可单独列出:

```plain
"sideEffects": [
  "*.css",
  "*.scss",
  "./src/initGlobal.js"
]
```

并避免在模块中使用影响静态分析的语句，例如:

- 动态 require
- 使用 `eval()`、`with`、`for...in`
- 使用复杂的对象属性访问
- 在模块顶层写逻辑判断

### 压缩 & 优化图片

使用 image-minimizer-webpack-plugin + squoosh 压缩图片资源。

### 减少 Moment、Lodash 等大体积依赖

- 使用 date-fns 或 dayjs 替代 moment。
- 使用 lodash-es 或按需导入。

**更新记录**

本文首次编辑于 2021-01-04，最近更新于 2025-11-26。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/1781.html>

(完)
