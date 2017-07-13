const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = Object.assign({}, require('./webpack.base.conf'))
const { rootPath, distPath, dev } = require('../config')
const { compat, min } = require('./util').parseArgv(process.argv)
const { version } = require('../package')

baseConfig.entry = null
baseConfig.output = null

let devConfig = {
  entry: {
    'dev': dev.entry
  },
  output: {
    path: distPath,
    filename: '[name].js',
    publicPath: dev.publicPath
  },
  devtool: '#cheap-source-map',
  devServer: {
    contentBase: distPath,
    publicPath: dev.publicPath,
    compress: true,
    port: dev.port,
    clientLogLevel: 'error',
    stats: {
      chunks: false,
      modules: false,
      colors: true
    },
    proxy: {
      /* proxy table */
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': dev.env,
      VERSION: `"${version}"`
    }),
    new HtmlWebpackPlugin({
      template: path.join(rootPath, 'index.ejs'),
      filename: 'index.html',
      inject: true,
      appPath: `${dev.publicPath}{{library}}.js`
    })
  ].concat(
    min
      ? new webpack.optimize.UglifyJsPlugin({
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
      : []
  )
}

if (!compat) {
  devConfig = webpackMerge(devConfig, {
    entry: {
      'dev': [
        `webpack-dev-server/client?http://localhost:${dev.port}/`,
        'webpack/hot/dev-server',
        dev.entry
      ]
    },
    devServer: {
      hot: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  })
}

module.exports = webpackMerge(baseConfig, devConfig)
