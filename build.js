/**
 * build.js
 * @ndaidong
 **/

import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'fs'

import { buildSync } from 'esbuild'

const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }))

rmSync('dist', {
  force: true,
  recursive: true
})
mkdirSync('dist')

const buildTime = (new Date()).toISOString()
const comment = [
  `// ${pkg.name}@${pkg.version}, by ${pkg.author}`,
  `built with esbuild at ${buildTime}`,
  `published under ${pkg.license} license`
].join(' - ')

/**
 * @type {import('esbuild').BuildOptions}
 * */
const baseOpt = {
  entryPoints: ['src/main.js'],
  bundle: true,
  charset: 'utf8',
  target: ['es2020', 'node14'],
  minify: true,
  write: true,
  sourcemap: 'external',
  external: ['canvas']
}

/**
 * @type {import('esbuild').BuildOptions}
 */
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

/**
 * @type {import('esbuild').BuildOptions}
 */
const browserVersion = {
  ...baseOpt,
  platform: 'browser',
  format: 'esm',
  outfile: `dist/${pkg.name}.browser.js`,
  banner: {
    js: comment
  }
}
buildSync(browserVersion)
