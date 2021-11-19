// main.test
/* eslint-env jest */

const { readFileSync } = require('fs')
const { URL } = require('url')

const nock = require('nock')

const { name, version } = require('../package.json')

const {
  extract,
  setParserOptions,
  setFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getFetchOptions,
  getSanitizeHtmlOptions
} = require('./main')

const keys = 'url title description image author content published source links ttr'.split(' ')

jest.setTimeout(10000)

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

const hasProperty = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

test('test extract a non-string link', async () => {
  const url = []
  const fn = async () => {
    const re = await extract(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test extract a bad link', async () => {
  const url = 'sfh poidfsf sakdjfh'
  const re = await extract(url)
  expect(re).toBe(null)
})

test('test extract a fake link', async () => {
  const url = 'https://somewhere.xyz'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(404)
  nock(baseUrl).get(path).reply(404)
  const fn = async () => {
    const re = await extract(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test extract an error endpoint', async () => {
  const url = 'https://bad-endpoint-somewhere-do-not.exist'
  const fn = async () => {
    const re = await extract(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test extract a good link', async () => {
  const url = 'https://ndaidong.hashnode.dev/how-to-make-your-mongodb-container-more-secure'
  const result = await extract(url)
  expect(result).toBeInstanceOf(Object)
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true)
  })
})

test('test extract from html content', async () => {
  const html = readFileSync('./test-data/venturebeat.txt', 'utf8')
  const result = await extract(html)
  expect(result).toBeInstanceOf(Object)
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true)
  })
})

test('test extract from actual html content', async () => {
  const html = readFileSync('./test-data/regular-article.html', 'utf8')
  const result = await extract(html)
  expect(result).toBeInstanceOf(Object)
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true)
  })
})

test('test extract oembed', async () => {
  const link = 'https://twitter.com/ndaidong/status/1173592062878314497'
  const result = await extract(link)
  expect(result).toBeInstanceOf(Object)
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true)
  })
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

test('Testing setFetchOptions/getFetchOptions methods', () => {
  setFetchOptions({
    headers: {
      authorization: 'bearer <token>'
    },
    timeout: 20,
    somethingElse: 1000
  })

  const actual = getFetchOptions()
  const expectedHeader = {
    authorization: 'bearer <token>',
    'user-agent': `${name}/${version}`
  }

  expect(actual.headers).toEqual(expectedHeader)
  expect(actual.timeout).toEqual(20)
})

test('Testing with custom user agent string', () => {
  const myUserAgent = 'Googlebot/2.1 (+http://www.google.com/bot.html)'
  setFetchOptions({
    headers: {
      authorization: 'bearer <token>',
      'user-agent': myUserAgent
    },
    timeout: 20,
    somethingElse: 1000
  })

  const actual = getFetchOptions()
  const expectedHeader = {
    authorization: 'bearer <token>',
    'user-agent': myUserAgent
  }

  expect(actual.headers).toEqual(expectedHeader)
  expect(actual.timeout).toEqual(20)
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
