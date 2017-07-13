const minimist = require('minimist')

exports.parseArgv = function (argv) {
  return minimist(argv.slice(2), { boolean: true })
}
