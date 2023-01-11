// transformation.test
/* eslint-env jest */

import {
  addTransformations,
  removeTransformations,
  getTransformations,
  findTransformations,
  execPreParser,
  execPostParser
} from './transformation.js'

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
  expect(result).toEqual(1)
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
  expect(result).toEqual(2)
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
  expect(result).toEqual(0)
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
  expect(result).toEqual(0)
})

test(' get all transformations', () => {
  const result = getTransformations()
  expect(result).toHaveLength(3)
  expect(result[0].patterns[0]).toEqual(/http(s?):\/\/([\w]+.)?def.tld\/*/)
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
  expect(result).toEqual(2)
})

test(' get all transformations again', () => {
  const result = getTransformations()
  expect(result).toHaveLength(4)
  expect(result[3].patterns[1]).toEqual(/http(s?):\/\/rst.inc\/*/)
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
  expect(notFound).toEqual([])

  const foundOne = findTransformations([
    'https://lmn.inc/docs/article.html',
  ])
  expect(foundOne).toHaveLength(1)

  const foundTwo = findTransformations([
    'https://def.gl/docs/article.html',
  ])
  expect(foundTwo).toHaveLength(2)
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
  expect(result.includes('hi <b>user</b>, this is an advertisement element')).toBeTruthy()
  expect(result.includes('<div class="adv">free product now!</div>')).toBeFalsy()
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
  expect(result.includes('<i>user</i>')).toBeTruthy()
  expect(result.includes('<b>user</b>')).toBeFalsy()
})

test(' remove all transformations', () => {
  const result = removeTransformations()
  expect(result).toEqual(7)
  expect(getTransformations()).toEqual([])
})
