# Git 常用命令记录

![Git 常用命令记录](http://blog.mazey.net/wp-content/uploads/2025/08/git_SegmentFault_7x3.jpg)

整理常用 Git 命令与配置技巧，涵盖基础操作、缓存清理、权限设置、分支管理、远程仓库、提交信息、标签创建及批量拉取代码，支持多平台 SSH 配置、CI / CD 部署及 npm 本地调试，便于高效开发与协作。

- [Git 常用命令记录](#git-常用命令记录)
  - [基础 Basic](#基础-basic)
  - [缓存 Cache](#缓存-cache)
  - [权限 Access Credential](#权限-access-credential)
  - [配置 Config](#配置-config)
  - [分支 Branch](#分支-branch)
  - [仓库地址 Remote Repository](#仓库地址-remote-repository)
  - [提交 Commit](#提交-commit)
  - [安装 Install](#安装-install)
  - [开发 Development](#开发-development)
  - [极狐 GitLab](#极狐-gitlab)
  - [标签 Tag](#标签-tag)
  - [拉取 Pull](#拉取-pull)

## 基础 Basic

最常用的 Git 操作命令:

```bash
git status                  # 查看当前仓库状态 (变更、未暂存、未提交等)
git add .                   # 添加所有变更到暂存区
git commit -m "<Message>"   # 提交到本地仓库
git push                    # 推送到远程仓库
git pull                    # 拉取远程仓库最新代码
git log                     # 查看提交历史
git diff                    # 比较变更内容
git reflog                  # 查看所有操作记录 (包括回滚、reset 等)
```

说明:

- `git reflog` 可用于找回误删的分支和提交。
- `git log --oneline` 可简洁显示历史记录。

参考: [Git 基础操作](http://blog.mazey.net/1644.html)

## 缓存 Cache

更新忽略文件 `.gitignore` 后清理缓存:

```bash
git rm -r --cached . && git add . && git commit -m "chore: clean cache" && git push
```

参考: [Git 删除 .gitignore 生成之前上传的文件](http://blog.mazey.net/1401.html)

## 权限 Access Credential

添加 SSH Keys 到远程平台:

```bash
cd ~ && ssh-keygen -t rsa -C "<UserName>@<DomainName>" && cd ~/.ssh && cat id_rsa.pub
```

参考: [GitHub / Gitee 等托管平台添加 SSH Keys](http://blog.mazey.net/2628.html)

## 配置 Config

查看和修改用户名及邮箱:

```bash
# 查看
git config user.name
git config user.email

# 修改
git config --global user.name "<UserName>"
git config --global user.email "<UserName>@<DomainName>"
```

针对不同项目修改用户名和邮箱:

```bash
git config user.name "<UserName>"
git config user.email "<UserName>@<DomainName>"
```

参考:

- [Git 查看和修改用户名和邮箱](http://blog.mazey.net/1985.html)
- [GitHub / GitLab 为不同的项目修改提交名字 user.name 和邮箱 user.email](http://blog.mazey.net/2956.html)

## 分支 Branch

删除本地和远程分支:

```bash
git branch -d <BranchName>
git push origin --delete <BranchName>
```

参考: [Git 删除本地和远程分支](http://blog.mazey.net/1617.html)

## 仓库地址 Remote Repository

修改远程仓库地址:

```bash
git remote set-url origin <URL>
```

参考: [Git 修改远程地址](http://blog.mazey.net/2631.html)

## 提交 Commit

修改最近一次 commit 的信息:

```bash
git commit --amend
```

查找第一条提交记录:

```bash
git rev-list --max-parents=0 HEAD
git show <Commit>
```

参考:

- [Git Commit message 和 Change log 编写规范 / 指南](http://blog.mazey.net/2186.html)
- [Change a commit message](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message)

## 安装 Install

Linux 搭建 Git 服务器及后续更新:

参考:

- [Linux 搭建 Git 服务器](http://blog.mazey.net/925.html)
- [如何在 CentOS 7.x / 6.x 安装 / 更新新版 Git](http://blog.mazey.net/2034.html)

## 开发 Development

npm 直接安装 GitHub / GitLab 仓库代码及 npm link 本地调试。

参考: [npm 直接安装 GitHub / GitLab 仓库代码及 npm link 本地调试](http://blog.mazey.net/2616.html)

## 极狐 GitLab

相关 CI / CD、部署与构建方案。

参考:

- [GitLab 指定 Runner 执行任务 (CI / CD / JOB)](http://blog.mazey.net/1744.html)
- [Webpack 多页面 & GitLab 增量构建部署模板](http://blog.mazey.net/1706.html)
- [使用 GitLab CI / CD 和阿里云 CLI 自动部署前端项目](http://blog.mazey.net/1695.html)

## 标签 Tag

创建标签并推送:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 拉取 Pull

批量拉取指定文件夹下所有 Git 项目最新代码。

参考: [批量拉取 / git pull 指定文件夹下面所有 Git 项目的最新代码](http://blog.mazey.net/3035.html)

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/5611.html>

(完)
