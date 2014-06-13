#!/usr/bin/env node

var minimist = require('minimist')
var path     = require('path')
var uniq     = require('uniq')
var tty      = require('tty')
var bl       = require('bl')
var fs       = require('fs')
var argv     = minimist(process.argv.slice(2))
var files    = argv._

if (!files.length || argv.help || argv.h) {
  return tty.isatty()
    ? showHelp()
    : handle(process.stdin, process.stdout)
}

process.env.DEBUG = (process.env.DEBUG || '')
  .split(',')
  .concat('lock-versions')
  .join(',')

uniq(files.map(function(file) {
  return path.resolve(file)
})).forEach(function(file) {
  if (fs.statSync(file).isDirectory()) {
    file = path.resolve(file, 'package.json')
  }

  handle(fs.createReadStream(file), function() {
    return fs.createWriteStream(file)
  })
})

function handle(a, b) {
  var lock = require('./')

  a.pipe(bl(function(err, data) {
    if (err) return this.emit('error', err)
    var self = this

    data = JSON.parse(String(data))

    lock(data, function(err, updated) {
      if (err) return self.emit('error', err)
      updated = JSON.stringify(updated, null, 2)

      if (typeof b === 'function') b = b()

      b.write(updated)
      b.write('\n')

      if (!b._isStdio) b.end()
    })
  }))
}

function showHelp() {
  fs.createReadStream(__dirname + '/usage.txt').once('close', function() {
    console.error()
  }).pipe(process.stderr)
}
