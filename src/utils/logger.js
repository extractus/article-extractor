// utils / logger

const {
  name,
} = require('../../package.json');

const debug = require('debug');

const info = debug(`${name}:info`);
const error = debug(`${name}:error`);
const warning = debug(`${name}:warning`);

module.exports = {
  info,
  error,
  warning,
};
