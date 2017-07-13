var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var opn = require('opn')
var chalk = require('chalk')
var config = require('./webpack.dev.conf')
const { compat } = require('./util').parseArgv(process.argv)

var compiler = webpack(config)

var devServerConfig = config.devServer
var port = devServerConfig.port
var uri = 'http://localhost:' + port
var { autoOpenBrowser } = require('../config').dev

var server = new WebpackDevServer(compiler, devServerConfig)

server.middleware.waitUntilValid(function bundleIsValid () {
  console.log(
    `${chalk.green('>>>')} Listening at localhost: ${chalk.green(port)}`
  )
})

server.listen(port, '0.0.0.0', function (err) {
  if (err) throw err

  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri, {
      app: compat ? 'iexplore' : 'chrome'
    })
  }
})
