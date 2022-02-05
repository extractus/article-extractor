/**
 * reset.js
 * @ndaidong
**/

import {
  existsSync,
  unlinkSync
} from 'fs'

import { execSync } from 'child_process'

const dirs = [
  'dist',
  'docs',
  '.nyc_output',
  'coverage',
  'node_modules',
  '.nuxt'
]

const files = [
  'yarn.lock',
  'pnpm-lock.yaml',
  'package-lock.json',
  'coverage.lcov'
]

dirs.forEach((d) => {
  execSync(`rm -rf ${d}`)
})

files.forEach((f) => {
  if (existsSync(f)) {
    unlinkSync(f)
  }
})
