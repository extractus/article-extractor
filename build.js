// build.js

import { readFileSync, writeFileSync, copyFileSync, rmSync, mkdirSync } from 'fs'

import { buildSync } from 'esbuild'

const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }))

rmSync('dist', {
  force: true,
  recursive: true,
})
mkdirSync('dist')

const buildTime = (new Date()).toISOString()
const comment = [
  `// ${pkg.name}@${pkg.version}, by ${pkg.author}`,
  `built with esbuild at ${buildTime}`,
  `published under ${pkg.license} license`,
].join(' - ')

const baseOpt = {
  entryPoints: ['src/main.js'],
  bundle: true,
  charset: 'utf8',
  target: ['es2020', 'node14'],
  pure: ['console.log', 'debug', 'alert'],
  legalComments: 'none',
  minify: true,
  sourcemap: false,
  write: true,
}

const esmVersion = {
  ...baseOpt,
  platform: 'browser',
  format: 'esm',
  outfile: 'dist/article-extractor.esm.js',
  banner: {
    js: comment,
  },
}
buildSync(esmVersion)

const cjsVersion = {
  ...baseOpt,
  platform: 'node',
  format: 'cjs',
  mainFields: ['main'],
  outfile: 'dist/cjs/article-extractor.js',
  banner: {
    js: comment,
  },
}
buildSync(cjsVersion)

const cjspkg = {
  name: pkg.name,
  version: pkg.version,
  main: './article-extractor.js',
}

writeFileSync(
  'dist/cjs/package.json',
  JSON.stringify(cjspkg, null, '  '),
  'utf8'
)

// copy types definition to cjs dir
copyFileSync('./index.d.ts', 'dist/cjs/index.d.ts')
