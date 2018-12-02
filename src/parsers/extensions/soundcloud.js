// parsers/extensions -> SoundCloud

const {loadJSON} = require('../../utils');

const {
  fetchOptions,
  SoundCloudKey,
} = require('../../config');

const URL = `https://api.soundcloud.com/resolve.json?client_id=${SoundCloudKey}&url=`;

const parser = {
  schemes: [
    '*soundcloud.com/*/*',
  ],
  extract: (url) => {
    return new Promise((resolve, reject) => {
      return loadJSON(`${URL}${encodeURIComponent(url)}`, fetchOptions).then(({json: data}) => {
        let {
          id,
          created_at: publishedTime,
          title,
          description,
          user,
          duration,
        } = data;

        let author = user.username || '';

        return resolve({
          title,
          description,
          author,
          publishedTime,
          duration: Math.round(duration / 1000),
          content: `<iframe scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}"></iframe>`,
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  },
};

module.exports = parser;
