# webpack 多页面 & GitLab 增量构建部署模板

![webpack 多页面 & GitLab 增量构建部署模板](http://blog.mazey.net/wp-content/uploads/2025/09/webpack_SF_7x3.jpg)

介绍了一个基于 webpack 的多页面模板，支持 GitLab 增量构建和部署。每个页面需在 pages 目录下包含 index.html 和 index.js，构建后生成独立的页面结构。通过 GitLab CI/CD 检测修改的页面，利用阿里云 OSS CLI 自动上传到云端，实现高效的增量部署。

- [webpack 多页面 \& GitLab 增量构建部署模板](#webpack-多页面--gitlab-增量构建部署模板)
  - [multipage-template](#multipage-template)
  - [入口文件](#入口文件)
  - [出口](#出口)
  - [增量部署](#增量部署)
  - [参考](#参考)

## [multipage-template](https://github.com/chengchuu/multipage-template)

webpack 多页面 & GitLab 增量构建部署模板。

## 入口文件

每新建个独立的页面只需要在 `pages` 下面新建一个文件夹即可，但必须拥有两个入口文件 `index.html`、`index.js`。

```plain
├── package.json
└── src
    ├── index.js // pages 外部可以放一些通用的东西
    └── pages
        ├── page1
        │   ├── index.js
        │   └── index.html
        └── page2
            ├── style.css
            ├── index.js
            └── index.html
```

## 出口

构建打包出来的页面结构互相独立。

```plain
├── package.json
└── dist
    ├── page1
    │   ├── 7ffaa4103cae71b1629a.js
    │   └── index.html
    └── page2
        ├── 88870cd4b2e554c2a754.css
        ├── 88870cd4b2e554c2a754.js
        └── index.html
```

## 增量部署

利用 GitLab 变量跑出有修改的 `pages` 文件夹，构建打包后使用阿里云 OSS 脚手架 [aliyunoss-cli](https://github.com/chengchuu/aliyunoss-cli) 自动上传到云端。

```bash
search_dir=src/pages
for path in "$search_dir"/*; do
echo "$(git diff HEAD~ --name-only | grep "$path")"
    if [ "$(git diff HEAD~ --name-only | grep "$path/")" ]; then
        page_name=$(basename $path)
        echo "[CI] Page \"$page_name\" has been modified"
        echo "[CI] Start building"
        npx cross-env NODE_ENV=production PAGE=$page_name node build/build.js
    fi
done
```

## 参考

- [使用 GitLab CI/CD 和阿里云 CLI 自动部署前端项目](http://blog.mazey.net/1695.html)

**更新记录**

本文首次编辑于 2020-08-24，最近更新于 <Date>。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/1706.html>

(完)
