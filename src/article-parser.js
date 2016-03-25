/**
 * Article parser
 * @ndaidong
 **/

'use strict';

var async = require('async');
var bella = require('bellajs');
var Promise = require('bluebird');
var fetch = require('node-fetch');
var parse = require('node-readability');
var read = require('read-art');
var sanitize = require('sanitize-html');
var cheerio = require('cheerio');
var oEmbed = require('oembed-auto-es6');

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
  if (o.ReadabilityToken) {
    config.ReadabilityToken = o.ReadabilityToken;
  }
};

var tracer = {};

var parseMeta = (html, url) => {

  let entry = {
    url: url,
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

  try {
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
        entry.canonical = m.attr('href');
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
  } catch (e) {
    tracer.parse = e;
  }

  return entry;
};

var parseWithEmbedly = (url) => {
  return new Promise((resolve, reject) => {
    let u = encodeURIComponent(url);
    let k = config.EmbedlyKey;
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
        let maxw = 0, maxh = 0;
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
        author: author,
        source: o.provider_name || '',
        image: image,
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

    async.series([
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
        if (content) {
          return next();
        }
        return read(html, (err, a) => {
          if (err) {
            tracer.error = err;
          }
          if (a && a.content) {
            content = a.content;
          }
          next();
        });
      },
      (next) => {
        if (content) {
          return next();
        }
        return parse(html, (err, a) => {
          if (err) {
            tracer.error = err;
          }
          if (a && a.content) {
            content = a.content;
            a.close();
          }
          next();
        });
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
    ], (err) => {
      if (err) {
        return reject(err);
      }
      if (!content) {
        return reject(new Error('No article determined'));
      }
      return resolve(content);
    });
  });
};

var absolutifyContentSrc = (s, url) => {
  let $ = cheerio.load(s, {
    normalizeWhitespace: true,
    decodeEntities: true
  });

  $('a').each(function _each1(i, elem) {
    let href = $(elem).attr('href');
    if (href) {
      $(elem).attr('href', absolutify(url, href));
    }
  });

  $('img').each(function _each2(i, elem) {
    let src = $(elem).attr('src');
    if (src) {
      $(elem).attr('src', absolutify(url, src));
    }
  });
  return $.html();
};

var extract = (url) => {

  return new Promise((resolve, reject) => {

    let msg = 'Unknown error';

    url = removeUTM(url);

    let canonicals = [ url ];
    let resURL, bestURL;
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

    async.series([
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
            msg = 'No URL or URL is in black list';
          }
          res.text().then((s) => {
            html = s;
            next();
          }).catch(next);
        }).catch(next);
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
          msg = 'No domain determined';
          return next();
        }

        domain = domain.replace('www.', '');
        if (!source) {
          source = domain;
        }
        return next();
      },
      (next) => {
        if (!bestURL || !html || !meta || !title || !domain) {
          return next();
        }

        return oEmbed
          .extract(bestURL)
          .then((oem) => {
            oemb = oem;
            if (oem.provider_name) {
              source = oem.provider_name;
            }
            if (oem.html) {
              content = oem.html;
            }
            if (oem.title) {
              title = oem.title;
            }
            if (oem.description) {
              description = oem.description;
            }
            if (oem.author_name) {
              author = oem.author_name;
            }
            if (oem.thumbnail_url) {
              image = oem.thumbnail_url;
            }
            if (oem.duration) {
              duration = oem.duration;
            }
            return oem;
          }).catch((e) => {
            tracer.getOEmbed = e;
          }).finally(next);
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
          alias: alias,
          url: bestURL,
          canonicals: canonicals,
          title: title,
          description: description,
          image: absolutify(bestURL, image),
          content: content,
          author: author,
          source: source,
          domain: domain,
          duration: duration
        };
        return next();
      },
      (next) => {
        if (oemb || !article) {
          return next();
        }

        return getArticle(html).then((art) => {
          content = art;
        }).catch((e) => {
          tracer.read = e;
          msg = 'Parsing article failed';
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
            tracer.estimate = e;
            return e;
          }).finally(next);
        }
        return Duration.estimate(content).then((d) => {
          duration = d;
          return null;
        }).catch((e) => {
          tracer.estimate = e;
          return e;
        }).finally(next);
      },
      (next) => {
        if (!article || !content) {
          return next();
        }
        article.duration = duration;
        return next();
      }
    ], (err) => {
      if (err) {
        return reject(err);
      }

      if (!article) {
        return reject(new Error(msg));
      }

      if (!article.title || !article.domain || !article.duration) {
        return reject(new Error('Not enough info to build article'));
      }

      return resolve(article);
    });
  });
};

module.exports = {
  configure: configure,
  getConfig: () => {
    return bella.clone(config);
  },
  extract: extract,
  getArticle: getArticle,
  getOEmbed: oEmbed.extract,
  getDomain: getDomain,
  parseMeta: parseMeta,
  parseWithEmbedly: parseWithEmbedly,
  absolutify: absolutify,
  purify: purify
};
