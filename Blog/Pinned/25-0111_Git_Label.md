# Git 平台常见 PR & Issue 标签及用途说明

![Git 常见 PR & Issue 标签及用途说明](http://blog.mazey.net/wp-content/uploads/2025/09/Git_SF_7x3.jpg)

在进行项目协作时，合理使用 Git 平台的 Pull Request 与 Issue 标签 (Label)，能大幅提升管理效率和协作体验。本文整理了一些主流标签及其说明、所属分类及颜色，供参考和查询。

- [Git 平台常见 PR \& Issue 标签及用途说明](#git-平台常见-pr--issue-标签及用途说明)
  - [标签分类](#标签分类)
  - [技能标签](#技能标签)
  - [项目标签](#项目标签)
  - [实践建议](#实践建议)
  - [示例应用](#示例应用)

## 标签分类

| Label Name           | Description                                   | Category          | Color       |
|----------------------|-----------------------------------------------|-------------------|-------------|
| `bug`                | 功能异常或出现错误 / Something isn't working    | Categories        | `#d73a4a`   |
| `dependencies`       | 更新依赖文件相关的 PR / Updates dependency file | Categories        | `#0366d6`   |
| `enhancement`        | 新功能或需求请求 / New feature or request       | Categories        | `#84b6eb`   |
| `documentation`      | 文档更新或改进 / Documentation updates          | Categories        | `#63EB75`   |
| `question`           | 需要进一步的信息 / Further information needed   | Categories        | `#d876e3`   |
| `task`               | 一般任务或待办事项 / Task or to-do item         | Categories        | `#d4c5f9`   |
| `refactor`           | 代码重构或清理 / Code refactoring               | Type of Work      | `#f7cbcc`   |
| `design`             | UI/UX 或设计相关更改 / UI/UX or design change   | Scope             | `#a2eeef`   |
| `help wanted`        | 需要额外关注或帮助 / Extra attention needed     | Community         | `#008672`   |
| `discussion`         | 社区讨论 / Community discussion                | Community         | `#6f42c1`   |
| `duplicate`          | 已存在相同问题 / Duplicate issue or PR          | Community         | `#cfd3d7`   |
| `testing`            | 测试相关 / Testing or test improvements        | Type of Work      | `#e4e669`   |
| `cannot merge`       | 因冲突无法合并 / Cannot be merged               | Status            | `#b60205`   |
| `ready to merge`     | 可合并 / Ready to be merged                    | Status            | `#0e8a16`   |
| `ready for review`   | 等待评审 / Ready for review                    | Status            | `#0366d6`   |
| `ready for release`  | 可发布 / Ready for release                     | Release           | `#0e8a16`   |
| `priority: high`     | 高优先级 / High priority                       | Priority          | `#b60205`   |
| `priority: medium`   | 中优先级 / Medium priority                     | Priority          | `#fbca04`   |
| `priority: low`      | 低优先级 / Low priority                        | Priority          | `#0e8a16`   |
| `in progress`        | 正在处理 / In progress                         | Status            | `#c2e0c6`   |
| `blocked`            | 阻塞 / Blocked due to issue                    | Status            | `#f9d0c4`   |
| `needs feedback`     | 需要反馈 / Needs feedback                      | Status            | `#fef2c0`   |
| `performance`        | 性能优化 / Performance optimization            | Type of Work      | `#d4e157`   |
| `security`           | 安全相关 / Security vulnerabilities            | Type of Work      | `#ff6f00`   |
| `good first issue`   | 适合新手 / Good for beginners                  | Difficulty        | `#7057ff`   |
| `medium`             | 中等复杂度 / Moderate complexity               | Difficulty        | `#e99695`   |
| `hard`               | 高复杂度 / Hard or challenging                 | Difficulty        | `#d93f0b`   |
| `frontend`           | 前端相关 / Frontend development                | Scope             | `#1d76db`   |
| `backend`            | 后端相关 / Backend development                 | Scope             | `#d4c5f9`   |
| `wontfix`            | 不予修复 / Won't be fixed                      | Community         | `#ffffff`   |
| `invalid`            | 无效问题 / Not valid or actionable             | Community         | `#e4e669`   |
| `breaking change`    | 不兼容变更 / Breaking change                   | Release           | `#b60205`   |
| `hotfix`             | 紧急修复 / Hotfix for critical issue           | Release           | `#d93f0b`   |

## 技能标签

| Label Name     | Description                     | Color       |
|----------------|---------------------------------|-------------|
| `go`           | Go language related             | `#00ADD8`   |
| `javascript`   | JavaScript language related     | `#f1e05a`   |
| `typescript`   | TypeScript language related     | `#3178c6`   |
| `shell`        | Shell scripting related         | `#89e051`   |
| `docker`       | Docker related                  | `#384d54`   |
| `html`         | HTML related                    | `#e34c26`   |
| `css`          | CSS related                     | `#663399`   |
| `nginx`        | Nginx related                   | `#009639`   |
| `sql`          | SQL language related            | `#e38c00`   |
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
|----------------|---------------------------------|-------------|
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
