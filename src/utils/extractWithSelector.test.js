// extractWithSelector.test
/* eslint-env jest */

const { readFileSync } = require('fs')

const { isString } = require('bellajs')

const extractWithSelector = require('./extractWithSelector')

test('test extractWithSelector a bad input', () => {
  const result = extractWithSelector(null)
  expect(result).toBe(null)
})

test('test extractWithSelector from good html content', async () => {
  const html = readFileSync('./test-data/regular-article.html', 'utf8')
  const result = extractWithSelector(html)
  expect(isString(result)).toBe(true)
  expect(result.length > 200).toBe(true)
})
