var debug  = require('debug')('lock-versions')
var npm    = require('npm-stats')('https://skimdb.npmjs.com')
var map    = require('map-limit')
var semver = require('semver')
var clone  = require('clone')

module.exports = lock

function lock(json, done) {
  json = clone(json)

  map([
      'dependencies'
    , 'devDependencies'
    , 'optionalDependencies'
  ], 3, function(key, next) {
    if (!json[key]) return next()

    var modules = Object.keys(json[key])

    map(modules, 10, function(module, next) {
      npm.module(module).info(function(err, info) {
        if (err) return next(err)

        var available = Object.keys(info.versions)
        var before = json[key][module]
        var range = json[key][module]
        var best = semver.maxSatisfying(available, range)

        if (best) {
          json[key][module] = best
          debug(module + '@' + before +' => '+ module + '@' + best)
        } else {
          debug('Ignoring ' + module + '@' + range)
        }

        return next()
      })
    }, next)
  }, function(err) {
    done(err, err ? null : json)
  })
}
