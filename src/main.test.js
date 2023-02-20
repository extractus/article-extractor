// main.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import nock from 'nock'

import {
  extract,
  getSanitizeHtmlOptions,
  setSanitizeHtmlOptions,
  addTransformations,
  removeTransformations
} from './main'

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
    test(` check ${fn.name}`, () => {
      expect(fn).toBeTruthy()
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
    test(`testing extract bad url "${url}"`, async () => {
      try {
        await extract(url)
      } catch (err) {
        expect(err).toBeTruthy()
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
      validate: (result, expect) => {
        expect(result).toBeFalsy()
      },
    },
    {
      input: {
        url: 'https://somewhere.com/path/to/no/content',
        html: '',
      },
      validate: (result, expect) => {
        expect(result).toBeFalsy()
      },
    },
    {
      input: {
        url: 'https://somewhere.com/path/to/article',
        html: readFileSync('./test-data/regular-article.html', 'utf8'),
      },
      validate: (result, expect) => {
        expect(result).toBeTruthy()
        expect(result.title).toEqual('Article title here')
        expect(result.description).toEqual(expDesc)
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
    test(`check extract("${url}")`, async () => {
      const result = await extract(url)
      validate(result, expect)
    })
  })

  test('check extract(html string)', async () => {
    const html = readFileSync('./test-data/regular-article.html', 'utf8')
    const result = await extract(html)
    expect(result).toBeTruthy()
    expect(result.title).toEqual('Article title here')
    expect(result.description).toEqual(expDesc)
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

  test('check if output contain class attribute', async () => {
    const html = readFileSync('./test-data/article-with-classes-attributes.html', 'utf8')
    const result = await extract(html)
    expect(result.content).toEqual(expect.stringContaining('code class="lang-js"'))
  })
})
