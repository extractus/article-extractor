// extractWithReadability.test
/* eslint-env jest */

import { readFileSync } from 'node:fs'

import { isString } from 'bellajs'

import extractWithReadability, { extractTitleWithReadability } from './extractWithReadability.js'

describe('test extractWithReadability()', () => {
  test('extract from good html content', async () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = extractWithReadability(html, 'https://foo.bar')
    expect(isString(result)).toBe(true)
    expect(result.length > 200).toBe(true)
    expect(result).toEqual(expect.stringContaining('<img src="https://foo.bar/orange.png">'))
  })

  test('extract from bad html content', async () => {
    expect(extractWithReadability(null)).toBe(null)
    expect(extractWithReadability({})).toBe(null)
    expect(extractWithReadability('<div></span>')).toBe(null)
  })

  test('extract title only', async () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = extractTitleWithReadability(html)
    expect(result).toBe('Article title here - ArticleParser')
  })

  test('extract title from page without title', async () => {
    const html = readFileSync('./test-data/html-no-title.html', 'utf8')
    const result = extractTitleWithReadability(html)
    expect(result).toBe(null)
  })

  test('extract title from non-string', async () => {
    const result = extractTitleWithReadability({})
    expect(result).toBe(null)
  })
})
