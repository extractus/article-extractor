// extractMetaData.test
import { describe, it } from 'node:test'
import assert from 'node:assert'

import { readFileSync } from 'node:fs'

import { isObject, hasProperty } from '@ndaidong/bellajs'

import extractMetaData from './extractMetaData.js'

const keys = 'url shortlink amphtml canonical title description image author source published favicon type'.split(' ')

function isDateString (date) {
  if (typeof date !== 'string') return false
  const d = new Date(date)
  return !isNaN(d.getTime())
}

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

  it('test extractMetaData(find date)', async () => {
    const html1 = readFileSync('./test-data/regular-article-date-time.html', 'utf8')
    const html2 = readFileSync('./test-data/regular-article-date-itemprop.html', 'utf8')
    const html3 = readFileSync('./test-data/regular-article-date-span.html', 'utf8')
    const result1 = extractMetaData(html1)
    const result2 = extractMetaData(html2)
    const result3 = extractMetaData(html3)
    assert.ok(isObject(result1))
    assert.ok(isObject(result2))
    assert.ok(isObject(result3))
    keys.forEach((k) => {
      assert.ok(hasProperty(result1, k))
      assert.ok(hasProperty(result3, k))
      assert.ok(hasProperty(result3, k))
    })
    assert.ok(isDateString(result1.published))
    assert.ok(isDateString(result2.published))
    assert.ok(isDateString(result3.published))
  })
})
