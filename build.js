import { build } from 'esbuild'
import fs from 'fs'

const { dependencies } = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
// we need esbuild to process esm dependencies while leaving cjs compatible ones
// out of the bundle
const esmDependencies = new Set(['bellajs'])
const externalDeps = Object.keys(dependencies)
  .filter(dep => !esmDependencies.has(dep))

build({
  entryPoints: ['./src/main.js'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'bundle.cjs',
  minify: true,
  sourcemap: true,
  external: externalDeps,
})