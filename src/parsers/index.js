// parser

const URL = require('url');

const {
  ucwords,
  copies,
  createAlias,
  createId,
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
  let parsed = URL.parse(url);
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

    let canonicals = unique([
      canonical,
      _url,
      url,
      metaUrl,
    ].filter(isValidURL));

    if (author && author.indexOf(' ') > 0) {
      author = ucwords(author);
    }

    let hashTitle = createAlias(title);
    url = chooseBestURL(canonicals, hashTitle);

    let domain = getDomainFromURL(url);
    if (!source) {
      source = domain;
    }

    let alias = [
      hashTitle,
      time(),
      createId(10),
    ].join('-');

    let structure = {
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

    let ext = findExtension(url);
    if (ext) {
      let art = await ext.extract(url, html);
      let res = copies(art, structure, true);
      if (art.canonicals) {
        res.canonicals = art.canonicals;
      }
      return res;
    }

    let content = await extractWithReadability(html);
    structure.content = content;

    return standalizeArticle(structure);
  } catch (err) {
    error(`Could not extract article from "${url}"`);
    return err;
  }
};

module.exports = parse;
