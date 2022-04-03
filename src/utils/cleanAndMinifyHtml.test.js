// cleanAndMinifyHtml.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isString } from 'bellajs'

import cleanAndMinifyHtml from './cleanAndMinifyHtml.js'

describe('test cleanAndMinifyHtml()', () => {
  test('test stripping attributes from elements', () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = cleanAndMinifyHtml(html)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.not.stringContaining('<p class="contentdetail">')
    )
    expect(result).toEqual(
      expect.stringContaining('<p> Those cheetahs are nothing more than dogs')
    )
  })
  test('test minifying html elements', () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    expect(html).toEqual(
      expect.not.stringContaining(
        '<p>The first fair dog is, in its own way, a lemon.</p> <img src="./orange.png" /></article>'
      )
    )
    const result = cleanAndMinifyHtml(html)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.stringContaining(
        '<p>The first fair dog is, in its own way, a lemon.</p> <img src="./orange.png" /></article>'
      )
    )
  })
})
