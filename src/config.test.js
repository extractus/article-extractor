// config.test
/* eslint-env jest */

const {
  setRequestOptions,
  getRequestOptions,
  setParserOptions,
  getParserOptions,
  setSanitizeHtmlOptions,
  getSanitizeHtmlOptions,
  getQueryRules,
  addQueryRules
} = require('./config')

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
    'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:94.0) Gecko/20100101 Firefox/94.0',
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
    a: ['href', 'title'],
    img: ['src', 'alt']
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

test('Testing addQueryRules/getQueryRules methods', () => {
  const defaultRules = require('./rules')
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
})
