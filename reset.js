// reset.js

import {
  existsSync,
  unlinkSync
} from 'node:fs'

import { execSync } from 'node:child_process'

const dirs = [
  'evaluation',
  'docs',
  '.nyc_output',
  'coverage',
  'node_modules',
  '.nuxt',
]

const files = [
  'yarn.lock',
  'pnpm-lock.yaml',
  'package-lock.json',
  'coverage.lcov',
]

dirs.forEach((d) => {
  execSync(`rm -rf ${d}`)
})

files.forEach((f) => {
  if (existsSync(f)) {
    unlinkSync(f)
  }
})
