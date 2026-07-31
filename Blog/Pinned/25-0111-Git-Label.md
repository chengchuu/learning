# Git 平台常见 PR & Issue 标签及用途说明

![Git 常见 PR & Issue 标签及用途说明](http://blog.mazey.net/wp-content/uploads/2025/09/Git_SF_7x3.jpg)

在进行项目协作时，合理使用 Git 平台的 Pull Request 与 Issue 标签 (Label)，能大幅提升管理效率和协作体验。本文整理了一些主流标签及其说明、所属分类及颜色，供参考和查询。

- [标签分类](#标签分类)
- [技能标签](#技能标签)
- [项目标签](#项目标签)
- [实践建议](#实践建议)
- [示例应用](#示例应用)

## 标签分类

| Label Name          | Description                  | Category     | Color     |
| :------------------ | :--------------------------- | :----------- | :-------- |
| `bug`               | Something is not working     | Categories   | `#d73a4a` |
| `dependencies`      | Updates dependency file      | Categories   | `#0366d6` |
| `enhancement`       | New feature or request       | Categories   | `#84b6eb` |
| `documentation`     | Documentation updates        | Categories   | `#63EB75` |
| `question`          | Further information needed   | Categories   | `#d876e3` |
| `task`              | Task or to-do item           | Categories   | `#d4c5f9` |
| `refactor`          | Code refactoring             | Type of Work | `#f7cbcc` |
| `design`            | UI/UX or design change       | Scope        | `#a2eeef` |
| `help wanted`       | Extra attention needed       | Community    | `#008672` |
| `discussion`        | Community discussion         | Community    | `#6f42c1` |
| `duplicate`         | Duplicate issue or PR        | Community    | `#cfd3d7` |
| `testing`           | Testing or test improvements | Type of Work | `#e4e669` |
| `cannot merge`      | Cannot be merged             | Status       | `#b60205` |
| `ready to merge`    | Ready to be merged           | Status       | `#0e8a16` |
| `ready for review`  | Ready for review             | Status       | `#0366d6` |
| `ready for release` | Ready for release            | Release      | `#0e8a16` |
| `priority: high`    | High priority                | Priority     | `#b60205` |
| `priority: medium`  | Medium priority              | Priority     | `#fbca04` |
| `priority: low`     | Low priority                 | Priority     | `#0e8a16` |
| `in progress`       | In progress                  | Status       | `#c2e0c6` |
| `blocked`           | Blocked due to issue         | Status       | `#f9d0c4` |
| `needs feedback`    | Needs feedback               | Status       | `#fef2c0` |
| `performance`       | Performance optimization     | Type of Work | `#d4e157` |
| `security`          | Security vulnerabilities     | Type of Work | `#ff6f00` |
| `good first issue`  | Good for beginners           | Difficulty   | `#7057ff` |
| `medium`            | Moderate complexity          | Difficulty   | `#e99695` |
| `hard`              | Hard or challenging          | Difficulty   | `#d93f0b` |
| `frontend`          | Frontend development         | Scope        | `#1d76db` |
| `backend`           | Backend development          | Scope        | `#d4c5f9` |
| `wontfix`           | Not going to be fixed        | Community    | `#ffffff` |
| `invalid`           | Not valid or actionable      | Community    | `#e4e669` |
| `breaking change`   | Breaking change              | Release      | `#b60205` |
| `hotfix`            | Hotfix for critical issue    | Release      | `#d93f0b` |

## 技能标签

| Label Name     | Description                     | Color       |
|:---------------|:--------------------------------|:------------|
| `go`           | Go language related             | `#00ADD8`   |
| `javascript`   | JavaScript language related     | `#f1e05a`   |
| `typescript`   | TypeScript language related     | `#3178c6`   |
| `shell`        | Shell scripting related         | `#89e051`   |
| `docker`       | Docker related                  | `#384d54`   |
| `html`         | HTML related                    | `#e34c26`   |
| `css`          | CSS related                     | `#663399`   |
| `nginx`        | Nginx related                   | `#009639`   |
| `sql`          | SQL language related            | `#e38c00`   |
| `PowerShell`   | PowerShell related              | `#012456`   |
| `php`          | PHP language related            | `#4F5D95`   |
| `python`       | Python language related         | `#3572A5`   |
| `java`         | Java language related           | `#b07219`   |
| `c++`          | C++ language related            | `#f34b7d`   |
| `c#`           | C# language related             | `#178600`   |
| `rust`         | Rust language related           | `#dea584`   |
| `ruby`         | Ruby language related           | `#701516`   |
| `kotlin`       | Kotlin language related         | `#A97BFF`   |
| `swift`        | Swift language related          | `#ffac45`   |
| `dart`         | Dart language related           | `#00B4AB`   |
| `scala`        | Scala language related          | `#c22d40`   |
| `objective-c`  | Objective-C language related    | `#438eff`   |
| `elixir`       | Elixir language related         | `#6e4a7e`   |

> 提示: 颜色参考 [GitHub 语言颜色](https://github.com/ozh/github-colors/blob/master/colors.json)。

## 项目标签

| Label Name     | Description                     | Color       |
|:---------------|:--------------------------------|:------------|
| `web`          | Web related                     | `#c5def5`   |
| `api`          | API related                     | `#5319e7`   |
| `mobile`       | Mobile related                  | `#f4f1bb`   |
| `blog`         | Blog related                    | `#ffe0b2`   |
| `link`         | Link related                    | `#b2dfdb`   |
| `koa`          | Koa related                     | `#a7ffeb`   |
| `scripts`      | Scripts related                 | `#c8e6c9`   |
| `x`            | x related                       | `#d1c4e9`   |

## 实践建议

- 分类明确: 建议根据项目实际情况自定义和精简标签体系，避免标签过多导致管理混乱。
- 颜色区分: 合理设置标签颜色，便于视觉识别不同类型问题，提高协作效率。
- 优先级标签: 如 `priority: high`、`priority: medium`、`priority: low`，有助于团队任务流转和资源分配。
- 状态标签: 如 `in progress`、`blocked`、`ready for review`，可结合自动化流程同步进度。

## 示例应用

- 新功能开发建议标注: `enhancement` + `frontend` / `backend` + `ready for review`
- 紧急修复建议标注: `bug` + `hotfix` + `priority: high`
- 安全相关建议标注: `security` + `backend`
- 需要社区协作建议标注: `help wanted` + `discussion`

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/5662.html>

(完)
