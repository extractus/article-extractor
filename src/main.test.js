// main.test

import { describe, it } from 'node:test'
import assert from 'node:assert'

import { readFileSync } from 'fs'

import { HttpsProxyAgent } from 'https-proxy-agent'

import nock from 'nock'

import {
  extract,
  getSanitizeHtmlOptions,
  setSanitizeHtmlOptions,
  addTransformations,
  removeTransformations
} from './main.js'

const env = process.env || {}
const PROXY_SERVER = env.PROXY_SERVER || ''

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname,
  }
}

describe('check all exported methods', () => {
  const fns = [
    extract,
    getSanitizeHtmlOptions,
    setSanitizeHtmlOptions,
    addTransformations,
    removeTransformations,
  ]

  fns.forEach((fn) => {
    it(` check ${fn.name}`, () => {
      assert.ok(fn)
    })
  })
})

describe('test extract(bad url)', () => {
  const badSamples = [
    '',
    { k: 9 },
    [1, 3, 4],
    301932,
    'htt:/abc.com/failed-none-sense',
    'fpt://abc.com/failed-none-sense',
    'ttp://badcom/146753785',
    'https://674458092126388225',
    'https://soundcloud^(*%%$%^$$%$$*&(&)())',
  ]

  badSamples.forEach((url) => {
    it(`testing extract bad url "${url}"`, async () => {
      try {
        await extract(url)
      } catch (err) {
        assert.ok(err)
      }
    })
  })
})

describe('test extract(regular article url)', () => {
  const expDesc = [
    'Navigation here Few can name a rational peach that isn\'t a conscientious goldfish!',
    'One cannot separate snakes from plucky pomegranates?',
    'Draped neatly on a hanger, the melons could be said to resemble knowledgeable pigs.',
  ].join(' ')
  const cases = [
    {
      input: {
        url: 'https://somewhere.com/path/to/no/article',
        html: readFileSync('./test-data/html-no-article.html', 'utf8'),
      },
      validate: (result) => {
        assert.equal(result, null)
      },
    },
    {
      input: {
        url: 'https://somewhere.com/path/to/no/content',
        html: '',
      },
      validate: (result) => {
        assert.equal(result, null)
      },
    },
    {
      input: {
        url: 'https://somewhere.com/path/to/article',
        html: readFileSync('./test-data/regular-article.html', 'utf8'),
      },
      validate: (result) => {
        assert.ok(result)
        assert.equal(result.title, 'Article title here')
        assert.equal(result.description, expDesc)
      },
    },
  ]
  cases.forEach(({ input, validate }) => {
    const { url, html, statusCode = 200 } = input
    const { baseUrl, path } = parseUrl(url)
    const scope = nock(baseUrl)
    scope.get(path)
      .reply(statusCode, html, {
        'Content-Type': 'text/html',
      })
    it(`check extract("${url}")`, async () => {
      const result = await extract(url)
      validate(result)
    })
  })

  it('check extract(html string)', async () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = await extract(html)
    assert.ok(result)
    assert.equal(result.title, 'Article title here')
    assert.equal(result.description, expDesc)
  })
})

describe('test extract with modified sanitize-html options', () => {
  const currentSanitizeOptions = getSanitizeHtmlOptions()

  setSanitizeHtmlOptions({
    ...currentSanitizeOptions,
    allowedAttributes: {
      ...currentSanitizeOptions.allowedAttributes,
      code: ['class'],
      div: ['class'],
    },
    allowedClasses: {
      code: ['language-*', 'lang-*'],
    },
  })

  it('check if output contain class attribute', async () => {
    const html = readFileSync('./test-data/article-with-classes-attributes.html', 'utf8')
    const result = await extract(html)
    assert.ok(result.content.includes('code class="lang-js"'))
  })
})

if (PROXY_SERVER !== '') {
  describe('test extract live article API via proxy server', () => {
    it('check if extract method works with proxy server', async () => {
      const url = 'https://www.cnbc.com/2022/09/21/what-another-major-rate-hike-by-the-federal-reserve-means-to-you.html'
      const result = await extract(url, {}, {
        agent: new HttpsProxyAgent(PROXY_SERVER),
      })
      assert.ok(result.title.includes('Federal Reserve'))
      assert.equal(result.source, 'cnbc.com')
    }, 10000)
  })
}
