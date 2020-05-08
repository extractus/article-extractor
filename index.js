/**
 * Starting app
 * @ndaidong
**/

const main = require('./src/main');
main.version = require('./package.json').version;

module.exports = main;
