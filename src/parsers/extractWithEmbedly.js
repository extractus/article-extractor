// utiles/extractWithEmbedly

const {
  EmbedlyKey,
} = require('../config');

const {
  isValidURL,
  logger,
} = require('../utils');

const {
  error,
  info,
} = logger;

const loadJSON = require('../utils/loadJSON');

const extractWithEmbedly = (url, key = '') => {
  return new Promise((resolve, reject) => {
    info(`Start parsing with Embedly...`);
    info(url);

    if (!isValidURL(url)) {
      throw new Error('Invalid URL');
    }

    let u = encodeURIComponent(url);
    let k = key || EmbedlyKey || '';

    if (!k) {
      throw new Error(`Missing Embedly's key`);
    }

    let target = `http://api.embed.ly/1/extract?key=${k}&url=${u}&format=json`;

    return loadJSON(target).then((data) => {
      let realUrl = data.url;
      let o = data.json;
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

      let {
        url,
        title,
        content,
        description,
      } = o;

      return resolve({
        _url: url,
        url: realUrl,
        title,
        description,
        author,
        source: o.provider_name || '',
        image,
        content,
      });
    }).catch((err) => {
      error('Error while parsing with Embedly');
      return reject(err);
    });
  });
};

module.exports = extractWithEmbedly;
