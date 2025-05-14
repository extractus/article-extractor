// html.test
import { describe, it } from 'node:test'
import assert from 'node:assert'

import { readFileSync } from 'node:fs'

import { isString } from '@ndaidong/bellajs'

import {
  cleanify
} from './html.js'

describe('test cleanify() method', () => {
  it('check if unwanted elements/attributes removed', () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    assert.ok(html.includes('<address>4746 Kelly Drive, West Virginia</address>'))
    assert.ok(html.includes('<img src="./orange.png" style="border: solid 1px #000">'))
    const result = cleanify(html)
    assert.ok(isString(result))
    assert.equal(result.includes('<address>4746 Kelly Drive, West Virginia</address>'), false)
    assert.equal(result.includes('<img src="./orange.png" style="border: solid 1px #000">'), false)
  })
})
