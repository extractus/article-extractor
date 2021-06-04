// utils/extractWithRules

const cheerio = require('cheerio');

const {
  stripTags,
} = require('bellajs');

const {
  error,
} = require('../utils/logger');

const MIN_SECTION_LENGTH = 200;
const MIN_TEXT_LENGTH = 20;

const countWord = (text) => {
  return text.length > 0 ? text.split(/\s+/).length : 0;
};

module.exports = (html) => {
  try {
    const doc = cheerio.load(html, {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeSelfClosing: true,
    });

    const filterElements = [
      '.tb-c-comments-box', // thebureauinvestigates.com
      '.share-buttons', // codecondo.com
      '.sidebar-widget', // hongkiat.com
    ];
    for (let j = 0; j < filterElements.length; j++) {
      doc(filterElements[j]).empty();
    }

    const potentialElements = [
      '.articleContainer__content', // people.com
      '.tb-o-story-section__body', // thebureauinvestigates.com
      '.tdb-block-inner', // defence-blog.com
      '.wysiwyg--all-content', // aljazeera.com
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
      '.page-content',
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
      '.timely-blog-rich-text-block', // memory.ai/timely-blog
      'article',
      '.article',
      '#article',
    ];

    for (let i = 0; i < potentialElements.length; i++) {
      const selector = potentialElements[i];
      const els = doc(selector);
      if (els) {
        const parts = [];
        els.each((_, el) => {
          const section = doc(el);
          const text = section.html().trim();
          if (countWord(text) >= MIN_SECTION_LENGTH) {
            parts.push(text);
          }
        });
        if (parts.length > 0) {
          return parts.reduce((prev, curr) => {
            return prev.concat([curr]);
          }, []).filter((sect) => {
            return stripTags(sect).length > MIN_TEXT_LENGTH;
          }).join('');
        }
      }
    }
  } catch (err) {
    error(err);
  }
  return null;
};
