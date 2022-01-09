// isHTMLString.test
/* eslint-env jest */

import {
  readFileSync
} from 'fs'

import isHTMLString from './isHTMLString.js'

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
