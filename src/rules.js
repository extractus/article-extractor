// rules

// TODO:
// Waiting for URL Pattern specs
// https://developer.mozilla.org/en-US/docs/Web/API/URLPattern

const rules = [
  {
    patterns: [
      /http(s?):\/\/([\w]+.)?techradar.com\/*/
    ],
    unwanted: [
      'nav.breadcrumb'
    ]
  },
  {
    patterns: [
      /http(s?):\/\/([\w]+.)?digitaltrends.com\/*/
    ],
    unwanted: [
      '.h-editors-recs-title',
      'ul.h-editors-recs'
    ]
  },
  {
    patterns: [
      /http(s?):\/\/([\w]+.)?mashable.com\/*/
    ],
    unwanted: [
      'blockquote.tiktok-embed'
    ],
    transform: ($) => {
      const html = $.html()
      const separators = [
        'Read more stories',
        'Explore related content',
        'Read more life stories'
      ]
      const separatorN = 'Follow Mashable SEA on'
      const state = {
        content: html
      }
      for (let i = 0; i < separators.length; i++) {
        const sep = separators[i]
        if (html.includes(sep)) {
          state.content = html.split(sep)[0]
          break
        }
      }
      if (state.content.includes(separatorN)) {
        state.content = html.split(separatorN)[0]
      }
      return $(state.content)
    }
  },
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
