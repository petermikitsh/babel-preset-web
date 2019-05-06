# babel-preset-web

> Like @babel/preset-env, but for web standards.

## Why?

Many JavaScript projects use [@babel/preset-env] to (1) transpile ES2015 language features, and (2) add necessary polyfills for ECMAScript features based on a list of targeted browsers.

However, this misses web standards, such as [fetch]. Although you might be targeting IE11 in your `@babel/preset-env`, your app may throw runtime exceptions if the web standards are not available.

`babel-preset-web` seeks to solve this problem.

[@babel/preset-env]: https://babeljs.io/docs/en/babel-preset-env
[fetch]: https://fetch.spec.whatwg.org/
