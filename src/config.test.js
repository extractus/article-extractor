// config.test
/* eslint-env jest */

import {
  setRequestOptions,
  getRequestOptions,
  setParserOptions,
  getParserOptions,
  setSanitizeHtmlOptions,
  getSanitizeHtmlOptions,
  getHtmlCrushOptions,
  setHtmlCrushOptions,
  getQueryRules,
  addQueryRules,
  setQueryRules
} from './config.js'

import { rules as defaultRules } from './rules.js'

test('Testing setRequestOptions/getRequestOptions methods', () => {
  setRequestOptions({
    headers: {
      authorization: 'bearer <token>'
    },
    timeout: 20,
    somethingElse: 1000
  })

  const actual = getRequestOptions()
  const expectedHeader = {
    authorization: 'bearer <token>',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
    accept: 'text/html; charset=utf-8'
  }

  expect(actual.headers).toEqual(expectedHeader)
  expect(actual.timeout).toEqual(20)
})

test('Testing setParserOptions/getParserOptions methods', () => {
  const expectedWPM = 400
  const expectedAlgorithm = 'levenshtein'

  setParserOptions({
    wordsPerMinute: expectedWPM
  })

  const actual = getParserOptions()

  expect(actual.wordsPerMinute).toEqual(expectedWPM)
  expect(actual.urlsCompareAlgorithm).toEqual(expectedAlgorithm)
})

test('Testing setSanitizeHtmlOptions/getSanitizeHtmlOptions methods', () => {
  setSanitizeHtmlOptions({
    allowedTags: ['div', 'span'],
    allowedAttributes: {
      a: ['href', 'title']
    }
  })

  const actual = getSanitizeHtmlOptions()
  const actualAllowedAttributes = actual.allowedAttributes
  const expectedAllowedAttributes = {
    a: ['href', 'title']
  }

  expect(actualAllowedAttributes).toEqual(expectedAllowedAttributes)

  const actualAllowedTags = actual.allowedTags
  const expectedAllowedTags = ['div', 'span']
  expect(actualAllowedTags).toEqual(expectedAllowedTags)

  setSanitizeHtmlOptions({
    allowedTags: []
  })

  expect(getSanitizeHtmlOptions().allowedTags).toEqual([])
})

test('Testing setHtmlCrushOptions/getHtmlCrushOptions methods', () => {
  const removeHTMLComments = 4
  const removeLineBreaks = true

  setHtmlCrushOptions({
    removeHTMLComments
  })

  const actual = getHtmlCrushOptions()

  expect(actual.removeHTMLComments).toEqual(removeHTMLComments)
  expect(actual.removeLineBreaks).toEqual(removeLineBreaks)
})

test('Testing addQueryRules/setQueryRules/getQueryRules methods', () => {
  const currentRules = getQueryRules()

  expect(currentRules).toEqual(defaultRules)

  addQueryRules()
  addQueryRules([])
  expect(getQueryRules()).toHaveLength(defaultRules.length)

  const newRules = [
    {
      patterns: [
        /somewhere.com\/*/
      ],
      selector: '.article-body',
      unwanted: [
        '.removing-box',
        '.ads-section'
      ]
    },
    {
      patterns: [
        /elsewhere.net\/*/
      ],
      selector: '.main-content',
      unwanted: [
        '.related-posts'
      ]
    }
  ]
  addQueryRules(newRules)

  const updatedRules = getQueryRules()
  expect(updatedRules).toHaveLength(defaultRules.length + newRules.length)
  expect(updatedRules[0]).toEqual(defaultRules[0])
  expect(updatedRules[updatedRules.length - 1]).toEqual(newRules[newRules.length - 1])

  setQueryRules(newRules)
  const latestUpdatedRules = getQueryRules()
  expect(latestUpdatedRules).toHaveLength(2)
  expect(latestUpdatedRules[1]).toEqual(newRules[1])
})
