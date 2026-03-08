# Workbox v6 版本分布与升级建议 (基于 npm 发布数据)

## 背景与目标

v6 的高频使用版本已集中在 6.5.4 和 6.6.0。本文据此进行版本解读，并给出可执行的升级策略。

## 版本数据总览

### 已提供的数据

| 依赖包 | 版本 | 下载量 | 发布时间 |
|---|---:|---:|---|
| workbox-cacheable-response | 6.5.4 | 980,381 | 4 年前 |
| workbox-cli | 6.6.0 | 3,677 | 3 年前 |
| workbox-cli | 6.5.4 | 6,431 | 4 年前 |
| workbox-expiration | 6.6.0 | 3,249,550 | 3 年前 |
| workbox-expiration | 6.5.4 | 963,249 | 4 年前 |
| workbox-precaching | 6.6.0 | 3,252,309 | 3 年前 |
| workbox-precaching | 6.5.4 | 966,434 | 4 年前 |
| workbox-routing | 6.6.0 | 3,283,139 | 3 年前 |
| workbox-routing | 6.5.4 | 997,095 | 4 年前 |
| workbox-strategies | 6.6.0 | 3,268,997 | 3 年前 |
| workbox-strategies | 6.5.4 | 992,309 | 4 年前 |
| workbox-webpack-plugin | 6.6.0 | 3,094,789 | 3 年前 |
| workbox-webpack-plugin | 6.5.4 | 920,223 | 4 年前 |

### 直接观察

(1) 除 `workbox-cli` 外，其余核心运行时包在 6.6.0 的下载量明显高于 6.5.4。

(2) `workbox-cli` 下载量远低于运行时包，这一现象正常。
CLI 主要用于构建阶段，不参与浏览器运行时依赖链。

## 推荐版本策略

### 方案 A: 统一到 6.6.0 (推荐)

建议将 Workbox 子包统一到 v6 后期稳定点。可采用如下版本策略:

| 依赖包 | 建议版本 |
|---|---|
| workbox-cacheable-response | 6.6.0 |
| workbox-cli | 6.6.0 |
| workbox-expiration | 6.6.0 |
| workbox-precaching | 6.6.0 |
| workbox-routing | 6.6.0 |
| workbox-strategies | 6.6.0 |
| workbox-webpack-plugin | 6.6.0 |

### 方案 B: 保守统一到 6.5.4

若构建链存在严格约束，可统一到 6.5.4。但根据当前数据，运行时包已明显向 6.6.0 集中。除非存在强约束，否则应优先选择 6.6.0。

## 为什么强调版本统一

Workbox 属于多子包协同体系，常在同一 SW 流程内共同生效。版本分散会提升排障复杂度。统一版本可带来三项直接收益:

- 构建与运行行为更可预测。
- 文档与示例的复用效率更高。
- 依赖审计和后续升级路径更清晰。

## 升级实施步骤

### 第一步: 更新依赖声明

将相关依赖统一为同一精确版本。建议先使用固定版本号，暂不使用 `^`，便于回归测试。

### 第二步: 清理并重装依赖

删除 lock 文件与 `node_modules` 后重装。该步骤可减少历史缓存引发的伪兼容问题。

### 第三步: 重新生成 SW 产物

若使用 `workbox-cli`，执行完整构建并重新生成 SW。若使用 `workbox-webpack-plugin`，应确认 precache 清单已更新。

### 第四步: 执行最小回归测试

建议至少覆盖以下场景:

- 首次访问与二次访问 (验证 precache 命中)。
- 离线访问导航页 (验证 fallback)。
- 运行时缓存命中 (API、CDN、图片等)。
- SW 更新链路 (含 `skipWaiting`、`clientsClaim`)。

## 可直接采用的依赖配置示例

| 依赖分类 | 依赖包 | 版本 |
|---|---|---|
| devDependencies | workbox-cli | 6.6.0 |
| devDependencies | workbox-webpack-plugin | 6.6.0 |
| dependencies | workbox-cacheable-response | 6.6.0 |
| dependencies | workbox-expiration | 6.6.0 |
| dependencies | workbox-precaching | 6.6.0 |
| dependencies | workbox-routing | 6.6.0 |
| dependencies | workbox-strategies | 6.6.0 |

依赖分组可按现有工程习惯调整。
关键目标是统一版本，而不是固定分组形式。

## 结论

基于已统计的 npm 数据，Workbox v6 的主流使用重心已落在 6.6.0。统一到 6.6.0 并执行一次完整回归，可在不重构核心架构的前提下，提升版本一致性与后续可维护性。
