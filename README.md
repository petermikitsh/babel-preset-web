# babel-preset-web

> Like @babel/preset-env, but for web standards.

## Why?

Many JavaScript projects use [@babel/preset-env] to (1) transpile ES2015 language features, and (2) add necessary polyfills for ECMAScript features based on a list of target browsers.

However, this misses web standards, such as [fetch]. For example: Although you might be targeting `{"ie: "11"}` in your `@babel/preset-env`, your app **may throw runtime exceptions** if a web standard is not available in any of your target browsers.

`babel-preset-web` seeks to solve this problem.

## Usage

```json
{
  "presets": [
    [
      "babel-preset-web",
      options
    ]
  ]
}
```

## Browserslist Integration

By default `babel-preset-web` will use [browserslist config sources] unless either the [targets] or [ignoreBrowserslistConfig] options are set.

## Options

### `targets`

`string | { [string]: string }`, defaults to `{}`.

This can either be a browserslist-compatible query:

```json
{
  "targets": "> 0.25%, not dead"
}
```

Or an object of minimum environment versions to support:

```json
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```

Example environments: `chrome`, `opera`, `edge`, `firefox`, `safari`, `ie`, `android`, `ios`.

### `debug`

`boolean`, defaults to `false`.

Outputs the targets/plugins used and the version specified in plugin data version to `console.log`.

### `useBuiltIns`

`"usage"` | `false`, defaults to `false`.

`useBuiltIns: 'usage'`

Adds specific imports for polyfills when they are used in each file. We take advantage of the fact that a bundler will load the same polyfill only once.

In

a.js

```js
fetch('http://www.example.com')
```

b.js

```js
new Intl.DateTimeFormat('en-US').format(new Date())
```

Out (if environment doesn't support it)

a.js

```js
import 'whatwg-fetch';
fetch('http://www.example.com')
```

b.js

```js
import 'intl';
new Intl.DateTimeFormat('en-US').format(new Date())
```

Out (if environment supports it)

a.js

```js
fetch('http://www.example.com')
```

b.js

```js
new Intl.DateTimeFormat('en-US').format(new Date())
```

`useBuiltIns: false`

Don't add polyfills automatically per file.

### `ignoreBrowserslistConfig`

`boolean`, defaults to `false`

Toggles whether or not browserslist config sources are used, which includes searching for any browserslist files or referencing the browserslist key inside package.json. This is useful for projects that use a browserslist config for files that won't be compiled with Babel.

[@babel/preset-env]: https://babeljs.io/docs/en/babel-preset-env
[browserslist config sources]: https://github.com/browserslist/browserslist#queries
[fetch]: https://fetch.spec.whatwg.org/
[targets]: #targets
[ignoreBrowserslistConfig]: #ignoreBrowserslistConfig
