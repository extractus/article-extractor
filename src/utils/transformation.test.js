// transformation.test
import { describe, it as test } from 'node:test'
import assert from 'node:assert'

import {
  addTransformations,
  removeTransformations,
  getTransformations,
  findTransformations,
  execPreParser,
  execPostParser
} from './transformation.js'

describe('test transformation', () => {
  test(' add one transformation object', () => {
    const result = addTransformations({
      patterns: [
        /http(s?):\/\/([\w]+.)?def.tld\/*/,
      ],
      pre: (document) => {
        return document
      },
      post: (document) => {
        return document
      },
    })
    assert.equal(result, 1)
  })

  test(' add multi transformation object', () => {
    const result = addTransformations([
      {
        patterns: [
          /http(s?):\/\/google.com\/*/,
          /http(s?):\/\/goo.gl\/*/,
        ],
      },
      {
        patterns: [
          /http(s?):\/\/goo.gl\/*/,
          /http(s?):\/\/google.inc\/*/,
        ],
      },
    ])
    assert.equal(result, 2)
  })

  test(' add transformation object without patterns', () => {
    const result = addTransformations({
      pre: (document) => {
        return document
      },
      post: (document) => {
        return document
      },
    })
    assert.equal(result, 0)
  })

  test(' add transformation object without valid patterns', () => {
    const result = addTransformations({
      patterns: 123,
      pre: (document) => {
        return document
      },
      post: (document) => {
        return document
      },
    })
    assert.equal(result, 0)
  })

  test(' get all transformations', () => {
    const result = getTransformations()
    assert.equal(result.length, 3)
    assert.deepEqual(result[0].patterns[0], /http(s?):\/\/([\w]+.)?def.tld\/*/)
  })

  test(' remove one transformation', () => {
    addTransformations([
      {
        patterns: [
          /http(s?):\/\/abc.com\/*/,
          /http(s?):\/\/def.gl\/*/,
        ],
      },
      {
        patterns: [
          /http(s?):\/\/hik.gl\/*/,
          /http(s?):\/\/lmn.inc\/*/,
        ],
      },
      {
        patterns: [
          /http(s?):\/\/opq.gl\/*/,
          /http(s?):\/\/rst.inc\/*/,
        ],
      },
    ])
    const result = removeTransformations([
      /http(s?):\/\/goo.gl\/*/,
    ])
    assert.equal(result, 2)
  })

  test(' get all transformations again', () => {
    const result = getTransformations()
    assert.equal(result.length, 4)
    assert.deepEqual(result[3].patterns[1], /http(s?):\/\/rst.inc\/*/)
  })

  test(' find transformations', () => {
    addTransformations([
      {
        patterns: [
          /http(s?):\/\/def.gl\/*/,
          /http(s?):\/\/uvw.inc\/*/,
        ],
      },
    ])
    const notFound = findTransformations([
      'https://goo.gl/docs/article.html',
    ])
    assert.deepEqual(notFound, [])

    const foundOne = findTransformations([
      'https://lmn.inc/docs/article.html',
    ])
    assert.equal(foundOne.length, 1)

    const foundTwo = findTransformations([
      'https://def.gl/docs/article.html',
    ])
    assert.equal(foundTwo.length, 2)
  })

  test(' run execPreParser', () => {
    addTransformations([
      {
        patterns: [
          /http(s?):\/\/xyz.com\/*/,
        ],
        pre: (doc) => {
          doc.querySelectorAll('.adv').forEach((element) => {
            element.parentNode.removeChild(element)
          })
          return doc
        },
      },
    ])
    const html = `
      <div>
        hi <b>user</b>, this is an advertisement element
        <div class="adv">free product now!</div>
      </div>
    `
    const result = execPreParser(html, 'https://xyz.com/article')
    assert.equal(result.includes('hi <b>user</b>, this is an advertisement element'), true)
    assert.equal(result.includes('<div class="adv">free product now!</div>'), false)
  })

  test(' run execPostParser', () => {
    addTransformations([
      {
        patterns: [
          /http(s?):\/\/xyz.com\/*/,
        ],
        post: (doc) => {
          doc.querySelectorAll('b').forEach((element) => {
            const itag = doc.createElement('i')
            itag.innerHTML = element.innerHTML
            element.parentNode.replaceChild(itag, element)
          })
          return doc
        },
      },
    ])
    const html = `
      <div>
        hi <b>user</b>,
        <p>Thank you for your feedback!</p>
      </div>
    `
    const result = execPostParser(html, 'https://xyz.com/article')
    assert.equal(result.includes('<i>user</i>'), true)
    assert.equal(result.includes('<b>user</b>'), false)
  })

  test(' remove all transformations', () => {
    const result = removeTransformations()
    assert.equal(result, 7)
    assert.deepEqual(getTransformations(), [])
  })
})
