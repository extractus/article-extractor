// parsers/extensions -> YouTube

const {extract} = require('oembed-parser');

const {
  fetchOptions,
  YouTubeKey,
} = require('../../config');

const {
  loadJSON,
  getYtid,
  toSecond,
} = require('../../utils');

const URL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${YouTubeKey}`;

const getDuration = (vid) => {
  return new Promise((resolve, reject) => {
    let url = `${URL}&id=${vid}`;
    return loadJSON(url, fetchOptions).then(({json: data}) => {
      if (data && data.items) {
        let items = data.items;
        if (items.length > 0) {
          let item = items[0].contentDetails || false;
          if (item && item.duration) {
            let duration = toSecond(item.duration);
            return resolve(duration);
          }
        }
      }
      return reject(new Error('Invalid format'));
    }).catch((e) => {
      return reject(e);
    });
  });
};

const parser = {
  schemes: [
    '*youtube.com/*',
    '*youtu.be/*',
  ],
  extract: (url) => {
    return new Promise((resolve, reject) => {
      let vid = getYtid(url);

      if (!vid) {
        throw new Error('No video ID found');
      }

      url = `https://www.youtube.com/watch?v=${vid}`;

      return extract(url).then((data) => {
        return {
          vid,
          title: data.title,
          canonicals: [
            url,
            `https://youtu.be/${vid}`,
            `https://www.youtube.com/v/${vid}`,
            `https://www.youtube.com/embed/${vid}`,
          ],
          content: `<iframe src="https://www.youtube.com/embed/${vid}?feature=oembed" frameborder="0" allowfullscreen></iframe>`,
          author: data.author_name,
          source: data.provider_name,
          image: data.thumbnail_url,
        };
      }).then((art) => {
        return getDuration(art.vid).then((duration) => {
          art.duration = duration;
          return resolve(art);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  },
};

module.exports = parser;
