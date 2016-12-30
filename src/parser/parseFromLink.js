/*
 * parser -> get HTML from link then extract article data
 * @ndaidong
*/

var fetch = require('node-fetch');

var parseMeta = require('./parseMeta');
var {
  getDomain
} = require('../uri');

var parseWithEmbedly = (link) => {
  return new Promise((resolve, reject) => {
    return fetch(link).then((res) => {
      return {
        html: res.text(),
        url: res.url
      };
    }).then((data) => {

      let {
        html,
        url
      } = data;

      let meta = parseMeta(html, url);
      let canonicals = [
        link,
        url,
        meta.url,
        meta.canonical
      ];

      let domain = getDomain(url);

      return resolve({
        url: o.url,
        title: o.title,
        description: o.description,
        author,
        source: o.provider_name || '',
        image,
        content: o.content
      });
    }).catch(reject);
  });
};

module.exports = parseWithEmbedly;
