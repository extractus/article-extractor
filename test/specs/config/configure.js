/**
 * Testing
 * @ndaidong
 */

const test = require('tap').test;
const {
  hasProperty,
  isObject,
} = require('bellajs');

const AP = require('../../../');

const sample = {
  fetchOptions: {
    timeout: 60,
    headers: {
      accept: 'JSON',
    },
    agent: 'nodejs/nginx',
  },
  wordsPerMinute: 500,
  SoundCloudKey: 'SOUNDCLOUDKEY',
  YouTubeKey: 'YOUTUBEKEY',
  EmbedlyKey: 'EMBEDLYKEY',
  htmlRules: {
    allowedTags: [
      'html', 'body', 'meta', 'link', 'title',
    ],
    allowedAttributes: {
      a: ['href'],
    },
  },
};

const hasRequiredKeys = (o) => {
  const structure = [
    'wordsPerMinute',
    'SoundCloudKey',
    'YouTubeKey',
    'EmbedlyKey',
    'htmlRules',
  ];

  return structure.every((k) => {
    return hasProperty(o, k);
  });
};

const fake = Object.create(AP);

test('Testing "configure" method:', (assert) => {
  fake.configure(sample);
  let config = fake.getConfig();

  assert.comment('(Call config object is C, so:)');
  assert.ok(isObject(config), 'C must be an object.');
  assert.ok(hasRequiredKeys(config), 'C must have all required keys.');

  let a1 = config.SoundCloudKey;
  let e1 = sample.SoundCloudKey;
  assert.deepEqual(a1, e1, `C.SoundCloudKey must be ${e1}`);

  let a2 = config.YouTubeKey;
  let e2 = sample.YouTubeKey;
  assert.deepEqual(a2, e2, `C.YouTubeKey must be ${e2}`);

  let a3 = config.EmbedlyKey;
  let e3 = sample.EmbedlyKey;
  assert.deepEqual(a3, e3, `C.EmbedlyKey must be ${e3}`);

  let a5 = config.htmlRules;
  let e5 = sample.htmlRules;
  assert.deepEqual(a5, e5, 'C.htmlRules must be equal to sample.htmlRules');

  assert.deepEqual(config.wordsPerMinute, sample.wordsPerMinute, `C.wordsPerMinute must be ${sample.wordsPerMinute}`);

  assert.deepEqual(
    config.fetchOptions.timeout,
    sample.fetchOptions.timeout,
    `C.fetchOptions.timeout must be ${sample.fetchOptions.timeout}`
  );

  assert.end();
});
