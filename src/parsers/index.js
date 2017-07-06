// parser
var fs = require('fs');
var path = require('path');

var {
  isObject,
  isArray,
  isFunction
} = require('bellajs');

var extensions = [];

fs.readdirSync(path.join(__dirname, 'extensions')).forEach((file) => {
  if (path.extname(file) === '.js') {
    let ext = require(`./extensions/${file}`);
    if (isObject(ext) && isFunction(ext.extract) && isArray(ext.schemes)) {
      extensions.push(ext);
    }
  }
});

var findExtension = require('../utils/findExtension')(extensions);


let ext = findExtension('https://www.youtube.com/watch?v=okMVc3-aCKQ');
console.log(ext);

var parse = (input) => {
  return input;
};

module.exports = parse;
