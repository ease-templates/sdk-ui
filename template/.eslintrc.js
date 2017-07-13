module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  {{#useStandard}}
  extends: 'standard',
  {{/useStandard}}
}
