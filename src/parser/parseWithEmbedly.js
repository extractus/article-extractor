/*
 * parser -> with Embedly
 * @ndaidong
*/

var fetch = require('node-fetch');

var config = require('../config');

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
    }).catch(reject);
  });
};

module.exports = parseWithEmbedly;
