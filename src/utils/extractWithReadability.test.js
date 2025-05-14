// extractWithReadability.test

import { describe, it } from 'node:test'
import assert from 'node:assert'

import { readFileSync } from 'node:fs'

import { isString } from '@ndaidong/bellajs'

import extractWithReadability, { extractTitleWithReadability } from './extractWithReadability.js'

describe('test extractWithReadability()', () => {
  it('extract from good html content', async () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = extractWithReadability(html, 'https://foo.bar')
    assert.ok(isString(result))
    assert.ok(result.length > 200)
    assert.ok(result.includes('<img src="https://foo.bar/orange.png">'))
  })

  it('extract from bad html content', async () => {
    assert.equal(extractWithReadability(null), null)
    assert.equal(extractWithReadability({}), null)
    assert.equal(extractWithReadability('<div></span>'), null)
  })

  it('extract title only', async () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = extractTitleWithReadability(html)
    assert.equal(result, 'Article title here - ArticleParser')
  })

  it('extract title from page without title', async () => {
    const html = readFileSync('./test-data/html-no-title.html', 'utf8')
    const result = extractTitleWithReadability(html)
    assert.equal(result, null)
  })

  it('extract title from non-string', async () => {
    const result = extractTitleWithReadability({})
    assert.equal(result, null)
  })
})
