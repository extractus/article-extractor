/**
 * build.js
 * @ndaidong
**/

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

import { buildSync } from 'esbuild'

const pkg = JSON.parse(readFileSync('./package.json'))

execSync('rm -rf dist')
execSync('mkdir dist')

const buildTime = (new Date()).toISOString()
const comment = [
  `// ${pkg.name}@${pkg.version}, by ${pkg.author}`,
  `built with esbuild at ${buildTime}`,
  `published under ${pkg.license} license`
].join(' - ')

const baseOpt = {
  entryPoints: ['src/main.js'],
  bundle: true,
  charset: 'utf8',
  target: ['es2020', 'node14'],
  minify: false,
  write: true
}

const cjsVersion = {
  ...baseOpt,
  platform: 'node',
  format: 'cjs',
  mainFields: ['main'],
  outfile: `dist/cjs/${pkg.name}.js`,
  banner: {
    js: comment
  }
}
buildSync(cjsVersion)

const cjspkg = {
  name: pkg.name + '-cjs',
  version: pkg.version,
  main: `./${pkg.name}.js`
}
writeFileSync(
  'dist/cjs/package.json',
  JSON.stringify(cjspkg, null, '  '),
  'utf8'
)
