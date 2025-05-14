// parseFromHtml.test
import { describe, it } from 'node:test'
import assert from 'node:assert'

import { readFileSync } from 'node:fs'

import { isFunction } from '@ndaidong/bellajs'

import { extractFromHtml as parseFromHtml } from '../main.js'
import { addTransformations } from './transformation.js'

const expDesc = [
  'Navigation here Few can name a rational peach that isn\'t a conscientious goldfish!',
  'One cannot separate snakes from plucky pomegranates?',
  'Draped neatly on a hanger, the melons could be said to resemble knowledgeable pigs.',
].join(' ')

const cases = [
  {
    input: {
      desc: 'a webpage with no title',
      html: readFileSync('./test-data/html-no-title.html', 'utf8'),
    },
    expectation: null,
  },
  {
    input: {
      desc: 'a webpage without link',
      html: readFileSync('./test-data/html-no-link.html', 'utf8'),
    },
    expectation: null,
  },
  {
    input: {
      desc: 'a webpage with no main article',
      html: readFileSync('./test-data/html-no-article.html', 'utf8'),
    },
    expectation: null,
  },
  {
    input: {
      desc: 'a webpage with a very short article',
      html: readFileSync('./test-data/html-too-short-article.html', 'utf8'),
      url: 'abcd',
    },
    expectation: null,
  },
  {
    input: {
      desc: 'a webpage with article but no source',
      html: readFileSync('./test-data/html-article-no-source.html', 'utf8'),
    },
    expectation: (result) => {
      assert.equal(result.source, 'somewhere.any')
    },
  },
  {
    input: {
      desc: 'a webpage with data-src in img tag',
      html: readFileSync('./test-data/html-article-with-data-src.html', 'utf8'),
    },
    expectation: (result) => {
      assert.equal(result.content.includes('<img src="https://somewhere.any/image1.jpg" />'), true)
      assert.equal(result.content.includes('<img src="https://somewhere.any/image2.jpg" />'), true)
    },
  },
  {
    input: {
      desc: 'a webpage with regular article',
      html: readFileSync('./test-data/regular-article.html', 'utf8'),
      url: 'https://somewhere.com/path/to/article',
    },
    expectation: (result) => {
      assert.equal(result.title, 'Article title here')
      assert.equal(result.description, expDesc)
      assert.equal(result.content.includes('<a target="_blank" href="https://otherwhere.com/descriptions/rational-peach">'), true)
      assert.equal(result.content.includes('<a target="_blank" href="https://somewhere.com/dict/watermelon">'), true)
    },
  },
]

describe('test parseFromHtml', () => {
  cases.forEach((acase) => {
    const { input, expectation } = acase
    const { desc, html, url = '' } = input
    it(`check if parseFromHtml() works with ${desc}`, async () => {
      const result = await parseFromHtml(html, url)
      if (isFunction(expectation)) {
        expectation(result)
      } else {
        assert.equal(result, expectation)
      }
    })
  })

  it('check if parseFromHtml() works with multi transforms', async () => {
    addTransformations([
      {
        patterns: [
          /http(s?):\/\/need-transform.tld\/*/,
        ],
        post: (document) => {
          document.querySelectorAll('a').forEach((node) => {
            const sHtml = node.innerHTML
            const link = node.getAttribute('href')
            node.parentNode.replaceChild(document.createTextNode(`[link url="${link}"]${sHtml}[/link]`), node)
          })
          return document
        },
      },
      {
        patterns: [
          /http(s?):\/\/sw.re\/*/,
        ],
        post: (document) => {
          document.querySelectorAll('strong').forEach((node) => {
            const b = document.createElement('B')
            b.innerHTML = node.innerHTML
            node.parentNode.replaceChild(b, node)
          })
          return document
        },
      },
    ])
    const html = readFileSync('./test-data/vnn-article.html', 'utf8')
    const url = 'https://need-transform.tld/path/to/article'
    const result = await parseFromHtml(html, url)
    assert.equal(result.title, 'Article title here')
    assert.equal(result.content.includes('<a href="https://vnn.vn/dict/watermelon" target="_blank">'), false)
    assert.equal(result.content.includes('[link url="https://vnn.vn/dict/watermelon"]watermelon[/link]'), true)
    assert.equal(result.content.includes('<b>in its own way</b>'), true)
  })
})
