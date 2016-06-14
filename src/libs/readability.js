// based on https://github.com/luin/readability/blob/master/src/readability.js

var jsdom = require('jsdom');
var Promise = require('promise-wtf');
var helpers = require('./helpers');

exports.debug = (debug) => {
  helpers.debug(debug);
};

exports.debug(false);

class Readability {
  constructor(window, options) {
    this._window = window;
    this._document = window.document;
    this.iframeLoads = 0;
    // Cache the body HTML in case we need to re-use it later
    this.bodyCache = null;
    this._articleContent = '';
    helpers.setCleanRules(options.cleanRulers || []);

    this.cache = {};

    helpers.prepDocument(this._document);
    this.cache = {
      body: this._document.body.innerHTML
    };

    let self = this; // eslint-disable-line consistent-this
    this.__defineGetter__('content', () => {
      return self.getContent(true);
    });
  }

  getContent() {
    if (typeof this.cache['article-content'] !== 'undefined') {
      return this.cache['article-content'];
    }
    let content = '';
    var articleContent = helpers.grabArticle(this._document);
    if (helpers.getInnerText(articleContent, false) === '') {
      this._document.body.innerHTML = this.cache.body;
      articleContent = helpers.grabArticle(this._document, true);
      if (helpers.getInnerText(articleContent, false) === '') {
        this.cache['article-content'] = false;
      }
    }
    if (articleContent) {
      content = articleContent.innerHTML;
      this.cache['article-content'] = content;
    }
    return content;
  }

  close() {
    if (this._window) {
      this._window.close();
    }
    this._window = null;
    this._document = null;
  }
}

var read = (html) => {
  return new Promise((resolve, reject) => {
    jsdom.env({
      html,
      done: (err, window) => {
        if (err) {
          window.close();
          return reject(err);
        }
        try {
          var readability = new Readability(window, {});
          return resolve(readability);
        } catch (ex) {
          window.close();
          return reject(ex);
        }
      }
    });
  });
};

module.exports = read;
