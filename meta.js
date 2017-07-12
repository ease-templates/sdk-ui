module.exports = {
  prompts: {
    name: {
      type: 'input',
      required: true,
      message: 'Project name'
    },
    description: {
      type: 'input',
      required: true,
      message: 'Project description',
      default: 'a simple web project'
    },
    author: {
      type: 'input',
      message: 'Author'
    },
    lint: {
      type: 'confirm',
      message: 'Use ESLint to lint your code?'
    },
    lintConfig: {
      when: 'lint',
      type: 'list',
      message: 'Pick an ESLint preset',
      choices: [
        {
          "name": "Standard (https://github.com/feross/standard)",
          "value": "standard",
          "short": "Standard"
        },
        {
          "name": "none (configure it yourself)",
          "value": "none",
          "short": "none"
        }
      ]
    },
  },
  filters: {
    '.eslintrc': 'lint'
  },
  completeMessage: 'To get started:\n\n  {{#inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n\n'
}
