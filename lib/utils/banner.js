const chalk = require('chalk');
const figlet = require('figlet');
const texBanner = chalk.hex('#28a688')(figlet.textSync('Tex', {horizontalLayout: 'full'}))

console.log(texBanner);
