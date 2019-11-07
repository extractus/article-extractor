// utils/extractWithRules

import cheerio from 'cheerio';

import {
  stripTags,
} from 'bellajs';

import {
  error,
} from '../utils/logger';

export default (html) => {
  try {
    const doc = cheerio.load(html, {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeSelfClosing: true,
    });

    const potentialClasses = [
      '.post-full-content',
      '.rich-text',
      '.post-content',
      '.post-body',
      '.post-entry',
      '.blog-post-content',
      '.ArticleBody-articleBody',
      '.articleBody',
      '.article-content',
      '.post',
      'article',
      '.article',
      '#article',
      '.message-body',
      '.content',
      '.page-content',
      '#content',
      '#main',
    ];

    for (let i = 0; i < potentialClasses.length; i++) {
      const selector = potentialClasses[i];
      const els = doc(selector);
      if (els) {
        const parts = [];
        els.each((i, el) => {
          const section = doc(el);
          const html = section.html().trim();
          if (html.length > 30) {
            parts.push(html);
          }
        });
        if (parts.length > 0) {
          return parts.reduce((prev, curr) => {
            return prev.concat([curr]);
          }, []).filter((section) => {
            return stripTags(section).length > 20;
          }).join('');
        }
      }
    }
    return null;
  } catch (err) {
    error(err);
    return null;
  }
};
