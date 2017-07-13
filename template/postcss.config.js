var path = require('path')

var spriteConfig = {
  retina: true,
  spritePath: './dist/sprites',
  spritesmith: {
    algorithm: 'top-down',
    padding: 3
  },
  basePath: './src/assets',
  hooks: {
    onSaveSpritesheet: function (opts, spritesheet) {
      return path.join(
        opts.spritePath,
        [`icon_${spritesheet.groups.reverse().join('')}`]
          .concat([
            spritesheet.extension
          ])
          .join('.')
      )
    }
  }
}

module.exports = {
  plugins: [
    require('postcss-smart-import'),
    require('precss'),
    require('postcss-calc'),
    require('autoprefixer'),
    require('postcss-sprites')(spriteConfig)
  ]
}
