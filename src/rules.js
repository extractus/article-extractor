// rules

// TODO:
// Waiting for URL Pattern specs
// https://developer.mozilla.org/en-US/docs/Web/API/URLPattern

/**
 * @type {QueryRule[]}
 */
export const rules = [
  {
    patterns: ['*://thanhnien.vn/*'],
    unwanted: [
      '.morenews',
      '.zone--media',
      '.zone--timeline'
    ]
  },
  {
    patterns: ['*://zingnews.vn/*'],
    unwanted: [
      '.the-article-category',
      '.the-article-meta',
      '.the-article-tags'
    ]
  },
  {
    patterns: ['*://{*.}?vnexpress.net/*'],
    unwanted: [
      '.header-content'
    ]
  },
  {
    patterns: ['*://{*.}?vietnamnet.vn/*', '*://{*.}?vnn.vn/*'],
    selector: '#ArticleContent',
    unwanted: [
      '.inner-article',
      '.article-relate'
    ]
  },
  {
    patterns: ['*://thehill.com/*'],
    unwanted: [
      '.rollover-people-block'
    ]
  },
  {
    patterns: ['*://{*.}?digitaltrends.com/*'],
    unwanted: [
      '.h-editors-recs-title',
      'ul.h-editors-recs'
    ]
  },
  {
    patterns: ['*://{*.}?techradar.com/*'],
    unwanted: [
      'nav.breadcrumb'
    ]
  }
]
