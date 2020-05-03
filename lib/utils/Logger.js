const chalk = require('chalk');

module.exports = {
  log(...message) {
    console.log.apply(null, message);
  },
  info(...message) {
    console.log(chalk.hex('#56b3b4')(message.join('')));
  },
  warn(...message) {
    console.log(chalk.yellow(message.join('')));
  },
  error(...message) {
    console.log(chalk.red(message.join('')));
  },
  success(...message) {
    console.log(chalk.green(message.join('')));
  },
};