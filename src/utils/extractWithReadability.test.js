// extractWithReadability.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isString } from 'bellajs'

import extractWithReadability from './extractWithReadability.js'

test('test extractWithReadability from good html content', async () => {
  const html = readFileSync('./test-data/regular-article.html', 'utf8')
  const result = extractWithReadability(html)
  expect(isString(result)).toBe(true)
  expect(result.length > 200).toBe(true)
})

test('test extractWithReadability from bad html content', async () => {
  expect(extractWithReadability(null)).toBe(null)
  expect(extractWithReadability({})).toBe(null)
  expect(extractWithReadability('<div></span>')).toBe(null)
})
