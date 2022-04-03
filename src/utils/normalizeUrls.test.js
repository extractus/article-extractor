// normalizeUrls.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isString } from 'bellajs'

import normalizeUrls from './normalizeUrls.js'

describe('test normalizeUrls()', () => {
  test('test adding absolute URLs to all links', () => {
    const bestUrl = 'https://test-url.com/burritos-for-life'
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = normalizeUrls(html, bestUrl)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.not.stringContaining('<a href="/dict/watermelon">watermelon</a>')
    )
    expect(result).toEqual(
      expect.stringContaining(
        '<a target="_blank" href="https://test-url.com/dict/watermelon">watermelon</a>'
      )
    )
  })
  test('test adding target=_blank to all links', () => {
    const bestUrl = 'https://test-url.com/burritos-for-life'
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = normalizeUrls(html, bestUrl)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.not.stringContaining(
        '<a href="https://otherwhere.com/descriptions/rational-peach">rational peach</a>'
      )
    )
    expect(result).toEqual(
      expect.stringContaining(
        '<a target="_blank" href="https://otherwhere.com/descriptions/rational-peach">rational peach</a>'
      )
    )
  })
})
