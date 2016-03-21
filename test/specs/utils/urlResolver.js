/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/
/* eslint no-console: 0*/

'use strict';

var path = require('path');
var test = require('tape');

var rootDir = '../../../src/';
var UR = require(path.join(rootDir, 'url-resolver'));

var absolutify = UR.absolutify;
var purify = UR.purify;
var getDomain = UR.getDomain;
var removeUTM = UR.removeUTM;

var isValidURL = UR.isValidURL;
var isAdsDomain = UR.isAdsDomain;
var isExceptDomain = UR.isExceptDomain;
var isInBlackList = UR.isInBlackList;

test('Testing "absolutify" method:', (assert) => {
  let imgSrc = absolutify('https://www.awesome.com/articles/hello-world.html', '../images/avatar.png');
  let expect = 'https://www.awesome.com/images/avatar.png';
  assert.deepEqual(imgSrc, expect, `Result must be ${expect}`);
  assert.end();
});

test('Testing purify method:', (assert) => {
  let fullUrl = purify('https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6#.98xbvjtjw?utm_medium=email&utm_source=Newsletter&utm_campaign=Autumn+Newsletter&utm_content=logo+link');
  let expect = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
  assert.deepEqual(fullUrl, expect, `Result must be ${expect}`);
  assert.end();
});

test('Testing removeUTM method:', (assert) => {
  let fullUrl = removeUTM('https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6#.98xbvjtjw?utm_medium=email&utm_source=Newsletter&utm_campaign=Autumn+Newsletter&utm_content=logo+link');
  let expect = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
  assert.deepEqual(fullUrl, expect, `Result must be ${expect}`);
  assert.end();
});

test('Testing getDomain method:', (assert) => {
  let fullUrl = getDomain('https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6#.98xbvjtjw?utm_medium=email&utm_source=Newsletter&utm_campaign=Autumn+Newsletter&utm_content=logo+link');
  let expect = 'medium.com';
  assert.deepEqual(fullUrl, expect, `Result must be ${expect}`);
  assert.end();
});

test('Testing isExceptDomain method:', (assert) => {
  let url1 = 'http://www.sfgate.com/technology/article/More-Americans-bid-pricey-Silicon-Valley-goodbye-6885270.php';
  let url2 = 'http://abc.com/xyz';
  let r1 = isExceptDomain(url1);
  let r2 = isExceptDomain(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});

test('Testing isAdsDomain method:', (assert) => {
  let url1 = 'http://lifehacker.com/hide-your-pin-number-or-password-on-a-fake-business-car-1766054555';
  let url2 = 'http://abc.com/xyz';
  let r1 = isAdsDomain(url1);
  let r2 = isAdsDomain(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});

test('Testing isValidURL method:', (assert) => {
  let url1 = 'http://lifehacker.com/hide-your-pin-number-or-password-on-a-fake-business-car-1766054555';
  let url2 = 'http://abc/xyz';
  let r1 = isValidURL(url1);
  let r2 = isValidURL(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});

test('Testing isInBlackList method:', (assert) => {
  let url1 = 'https://twitter.com/eon01/status/709157454140088324';
  let url2 = 'http://abc.com/xyz';
  let r1 = isInBlackList(url1);
  let r2 = isInBlackList(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});
