/**
 * Article parser
 * @ndaidong
 **/

var bella = require('bellajs');
var Promise = require('promise-wtf');
var fetch = require('node-fetch');
var sanitize = require('sanitize-html');
var cheerio = require('cheerio');

var read = require('es6-readability');

var config = require('./config');

var Duration = require('./duration');
var urlResolver = require('./url-resolver');
var absolutify = urlResolver.absolutify;
var purify = urlResolver.purify;
var removeUTM = urlResolver.removeUTM;
var getDomain = urlResolver.getDomain;
var isValidURL = urlResolver.isValidURL;
var isExceptDomain = urlResolver.isExceptDomain;

var configure = (o) => {
  if (o.wordsPerMinute) {
    let wpm = Number(o.wordsPerMinute);
    if (bella.isNumber(wpm) && wpm > 100 && wpm < 1000) {
      config.wordsPerMinute = wpm;
    }
  }

  if (o.blackList) {
    let bl = o.blackList;
    if (bella.isArray(bl)) {
      config.blackList = bl;
    }
  }

  if (o.adsDomain) {
    let ad = o.adsDomain;
    if (bella.isArray(ad)) {
      config.adsDomain = ad;
    }
  }
  if (o.htmlRules) {
    let hr = o.htmlRules;
    if (bella.isObject(hr)) {
      if (hr.allowedTags && bella.isArray(hr.allowedTags)) {
        config.htmlRules.allowedTags = hr.allowedTags;
      }
      if (hr.allowedAttributes && bella.isObject(hr.allowedAttributes)) {
        config.htmlRules.allowedAttributes = hr.allowedAttributes;
      }
    }
  }

  if (o.SoundCloudKey) {
    config.SoundCloudKey = o.SoundCloudKey;
  }
  if (o.YouTubeKey) {
    config.YouTubeKey = o.YouTubeKey;
  }
  if (o.EmbedlyKey) {
    config.EmbedlyKey = o.EmbedlyKey;
  }
};

var tracer = {};

var parseMeta = (html, url) => {

  let entry = {
    url,
    canonical: '',
    title: '',
    description: '',
    image: '',
    author: '',
    source: ''
  };

  let sourceAttrs = [
    'application-name',
    'og:site_name',
    'dc.title'
  ];
  let urlAttrs = [
    'og:url',
    'twitter:url'
  ];
  let titleAttrs = [
    'title',
    'og:title',
    'twitter:title'
  ];
  let descriptionAttrs = [
    'description',
    'og:description',
    'twitter:description'
  ];
  let imageAttrs = [
    'og:image',
    'twitter:image',
    'twitter:image:src'
  ];
  let authorAttrs = [
    'author',
    'creator',
    'og:creator',
    'og:article:author',
    'twitter:creator',
    'dc.creator'
  ];

  let doc = cheerio.load(html, {
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    recognizeSelfClosing: true
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
    let property = bella.strtolower(m.attr('property'));
    let name = bella.strtolower(m.attr('name'));

    if (bella.contains(sourceAttrs, property) || bella.contains(sourceAttrs, name)) {
      entry.source = content;
    }
    if (bella.contains(urlAttrs, property) || bella.contains(urlAttrs, name)) {
      entry.url = content;
    }
    if (bella.contains(titleAttrs, property) || bella.contains(titleAttrs, name)) {
      entry.title = content;
    }
    if (bella.contains(descriptionAttrs, property) || bella.contains(descriptionAttrs, name)) {
      entry.description = content;
    }
    if (bella.contains(imageAttrs, property) || bella.contains(imageAttrs, name)) {
      entry.image = content;
    }
    if (bella.contains(authorAttrs, property) || bella.contains(authorAttrs, name)) {
      entry.author = content;
    }
  });

  return entry;
};

var absolutifyContentSrc = (s, url) => {
  let $ = cheerio.load(s, {
    normalizeWhitespace: true,
    decodeEntities: true
  });

  $('a').each((i, elem) => {
    let href = $(elem).attr('href');
    if (href) {
      $(elem).attr('href', absolutify(url, href));
    }
  });

  $('img').each((i, elem) => {
    let src = $(elem).attr('src');
    if (src) {
      $(elem).attr('src', absolutify(url, src));
    }
  });
  return $.html();
};

var parseWithEmbedly = (url, key = '') => {
  return new Promise((resolve, reject) => {
    let u = encodeURIComponent(url);
    let k = key || config.EmbedlyKey || '';
    let target = `http://api.embed.ly/1/extract?key=${k}&url=${u}&format=json`;

    return fetch(target).then((res) => {
      return res.json();
    }).then((o) => {
      let author = '';
      let authors = o.author || [];
      if (authors.length) {
        author = authors[0].name;
      }
      let image = '';
      let images = o.images || [];
      if (images.length) {
        let maxw = 0;
        let maxh = 0;
        images.forEach((img) => {
          if (img.width > maxw && img.height > maxh) {
            image = img.url;
            maxw = img.width;
            maxh = img.height;
          }
        });
      }
      return resolve({
        url: o.url,
        title: o.title,
        description: o.description,
        author,
        source: o.provider_name || '',
        image,
        content: o.content
      });
    }).catch((e) => {
      return reject(e);
    });
  });
};

var getArticle = (html) => {
  return new Promise((resolve, reject) => {

    let content;

    Promise.series([
      (next) => {
        if (content) {
          return next();
        }

        let $ = cheerio.load(html);

        if (!$) {
          return next();
        }

        let classes = [
          '.post-content noscript',
          '.post-body',
          '.post-content',
          '.article-body',
          '.article-content',
          '.entry-inner',
          '.post',
          'article'
        ];

        for (let i = 0; i < classes.length; i++) {
          let c = $(classes[i]);
          if (c) {
            content = c.html();
            if (content) {
              break;
            }
          }
        }
        return next();
      },
      (next) => {
        return read(html).then((a) => {
          if (a && a.content && !content) {
            content = a.content;
          }
        }).finally(next);
      },
      (next) => {
        if (!content) {
          return next();
        }
        let s = sanitize(content, config.htmlRules);
        let $ = cheerio.load(s, {
          normalizeWhitespace: true,
          decodeEntities: true
        });

        $('a').attr('target', '_blank');
        content = $.html();

        return next();
      }
    ]).then(() => {
      if (!content) {
        return reject(new Error('No article determined'));
      }
      return null;
    }).catch((err) => {
      return reject(err);
    }).finally(() => {
      return resolve(content);
    });
  });
};

var extract = (url) => {

  return new Promise((resolve, reject) => {

    let error;

    url = removeUTM(url);

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

    Promise.series([
      (next) => {
        if (!isExceptDomain(url)) {
          return next();
        }
        return parseWithEmbedly(url).then((a) => {
          resURL = a.url;
          title = a.title;
          description = a.description;
          author = a.author;
          source = a.source;
          content = a.content;
          canonicals.push(resURL);
        }).catch((e) => {
          tracer.embedlyError = e;
        }).finally(next);
      },
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
        canonicals = bella.unique(canonicals);

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

        canonicals = bella.unique(curls);

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
