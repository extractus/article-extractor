#!/usr/bin/env node

var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));
var url = argv.url || argv.u;

var {
  extract
} = require('../src/main');

(async () => {
  let a = await extract(url);
  console.log(a); // eslint-disable-line
})();
