#!/usr/bin/env node

const {
  existsSync,
  unlinkSync,
} = require('fs');

const {execSync} = require('child_process');

const dirs = [
  'dist',
  'docs',
  '.nyc_output',
  'coverage',
  'node_modules',
  '.nuxt',
];

const files = [
  'yarn.lock',
  'package-lock.json',
  'coverage.lcov',
];

dirs.forEach((d) => {
  execSync(`rm -rf ${d}`);
});

files.forEach((f) => {
  if (existsSync(f)) {
    unlinkSync(f);
  }
});
