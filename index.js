// start

const include = require('esm')(module, {
  cjs: true,
  mode: 'auto',
  cache: false,
  sourceMap: false,
});

const main = include('./src/main');
main.version = include('./package').version;

module.exports = main;
