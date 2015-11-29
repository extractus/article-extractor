'use strict';

var fs = require('fs');
var path = require('path');

var traceur = require('traceur');
traceur.require.makeDefault((filename) => {
  return !filename.includes('node_modules');
});

/**
 * Import specs
 */

var dirs = ['extracting'];
dirs.forEach((dir) => {
  let where = './test/specs/' + dir;
  if(fs.existsSync(where)){
    fs.readdirSync(where).forEach((file) => {
      if(path.extname(file) === '.js'){
        require(path.join('.' + where, file));
      }
    });
  }
});
