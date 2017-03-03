/**
 * Article parser
 * @ndaidong
 **/

var bella = require('bellajs');
var Promise = require('bluebird');
var fetch = require('node-fetch');

var debug = require('debug');
var error = debug('artparser:error');
var info = debug('artparser:info');

var config = require('./config');
var {configure, FETCH_OPTIONS} = config;

var Duration = require('./duration');

var {
  absolutify,
  purify,
  removeUTM,
  getDomain,
  isValidURL,
  isExceptDomain,
  absolutifyContentSrc
} = require('./uri');

var {
  parseWithEmbedly,
  parseMeta,
  getArticle
} = require('./parser');


var getRemoteContent = (input) => {

  return new Promise((resolve, reject) => {
    let {
      url
    } = input;

    info(`Start fetching HTML content from ${url}`);

    let _url = '';

    fetch(url, FETCH_OPTIONS)
      .then((res) => {
        let {
          ok,
          status,
          headers
        } = res;
        if (!ok || status !== 200) {
          return reject(new Error(`Fetching failed for ${url}`));
        }
        let contentType = headers.get('content-type');
        if (!contentType.startsWith('text/')) {
          return reject(new Error(`Could not handle ${contentType}`));
        }
        info(`Retrieved HTML content from ${url}`);
        _url = purify(res.url);
        return res.text();
      })
      .then((html) => {
        info(`Finish fetching HTML content from ${url}`);
        if (!html) {
          info('Returned HTML is empty. Exit process.');
          return reject(new Error(`No HTML content retrieved for ${url}`));
        }
        input.canonicals.push(_url);
        input.url = _url;
        input.html = html;
        return resolve(input);
      }).catch((err) => {
        error(`Error while fetching remote data from "${url}"`);
        error(err);
        return reject(err);
      });
  });
};

var extractMetaData = (input) => {

  let {
    html,
    url
  } = input;

  info(`Start extracting metadata for ${url}`);

  let meta = parseMeta(html, url);

  let {
    canonical,
    title,
    description,
    image,
    author,
    source,
    publishedTime
  } = meta;

  if (meta.url) {
    let _url = meta.url;
    let {canonicals} = input;
    input.canonicals = canonicals.concat([_url, canonical]);
    input.url = _url;
  }

  input.title = title;
  input.description = description;
  input.image = image;
  input.author = author;
  input.source = source;
  input.publishedTime = publishedTime;

  info(`Finish extracting metadata for ${url}`);

  return Promise.resolve(input);
};

var extractArticle = (input) => {

  return new Promise((resolve, reject) => {
    let {
      url,
      html
    } = input;

    info(`Start extracting main article for ${url}`);

    getArticle(html).then((content) => {
      info(`Finish extracting main article for ${url}`);
      if (content) {
        info(`Determined main article for ${url}`);
        input.content = content;
        return resolve(input);
      }
      return reject(new Error('No article extracted. Cancel process.'));
    }).catch((err) => {
      error(`Error while extracting main article for ${url}`);
      error(err);
      return reject(err);
    });
  });
};

var standalizeCanonicals = (input) => {

  let {
    canonicals
  } = input;

  info(`Start standalizing canonicals for ${input.url}`);

  let arr = canonicals.filter((url) => {
    return url && url.length > 10;
  }).map((url) => {
    if (url.startsWith('//')) {
      url = 'http:' + url;
    }
    return purify(url);
  }).filter((url) => {
    return isValidURL(url);
  });

  input.canonicals = bella.stabilize(arr).unique();

  info(`Finish standalizing canonicals for ${input.url}`);

  return Promise.resolve(input);
};

var standalizeContent = (input) => {

  let {
    url,
    content
  } = input;

  info(`Start standalizing content for ${url}`);

  input.content = absolutifyContentSrc(content, url);

  info(`Finish standalizing content for ${url}`);
  return Promise.resolve(input);
};

var standalizeDescription = (input) => {
  let {
    url,
    description,
    content
  } = input;

  info(`Start standalizing description for ${url}`);

  let s = bella.stripTags(description || content);
  input.description = bella.truncate(s, 156);

  info(`Finish standalizing description for ${url}`);
  return Promise.resolve(input);
};

var standalizeImage = (input) => {
  let {
    url,
    image
  } = input;

  info(`Start standalizing image for ${url}`);

  if (image) {
    info(`Before: ${image}`);
    input.image = absolutify(url, image);
    info(`After: ${input.image}`);
  }

  info(`Finish standalizing image for ${url}`);

  return Promise.resolve(input);
};

var standalizeAuthor = (input) => {
  let {
    url,
    author
  } = input;

  info(`Start standalizing author name for ${url}`);

  if (author && author.indexOf(' ') > 0) {
    info(`Before: ${author}`);
    input.author = bella.ucwords(author);
    info(`After: ${input.author}`);
  }

  info(`Finish standalizing author for ${url}`);
  return Promise.resolve(input);
};

var standalizeStuff = (input) => {
  let {
    url,
    title,
    source
  } = input;

  info(`Fix some stuffs for ${url}`);

  let domain = getDomain(url);
  input.domain = domain;
  if (!source) {
    input.source = domain;
  }

  let t = bella.time();
  input.alias = bella.createAlias(title) + '-' + t;

  let tit = bella.stripTags(title);
  input.title = bella.truncate(tit, 118);

  info(`Almost done with ${url}`);

  return Promise.resolve(input);
};

var estimateDuration = (input) => {
  return new Promise((resolve, reject) => {
    let {
      url,
      title,
      content
    } = input;

    info(`Start estimating duration for ${url}`);

    let p;
    if (Duration.isMovie(url) || Duration.isAudio(url)) {
      p = () => {
        return Duration.estimate(url);
      };
    } else {
      p = () => {
        return Duration.estimate(content);
      };
    }

    p().then((d) => {
      input.duration = d;
      info(`Finish estimating duration for ${url}`);
      return resolve(input);
    }).catch((err) => {
      error(`Error while estimating duration for "${title}"`);
      return reject(err);
    });
  });
};

var extract = (link) => {

  return new Promise((resolve, reject) => {

    let url = removeUTM(link);

    if (isExceptDomain(url)) {
      return reject(new Error('This domain is blocked by configuration.'));
    }

    let article = {
      url,
      title: '',
      alias: '',
      description: '',
      canonicals: [url],
      image: '',
      content: '',
      author: '',
      source: '',
      domain: '',
      duration: 0
    };

    info(`Start extracting article data for ${url}`);

    return getRemoteContent(article)
      .then(extractMetaData)
      .then(extractArticle)
      .then(standalizeCanonicals)
      .then(standalizeContent)
      .then(standalizeDescription)
      .then(standalizeImage)
      .then(standalizeAuthor)
      .then(standalizeStuff)
      .then(estimateDuration)
      .then((output) => {
        info(`Finish extracting "${url}"`);
        output.html = '';
        delete output.html;
        return resolve(output);
      })
      .catch((err) => {
        error(err);
        return reject(new Error(err.message || 'Something wrong while extracting article'));
      });
  });
};

module.exports = {
  configure,
  getConfig: () => {
    return bella.clone(config);
  },
  extract,
  getArticle,
  getDomain,
  parseMeta,
  parseWithEmbedly,
  absolutify,
  purify
};
