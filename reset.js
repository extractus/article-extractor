#!/usr/bin/env node

var {
  existsSync,
  unlinkSync
} = require('fs');
var exec = require('child_process').execSync;

var dirs = [
  '.nyc_output',
  'coverage',
  'node_modules'
];

var files = [
  'yarn.lock',
  'package-lock.json',
  'coverage.lcov'
];

dirs.forEach((d) => {
  exec(`rm -rf ${d}`);
});

files.forEach((f) => {
  if (existsSync(f)) {
    unlinkSync(f);
  }
});


