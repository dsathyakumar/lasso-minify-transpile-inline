# lasso-minify-transpile-inline

A minimalist [lasso](https://github.com/lasso-js/lasso) plugin that minifes and transpiles inline source files, that do not have to be wrapped by `$_mod` - the [lasso client side runtime](https://github.com/lasso-js/lasso-modules-client)

## What it does?
- `transpiles` & `minifes` inline source files via `babel-core` & places them in the specified slot.

## Usage

```javascript
{
  type: minify-transpile-inline,
  inline: true,
  path: './path/to/my/jsfile.js',
  slot: 'mySlot'
}
```

## Why is this needed?
This is different from :


```javascript
{
  inline: true,
  run: true,
  type: require,
  path: './path/to/my/jsfile.js',
  slot: 'mySlot'
}
```
Marking as `type: require` will cause the file to be wrapped by the [lasso-modules-client](https://github.com/lasso-js/lasso-modules-client) variable - `$_mod`. In most cases, this definition comes bundled with the externalized script containing the dependencies of your entire page. Just in case, you need to execute a script, on page load, before the externalized JS loads, this plugin helps do it, without wrapping it with the variable - `$_mod`.

### Include this plugin in the lasso config as:

```json
"lasso": {
        "plugins": [
            "lasso-less",
            "lasso-autoprefixer",
            "lasso-marko",
            "lasso-minify-transpile-inline"
        ],
        "minify": false,
        "minifyInlineOnly": true,
        "bundlingEnabled": true,
        "resolveCssUrls": true,
        "noConflict": "gh-fe",
        "cacheProfile": "production"
    }

```
