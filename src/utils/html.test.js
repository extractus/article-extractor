// html.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isString } from 'bellajs'

import {
  isValid as isHTMLString,
  cleanify
} from './html.js'

describe('test isValid() method', () => {
  test('validate bad input', () => {
    const result = isHTMLString({})
    expect(result).toBe(false)
  })

  test('validate regular string', () => {
    const result = isHTMLString('This is just a string, not HTML')
    expect(result).toBe(false)
  })

  test('validate bad-format HTML', () => {
    const result = isHTMLString('<div class="welcome">Hello world</span>')
    expect(result).toBe(false)
  })

  test('validate well-format HTML', () => {
    const result = isHTMLString('<div class="welcome">Hello <b>world</b><hr></div>')
    expect(result).toBe(true)
  })

  test('validate example HTML page', () => {
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
})

describe('test cleanify() method', () => {
  test('check if unwanted elements/attributes removed', () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    expect(html).toEqual(
      expect.stringContaining(
        '<address>4746 Kelly Drive, West Virginia</address>'
      )
    )
    expect(html).toEqual(
      expect.stringContaining(
        '<img src="./orange.png" style="border: solid 1px #000">'
      )
    )
    const result = cleanify(html)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.not.stringContaining(
        '<address>4746 Kelly Drive, West Virginia</address>'
      )
    )
    expect(result).toEqual(
      expect.not.stringContaining(
        '<img src="./orange.png" style="border: solid 1px #000">'
      )
    )
  })
})
