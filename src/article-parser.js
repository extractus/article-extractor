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
var oembed = require('oembed-auto');

var config = require('./config');

var Duration = require('./duration');
var urlResolver = require('./url-resolver');
var purifyURL = urlResolver.purifyURL;
var removeUTM = urlResolver.removeUTM;
var getDomain = urlResolver.getDomain;
var isValidURL = urlResolver.isValidURL;

var configure = (o) => {
  if(o.wordsPerMinute){
    let wpm = Number(o.wordsPerMinute);
    if(bella.isNumber(wpm) && wpm > 100 && wpm < 1000){
      config.wordsPerMinute = wpm;
    }
  }
  if(o.blackList){
    let bl = o.blackList;
    if(bella.isArray(bl)){
      config.blackList = bl;
    }
  }
  if(o.adsDomain){
    let ad = o.adsDomain;
    if(bella.isArray(ad)){
      config.adsDomain = ad;
    }
  }
  if(o.htmlRules){
    let hr = o.htmlRules;
    if(bella.isObject(hr)){
      if(hr.allowedTags && bella.isArray(hr.allowedTags)){
        config.htmlRules.allowedTags = hr.allowedTags;
      }
      if(hr.allowedAttributes && bella.isObject(hr.allowedAttributes)){
        config.htmlRules.allowedAttributes = hr.allowedAttributes;
      }
    }
  }
}

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
  }

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

  try{
    let doc = cheerio.load(html, {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeSelfClosing: true
    });

    entry.title = doc('title').text();

    doc('link').each((i, link) => {
      let m = doc(link);
      let rel = m.attr('rel');
      if(rel && rel === 'canonical'){
        entry.canonical = m.attr('href');
      }
    });

    doc('meta').each((i, meta) => {

      let m = doc(meta);
      let content = m.attr('content');
      let property = bella.strtolower(m.attr('property'));
      let name = bella.strtolower(m.attr('name'));

      if(bella.contains(sourceAttrs, property) || bella.contains(sourceAttrs, name)){
        entry.source = content;
      }
      if(bella.contains(urlAttrs, property) || bella.contains(urlAttrs, name)){
        entry.url = content;
      }
      if(bella.contains(titleAttrs, property) || bella.contains(titleAttrs, name)){
        entry.title = content;
      }
      if(bella.contains(descriptionAttrs, property) || bella.contains(descriptionAttrs, name)){
        entry.description = content;
      }
      if(bella.contains(imageAttrs, property) || bella.contains(imageAttrs, name)){
        entry.image = content;
      }
      if(bella.contains(authorAttrs, property) || bella.contains(authorAttrs, name)){
        entry.author = content;
      }
    });
  }
  catch(e){
    console.log(e);
  }

  return entry;
}

var getOEmbed = (url) => {
  return new Promise((resolve, reject) => {
    oembed(url, (err, data) => {
      if(err){
        return reject(err);
      }
      return resolve(data);
    });
  });
}

var getArticle = (html) => {
  return new Promise((resolve, reject) => {

    let content;

    async.series([
      (next) => {
        if(content){
          return next();
        }

        let $ = cheerio.load(html);

        if(!$){
          return next();
        }

        let classes = [
          '.post-content noscript',
          '.post-content',
          '.post-body',
          '.entry-inner',
          '.post',
          'article'
        ];

        for(let i = 0; i < classes.length; i++){
          let c = $(classes[i]);
          if(c){
            content = c.html();
            if(content){
              break;
            }
          }
        }
        next();
      },
      (next) => {
        if(content){
          return next();
        }
        read(html, (err, a) => {
          if(err){
            tracer.error = err;
          }
          if(a && a.content){
            content = a.content;
          }
          next();
        });
      },
      (next) => {
        if(content){
          return next();
        }
        parse(html, (err, a) => {
          if(err){
            tracer.error = err;
          }
          if(a && a.content){
            content = a.content;
            a.close();
          }
          next();
        });
      },
      (next) => {
        if(!content){
          return next();
        }

        let s = sanitize(content, config.htmlRules);
        let $ = cheerio.load(s, {
          normalizeWhitespace: true,
          decodeEntities: true
        });

        $('a').attr('target', '_blank');
        content = $.html();

        next();
      }
    ], (err) => {
      if(err){
        return reject(err);
      }
      if(!content){
        return reject(new Error('No article determined'));
      }
      return resolve(content);
    });
  });
}

var extract = (url) => {

  return new Promise((resolve, reject) => {

    let msg = 'Unknown error';

    url = removeUTM(url);

    let canonicals = [url];
    let resURL = '', bestURL = '';
    let html = '';
    let meta = {};
    let article = {};

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
        fetch(url).then((res) => {
          resURL = purifyURL(res.url);
          if(resURL){
            canonicals.push(resURL);
          }
          else{
            msg = 'No URL or URL is in black list';
          }
          res.text().then((s) => {
            html = s;
            next();
          });
        });
      },
      (next) => {
        if(!resURL || !html){
          return next();
        }

        meta = parseMeta(html, resURL);

        if(!meta || !meta.title || !meta.url){
          return next();
        }

        canonicals.push(meta.url);

        if(meta.canonical){
          canonicals.push(meta.canonical);
        }

        for(let i = canonicals.length - 1; i >= 0; i--){
          let cano = canonicals[i];
          if(cano.startsWith('//')){
            cano = 'http:' + cano;
          }
          cano = purifyURL(cano);
          if(!isValidURL(cano)){
            canonicals.splice(i, 1);
            continue;
          }
        }

        canonicals = bella.unique(canonicals);

        bestURL = canonicals[canonicals.length - 1];

        domain = getDomain(bestURL);

        if(!domain){
          msg = 'No domain determined';
          return next();
        }

        title = meta.title || '';

        if(!title){
          msg = 'No title determined';
          return next();
        }

        description = meta.description || '';
        image = meta.image || '';
        author = meta.author || '';
        source = meta.source || domain.replace('www.', '');

        next();
      },
      (next) => {
        if(!bestURL || !html || !meta || !title || !domain){
          return next();
        }
        getOEmbed(bestURL).then((oem) => {
          if(oem.provider_name){
            source = oem.provider_name;
          }
          if(oem.html){
            content = oem.html;
          }
          if(oem.title){
            title = oem.title;
          }
          if(oem.description){
            description = oem.description;
          }
          if(oem.author_name){
            author = oem.author_name;
          }
          if(oem.thumbnail_url){
            image = oem.thumbnail_url;
          }
          if(oem.duration){
            duration = oem.duration;
          }
        }).catch((e) => {
          tracer.getOEmbed = e;
        }).finally(next);
      },
      (next) => {
        if(!bestURL || !html || !meta || !title || !domain){
          console.log('loss title %s', title);
          console.log('loss domain %s', domain);
          return next();
        }
        let t = bella.time();
        alias = bella.createAlias(title) + '-' + t;

        let auth = author;
        if(auth && auth.indexOf(' ') > 0){
          author = bella.ucwords(auth);
        }

        let tit = bella.stripTags(title);
        title = bella.truncate(tit, 118);

        let desc = bella.stripTags(description);
        if(desc){
          description = bella.truncate(desc, 156);
        }

        article = {
          alias: alias,
          url: bestURL,
          canonicals: canonicals,
          title: title,
          description: description,
          image: image,
          content: content,
          author: author,
          source: source,
          domain: domain,
          duration: duration
        }
        next();
      },
      (next) => {
        if(!article){
          return next();
        }
        getArticle(html).then((art) => {
          content = art;
        }).catch((e) => {
          console.log(e);
          tracer.read = e;
          msg = 'Parsing article failed';
        }).finally(next);
      },
      (next) => {
        if(!article || !content){
          return next();
        }

        article.content = content;

        let desc = article.description;
        if(!desc && content){
          desc = bella.stripTags(content);
          article.description = bella.truncate(desc, 156);
        }

        next();
      },
      (next) => {
        if(!article || !content || duration){
          return next();
        }
        if(Duration.isMovie(bestURL) || Duration.isAudio(bestURL)){
          Duration.estimate(bestURL).then((d) => {
            duration = d;
          }).catch((e) => {
            console.log(e);
          }).finally(next);
        }
        else{
          Duration.estimate(content).then((d) => {
            duration = d;
          }).catch((e) => {
            console.log(e);
          }).finally(next);
        }
      },
      (next) => {
        if(!article || !content || !duration){
          return next();
        }
        article.duration = duration;
        next();
      }
    ], (err) => {
      if(err){
        console.log(err);
        return reject(err);
      }

      if(!article){
        return reject(new Error(msg));
      }

      if(!article.title || !article.domain || !article.duration){
        return reject(new Error('Not enough info to build article'));
      }

      return resolve(article);
    });
  });
}

module.exports = {
  configure: configure,
  extract: extract,
  getOEmbed: getOEmbed,
  getDomain: getDomain,
  parseMeta: parseMeta,
  purifyURL: purifyURL
}
