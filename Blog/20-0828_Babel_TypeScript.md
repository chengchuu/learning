# 使用 Babel 编译 TypeScript

使用 ts-loader 在构建打包生产代码时面对重重问题，比如 Polyfill 的自动注入等，于是转变为用 Babel 来编译 TypeScript。

## 一、安装 Babel

安装 webpack 和 TypeScript 所必要的 Babel 依赖:

```bash
# Babel & webpack loader
npm install @babel/core @babel/cli @babel/preset-env @babel/preset-typescript babel-loader @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties @babel/plugin-proposal-private-methods @babel/plugin-proposal-object-rest-spread core-js -D

# Babel runtime with corejs3 support
npm install @babel/runtime @babel/runtime-corejs3 -S
```

## 二、配置 `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          // "usage" 会在代码中按需注入 core-js polyfills (适合应用)
          // "entry" 需要手动在入口 import "core-js/stable"; import "regenerator-runtime/runtime";
          // 或者把 useBuiltIns 改为 false (不注入 polyfill)
          useBuiltIns: false, // 或 "usage" / "entry"
          corejs: 3,
          // 可以根据需要设置 targets，也可由 browserslist 决定
          // targets: { browsers: [">0.2%", "not dead", "not op_mini all"] },
          bugfixes: true,
          modules: false
        }
      ],
      "@babel/preset-typescript"
    ],
    plugins: [
      // 推荐用于库，抽出 helper，减少重复代码；如果需要 core-js 注入，配置 corejs 选项
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: false, // 或 3 表示把 core-js polyfills 用 runtime 方式注入 (需要 @babel/runtime-corejs3)
          helpers: true,
          regenerator: true,
          version: require("@babel/runtime/package.json").version
        }
      ],

      // class fields、private fields 等 (现代 JS 特性)
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-private-methods",
      "@babel/plugin-proposal-object-rest-spread"
    ]
  };
};
```

## 三、修改 webpack 配置

```javascript
module.exports = {
  // ...entry, output 等
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            // babel.config.js 会被自动加载
          }
        }
      }
      // 其他 loader (CSS、图片等)
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  }
  // ...plugins, optimization 等
};
```

## 四、配置 TypeScript 环境

安装 `typescript`:

```bash
npm install typescript -D
```

配置 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    // 对用 Babel 转译的项目很重要：
    "isolatedModules": true,

    // 不让 tsc 输出 .js 文件 (Babel 去转译)
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

修改 `package.json`，添加脚本命令:

```plain
{
  "scripts": {
    "build:webpack": "webpack --config webpack.config.js"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]
}
```
