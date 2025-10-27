# 创建一个新的 TypeScript 项目

- [创建一个新的 TypeScript 项目](#创建一个新的-typescript-项目)
  - [一、初始化 npm 项目](#一初始化-npm-项目)
  - [二、安装 TypeScript](#二安装-typescript)
  - [三、初始化配置文件 `tsconfig.json`](#三初始化配置文件-tsconfigjson)
  - [四、编译 `.ts`](#四编译-ts)
  - [五、使用 webpack 打包](#五使用-webpack-打包)
    - [5.1 安装 webpack](#51-安装-webpack)
    - [5.2 安装 TypeScript 加载器 `ts-loader`](#52-安装-typescript-加载器-ts-loader)
    - [5.3 配置 `webpack.config.js`](#53-配置-webpackconfigjs)
    - [5.4 打包](#54-打包)
  - [六、使用 ESLint 规范代码](#六使用-eslint-规范代码)
    - [6.1 安装依赖](#61-安装依赖)
    - [6.2 新增配置文件 `eslint.config.cjs`](#62-新增配置文件-eslintconfigcjs)
    - [6.3 `package.json` 中添加检测脚本](#63-packagejson-中添加检测脚本)
    - [6.4 运行检测](#64-运行检测)
    - [6.5 自动修复不规范的代码](#65-自动修复不规范的代码)
    - [6.6 添加更多扩展文件](#66-添加更多扩展文件)
  - [附录](#附录)

## 一、初始化 npm 项目

```bash
# npm
npm init

# Git
git init
```

## 二、安装 TypeScript

```bash
npm i typescript -D

# 查看版本
npx tsc --version
```

## 三、初始化配置文件 `tsconfig.json`

```bash
npx tsc --init
```

## 四、编译 `.ts`

新建 `index.ts` 文件。

项目目录:

```plain
├── package.json
├── tsconfig.json
└── src
    └── index.ts
```

文件 `index.ts`:

```javascript
const ProjectName = "new-typescript-project";

function say(): string {
  return `This project is ${ProjectName}.`;
}

console.log(say());
```

**编译:**

```bash
npx tsc src/index.ts
```

**结果:**

```javascript
var ProjectName = "new-typescript-project";
function say() {
    return "This project is ".concat(ProjectName, ".");
}
console.log(say());
```

监听文件变化:

```bash
npx tsc -w
```

## 五、使用 webpack 打包

### 5.1 安装 webpack

```bash
npm install webpack webpack-cli -D
```

### 5.2 安装 TypeScript 加载器 `ts-loader`

```bash
npm install ts-loader -D
```

### 5.3 配置 `webpack.config.js`

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules:[
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  }
};
```

### 5.4 打包

```bash
npx webpack --config webpack.config.js
```

**结果:**

```javascript
(()=>{"use strict";console.log("This project is new-typescript-project.")})();
```

## 六、使用 ESLint 规范代码

### 6.1 安装依赖

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier -D
```

### 6.2 新增配置文件 `eslint.config.cjs`

```bash
touch eslint.config.cjs
```

```javascript
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const tsRecommendedRules =
  tsPlugin && tsPlugin.configs && tsPlugin.configs.recommended
    ? tsPlugin.configs.recommended.rules
    : {};

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '*.min.js', '.git/**']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...tsRecommendedRules,
      'prettier/prettier': 'error',
      'no-console': 'off',
      '@typescript-eslint/no-inferrable-types': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'warn'
    }
  }
];
```

### 6.3 `package.json` 中添加检测脚本

```plain
"lint": "eslint src/index.ts --ext .ts"
```

### 6.4 运行检测

```bash
npm run lint
```

报错示例:

```javascript
const ProjectName = "new-typescript-project"
```

```plain
1:45  error  Insert `;`  prettier/prettier
```

修改相应代码:

```plain
- const ProjectName = "new-typescript-project"
+ const ProjectName = "new-typescript-project";
```

再次运行通过！

### 6.5 自动修复不规范的代码

脚本添加 `--fix` 选项:

```plain
"lint:fix": "eslint src/index.ts --ext .ts --fix"
```

### 6.6 添加更多扩展文件

```plain
"lint:fix": "eslint src/index.ts --ext .ts,.tsx --fix"
```

## 附录

案例: [GitHub: new-typescript-project](https://github.com/chengchuu/new-typescript-project)

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/1685.html>

(完)
