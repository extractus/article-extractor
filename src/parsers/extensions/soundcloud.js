// parsers/extensions -> SoundCloud

var loadJSON = require('../../utils/loadJSON');

var {
  SoundCloudKey
} = require('../../config');

const URL = `http://api.soundcloud.com/resolve.json?client_id=${SoundCloudKey}&url=`;

var parser = {
  schemes: [
    '*soundcloud.com/*/*'
  ],
  extract: (url) => {
    return new Promise((resolve, reject) => {
      return loadJSON(`${URL}${encodeURIComponent(url)}`).then((data) => {
        let {
          id,
          created_at: publishedTime,
          title,
          description,
          user,
          duration
        } = data;

        let author = user.username || '';

        return resolve({
          title,
          description,
          author,
          publishedTime,
          duration: Math.round(duration / 1000),
          content: `<iframe scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}"></iframe>`
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }
};

module.exports = parser;
