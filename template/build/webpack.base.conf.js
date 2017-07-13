const path = require('path')
const { srcPath, distPath } = require('../config')
const assetsPath = path.join(srcPath, 'assets')

module.exports = {
  entry: {
    {{library}}: path.resolve(srcPath, 'index.js')
  },
  output: {
    path: distPath,
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '{{library}}'
  },
  resolve: {
    extensions: ['', '.js', '.html'],
    alias: {
      '@': srcPath,
      Assets: assetsPath
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        include: [srcPath],
        exclude: ['../node_modules'],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [srcPath]
      },
      {
        test: /\.ejs$/,
        loader: 'html-loader',
        include: [srcPath]
      },
      {
        test: /\.p?css$/,
        loaders: ['css-loader?importLoaders=1', 'postcss-loader'],
        include: [srcPath]
      },
      {
        test: /\.(png|jpe?g)$/,
        loader: 'file-loader',
        query: {
          name: 'images/[name].[hash:7].[ext]'
        }
      }
    ]
  }
}
