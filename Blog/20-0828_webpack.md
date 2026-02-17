# 使用 webpack-merge 合并 webpack 配置

使用 webpack 搭建项目时会配置开发、测试、预发布、生产环境，这里面充斥着大量重复的配置，例如：入口、加载器等。[webpack-merge](https://www.npmjs.com/package/webpack-merge) 作为 webpack 的配置合并工具，功能类似于 JavaScript 的 [Object.assign\(\)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)。

示例：

`utils.js`

```
const path = require('path');
const _resolve = (_path) => path.resolve(__dirname, _path);

module.exports = {
  _resolve
}
```

`webpack.config.base.js`

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { _resolve } = require('./utils');

const baseConf = {
  entry: {
    index: _resolve('../src/index.ts')
  },
  output: {
    filename: '[name].js',
    path: _resolve('../dist')
  },
  module:{
    rules:[
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: _resolve('../dist/index.html'),
      template: _resolve('../src/index.html'),
      inject: true,
      chunksSortMode: 'dependency'
    }),
    new CleanWebpackPlugin([_resolve('../dist')])
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}

module.exports = baseConf;
```

`webpack.config.prd.js`

```
const { merge } = require('webpack-merge');
const baseConf = require('./webpack.config.base');

module.exports = merge(baseConf, {/* 生产配置 */
  mode: 'production'
});
```
