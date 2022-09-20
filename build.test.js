// release.test

/* eslint-env jest */

import {
  existsSync,
  readFileSync
} from 'fs'

const pkg = JSON.parse(readFileSync('./package.json'))

const esmFile = `./dist/${pkg.name}.esm.js`
const cjsFile = `./dist/cjs/${pkg.name}.js`
const cjsPkg = JSON.parse(readFileSync('./dist/cjs/package.json'))
const cjsType = './dist/cjs/index.d.ts'

describe('Validate commonjs version output', () => {
  test(`Check if ${cjsFile} created`, () => {
    expect(existsSync(cjsFile)).toBeTruthy()
  })
  test('Check if cjs type copied', () => {
    expect(existsSync(cjsType)).toBeTruthy()
  })
  const constent = readFileSync(cjsFile, 'utf8')
  const lines = constent.split('\n')
  test('Check if file meta contains package info', () => {
    expect(lines[0].includes(`${pkg.name}@${pkg.version}`)).toBeTruthy()
    expect(lines[0].includes(pkg.author)).toBeTruthy()
    expect(lines[0].includes(pkg.license)).toBeTruthy()
  })
  test('Check if cjs package info updated', () => {
    expect(cjsPkg.name).toEqual(pkg.name)
    expect(cjsPkg.version).toEqual(pkg.version)
  })
})

describe('Validate ESM version output', () => {
  test(`Check if ${esmFile} created`, () => {
    expect(existsSync(esmFile)).toBeTruthy()
  })
  const constent = readFileSync(esmFile, 'utf8')
  const lines = constent.split('\n')
  test('Check if file meta contains package info', () => {
    expect(lines[0].includes(`${pkg.name}@${pkg.version}`)).toBeTruthy()
    expect(lines[0].includes(pkg.author)).toBeTruthy()
    expect(lines[0].includes(pkg.license)).toBeTruthy()
  })
})
