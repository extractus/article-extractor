// rules

// TODO:
// Waiting for URL Pattern specs
// https://developer.mozilla.org/en-US/docs/Web/API/URLPattern

const rules = [
  {
    patterns: [
      /thehill.com\/*/
    ],
    unwanted: [
      '.rollover-people-block'
    ]
  },
  {
    patterns: [
      /http(s?):\/\/([\w]+.)?vietnamnet.vn\/*/,
      /http(s?):\/\/([\w]+.)?vnn.vn\/*/
    ],
    selector: '#ArticleContent',
    unwanted: [
      '.inner-article',
      '.article-relate'
    ]
  },
  {
    patterns: [
      /http(s?):\/\/([\w]+.)?vnexpress.net\/*/
    ],
    unwanted: [
      '.header-content'
    ]
  },
  {
    patterns: [
      /http(s?):\/\/zingnews.vn\/*/
    ],
    unwanted: [
      '.the-article-category',
      '.the-article-meta',
      '.the-article-tags'
    ]
  },
  {
    patterns: [
      /http(s?):\/\/thanhnien.vn\/*/
    ],
    unwanted: [
      '.morenews',
      '.zone--media',
      '.zone--timeline'
    ]
  }
]

module.exports = rules
