// html.test
/* eslint-env jest */

import { readFileSync } from 'node:fs'

import { isString } from 'bellajs'

import {
  cleanify
} from './html.js'

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
