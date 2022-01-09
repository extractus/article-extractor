// extractWithSelector.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isString } from 'bellajs'

import extractWithSelector from './extractWithSelector.js'

test('test extractWithSelector a bad input', () => {
  const result = extractWithSelector(null)
  expect(result).toBe(null)
})

test('test extractWithSelector from good html content', async () => {
  const html = readFileSync('./test-data/regular-article.html', 'utf8')
  const result = extractWithSelector(html, 'article', ['.ads-section'])
  expect(isString(result)).toBe(true)
  expect(result.length > 200).toBe(true)
})
