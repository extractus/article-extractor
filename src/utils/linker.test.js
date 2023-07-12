// linker.test
/* eslint-env jest */

import { readFileSync } from 'node:fs'

import { isString } from 'bellajs'

import {
  chooseBestUrl,
  isValid as isValidUrl,
  purify as purifyUrl,
  normalize as normalizeUrls,
  absolutify as absolutifyUrl
} from './linker.js'

describe('test isValidUrl()', () => {
  const cases = [
    {
      url: 'https://www.23hq.com',
      expected: true,
    },
    {
      url: 'https://secure.actblue.com',
      expected: true,
    },
    {
      url: 'https://docs.microsoft.com/en-us/azure/iot-edge/quickstart?view=iotedge-2018-06',
      expected: true,
    },
    {
      url: 'http://192.168.1.199:8081/example/page',
      expected: true,
    },
    {
      url: 'ftp://192.168.1.199:8081/example/page',
      expected: false,
    },
    {
      url: '',
      expected: false,
    },
    {
      url: null,
      expected: false,
    },
    {
      url: { a: 'x' },
      expected: false,
    },
  ]
  cases.forEach(({ url, expected }) => {
    test(`isValidUrl("${url}") must return "${expected}"`, () => {
      const result = isValidUrl(url)
      expect(result).toEqual(expected)
    })
  })
})

describe('test normalizeUrls()', () => {
  test('test adding absolute URLs to all links', () => {
    const bestUrl = 'https://test-url.com/burritos-for-life'
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = normalizeUrls(html, bestUrl)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.not.stringContaining('<a href="/dict/watermelon">watermelon</a>')
    )
    expect(result).toEqual(
      expect.stringContaining(
        '<a target="_blank" href="https://test-url.com/dict/watermelon">watermelon</a>'
      )
    )
  })
  test('test adding target=_blank to all links', () => {
    const bestUrl = 'https://test-url.com/burritos-for-life'
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = normalizeUrls(html, bestUrl)
    expect(isString(result)).toBe(true)
    expect(result).toEqual(
      expect.not.stringContaining(
        '<a href="https://otherwhere.com/descriptions/rational-peach">rational peach</a>'
      )
    )
    expect(result).toEqual(
      expect.stringContaining(
        '<a target="_blank" href="https://otherwhere.com/descriptions/rational-peach">rational peach</a>'
      )
    )
  })
})

describe('test purifyUrl()', () => {
  const entries = [
    {
      url: '',
      expected: null,
    },
    {
      url: {},
      expected: null,
    },
    {
      url: 'https://some.where/article/abc-xyz',
      expected: 'https://some.where/article/abc-xyz',
    },
    {
      url: 'https://some.where/article/abc-xyz#name,bob',
      expected: 'https://some.where/article/abc-xyz',
    },
    {
      url: 'https://some.where/article/abc-xyz?utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz',
    },
    {
      url: 'https://some.where/article/abc-xyz?q=3&utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz?q=3',
    },
    {
      url: 'https://some.where/article/abc-xyz?pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz',
    },
    {
      url: 'https://some.where/article/abc-xyz?q=3&pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz?q=3',
    },
  ]
  entries.forEach((entry) => {
    const {
      url,
      expected,
    } = entry
    test(`purifyUrl("${url}") must become "${expected}"`, () => {
      const result = purifyUrl(url)
      expect(result).toEqual(expected)
    })
  })
})

describe('test absolutifyUrl()', () => {
  const entries = [
    {
      full: '',
      expected: '',
    },
    {
      relative: {},
      expected: '',
    },
    {
      full: 'https://some.where/article/abc-xyz',
      relative: 'category/page.html',
      expected: 'https://some.where/article/category/page.html',
    },
    {
      full: 'https://some.where/article/abc-xyz',
      relative: '../category/page.html',
      expected: 'https://some.where/category/page.html',
    },
    {
      full: 'https://some.where/blog/authors/article/abc-xyz',
      relative: '/category/page.html',
      expected: 'https://some.where/category/page.html',
    },
    {
      full: 'https://some.where/article/abc-xyz',
      expected: 'https://some.where/article/abc-xyz',
    },
  ]
  entries.forEach((entry) => {
    const {
      full,
      relative,
      expected,
    } = entry
    test(`absolutifyUrl("${full}", "${relative}") must become "${expected}"`, () => {
      const result = absolutifyUrl(full, relative)
      expect(result).toEqual(expected)
    })
  })
})

describe('test chooseBestUrl()', () => {
  test('test chooseBestUrl an actual case', () => {
    const title = 'Google đã ra giá mua Fitbit'
    const urls = [
      'https://alpha.xyz/tin-tuc-kinh-doanh/-/view_content/content/2965950/google-da-ra-gia-mua-fitbit',
      'https://alpha.xyz/tin-tuc-kinh-doanh/view/2965950/907893219797',
      'https://alpha.xyz/tin-tuc-kinh-doanh/google-da-ra-gia-mua-fitbit',
      'https://a.xyz/read/google-da-ra-gia-mua-fitbit',
      'https://a.xyz/read/2965950/907893219797',
    ]
    const result = chooseBestUrl(urls, title)
    expect(result).toBe(urls[3])
  })
})
