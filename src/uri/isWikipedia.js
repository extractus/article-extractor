/*
 * uri -> check if is Wikipedia
 * @ndaidong
*/

let isWiki = (input) => {
  let {
    url
  } = input;

  return url.includes('wikipedia.org');
};


module.exports = isWiki;
