# Using Multiple Configurations in webpack: Exporting an Array of Config Objects

- [Using Multiple Configurations in webpack: Exporting an Array of Config Objects](#using-multiple-configurations-in-webpack-exporting-an-array-of-config-objects)
  - [My Experience: From Multiple Files to Multi-Config](#my-experience-from-multiple-files-to-multi-config)
    - [The Turning Point](#the-turning-point)
  - [Why Is This Useful?](#why-is-this-useful)
  - [How Does It Work?](#how-does-it-work)
  - [Things to Keep in Mind](#things-to-keep-in-mind)
  - [Example: Multiple HTML and JS Bundles](#example-multiple-html-and-js-bundles)
  - [Conclusion](#conclusion)

If you've ever worked on a web project with multiple entry points or distinct build requirements—such as separate bundles for the BUNDLE_A, BUNDLE_B, and BUNDLE_C—you might have wondered: Can I manage all builds efficiently with one webpack setup?

The answer is yes! webpack natively supports exporting an array of configuration objects, a feature known as "multi-compiler mode." This is a powerful capability that can streamline complex builds and make your workflow much simpler.

## My Experience: From Multiple Files to Multi-Config

At first, I managed my assets with webpack using different config files:

- `webpack.config.BUNDLE_A.js` for the BUNDLE_A
- `webpack.config.BUNDLE_B.js` for the BUNDLE_B
- `webpack.config.BUNDLE_C.js` for BUNDLE_C

Each file had its own build/watch command, and I often ran three terminal sessions (or three services in Docker Compose) to watch source changes. While this worked, it quickly became unwieldy as my project grew.

### The Turning Point

I discovered that I could combine all three configurations into one file by simply exporting an array in my JavaScript config:

```js
// webpack.config.all.js
const BUNDLE_A = require('./webpack.config.BUNDLE_A');
const BUNDLE_B = require('./webpack.config.BUNDLE_B');
const BUNDLE_C = require('./webpack.config.BUNDLE_C');

module.exports = [
  BUNDLE_A,
  BUNDLE_B,
  BUNDLE_C,
];
```

With this, I could build and watch all three bundles at once:

```bash
npx webpack --config ./scripts/webpack.config.all.js --watch
```

No more juggling multiple terminals or convoluted scripts—Webpack handles all three builds using a single command!

## Why Is This Useful?

- Efficiency: All configs run in one process. webpack watches all defined entries and outputs in parallel, automatically rebuilding when relevant files change.
- Maintainability: Shared plugins, settings, or loader rules can be defined in one place and reused.
- Flexibility: Each config can specify its own entry, output, plugins, and loaders. Completely separation, or partial sharing, is possible.

## How Does It Work?

webpack "multi-compiler mode" kicks in whenever you export an array of config objects:

```javascript
module.exports = [
  { ...config for BUNDLE_A... },
  { ...config for BUNDLE_B... },
  { ...config for BUNDLE_C... }
];
```

webpack will process each configuration independently but in the same process. This means you can have:

- Different entry points (`entry` fields)
- Distinct output filenames/folders (`output`)
- Custom plugins per config

## Things to Keep in Mind

- Output Conflicts: Make sure each config outputs files to separate locations or names to avoid conflicts.
- Plugin Use: Some plugins, such as HtmlWebpackPlugin, may need unique configuration per build to avoid overwriting files.
- Performance: For most projects, multi-config is fast and efficient. For very large applications, separate processes may be desirable, but for most workflows, one multi-config is best.

## Example: Multiple HTML and JS Bundles

Here's a sample `webpack.config.js` using the array pattern:

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    name: 'BUNDLE_A',
    entry: './src/BUNDLE_A.js',
    output: { filename: 'BUNDLE_A.bundle.js', path: path.resolve(__dirname, 'dist') },
    plugins: [
      new HtmlWebpackPlugin({ filename: 'BUNDLE_A.html', template: './src/BUNDLE_A.html' }),
    ],
  },
  {
    name: 'BUNDLE_B',
    entry: './src/BUNDLE_B.js',
    output: { filename: 'BUNDLE_B.bundle.js', path: path.resolve(__dirname, 'dist') },
    plugins: [
      new HtmlWebpackPlugin({ filename: 'BUNDLE_B.html', template: './src/BUNDLE_B.html' }),
    ],
  },
];
```

## Conclusion

Exporting an array of config objects in webpack is a best practice for complex builds.  
It simplifies your workflow, reduces duplication, and lets you manage even large, multi-bundle projects efficiently.

Embracing this feature was a game-changer for my projects—and I highly recommend you give it a try whenever you’re working with multiple entry points or distinct build targets!
