# 使用 webpack-bundle-analyzer 分析与优化构建体积

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
