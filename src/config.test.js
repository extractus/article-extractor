// config.test
import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  setSanitizeHtmlOptions,
  getSanitizeHtmlOptions
} from './config.js'

describe('check config methods', () => {
  it('Testing setSanitizeHtmlOptions/getSanitizeHtmlOptions methods', () => {
    setSanitizeHtmlOptions({
      allowedTags: ['div', 'span'],
      allowedAttributes: {
        a: ['href', 'title'],
      },
    })

    const actual = getSanitizeHtmlOptions()
    const actualAllowedAttributes = actual.allowedAttributes
    const expectedAllowedAttributes = {
      a: ['href', 'title'],
    }

    assert.deepEqual(actualAllowedAttributes, expectedAllowedAttributes)

    const actualAllowedTags = actual.allowedTags
    const expectedAllowedTags = ['div', 'span']
    assert.deepEqual(actualAllowedTags, expectedAllowedTags)

    setSanitizeHtmlOptions({
      allowedTags: [],
    })

    assert.deepEqual(getSanitizeHtmlOptions().allowedTags, [])
  })
})
