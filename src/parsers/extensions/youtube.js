// parsers/extensions -> YouTube

var {extract} = require('oembed-parser');

var {
  YouTubeKey
} = require('../../config');

var loadJSON = require('../../utils/loadJSON');
var getYtid = require('../../utils/getYtid');
var toSecond = require('../../utils/toSecond');

const URL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${YouTubeKey}`;

var getDuration = (vid) => {
  return new Promise((resolve, reject) => {
    let url = `${URL}&id=${vid}`;
    return loadJSON(url).then(({json: data}) => {
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

var parser = {
  schemes: [
    '*youtube.com/*',
    '*youtu.be/*'
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
            `https://www.youtube.com/embed/${vid}`
          ],
          content: `<iframe src="https://www.youtube.com/embed/${vid}?feature=oembed" frameborder="0" allowfullscreen></iframe>`,
          author: data.author_name,
          source: data.provider_name,
          image: data.thumbnail_url
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
  }
};

module.exports = parser;
