# lock-versions [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Locks all of your package.json's versions to a single version number,
matching the best version currently available on npm that satisfies the
current range.

Useful mostly for providing more reliable deploys when running node
applications in production.

## Module Usage

[![NPM](https://nodei.co/npm/lock-versions.png)](https://nodei.co/npm/lock-versions/)

### lock(json, done(err, locked))

Given a `package.json` file passed in as an object literal, query npm for the
appropriate versions to use, returning the `locked` version of the file as
an object literal when ready.

``` javascript
var lock = require('lock-versions')
var fs = require('fs')

var pkgFile = __dirname + '/package.json'
var pkg = JSON.parse(
  fs.readFileSync(pkgFile, 'utf8')
)

lock(pkg, function(err, updated) {
  if (err) throw err
  fs.writeFileSync(pkgFile, JSON.stringify(updated, null, 2))
})
```

## CLI Usage

You can install this as a command-line tool by running:

``` bash
npm install -g lock-versions
```

Which you can use like so:

```
Usage: lock-versions [file(s)...]

Locks all of your package.json's versions to a single version number,
matching the best version currently available on npm that satisfies the
current range.

Useful mostly for providing more reliable deploys when running node
applications in production.

lock-versions package.json
lock-versions node_modules/*/package.json
cat package.json | lock-versions > package.json
```

## License

MIT. See [LICENSE.md](http://github.com/hughsk/lock-versions/blob/master/LICENSE.md) for details.
