# Workbox v6 (CLI + `workbox-config.js`) Practical Guide

> Target audience: projects using **Workbox v6.x** with **workbox-cli** and a `workbox-config.js` build file.  
> This guide avoids v7-only wording and focuses on v6-compatible usage and patterns.

---

## 1) What is Workbox in v6?

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
npm i -D workbox-cli@^6.1.5
npm i workbox-routing@^6.1.2 workbox-strategies@^6.1.2 workbox-precaching@^6.1.2 workbox-expiration@^6.1.2 workbox-cacheable-response@^6.1.2
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
        request.destination === 'image' && url.origin === 'self.origin', // DO NOT use this literal; see note below
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

### Important correction for same-origin function matcher

Inside CLI config, use:

```js
urlPattern: ({request, url}) =>
  request.destination === 'image' && url.origin === self.location.origin
```

`'self.origin'` as a string is incorrect.

---

## 5) `injectManifest` mode (v6)

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

## 6) Precache vs Runtime cache (v6 best practice)

### Precache
- For build assets you control and version.
- Typical: `index.html`, hashed JS/CSS, app icons, local fonts.

### Runtime cache
- For dynamic or external resources.
- Typical: API responses, CDN files, user images.

### Can the same URL be in both?
- It may still function, but avoid this overlap.
- Usually precache route wins for precached URL matches.
- Overlap can waste storage and complicate debugging.

**Rule of thumb**:  
Do not intentionally cache the same URL in both precache and runtime routes.

---

## 7) Third-party domain caching in v6

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

## 8) Strategy selection cheat sheet (v6)

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

## 9) Typical production recommendations

1. **Set expiration limits** on every runtime cache.
2. **Separate cache names** by resource type (`api-cache`, `images`, `cdn-assets`).
3. **Avoid broad patterns** that cache everything from all origins.
4. **Use explicit origin checks** for third-party.
5. **Plan SW update UX** (`skipWaiting/clientsClaim` only if rollout behavior is acceptable).
6. **Do not cache sensitive endpoints** (auth tokens, profile mutations, etc).

---

## 10) Register service worker (web app side)

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

## 11) Debug checklist (v6)

- DevTools → Application → Service Workers:
  - Is SW installed/activated?
- DevTools → Application → Cache Storage:
  - Are expected cache names created?
- Network tab:
  - Check resource `from ServiceWorker`.
- Hard refresh / unregister old SW when testing config changes.
- Ensure build output path matches `globDirectory` and `swDest`.

---

## 12) Common pitfalls in v6

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

## 13) Minimal `generateSW` config template (copy/paste)

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

## 14) Build script example (`package.json`)

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

## 15) Final migration note (v6 project reading v7 docs)

If you read v7 docs while staying on v6:

- Validate API names/options against your installed v6 packages.
- Keep examples conservative (core strategies/plugins used above are v6-safe).
- Test generated SW behavior in DevTools after each change.

---

## License / usage

Feel free to copy this article into your internal docs and adapt per project.
