// parsers/extensions -> Vimeo

var loadJSON = require('../../utils/loadJSON');

const URL = 'https://vimeo.com/api/oembed.json?url=';

var parser = {
  schemes: [
    '*vimeo.com/*',
    '*vimeo.com/album/*/video/*',
    '*vimeo.com/channels/*/*',
    '*player.vimeo.com/video/*'
  ],
  extract: (url) => {
    return new Promise((resolve, reject) => {
      return loadJSON(`${URL}${encodeURIComponent(url)}`).then(({json: data}) => {
        let {
          video_id: vid,
          thumbnail_url: image,
          title,
          description,
          author_name: author,
          provider_name: source,
          duration
        } = data;
        return resolve({
          canonicals: [
            `https://vimeo.com/${vid}`,
            `https://player.vimeo.com/video/${vid}`
          ],
          image,
          title,
          description,
          author,
          source,
          duration,
          content: `<iframe src="https://player.vimeo.com/video/${vid}" frameborder="0" allowfullscreen></iframe>`
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }
};

module.exports = parser;
