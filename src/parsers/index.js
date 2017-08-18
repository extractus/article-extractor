// parser

var URL = require('url');

var debug = require('debug');
var error = debug('artparser:error');

var {
  stripTags,
  ucwords,
  truncate,
  copies,
  createAlias,
  createId,
  time
} = require('bellajs');

var {
  findExtension,
  standalizeArticle,
  chooseBestURL,
  isValidURL
} = require('../utils');

var parseMeta = require('./parseMeta');
var extractWithReadability = require('./extractWithReadability');

var unique = (arr) => {
  return Array.from(new Set(arr));
};

var getDomainFromURL = (url) => {
  let parsed = URL.parse(url);
  return parsed.host.replace('www.', '');
};

var parse = (input) => {
  return new Promise((resolve, reject) => {
    let {
      _url,
      url,
      html
    } = input;

    let {
      url: metaUrl,
      title = '',
      canonical = '',
      description = '',
      image = '',
      author = '',
      source = '',
      publishedTime = ''
    } = parseMeta(html, url);

    let canonicals = unique([
      canonical,
      _url,
      url,
      metaUrl
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
      createId(10)
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
      duration: 0
    };

    let ext = findExtension(url);
    if (ext) {
      return ext.extract(url, html).then((art) => {
        let res = copies(art, structure, true);
        if (art.canonicals) {
          res.canonicals = art.canonicals;
        }
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      });
    }

    return extractWithReadability(html)
      .then((content) => {
        structure.content = content;
        let s = stripTags(description || content);
        structure.description = truncate(s, 156);
        return structure;
      })
      .then(standalizeArticle)
      .then((art) => {
        return resolve(art);
      })
      .catch((err) => {
        error(`Could not extract article from "${url}"`);
        return reject(err);
      });
  });
};

module.exports = parse;
