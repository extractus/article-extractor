// html.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isString } from 'bellajs'

import {
  isValid as isHTMLString,
  cleanAndMinify as cleanAndMinifyHtml
} from './html.js'

test('test isHTMLString(bad input)', () => {
  const result = isHTMLString({})
  expect(result).toBe(false)
})

test('test isHTMLString(regular string)', () => {
  const result = isHTMLString('This is just a string, not HTML')
  expect(result).toBe(false)
})

test('test isHTMLString(bad-format HTML)', () => {
  const result = isHTMLString('<div class="welcome">Hello world</span>')
  expect(result).toBe(false)
})

test('test isHTMLString(well-format HTML)', () => {
  const result = isHTMLString('<div class="welcome">Hello <b>world</b><hr></div>')
  expect(result).toBe(true)
})

test('test isHTMLString(example HTML page)', () => {
  const files = [
    'regular-article.html',
    'html-no-title.html',
    'html-article-no-source.html',
    'html-too-short-article.html'
  ]
  files.forEach((file) => {
    const html = readFileSync(`./test-data/${file}`, 'utf8')
    const result = isHTMLString(html)
    expect(result).toBe(true)
  })
})

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
