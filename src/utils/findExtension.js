// utils -> findExtension

var findExtension = (url, providers) => {
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

module.exports = (extensions) => {
  return (url) => {
    return findExtension(url, extensions);
  };
};
