/**
 * Article parser
 * @ndaidong
 **/

'use strict';

var bella = require('bellajs');
var Promise = require('bluebird');
var fetch = require('node-fetch');
var read = require('node-readability');
var sanitize = require('sanitize-html');
var cheerio = require('cheerio');

var config = require('./config');
var urlResolver = require('./url-resolver');
var purifyURL = urlResolver.purifyURL;
var getDomain = urlResolver.getDomain;
var isValidURL = urlResolver.isValidURL;

var parseMeta = (html) => {

  let entry = {
    url: '',
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

  let doc = cheerio.load(html, {
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    recognizeSelfClosing: true
  });

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
  return entry;
}

var getDuration = (content) => {
  let text = bella.stripTags(content);
  let words = text.trim().split(/\s+/g).length;
  let minToRead = Math.round(words / config.wordsPerMinute);
  return minToRead < 1 ? 1 : minToRead;
}

var extract = (url) => {
  return new Promise((resolve, reject) => {
    let canonicals = [url];
    fetch(url).then((res) => {
      let resURL = purifyURL(res.url);
      if(resURL){
        canonicals.push(resURL);
      }
      return res.text();
    }).then((html) => {
      if(!html){
        return reject('No response HTML');
      }
      return read(html, (err, article) => {
        if(err){
          console.log(err);
          return reject(err);
        }
        if(!article || !article.content || !article.title){
          return reject('No article extracted');
        }

        console.log('Extracted %s', article.title);

        let content = sanitize(article.content, config.htmlRules);
        let $ = cheerio.load(content, {
          normalizeWhitespace: true,
          decodeEntities: true
        });

        $('a').attr('target', '_blank');
        content = $.html();
        article.close();

        let meta = parseMeta(html);
        if(meta.url){
          canonicals.push(meta.url);
        }
        if(meta.canonical){
          canonicals.push(meta.canonical);
        }

        for(let i = canonicals.length - 1; i >= 0; i--){
          let cano = canonicals[i];
          if(cano.startsWith('//')){
            cano = 'http:' + cano;
          }
          if(!isValidURL(cano)){
            canonicals.splice(i, 1);
            continue;
          }
          cano = purifyURL(cano);
        }
        canonicals = bella.unique(canonicals);

        let bestURL = canonicals[canonicals.length - 1];
        let title = meta.title || article.title;
        let t = bella.time();

        return resolve({
          alias: bella.createAlias(title) + '-' + t,
          url: bestURL,
          canonicals: canonicals,
          title: title,
          description: meta.description,
          image: meta.image,
          content: content,
          author: meta.author,
          source: meta.source,
          domain: getDomain(bestURL),
          duration: getDuration(content)
        });
      });
    }).catch((e) => {
      return reject(e);
    });
  });
}

module.exports = {
  extract: extract,
  getDuration: getDuration,
  getDomain: getDomain,
  parseMeta: parseMeta,
  purifyURL: purifyURL
}
