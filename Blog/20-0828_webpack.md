# 使用 webpack-merge 合并 webpack 配置

使用 webpack 搭建项目时会配置开发、测试、预发布、生产环境，这里面充斥着大量重复的配置，例如：入口、加载器等。[webpack-merge](https://www.npmjs.com/package/webpack-merge) 作为 webpack 的配置合并工具，功能类似于 JavaScript 的 [`Object.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)。


快速安装:

```bash
npm install -D webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin clean-webpack-plugin mini-css-extract-plugin css-loader postcss-loader postcss postcss-preset-env sass sass-loader esbuild-loader
```

示例：

`utils.js`
```javascript
const path = require('path');

const resolve = (...segments) => path.resolve(__dirname, ...segments);

module.exports = { resolve };
```

`webpack.common.js`
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('./utils');

module.exports = {
  entry: {
    index: resolve('src/index.tsx') // 或 index.ts
  },
  output: {
    path: resolve('dist'),
    // 具体 filename 在各环境中覆盖（开发不需要 contenthash）
    filename: '[name].js',
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      // 用 esbuild-loader 当作快速 TS/JS 转译器
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx', // 或 'ts' / 'jsx' / 'js'
          target: 'es2017'
        }
      },
      // 资源模块（替代 file-loader / url-loader）
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 小于 8kb 内联
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
      // 注意：样式 loader 在各环境中不同（见下面 dev/prod）
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // webpack 5 推荐简单用法
    new HtmlWebpackPlugin({
      template: resolve('src/index.html'),
      inject: 'body'
    })
  ],
  // 打开持久化缓存，在大多数场景下能显著加快二次构建
  cache: {
    type: 'filesystem'
  },
  stats: 'minimal'
};
```

`webpack.dev.js`
```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { resolve } = require('./utils');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader', // 开发直接注入，速度快
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env', { stage: 3 }]]
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    static: { directory: resolve('dist') },
    hot: true,
    port: 3000,
    open: true,
    historyApiFallback: true
  }
});
```

`webpack.prod.js`
```javascript
const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash:8].js',
    clean: true // webpack 5 output.clean 可替代 CleanWebpackPlugin，在 simple 场景下更方便
  },
  module: {
    rules: [
      // 这里仅声明 test，实际 loader 通过 mergeWithRules 替换
      {
        test: /\.s?css$/
      }
    ]
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 50,
      // 典型的缓存组配置可在此处展开
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ]
};

// 使用 mergeWithRules 将样式 loader 在生产环境里替换为 MiniCssExtractPlugin.loader + css + postcss + sass
const merged = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      // use 数组用 replace（生产直接替换掉开发用的 style-loader）
      use: 'replace'
    }
  }
})(common, prodConfig);

// 供外部 require
module.exports = merged;
```

**更新记录**

本文首次编辑于 2020-08-28，最近更新于 2025-11-22。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/1724.html>

(完)
