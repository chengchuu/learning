# Workbox v6 (CLI + "workbox-config.js") Practical Guide

- [1) What is Workbox in v6](#1-what-is-workbox-in-v6)
- [2) Install (v6)](#2-install-v6)
- [3) CLI config file basics (`workbox-config.js`)](#3-cli-config-file-basics-workbox-configjs)
- [4) `generateSW` mode (v6)](#4-generatesw-mode-v6)
  - [Example `workbox-config.js` (v6, with runtime caching)](#example-workbox-configjs-v6-with-runtime-caching)
- [5) `skipWaiting` and `clientsClaim` explained (v6)](#5-skipwaiting-and-clientsclaim-explained-v6)
  - [Default lifecycle (both false)](#default-lifecycle-both-false)
  - [`skipWaiting`](#skipwaiting)
  - [`clientsClaim`](#clientsclaim)
  - [Recommended usage](#recommended-usage)
- [6) `injectManifest` mode (v6)](#6-injectmanifest-mode-v6)
  - [`workbox-config.js` for `injectManifest`](#workbox-configjs-for-injectmanifest)
  - [`src/sw.js` (v6-compatible example)](#srcswjs-v6-compatible-example)
- [7) `navigateFallback` example (v6)](#7-navigatefallback-example-v6)
  - [Example config](#example-config)
  - [`offline.html` sample](#offlinehtml-sample)
- [8) Precache vs Runtime cache (v6 best practice)](#8-precache-vs-runtime-cache-v6-best-practice)
  - [Precache](#precache)
  - [Runtime cache](#runtime-cache)
  - [Can the same URL be in both](#can-the-same-url-be-in-both)
- [9) Third-party domain caching in v6](#9-third-party-domain-caching-in-v6)
- [10) Strategy selection cheat sheet (v6)](#10-strategy-selection-cheat-sheet-v6)
- [11) Typical production recommendations](#11-typical-production-recommendations)
- [12) Register service worker (web app side)](#12-register-service-worker-web-app-side)
- [13) Debug checklist (v6)](#13-debug-checklist-v6)
- [14) Common pitfalls in v6](#14-common-pitfalls-in-v6)
- [15) Minimal `generateSW` config template (copy/paste)](#15-minimal-generatesw-config-template-copypaste)
- [16) Build script example (`package.json`)](#16-build-script-example-packagejson)
- [17) Final migration note (v6 project reading v7 docs)](#17-final-migration-note-v6-project-reading-v7-docs)
- [License / usage](#license--usage)

> Target audience: projects using **Workbox v6.x** with **workbox-cli** and a `workbox-config.js` build file.
> This guide avoids v7-only wording and focuses on v6-compatible usage and patterns.

---

## 1) What is Workbox in v6

Workbox v6 helps you generate and maintain a Service Worker (SW) for PWA/offline caching:

- **Precache**: cache build-time known assets (app shell/static files).
- **Runtime cache**: cache requests encountered at runtime (APIs, CDN, images, etc).
- **Strategies**: define cache/network behavior (`CacheFirst`, `NetworkFirst`, etc).
- **Plugins**: control expiration, cacheability, background sync, etc.

With CLI, you typically use one of two modes:

1. `generateSW` (simpler, less custom SW code)
2. `injectManifest` (fully custom SW file, Workbox injects precache manifest)

---

## 2) Install (v6)

If you already have these, skip:

```bash
npm i -D workbox-cli@^6.5.4
npm i -D workbox-routing@^6.5.4 workbox-strategies@^6.5.4 workbox-precaching@^6.5.4 workbox-expiration@^6.5.4 workbox-cacheable-response@^6.5.4
```

> Tip: Keep Workbox package versions aligned as closely as possible in v6 projects.

---

## 3) CLI config file basics (`workbox-config.js`)

Create a config file at project root:

```js
module.exports = {
  // Required:
  globDirectory: 'dist/',

  // Which files to precache:
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'
  ],

  // Output SW:
  swDest: 'dist/sw.js'
};
```

Then generate SW:

```bash
npx workbox generateSW workbox-config.js
```

---

## 4) `generateSW` mode (v6)

Use this when you want configuration-driven SW generation.

### Example `workbox-config.js` (v6, with runtime caching)

```js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'
  ],
  swDest: 'dist/sw.js',

  // Optional quality-of-life:
  cleanupOutdatedCaches: true,
  skipWaiting: false,      // set true only if you accept immediate activation
  clientsClaim: false,     // often paired with skipWaiting in controlled rollouts

  runtimeCaching: [
    // Same-origin images
    {
      urlPattern: ({request, url}) =>
        request.destination === 'image' && url.origin === self.location.origin,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60
        }
      }
    },

    // API
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
    },

    // Third-party CDN assets
    {
      urlPattern: /^https:\/\/cdn\.example\.com\/.*\.(js|css|png|jpg|jpeg|svg|webp)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-assets',
        cacheableResponse: {
          statuses: [0, 200] // include opaque responses
        },
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60
        }
      }
    }
  ]
};
```

---

## 5) `skipWaiting` and `clientsClaim` explained (v6)

These options control **how quickly a new SW version takes over**.

### Default lifecycle (both false)

When a new SW is deployed:

1. It installs and becomes **waiting**.
2. It activates later (usually when old controlled tabs are closed/reloaded).

This is safer for consistency because one page session usually stays on one SW version.

### `skipWaiting`

```js
skipWaiting: true
```

- New SW skips waiting and activates sooner.
- Faster rollout.
- Risk: mixed-version issues if old page references removed/changed assets.

### `clientsClaim`

```js
clientsClaim: true
```

- Once active, SW immediately controls open clients in scope.
- No need to wait for next navigation.
- Risk: behavior can change mid-session for users.

### Recommended usage

- **Conservative (safer):** `skipWaiting: false`, `clientsClaim: false`
- **Aggressive rollout:** `skipWaiting: true`, `clientsClaim: true` (use with versioned assets + update UX prompt)

---

## 6) `injectManifest` mode (v6)

Use this when you need custom SW logic/events.

### `workbox-config.js` for `injectManifest`

```js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'],
  swSrc: 'src/sw.js',
  swDest: 'dist/sw.js'
};
```

Build command:

```bash
npx workbox injectManifest workbox-config.js
```

### `src/sw.js` (v6-compatible example)

```js
/* eslint-disable no-undef */
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate, NetworkFirst, CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

// Injected by workbox-cli injectManifest:
precacheAndRoute(self.__WB_MANIFEST);

// HTML navigation requests (freshness first)
registerRoute(
  ({request}) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({statuses: [200]}),
    ],
  })
);

// Same-origin images
registerRoute(
  ({request, url}) =>
    request.destination === 'image' &&
    url.origin === self.location.origin,
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// Third-party CDN
registerRoute(
  ({url}) => url.origin === 'https://cdn.example.com',
  new StaleWhileRevalidate({
    cacheName: 'cdn-assets',
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// Versioned static assets
registerRoute(
  ({request}) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);
```

---

## 7) `navigateFallback` example (v6)

`navigateFallback` is used for **navigation (HTML document) requests** when navigation fails (e.g., offline).

### Example config

```js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2}'],
  swDest: 'dist/sw.js',

  // Ensure offline.html is included by globPatterns
  navigateFallback: '/offline.html',

  // Optional: limit fallback to app pages only
  navigateFallbackAllowlist: [/^\/$/, /^\/app(\/.*)?$/],

  // Optional: exclude routes that should never fallback
  navigateFallbackDenylist: [/^\/api\/.*$/, /^\/admin\/.*$/],

  runtimeCaching: [
    {
      urlPattern: ({request}) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
        cacheableResponse: {statuses: [200]}
      }
    }
  ]
};
```

### `offline.html` sample

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Offline</title>
  </head>
  <body>
    <h1>You are offline</h1>
    <p>Please check your connection and try again.</p>
  </body>
</html>
```

> Notes:
>
> - `navigateFallback` does **not** apply to API/script/image requests.
> - It only applies to navigation requests.
> - If network is fine and routes are reachable, normal pages should load instead of fallback.

---

## 8) Precache vs Runtime cache (v6 best practice)

### Precache

- For build assets you control and version.
- Typical: `index.html`, hashed JS/CSS, app icons, local fonts.

### Runtime cache

- For dynamic or external resources.
- Typical: API responses, CDN files, user images.

### Can the same URL be in both

- It may still function, but avoid this overlap.
- Usually precache route wins for precached URL matches.
- Overlap can waste storage and complicate debugging.

**Rule of thumb**:
Do not intentionally cache the same URL in both precache and runtime routes.

---

## 9) Third-party domain caching in v6

Yes, runtime caching can cache cross-origin assets if your `urlPattern` matches.

Use one of:

```js
// Function matcher (recommended)
({url}) => url.origin === 'https://cdn.example.com'
```

or

```js
// RegExp matcher
/^https:\/\/cdn\.example\.com\/.*$/
```

For cross-origin opaque responses, include status `0`:

```js
cacheableResponse: { statuses: [0, 200] }
```

---

## 10) Strategy selection cheat sheet (v6)

- `CacheFirst`
  Best for hashed static assets, fonts, stable images.
- `NetworkFirst`
  Best for HTML/API needing freshness.
- `StaleWhileRevalidate`
  Best for UX speed with eventual freshness (common default).
- `NetworkOnly`
  Auth/session/sensitive endpoints.
- `CacheOnly`
  Rare, special controlled scenarios.

---

## 11) Typical production recommendations

1. **Set expiration limits** on every runtime cache.
2. **Separate cache names** by resource type (`api-cache`, `images`, `cdn-assets`).
3. **Avoid broad patterns** that cache everything from all origins.
4. **Use explicit origin checks** for third-party.
5. **Plan SW update UX** (`skipWaiting/clientsClaim` only if rollout behavior is acceptable).
6. **Do not cache sensitive endpoints** (auth tokens, profile mutations, etc).

---

## 12) Register service worker (web app side)

```js
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

---

## 13) Debug checklist (v6)

- DevTools → Application → Service Workers:
  - Is SW installed/activated?
- DevTools → Application → Cache Storage:
  - Are expected cache names created?
- Network tab:
  - Check resource `from ServiceWorker`.
- Hard refresh / unregister old SW when testing config changes.
- Ensure build output path matches `globDirectory` and `swDest`.

---

## 14) Common pitfalls in v6

1. **Wrong scope/path**
   - SW at `/dist/sw.js` may not control `/` pages as expected unless served correctly.
2. **Overlapping precache/runtime rules**
   - Leads to confusing behavior.
3. **Missing status `0` for cross-origin opaque responses**
   - Third-party assets may not be cached as intended.
4. **No expiration plugin**
   - Cache can grow too large.
5. **Caching HTML with CacheFirst**
   - Can trap users on stale pages.

---

## 15) Minimal `generateSW` config template (copy/paste)

```js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,svg,png,jpg,jpeg,woff2}'],
  swDest: 'dist/sw.js',
  cleanupOutdatedCaches: true,
  runtimeCaching: [
    {
      urlPattern: /\/api\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3,
        cacheableResponse: {statuses: [0, 200]},
        expiration: {maxEntries: 100, maxAgeSeconds: 86400}
      }
    },
    {
      urlPattern: /^https:\/\/cdn\.example\.com\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-assets',
        cacheableResponse: {statuses: [0, 200]},
        expiration: {maxEntries: 100, maxAgeSeconds: 2592000}
      }
    }
  ]
};
```

---

## 16) Build script example (`package.json`)

```json
{
  "scripts": {
    "build": "your-build-command",
    "build:sw": "workbox generateSW workbox-config.js",
    "build:all": "npm run build && npm run build:sw"
  }
}
```

---

## 17) Final migration note (v6 project reading v7 docs)

If you read v7 docs while staying on v6:

- Validate API names/options against your installed v6 packages.
- Keep examples conservative (core strategies/plugins used above are v6-safe).
- Test generated SW behavior in DevTools after each change.

---

## License / usage

Feel free to copy this article into your internal docs and adapt per project.
