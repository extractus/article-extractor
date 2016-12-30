/**
 * Testing
 * @ndaidong
 */

var path = require('path');
var test = require('tape');

var rootDir = '../../../src/';
var UR = require(path.join(rootDir, 'uri'));

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

  let r1 = absolutify(123);
  assert.deepEqual(r1, '', 'Can not absolutify a number');
  assert.end();
});

test('Testing purify method:', (assert) => {
  let fullUrl = purify('https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6#.98xbvjtjw?utm_medium=email&utm_source=Newsletter&utm_campaign=Autumn+Newsletter&utm_content=logo+link');
  let expect = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
  assert.deepEqual(fullUrl, expect, `Result must be ${expect}`);

  let r1 = purify(123);
  assert.deepEqual(r1, false, 'Can not purify a number');

  let d2 = 'https://abc.xyz/123';
  let r2 = purify(d2);
  assert.deepEqual(r2, d2, 'Standard URL should be kept as it is');

  let d3 = 'https://abc.xyz/123?98765';
  let r3 = purify(d3);
  let e3 = 'https://abc.xyz/123';
  assert.deepEqual(r3, e3, `Result for purify('${d3}') must be '${e3}'`);

  let d4 = 'https://abc.xyz/123?uid=09123';
  let r4 = purify(d4);
  let e4 = 'https://abc.xyz/123?uid=09123';
  assert.deepEqual(r4, e4, `Result for purify('${d4}') must be '${e4}'`);
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

  let r1 = getDomain(123);
  assert.deepEqual(r1, false, 'Can not getDomain from a number');
  assert.end();
});

test('Testing isExceptDomain method:', (assert) => {
  let url1 = 'http://www.sfgate.com/technology/article/More-Americans-bid-pricey-Silicon-Valley-goodbye-6885270.php';
  let url2 = 'http://abc.com/xyz';
  let url3 = 12345;
  let r1 = isExceptDomain(url1);
  let r2 = isExceptDomain(url2);
  let r3 = isExceptDomain(url3);
  let e1 = true;
  let e2 = false;
  let e3 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.deepEqual(r3, e3, `Result must be ${e3} for ${url3}`);
  assert.end();
});

test('Testing isAdsDomain method:', (assert) => {
  let url1 = 'http://lifehacker.com/hide-your-pin-number-or-password-on-a-fake-business-car-1766054555';
  let url2 = 'http://abc.com/xyz';
  let url3 = 12345;
  let r1 = isAdsDomain(url1);
  let r2 = isAdsDomain(url2);
  let r3 = isAdsDomain(url3);
  let e1 = true;
  let e2 = false;
  let e3 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.deepEqual(r3, e3, `Result must be ${e3} for ${url3}`);
  assert.end();
});

test('Testing isValidURL method:', (assert) => {
  let url1 = 'http://lifehacker.com/hide-your-pin-number-or-password-on-a-fake-business-car-1766054555';
  let url2 = 'http://abc/xyz';
  let url3 = 'https://twitter.com/eon01/status/709157454140088324';
  let url4 = null;
  let r1 = isValidURL(url1);
  let r2 = isValidURL(url2);
  let r3 = isValidURL(url3);
  let r4 = isValidURL(url4);
  let e1 = true;
  let e2 = false;
  let e3 = false;
  let e4 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.deepEqual(r3, e3, `Result must be ${e3} for ${url3}`);
  assert.deepEqual(r4, e4, `Result must be ${e4} for ${url4}`);
  assert.end();
});

test('Testing isInBlackList method:', (assert) => {
  let url1 = 'https://twitter.com/eon01/status/709157454140088324';
  let url2 = 'http://abc.com/xyz';
  let url3 = 12345;
  let r1 = isInBlackList(url1);
  let r2 = isInBlackList(url2);
  let r3 = isInBlackList(url3);
  let e1 = true;
  let e2 = false;
  let e3 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.deepEqual(r3, e3, `Result must be ${e3} for ${url3}`);
  assert.end();
});
