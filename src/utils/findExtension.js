// utils -> findExtension

var fs = require('fs');
var path = require('path');

var {
  isObject,
  isArray,
  isFunction
} = require('bellajs');

var extDir = '../parsers/extensions';
var extensions = [];

fs.readdirSync(path.join(__dirname, extDir)).forEach((file) => {
  if (path.extname(file) === '.js') {
    let ext = require(`${extDir}/${file}`);
    if (isObject(ext) && isFunction(ext.extract) && isArray(ext.schemes)) {
      extensions.push(ext);
    }
  }
});

var extFinder = (url, providers) => {
  let candidates = providers.filter((provider) => {
    let {
      schemes
    } = provider;

    return schemes.some((scheme) => {
      let reg = new RegExp(scheme.replace(/\*/g, '(.*)'), 'i');
      return url.match(reg);
    });
  });
  return candidates.length > 0 ? candidates[0] : null;
};

module.exports = (url) => {
  return extFinder(url, extensions);
};
