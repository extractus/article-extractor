/*
 * parser -> with Embedly
 * @ndaidong
*/

var Promise = require('bluebird');
var fetch = require('node-fetch');

var debug = require('debug');
var error = debug('artparser:error');
var info = debug('artparser:info');

var config = require('../config');

var {FETCH_OPTIONS} = config;

var parseWithEmbedly = (url, key = '') => {
  return new Promise((resolve, reject) => {

    info(`Start parsing with Embedly...`);
    info(url);

    let u = encodeURIComponent(url);
    let k = key || config.EmbedlyKey || '';
    let target = `http://api.embed.ly/1/extract?key=${k}&url=${u}&format=json`;

    return fetch(target, FETCH_OPTIONS).then((res) => {
      info(`Loaded data from Embedly.`);
      return res.json();
    }).then((o) => {
      info(`Standalizing data structure...`);
      let author = '';
      let authors = o.authors || [];
      if (authors.length) {
        author = authors.reduce((prev, curr) => {
          return prev.concat([curr.name]);
        }, []).join(', ');
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
      info(`Finish parsing with Embedly.`);
      return resolve({
        url: o.url,
        title: o.title,
        description: o.description,
        author,
        source: o.provider_name || '',
        image,
        content: o.content
      });
    }).catch((err) => {
      error('Error while parsing with Embedly');
      info(url);
      error(err);
      return reject(err);
    });
  });
};

module.exports = parseWithEmbedly;
