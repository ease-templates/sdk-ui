const path = require('path')

const rootPath = path.resolve(__dirname, '../')
const srcPath = path.resolve(__dirname, '../src')
const distPath = path.resolve(__dirname, '../dist')

module.exports = {
  rootPath,
  srcPath,
  distPath,
  dev: {
    port: 9000,
    publicPath: '/',
    autoOpenBrowser: true,
    entry: path.join(rootPath, 'index.js'),
    env: {
      NODE_ENV: '"development"'
    }
  },
  build: {
    publicPath: '/',
    env: {
      NODE_ENV: '"production"'
    }
  }
}
