/**
 * Import specs
 */

import {
  existsSync,
  readdirSync,
} from 'fs';

import {
  extname,
  join,
} from 'path';

const dirs = [
  'utils',
  '',
];

dirs.forEach((dir) => {
  const where = './tests/specs/' + dir;
  if (existsSync(where)) {
    readdirSync(where).forEach((file) => {
      if (extname(file) === '.js') {
        require(join('.' + where, file));
      }
    });
  }
});
