// utils -> extractMetaData

const cheerio = require('cheerio');

const strtolower = (s) => {
  return s ? s.toLowerCase() : '';
};

module.exports = (html) => {
  const entry = {
    url: '',
    shortlink: '',
    amphtml: '',
    canonical: '',
    title: '',
    description: '',
    image: '',
    author: '',
    source: '',
    published: '',
  };

  const sourceAttrs = [
    'application-name',
    'og:site_name',
    'dc.title',
  ];
  const urlAttrs = [
    'og:url',
    'twitter:url',
  ];
  const titleAttrs = [
    'title',
    'og:title',
    'twitter:title',
  ];
  const descriptionAttrs = [
    'description',
    'og:description',
    'twitter:description',
  ];
  const imageAttrs = [
    'og:image',
    'twitter:image',
    'twitter:image:src',
  ];
  const authorAttrs = [
    'author',
    'creator',
    'og:creator',
    'og:article:author',
    'twitter:creator',
    'dc.creator',
  ];
  const publishedTimeAttrs = [
    'article:published_time',
  ];

  const doc = cheerio.load(html, {
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    recognizeSelfClosing: true,
  });

  entry.title = doc('head > title').text();

  doc('link').each((i, link) => {
    const m = doc(link);
    const rel = m.attr('rel');
    if (rel) {
      const href = m.attr('href');
      if (rel === 'canonical') {
        entry.canonical = href;
      } else if (rel === 'shortlink') {
        entry.shortlink = href;
      } else if (rel === 'amphtml') {
        entry.amphtml = href;
      }
    }
  });

  doc('meta').each((i, meta) => {
    const m = doc(meta);
    const content = m.attr('content');
    const property = strtolower(m.attr('property'));
    const name = strtolower(m.attr('name'));

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
      entry.published = content;
    }
  });

  return entry;
};
