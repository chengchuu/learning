# Workbox v6 (CLI + `workbox-config.js`) 实用指南

本文介绍 Workbox v6 在 CLI 环境中的使用方法，涵盖 generateSW 与 injectManifest 两种模式，说明缓存策略、运行时缓存与预缓存机制，以及 skipWaiting 和 clientsClaim 的更新行为，并提供配置示例与生产实践建议。

- [1) Workbox v6 是什么](#1-workbox-v6-是什么)
- [2) 安装 (v6)](#2-安装-v6)
- [3) CLI 配置文件基础 (`workbox-config.js`)](#3-cli-配置文件基础-workbox-configjs)
- [4) `generateSW` 模式 (v6)](#4-generatesw-模式-v6)
  - [示例 `workbox-config.js` (v6，包含运行时缓存)](#示例-workbox-configjs-v6包含运行时缓存)
- [5) `skipWaiting` 与 `clientsClaim` 说明 (v6)](#5-skipwaiting-与-clientsclaim-说明-v6)
- [6) `injectManifest` 模式 (v6)](#6-injectmanifest-模式-v6)
- [7) `navigateFallback` 示例 (v6)](#7-navigatefallback-示例-v6)
- [8) 预缓存与运行时缓存 (v6 最佳实践)](#8-预缓存与运行时缓存-v6-最佳实践)
  - [预缓存](#预缓存)
  - [运行时缓存](#运行时缓存)
  - [是否可以重复缓存](#是否可以重复缓存)
- [9) 第三方域名缓存 (v6)](#9-第三方域名缓存-v6)
- [10) 策略选择速查表 (v6)](#10-策略选择速查表-v6)
- [11) 生产环境建议](#11-生产环境建议)
- [12) 注册 Service Worker (Web 应用侧)](#12-注册-service-worker-web-应用侧)
- [13) 调试检查清单 (v6)](#13-调试检查清单-v6)
- [14) 常见问题 (v6)](#14-常见问题-v6)
- [15) 最小 `generateSW` 配置模板](#15-最小-generatesw-配置模板)
- [16) 构建脚本示例 (`package.json`)](#16-构建脚本示例-packagejson)
- [17) 迁移说明 (v6 项目参考 v7 文档)](#17-迁移说明-v6-项目参考-v7-文档)

## 1) Workbox v6 是什么

Workbox v6 用于生成和维护 Service Worker (SW)，以支持 PWA 和离线缓存。

主要功能如下:

- **预缓存 (Precache)**: 缓存构建时已知资源。
- **运行时缓存 (Runtime cache)**: 缓存运行时请求。
- **缓存策略 (Strategy)**: 定义网络与缓存行为。
- **插件 (Plugin)**: 控制过期、缓存条件、后台同步等。

CLI 提供两种模式:

1. `generateSW`: 基于配置自动生成 SW。
2. `injectManifest`: 使用自定义 SW 文件。

## 2) 安装 (v6)

如果项目尚未安装:

```bash
npm i -D workbox-cli@^6.5.4
npm i workbox-routing@^6.5.4 workbox-strategies@^6.5.4 workbox-precaching@^6.5.4 workbox-expiration@^6.5.4 workbox-cacheable-response@^6.5.4
```

建议保持各个 Workbox 包版本一致。

## 3) CLI 配置文件基础 (`workbox-config.js`)

在项目根目录创建配置文件:

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'
  ],
  swDest: 'dist/sw.js'
};
```

生成 Service Worker:

```bash
npx workbox generateSW workbox-config.js
```

## 4) `generateSW` 模式 (v6)

该模式适用于以配置驱动生成 Service Worker 的场景。

### 示例 `workbox-config.js` (v6，包含运行时缓存)

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'
  ],
  swDest: 'dist/sw.js',

  cleanupOutdatedCaches: true,
  skipWaiting: false,
  clientsClaim: false,

  runtimeCaching: [
    {
      urlPattern: ({request, url}) =>
        request.destination === 'image' &&
        url.origin === self.location.origin,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /\/api\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ]
};
```

## 5) `skipWaiting` 与 `clientsClaim` 说明 (v6)

这两个选项用于控制 Service Worker 的更新行为。

默认情况下，新版本 SW 会进入等待状态。只有旧页面关闭或刷新后，才会激活。

启用 `skipWaiting` 后，新 SW 会更快激活。启用 `clientsClaim` 后，SW 会立即接管当前页面。

建议如下:

- 稳定优先: 保持默认值。
- 快速发布: 同时启用两者，并配合版本控制。

## 6) `injectManifest` 模式 (v6)

该模式适用于需要自定义 Service Worker 逻辑的场景。

配置示例:

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'],
  swSrc: 'src/sw.js',
  swDest: 'dist/sw.js'
};
```

## 7) `navigateFallback` 示例 (v6)

该选项用于处理离线导航请求。

示例:

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'],
  swDest: 'dist/sw.js',
  navigateFallback: '/offline.html'
};
```

说明:

- 仅适用于 HTML 导航请求。
- 不适用于 API 或资源请求。

## 8) 预缓存与运行时缓存 (v6 最佳实践)

### 预缓存

用于构建时资源，例如: HTML、JavaScript、CSS、本地字体。

### 运行时缓存

用于动态资源，例如: API、CDN 文件、用户上传内容。

### 是否可以重复缓存

避免将同一 URL 同时加入两种缓存。该行为会增加调试难度。

## 9) 第三方域名缓存 (v6)

可以缓存跨域资源。

示例:

```javascript
({url}) => url.origin === 'https://cdn.example.com'
```

对于跨域响应，应包含状态码 `0`:

```javascript
cacheableResponse: { statuses: [0, 200] }
```

## 10) 策略选择速查表 (v6)

- `CacheFirst`
  优先从缓存返回资源；若缓存不存在，则请求网络并写入缓存。适用于带版本号的静态资源，例如 JavaScript、CSS、字体和图片。
- `NetworkFirst`
  优先请求网络；若请求失败或超时，则回退到缓存。适用于需要保持数据新鲜度的资源，例如 HTML 页面和 API 响应。
- `StaleWhileRevalidate`
  优先返回缓存，同时在后台发起网络请求更新缓存。适用于对加载速度要求较高，同时允许短时间内容过期的资源。
- `NetworkOnly`
  仅从网络请求资源，不使用缓存。适用于敏感接口，例如认证、用户信息和支付相关请求。
- `CacheOnly`
  仅从缓存读取资源，不发起网络请求。适用于明确已预缓存的资源，或完全离线的受控场景。

## 11) 生产环境建议

生产环境应遵循以下原则:

1. 为所有缓存设置过期策略。
2. 按资源类型拆分缓存名称。
3. 避免过宽的匹配规则。
4. 明确限制第三方域名。
5. 规划更新策略。
6. 避免缓存敏感接口。

## 12) 注册 Service Worker (Web 应用侧)

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered');
    } catch (e) {
      console.error('SW registration failed', e);
    }
  });
}
```

## 13) 调试检查清单 (v6)

检查以下内容:

- SW 是否成功安装。
- 缓存是否创建。
- 请求是否由 Service Worker 处理。
- 构建路径是否正确。

## 14) 常见问题 (v6)

常见错误包括:

1. Service Worker 路径错误。
2. 缓存规则冲突。
3. 未处理跨域响应。
4. 未设置过期策略。
5. HTML 使用错误缓存策略。

## 15) 最小 `generateSW` 配置模板

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,svg,png,jpg,jpeg,woff2}'],
  swDest: 'dist/sw.js',
  cleanupOutdatedCaches: true
};
```

## 16) 构建脚本示例 (`package.json`)

```json
{
  "scripts": {
    "build": "your-build-command",
    "build:sw": "workbox generateSW workbox-config.js"
  }
}
```

## 17) 迁移说明 (v6 项目参考 v7 文档)

在使用 v6 项目时参考 v7 文档，应注意:

- 核对 API 是否存在。
- 避免使用新特性。
- 每次修改后进行测试。
