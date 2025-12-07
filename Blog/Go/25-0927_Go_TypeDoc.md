# 快捷转换 Markdown 文档和 TypeScript/TypeDoc 注释

![快捷转换 Markdown 文档和 TypeScript/TypeDoc 注释](http://blog.mazey.net/wp-content/uploads/2023/11/Go_Scripts_s7x3_w1400.jpg)

提供脚本工具将代码注释与 Markdown 文档互相转换，简化操作流程。分别对应不同版本的可执行文件，通过指定格式存放数据并运行脚本，可快速生成所需结果，提升效率。

- [快捷转换 Markdown 文档和 TypeScript/TypeDoc 注释](#快捷转换-markdown-文档和-typescripttypedoc-注释)
  - [背景](#背景)
  - [解决方案](#解决方案)
    - [注释转 Markdown](#注释转-markdown)
    - [Markdown 转注释](#markdown-转注释)
  - [使用案例](#使用案例)

## 背景

作为文档工具人，经常需要把代码里面的注释转换成语义化的 Markdown 文档，有时也需要进行反向操作。以前是写正则表达式全局匹配，时间长了这种方式也变得繁琐乏味。所以写了脚本来互转，增加一些便捷性。

## 解决方案

### 注释转 Markdown

下载地址：https://github.com/chengchuu/go-gin-gee/releases/tag/v1.2.0

操作步骤：

1. 跟自身系统下载文件 `convert-typedoc-to-markdown-mac-darwin-amd64`/...
2. 在同个目录下新建一个文件夹 `data`
3. 在文件夹 `data` 内新建一个文件 `td2md.js`
4. 在将需要被转换的注释放在文件 `td2md.js`
5. 执行 `convert-typedoc-to-markdown-mac-darwin-amd64`/...
6. 在文件 `data/td2md.md` 内查看最新结果

![Convert TypeDoc to Markdown](http://blog.mazey.net/wp-content/uploads/2023/05/td2md-646ef844b43bc-w800.png)

### Markdown 转注释

下载地址：https://github.com/chengchuu/go-gin-gee/releases/tag/v1.3.0

操作步骤：

1. 跟自身系统下载文件 `convert-markdown-to-typedoc-mac-darwin-amd64`/...
2. 在同个目录下新建一个文件夹 `data`
3. 在文件夹 `data` 内新建一个文件 `md2td.md`
4. 在将需要被转换的注释放在文件 `md2td.md`
5. 执行 `convert-markdown-to-typedoc-mac-darwin-amd64`/...
6. 在文件 `data/md2td.js` 内查看最新结果

![Convert Markdown to TypeDoc](http://blog.mazey.net/wp-content/uploads/2023/05/md2td-646efa0712a67-w800.png)

## 使用案例

GitHub：https://github.com/chengchuu/mazey/tree/v3.7.4/scripts/convert

![GitHub Case](http://blog.mazey.net/wp-content/uploads/2023/05/github-case-646efda16296b-w400.png)

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/3494.html>

(完)
