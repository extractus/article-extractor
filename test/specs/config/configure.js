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
    'htmlRules',
  ];

  return structure.every((k) => {
    return hasProperty(o, k);
  });
};

const fake = Object.create(AP);

test('Testing "configure" method:', (assert) => {
  fake.configure(sample);
  const config = fake.getConfig();

  assert.comment('(Call config object is C, so:)');
  assert.ok(isObject(config), 'C must be an object.');
  assert.ok(hasRequiredKeys(config), 'C must have all required keys.');

  const a1 = config.SoundCloudKey;
  const e1 = sample.SoundCloudKey;
  assert.deepEqual(a1, e1, `C.SoundCloudKey must be ${e1}`);

  const a2 = config.YouTubeKey;
  const e2 = sample.YouTubeKey;
  assert.deepEqual(a2, e2, `C.YouTubeKey must be ${e2}`);

  const a5 = config.htmlRules;
  const e5 = sample.htmlRules;
  assert.deepEqual(a5, e5, 'C.htmlRules must be equal to sample.htmlRules');

  assert.deepEqual(config.wordsPerMinute, sample.wordsPerMinute, `C.wordsPerMinute must be ${sample.wordsPerMinute}`);

  assert.deepEqual(
    config.fetchOptions.timeout,
    sample.fetchOptions.timeout,
    `C.fetchOptions.timeout must be ${sample.fetchOptions.timeout}`
  );

  assert.end();
});
