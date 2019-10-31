// utils / logger

import {
  name,
} from '../../package.json';

import debug from 'debug';

export const info = debug(`${name}:info`);
export const error = debug(`${name}:error`);
export const warning = debug(`${name}:warning`);
