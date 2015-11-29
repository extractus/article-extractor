/**
 * Testing
 * @ndaidong
 */
/* global describe it before */
/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/

'use strict';

var chai = require('chai');

chai.should();
var expect = chai.expect;

import {extract} from '../../../src/article-parser';

let url = 'http://www.smashingapps.com/2015/11/27/8-extensions-for-parental-control-in-chrome-firefox.html';

describe('.extract(url)', () => {

  let article;

  before((done) => {
    extract(url).then((art) => {
      article = art;
    }).catch((e) => {
      console.log(e);
    }).finally(done);
  });

  describe('Parsing... URL: ' + url, () => {
    if(!article){
      console.log('Parsing failed');
      return false;
    }
    it(' should be object', (done) => {
      expect(article).to.be.an('object');
      done();
    });
    it(' should match schema', (done) => {
      expect(article).to.have.all.keys('alias', 'url', 'canonicals', 'title', 'description', 'image', 'content', 'author', 'source', 'domain', 'duration');
      done();
    });
  });
});
