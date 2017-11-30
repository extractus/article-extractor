#!/usr/bin/env node

const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const url = argv.url || argv.u;

const {
  extract,
} = require('../src/main');

(async () => {
  let a = await extract(url);
  console.log(a); // eslint-disable-line
})();
