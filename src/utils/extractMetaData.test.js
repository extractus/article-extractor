// extractMetaData.test
import { describe, it } from 'node:test'
import assert from 'node:assert'

import { readFileSync } from 'node:fs'

import { isObject, hasProperty } from 'bellajs'

import extractMetaData from './extractMetaData.js'

const keys = 'url shortlink amphtml canonical title description image author source published favicon type'.split(' ')

describe('test extractMetaData', () => {
  it('test extractMetaData(good content)', async () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = extractMetaData(html)
    assert.ok(isObject(result))
    keys.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
  })

  it('test extractMetaData(json ld schema content)', async () => {
    const html = readFileSync('./test-data/regular-article-json-ld.html', 'utf8')
    const result = extractMetaData(html)
    assert.ok(isObject(result))
    keys.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
  })
})
