// main.test
/* eslint-env jest */

const {
  readFileSync
} = require('fs')

const nock = require('nock')

const {
  extract
} = require('./main')

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

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
    'https://soundcloud^(*%%$%^$$%$$*&(&)())'
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
  const cases = [
    {
      input: {
        url: 'https://somewhere.com/path/to/no/article',
        html: readFileSync('./test-data/html-no-article.html', 'utf8')
      },
      validate: (result, expect) => {
        expect(result).toBeFalsy()
      }
    },
    {
      input: {
        url: 'https://somewhere.com/path/to/no/content',
        html: ''
      },
      validate: (result, expect) => {
        expect(result).toBeFalsy()
      }
    },
    {
      input: {
        url: 'https://somewhere.com/path/to/article',
        html: readFileSync('./test-data/regular-article.html', 'utf8')
      },
      validate: (result, expect) => {
        expect(result).toBeTruthy()
        expect(result.title).toEqual('Article title here')
        expect(result.description).toEqual('Few words to summarize this article content')
      }
    }
  ]
  cases.forEach(({ input, validate }) => {
    const { url, html, statusCode = 200 } = input
    const { baseUrl, path } = parseUrl(url)
    const scope = nock(baseUrl)
    scope.get(path)
      .reply(statusCode, html, {
        'Content-Type': 'text/html'
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
    expect(result.description).toEqual('Few words to summarize this article content')
  })
})
