/**
 * duration
 * @ndaidong
 **/

'use strict';

var bella = require('bellajs');
var fetch = require('node-fetch');
var Promise = require('bluebird');

var urlResolver = require('./url-resolver');
var config = require('./config');

var getYtid = (lnk) => {
  let x1 = 'www.youtube.com/watch?';
  let x2 = 'youtu.be/';
  let x3 = 'www.youtube.com/v/';
  let x4 = 'www.youtube.com/embed/';
  let s = '', vid = '';

  lnk = lnk.replace('http://', '');
  lnk = lnk.replace('https://', '');

  if (lnk.indexOf(x1) === 0) {
    s = lnk.replace(x1, '');
    let arr = s.split('&');
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        let tm = arr[i].split('=');
        if (tm[0] === 'v') {
          vid = tm[1];
          break;
        }
      }
    }
  } else if (lnk.indexOf(x2) === 0) {
    vid = lnk.replace(x2, '');
  } else if (lnk.indexOf(x3) === 0) {
    vid = lnk.replace(x3, '');
  } else if (lnk.indexOf(x4) === 0) {
    vid = lnk.replace(x4, '');
    let ques = vid.indexOf('?');
    if (ques !== -1) {
      vid = vid.substring(0, ques);
    }
  }
  return vid;
};

var toSecond = (duration) => {
  let matches = duration.match(/[0-9]+[HMS]/g);

  let seconds = 0;

  matches.forEach((part) => {

    let unit = part.charAt(part.length - 1);
    let amount = parseInt(part.slice(0, -1), 10);

    switch (unit) {
      case 'H':
        seconds += amount * 60 * 60; break;
      case 'M':
        seconds += amount * 60; break;
      case 'S':
        seconds += amount; break;
      default:
    }
  });

  return seconds;
};

var isSoundCloud = (src) => {
  return src.includes('soundcloud.com');
};
var isAudioBoom = (src) => {
  return src.includes('audioboom.com');
};
var isAudio = (src) => {
  return isSoundCloud(src) || isAudioBoom(src);
};


var isYouTube = (src) => {
  return src.includes('youtube.com') || src.includes('youtu.be/');
};
var isVimeo = (src) => {
  return src.includes('vimeo.com');
};

function isMovie(src) {
  return isYouTube(src) || isVimeo(src);
}

var estimateAudio = (src) => {
  return new Promise((resolve, reject) => {
    if (isSoundCloud(src)) {
      let url = 'http://api.soundcloud.com/resolve.json?url=' + bella.encode(src) + '&client_id=' + config.SoundCloudKey;
      return fetch(url).then((res) => {
        return res.json();
      }).then((ob) => {
        if (ob && ob.duration) {
          let duration = Math.round(ob.duration / 1000);
          return resolve(duration);
        }
        return reject(new Error('Invalid format'));
      }).catch((e) => {
        return reject(e);
      });
    }
    return reject(new Error('Not supported ' + src));
  });
};

var estimateMovie = (src) => {
  return new Promise((resolve, reject) => {
    if (isYouTube(src)) {
      let vid = getYtid(src);
      let url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + vid + '&key=' + config.YouTubeKey;
      return fetch(url).then((res) => {
        return res.json();
      }).then((ob) => {
        if (ob && ob.items) {
          let items = ob.items;
          if (bella.isArray(items) && items.length > 0) {
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
    } else if (isVimeo(src)) {
      return fetch('http://vimeo.com/api/oembed.json?url=' + src).then((res) => {
        return res.json();
      }).then((ob) => {
        if (ob && ob.duration) {
          let duration = ob.duration;
          return resolve(duration);
        }
        return reject(new Error('Invalid format'));
      }).catch((e) => {
        return reject(e);
      });
    }
    return reject(new Error('Not supported ' + src));
  });
};

var estimateArticle = (content) => {
  let text = bella.stripTags(content);
  let words = text.trim().split(/\s+/g).length;
  let minToRead = words / config.wordsPerMinute;
  let secToRead = Math.ceil(minToRead * 60);
  return secToRead;
};

var estimate = (source) => {
  return new Promise((resolve) => {
    if (urlResolver.isValidURL(source)) {
      if (isAudio(source)) {
        return resolve(estimateAudio(source));
      } else if (isMovie(source)) {
        return resolve(estimateMovie(source));
      }
    }
    return resolve(estimateArticle(source));
  });
};

module.exports = {
  estimate: estimate,
  isYouTube: isYouTube,
  isVimeo: isVimeo,
  isSoundCloud: isSoundCloud,
  isAudioBoom: isAudioBoom,
  isMovie: isMovie,
  isAudio: isAudio,
  getYtid: getYtid,
  toSecond: toSecond,
  estimateAudio: estimateAudio,
  estimateMovie: estimateMovie
};
