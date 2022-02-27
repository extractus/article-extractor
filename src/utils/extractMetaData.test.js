// extractMetaData.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isObject, hasProperty } from 'bellajs'

import extractMetaData from './extractMetaData.js'

const keys = 'url shortlink amphtml canonical title description image author source published'.split(' ')

test('test extractMetaData(good content)', async () => {
  const html = readFileSync('./test-data/regular-article.html', 'utf8')
  const result = extractMetaData(html)
  expect(isObject(result)).toBe(true)
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true)
  })
})
