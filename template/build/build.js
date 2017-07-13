const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const rm = require('rimraf')
const { info } = require('./util').parseArgv(process.argv)
const webpack = require('webpack')
const prodConfig = require('./webpack.prod.conf')
const { distPath } = require('../config')

const spinner = ora('Building for production...')
spinner.start()

rm(distPath, err => {
  if (err) throw err
  webpack(prodConfig, function (err, stats) {
    spinner.stop()
    if (err) {
      throw err
    }
    rm(path.join(distPath, 'sprites'), err => {
      if (err) throw err
      let opts = { colors: true }
      if (!info) {
        Object.assign(opts, {
          chunks: false,
          modules: false,
          children: false,
          chunkModules: false
        })
      }
      process.stdout.write(stats.toString(opts) + '\n\n')
      console.log(chalk.cyan('  Build complete.\n'))
    })
  })
})
