/**
 * Article parser
 * @ndaidong
 **/

var bella = require('bellajs');
var Promise = require('promise-wtf');
var fetch = require('node-fetch');

var debug = require('debug');
var error = debug('artparser:error');
var info = debug('artparser:info');

var config = require('./config');
var {configure} = config;

var Duration = require('./duration');

var {
  absolutify,
  purify,
  removeUTM,
  getDomain,
  isValidURL,
  isExceptDomain,
  absolutifyContentSrc
} = require('./uri');

var {
  parseFromLink,
  parseWithEmbedly,
  parseMeta,
  getArticle
} = require('./parser');


var extract = (link) => {

  let url = removeUTM(link);

  let canonicals = [url];
  let resURL;
  let bestURL;
  let html;
  let meta;
  let oemb;
  let article;

  let alias = '';
  let title = '';
  let description = '';
  let image = '';
  let author = '';
  let source = '';
  let content = '';
  let domain = '';
  let duration = 0;

  let parse;

  if (!isExceptDomain(url)) {
    parse = () => {
      return parseWithEmbedly(url);
    };
  } else {
    parse = () => {
      return parseFromLink(url);
    };
  }

  return new Promise((resolve, reject) => {
    Promise.series([
      (next) => {
        if (resURL) {
          return next();
        }

        return fetch(url).then((res) => {
          resURL = purify(res.url);
          if (resURL) {
            canonicals.push(resURL);
          } else {
            error = {
              code: '001',
              message: 'No URL or URL is in black list'
            };
          }
          return res.text().then((s) => {
            html = s;
            next();
          });
        }).catch((e) => {
          next(e);
        });
      },
      (next) => {
        if (!resURL || !html) {
          return next();
        }

        meta = parseMeta(html, resURL);

        if (!meta || !meta.title || !meta.url) {
          return next();
        }

        canonicals.push(meta.url);

        if (meta.canonical) {
          canonicals.push(meta.canonical);
        }

        title = meta.title || '';
        description = meta.description || '';
        image = meta.image || '';
        author = meta.author || '';
        domain = domain.replace('www.', '');
        if (!source) {
          source = meta.source || '';
        }

        return next();
      },
      (next) => {
        let tmp = bella.stabilize(canonicals);
        canonicals = tmp.unique();

        let curls = canonicals.filter((cano) => {
          if (!cano) {
            return false;
          }
          if (cano.startsWith('//')) {
            cano = 'http:' + cano;
          }
          cano = purify(cano);
          return isValidURL(cano);
        });

        let tmpCurls = bella.stabilize(curls);
        canonicals = tmpCurls.unique();

        bestURL = canonicals[canonicals.length - 1];

        domain = getDomain(bestURL);

        if (!domain) {
          error = {
            code: '002',
            message: 'No domain determined'
          };
          return next();
        }

        domain = domain.replace('www.', '');
        if (!source) {
          source = domain;
        }
        return next();
      },
      (next) => {
        if (!bestURL || !domain || !title) {
          return next();
        }

        let t = bella.time();
        alias = bella.createAlias(title) + '-' + t;

        let tit = bella.stripTags(title);
        title = bella.truncate(tit, 118);

        let desc = bella.stripTags(description);
        if (desc) {
          description = bella.truncate(desc, 156);
        }

        let auth = author;
        if (auth && auth.indexOf(' ') > 0) {
          author = bella.ucwords(auth);
        }

        article = {
          alias,
          url: bestURL,
          canonicals,
          title,
          description,
          image: absolutify(bestURL, image),
          content,
          author,
          source,
          domain,
          duration
        };

        return next();
      },
      (next) => {
        if (oemb || !article) {
          return next();
        }

        return getArticle(html).then((art) => {
          content = art;
        }).catch((er) => {
          error = er;
        }).finally(next);
      },
      (next) => {
        if (!article || !content || oemb) {
          return next();
        }

        let desc = article.description;
        if (!desc && content) {
          desc = bella.stripTags(content);
          article.description = bella.truncate(desc, 156);
        }

        return next();
      },
      (next) => {

        if (!article || !content || duration) {
          return next();
        }

        article.content = absolutifyContentSrc(content, bestURL);

        if (Duration.isMovie(bestURL) || Duration.isAudio(bestURL)) {
          return Duration.estimate(bestURL).then((d) => {
            duration = d;
            return null;
          }).catch((e) => {
            error = e;
          }).finally(next);
        }
        return Duration.estimate(content).then((d) => {
          duration = d;
          return null;
        }).catch((e) => {
          error = e;
        }).finally(next);
      },
      (next) => {
        if (!article || !content) {
          return next();
        }
        article.duration = duration;
        return next();
      }
    ]).then(() => {
      if (!article || !article.title || !article.domain || !article.duration) {
        error = {
          code: '003',
          message: 'Not enough info to build article',
          article
        };
      }
      return null;
    }).catch((err) => {
      error = err;
    }).finally(() => {
      if (error) {
        return reject(new Error(error.message || 'Something wrong while extracting article'));
      }
      return resolve(article);
    });
  });
};

module.exports = {
  configure,
  getConfig: () => {
    return bella.clone(config);
  },
  extract,
  getArticle,
  getDomain,
  parseMeta,
  parseWithEmbedly,
  absolutify,
  purify
};
