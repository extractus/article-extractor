/**
 * Testing
 * @ndaidong
 */

import {hasProperty} from 'bellajs';
import {test} from 'tap';

import * as AP from '../../index';


test('Check exported APIs', (assert) => {
  const methods = [
    'extract',
    'setParserOptions',
    'getParserOptions',
    'setNodeFetchOptions',
    'getNodeFetchOptions',
    'setSanitizeHtmlOptions',
    'getSanitizeHtmlOptions',
  ];
  const props = ['version'];

  methods.forEach((m) => {
    assert.type(AP[m], 'function', `ArticleParser must have method "${m}"`);
  });
  props.forEach((p) => {
    assert.ok(hasProperty(AP, p), `ArticleParser must have property "${p}"`);
  });

  assert.end();
});

