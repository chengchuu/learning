# Git 常用命令记录

![Git 常用命令记录](http://blog.mazey.net/wp-content/uploads/2025/08/git_SegmentFault_7x3.jpg)

整理常用 Git 命令与配置技巧，涵盖基础操作、缓存清理、权限设置、分支管理、远程仓库、提交信息、标签创建及批量拉取代码，支持多平台 SSH 配置、CI / CD 部署及 npm 本地调试，便于高效开发与协作。

- [安装 Install](#安装-install)
- [基础 Basic](#基础-basic)
- [克隆 Clone](#克隆-clone)
  - [部分克隆](#部分克隆)
  - [浅克隆](#浅克隆)
- [配置 Config](#配置-config)
  - [用户名和邮箱](#用户名和邮箱)
  - [本地忽略文件](#本地忽略文件)
- [权限 Access Credential](#权限-access-credential)
- [缓存 Cache](#缓存-cache)
- [仓库地址 Remote Repository](#仓库地址-remote-repository)
- [分支 Branch](#分支-branch)
- [提交 Commit](#提交-commit)
- [标签 Tag](#标签-tag)
- [拉取 Pull](#拉取-pull)
  - [配置 git pull 的 Merge / Rebase 策略](#配置-git-pull-的-merge--rebase-策略)
  - [批量拉取](#批量拉取)
- [开发 Development](#开发-development)
- [极狐 GitLab](#极狐-gitlab)

## 安装 Install

Linux 搭建 Git 服务器及后续更新:

参考:

- [Linux 搭建 Git 服务器](http://blog.mazey.net/925)
- [如何在 CentOS 7.x / 6.x 安装 / 更新新版 Git](http://blog.mazey.net/2034)

## 基础 Basic

示例中的 `<your-...>` 是占位符，执行前请替换为实际值。Shell 命令中的占位符使用引号包裹，避免尖括号被解释为重定向。

最常用的 Git 操作命令:

```bash
git status                  # 查看当前仓库状态 (变更、未暂存、未提交等)
git add .                   # 添加所有变更到暂存区
git commit -m "<your-message>" # 提交到本地仓库
git push                    # 推送到远程仓库
git pull                    # 拉取远程仓库最新代码
git log                     # 查看提交历史
git diff                    # 比较变更内容
git reflog                  # 查看所有操作记录 (包括回滚、reset 等)
```

说明:

- `git reflog` 可用于找回误删的分支和提交。
- `git log --oneline` 可简洁显示历史记录。

参考: [Git 基础操作](http://blog.mazey.net/1644)

## 克隆 Clone

大仓库可按需选择部分克隆或浅克隆。两种方式都能检出当前版本的完整文件，但省略的数据不同。

### 部分克隆

保留所获取分支的完整提交历史，按需下载文件内容:

```bash
git clone --filter=blob:none "<your-repository-url>"
```

- `blob` 是 Git 存储文件内容的对象。初次获取时省略这些对象，检出时再下载当前版本所需的内容。
- 查看历史文件内容时，Git 可能需要联网补充下载。
- 提交和目录结构仍需下载，因此初始下载量可能较大。远程服务器需支持过滤功能。

### 浅克隆

仅获取最新一层提交历史，适合阅读或构建最新源码:

```bash
git clone --depth 1 "<your-repository-url>"
```

默认只获取一个分支。浅克隆仍可编辑和提交，但依赖完整历史的操作会受限。

进入克隆后的仓库，按需选择以下命令补充历史:

```bash
# 从当前浅克隆边界继续获取 100 层历史
git fetch --deepen=100

# 远程仓库历史完整时，补全所配置分支的历史
git fetch --unshallow
```

`--unshallow` 不会自动扩大获取分支的配置。补全历史不等于获取所有远程分支。

参考:

- [Git clone 官方文档](https://git-scm.com/docs/git-clone)
- [Git fetch 官方文档](https://git-scm.com/docs/git-fetch)

## 配置 Config

### 用户名和邮箱

查看和修改用户名及邮箱:

```bash
# 查看
git config user.name
git config user.email

# 修改
git config --global user.name "<your-username>"
git config --global user.email "<your-email>"
```

针对不同项目修改用户名和邮箱:

```bash
git config user.name "<your-username>"
git config user.email "<your-email>"
```

参考:

- [Git 查看和修改用户名和邮箱](http://blog.mazey.net/1985)
- [GitHub / GitLab 为不同的项目修改提交名字 user.name 和邮箱 user.email](http://blog.mazey.net/2956)

### 本地忽略文件

只在当前本地仓库忽略文件，无需修改共享的 `.gitignore`。在普通克隆仓库的根目录执行:

```bash
echo "<your-file>" >> .git/info/exclude
```

例如，忽略未跟踪的 `AGENTS.md`:

```bash
echo "AGENTS.md" >> .git/info/exclude
```

- `.git/info/exclude` 不纳入版本控制，规则不会随提交共享。
- 规则使用 `.gitignore` 的模式语法。`AGENTS.md` 可匹配各级目录中的同名文件；`/AGENTS.md` 只匹配仓库根目录。
- 忽略规则不影响已经跟踪的文件，也不会自动取消跟踪。
- 上述路径适用于 `.git` 为目录的普通克隆，不适用于 `.git` 为文件的链接工作树。

如果需要先重命名文件，可单独执行 `mv AGENTS.log.md AGENTS.md`。执行前确认目标文件不存在，避免覆盖。重命名与设置忽略规则是两个独立操作。

参考: [Git ignore 官方文档](https://git-scm.com/docs/gitignore)

## 权限 Access Credential

添加 SSH Keys 到远程平台:

ED25519 (推荐):

```bash
cd ~ && ssh-keygen -t ed25519 -C "<your-email>" && cd ~/.ssh && cat id_ed25519.pub
```

RSA:

```bash
cd ~ && ssh-keygen -t rsa -C "<your-email>" && cd ~/.ssh && cat id_rsa.pub
```

参考: [GitHub / Gitee 等托管平台添加 SSH Keys](http://blog.mazey.net/2628)

## 缓存 Cache

更新忽略文件 `.gitignore` 后清理缓存:

```bash
git rm -r --cached . && git add . && git commit -m "chore: clean cache" && git push
```

参考: [Git 删除 .gitignore 生成之前上传的文件](http://blog.mazey.net/1401)

## 仓库地址 Remote Repository

修改远程仓库地址:

```bash
git remote set-url origin "<your-repository-url>"
```

参考: [Git 修改远程地址](http://blog.mazey.net/2631)

## 分支 Branch

删除本地和远程分支:

```bash
git branch -d "<your-branch>"
git push origin --delete "<your-branch>"
```

参考: [Git 删除本地和远程分支](http://blog.mazey.net/1617)

## 提交 Commit

修改最近一次 commit 的信息:

```bash
git commit --amend
```

查找第一条提交记录:

```bash
git rev-list --max-parents=0 HEAD
git show "<your-commit-hash>"
```

参考:

- [Git Commit message 和 Change log 编写规范 / 指南](http://blog.mazey.net/2186)
- [Change a commit message](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message)

## 标签 Tag

创建标签并推送:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 拉取 Pull

### 配置 git pull 的 Merge / Rebase 策略

当本地分支和远程分支出现分叉时，可配置 `git pull` 默认使用 Merge 或 Rebase，避免 Git 每次提示选择拉取策略。

使用 Merge:

```bash
git config --global pull.rebase false
```

保留分支原有提交历史，必要时会产生 Merge Commit。

使用 Rebase:

```bash
git config --global pull.rebase true
```

将本地提交重新应用到远程分支最新提交之后，使提交历史更加线性。

仅针对当前仓库配置时，移除 `--global`:

```bash
git config pull.rebase false
git config pull.rebase true
```

查看当前配置:

```bash
git config --get pull.rebase
git config --global --get pull.rebase
```

### 批量拉取

批量拉取指定文件夹下所有 Git 项目最新代码。

参考: [批量拉取 / git pull 指定文件夹下面所有 Git 项目的最新代码](http://blog.mazey.net/3035)

## 开发 Development

npm 直接安装 GitHub / GitLab 仓库代码及 npm link 本地调试。

参考: [npm 直接安装 GitHub / GitLab 仓库代码及 npm link 本地调试](http://blog.mazey.net/2616)

## 极狐 GitLab

相关 CI / CD、部署与构建方案。

参考:

- [GitLab 指定 Runner 执行任务 (CI / CD / JOB)](http://blog.mazey.net/5992)
- [webpack 多页面 & GitLab 增量构建部署模板](http://blog.mazey.net/1706)
- [使用 GitLab CI / CD 和阿里云 CLI 自动部署前端项目](http://blog.mazey.net/1695)

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <https://blog.mazey.net/5611.html>

<!-- ID: 20220303-Git-Command -->
