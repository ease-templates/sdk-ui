const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const { build } = require('../config')
const { version } = require('../package')

const baseFilename = `[name].v${version}`

module.exports = webpackMerge(baseConfig, {
  output: {
    publicPath: build.publicPath,
    filename: `${baseFilename}.js`
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': build.env,
      VERSION: `"${version}"`
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: false
      },
      mangle: {
        screw_ie8: false
      },
      output: {
        screw_ie8: false
      },
      comments: false
    })
  ]
})
