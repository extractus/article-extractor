// utils / logger

const {
  name,
} = require('../../package.json');

const debug = require('debug');

module.exports = {
  info: debug(`${name}:info`),
  error: debug(`${name}:error`),
  warning: debug(`${name}:warning`),
};
