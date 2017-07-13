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
    library: {
      type: 'input',
      required: true,
      message: 'Library name',
      default: 'app'
    },
    useStandard: {
      type: 'confirm',
      message: 'Use ESLint and javascript-standard-style to lint your code?'
    }
  },
  completeMessage: 'To get started:\n\n  {{#inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n\n  npm run dev\n\n'
}
