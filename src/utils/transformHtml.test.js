// transformHtml.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { isString } from 'bellajs'

import transformHtml from './transformHtml.js'

describe('test transformHtml()', () => {
  test('test transform html elements from good html content', async () => {
    const transform = (document) => {
      document.querySelectorAll('h1').forEach((node) => {
        const newNode = document.createElement('h2')
        newNode.innerHTML = node.innerHTML
        node.parentNode.replaceChild(newNode, node)
      })
      return document
    }

    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = transformHtml(html, transform)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.not.stringContaining('<h1>Article title here</h1>')
    )
    expect(result).toEqual(
      expect.stringContaining('<h2>Article title here</h2>')
    )
  })
})
