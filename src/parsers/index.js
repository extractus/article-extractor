// parser

const URL = require('url');

const {
  ucwords,
  copies,
  slugify,
  genid,
  time,
} = require('bellajs');

const {
  standalizeArticle,
  chooseBestURL,
  isValidURL,
  logger,
} = require('../utils');

const findExtension = require('../utils/findExtension');

const {
  error,
} = logger;

const extractMetaTags = require('./extractMetaTags');
const extractWithReadability = require('./extractWithReadability');

const unique = (arr) => {
  return Array.from(new Set(arr));
};

const getDomainFromURL = (url) => {
  const parsed = URL.parse(url);
  return parsed.host.replace('www.', '');
};

const parse = async (input) => {
  let {
    _url,
    url,
    html,
  } = input;

  try {
    let {
      url: metaUrl,
      title = '',
      canonical = '',
      description = '',
      image = '',
      author = '',
      source = '',
      publishedTime = '',
    } = extractMetaTags(html, url);

    const canonicals = unique([
      canonical,
      _url,
      url,
      metaUrl,
    ].filter(isValidURL));

    if (author && author.indexOf(' ') > 0) {
      author = ucwords(author);
    }

    const hashTitle = slugify(title);
    url = chooseBestURL(canonicals, hashTitle);

    const domain = getDomainFromURL(url);
    if (!source) {
      source = domain;
    }

    const alias = [
      hashTitle,
      time(),
      genid(10),
    ].join('-');

    const structure = {
      title,
      alias,
      url,
      canonicals,
      description,
      content: '',
      image,
      author,
      source,
      domain,
      publishedTime,
      duration: 0,
    };

    const ext = findExtension(url);
    if (ext) {
      const art = await ext.extract(url, html);
      const res = copies(art, structure, true);
      if (art.canonicals) {
        res.canonicals = art.canonicals;
      }
      return res;
    }

    const content = await extractWithReadability(html);
    structure.content = content;

    return standalizeArticle(structure);
  } catch (err) {
    error(`Could not extract article from "${url}"`);
    return err;
  }
};

module.exports = parse;
