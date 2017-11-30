// utiles/parseMeta

const cheerio = require('cheerio');

const isValidURL = require('../utils/isValidURL');

const strtolower = (s) => {
  return s ? s.toLowerCase() : '';
};

const parseMeta = (html, url) => {
  let entry = {
    url,
    canonical: '',
    title: '',
    description: '',
    image: '',
    author: '',
    source: '',
    publishedTime: '',
  };

  let sourceAttrs = [
    'application-name',
    'og:site_name',
    'dc.title',
  ];
  let urlAttrs = [
    'og:url',
    'twitter:url',
  ];
  let titleAttrs = [
    'title',
    'og:title',
    'twitter:title',
  ];
  let descriptionAttrs = [
    'description',
    'og:description',
    'twitter:description',
  ];
  let imageAttrs = [
    'og:image',
    'twitter:image',
    'twitter:image:src',
  ];
  let authorAttrs = [
    'author',
    'creator',
    'og:creator',
    'og:article:author',
    'twitter:creator',
    'dc.creator',
  ];
  let publishedTimeAttrs = [
    'article:published_time',
  ];

  let doc = cheerio.load(html, {
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    recognizeSelfClosing: true,
  });

  entry.title = doc('title').text();

  doc('link').each((i, link) => {
    let m = doc(link);
    let rel = m.attr('rel');
    if (rel && rel === 'canonical') {
      let href = m.attr('href');
      if (isValidURL(href)) {
        entry.canonical = href;
      }
    }
  });

  doc('meta').each((i, meta) => {
    let m = doc(meta);
    let content = m.attr('content');
    let property = strtolower(m.attr('property'));
    let name = strtolower(m.attr('name'));

    if (sourceAttrs.includes(property) || sourceAttrs.includes(name)) {
      entry.source = content;
    }
    if (urlAttrs.includes(property) || urlAttrs.includes(name)) {
      entry.url = content;
    }
    if (titleAttrs.includes(property) || titleAttrs.includes(name)) {
      entry.title = content;
    }
    if (descriptionAttrs.includes(property) || descriptionAttrs.includes(name)) {
      entry.description = content;
    }
    if (imageAttrs.includes(property) || imageAttrs.includes(name)) {
      entry.image = content;
    }
    if (authorAttrs.includes(property) || authorAttrs.includes(name)) {
      entry.author = content;
    }
    if (publishedTimeAttrs.includes(property) || publishedTimeAttrs.includes(name)) {
      entry.publishedTime = content;
    }
  });

  return entry;
};

module.exports = parseMeta;
