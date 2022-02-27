// rules

// TODO:
// Waiting for URL Pattern specs
// https://developer.mozilla.org/en-US/docs/Web/API/URLPattern

/**
 * @type {QueryRule[]}
 */
export const rules = [
  {
    patterns: [
      { hostname: 'thanhnien.vn' }
    ],
    unwanted: [
      '.morenews',
      '.zone--media',
      '.zone--timeline'
    ]
  },
  {
    patterns: [
      { hostname: 'zingnews.vn' }
    ],
    unwanted: [
      '.the-article-category',
      '.the-article-meta',
      '.the-article-tags'
    ]
  },
  {
    patterns: [
      { hostname: '{*.}?vnexpress.net' }
    ],
    unwanted: [
      '.header-content'
    ]
  },
  {
    patterns: [
      { hostname: '{*.}?vietnamnet.vn' },
      { hostname: '{*.}?vnn.vn' }
    ],
    selector: '#ArticleContent',
    unwanted: [
      '.inner-article',
      '.article-relate'
    ]
  },
  {
    patterns: [
      { hostname: 'thehill.com' }
    ],
    unwanted: [
      '.rollover-people-block'
    ]
  },
  {
    patterns: [
      { hostname: '{*.}?digitaltrends.com' }
    ],
    unwanted: [
      '.h-editors-recs-title',
      'ul.h-editors-recs'
    ]
  },
  {
    patterns: [
      { hostname: '{*.}?techradar.com' }
    ],
    unwanted: [
      'nav.breadcrumb'
    ]
  }
]
