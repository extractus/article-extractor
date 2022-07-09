// release.test

/* eslint-env jest */

import {
  existsSync,
  readFileSync
} from 'fs'

const pkg = JSON.parse(readFileSync('./package.json'))

const cjsFile = `./dist/cjs/${pkg.name}.js`
const cjsPkg = JSON.parse(readFileSync('./dist/cjs/package.json'))

describe('Validate commonjs version output', () => {
  test(`Check if ${cjsFile} created`, () => {
    expect(existsSync(cjsFile)).toBeTruthy()
  })
  test('Check if cjs package info updated', () => {
    expect(cjsPkg.name).toEqual(`${pkg.name}-cjs`)
    expect(cjsPkg.version).toEqual(pkg.version)
  })
  const constent = readFileSync(cjsFile, 'utf8')
  const lines = constent.split('\n')
  test('Check if file meta contains package info', () => {
    expect(lines[0].includes(`${pkg.name}@${pkg.version}`)).toBeTruthy()
    expect(lines[0].includes(pkg.author)).toBeTruthy()
    expect(lines[0].includes(pkg.license)).toBeTruthy()
  })
})
