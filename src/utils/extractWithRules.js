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
      '.article_content',
      '.textArticle',
      '.main-content-body',
      '.entry-content',
      '.c-post-content',
      '.art-v2-body',
      '.post',
      '#post-detail',
      '#contentdetail',
      '.contentdetail',
      '.message-body',
      '.content',
      '.page-content',
      '.entry',
      '.detail-content',
      '.contentbody',
      '.node-article', // thehill.com
      '#article-body', // dev.to
      '.body', // dev.to
      '.content-news-detail', // nld.com.vn
      '.news-content', // soha.vn
      '.content_detail', // vnexpress.net
      '#divNewsContent', // dantri.com.vn
      '#article-content', // voatiengviet.com
      '#ArticleContent', // vietnamnet.vn
      '.ArticleContent', // vietnamnet.vn
      '#abody', // thanhnien.vn, plo.vn
      '.cms-body', // thanhnien.vn, plo.vn
      '.the-article-body', // news.zing.vn
      '#main-detail-body', // tuoitre.vn
      '.div-content', // voh.com.vn
      '#baiviet-container', // eva.vn
      '.nwsCt', // eva.vn
      '.knc-content', // kenh14.vn
      'article',
      '.article',
      '#article',
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
