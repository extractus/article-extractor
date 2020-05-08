// normalizeUrl.test

const normalizeUrl = require('./normalizeUrl');


test(`test normalizeUrl in detailt`, () => {
  const entries = [
    {
      url: 'http://some.where/article/abc-xyz',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz#name,bob',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz?utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz?q=3&utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz?q=3',
    },
    {
      url: 'http://some.where/article/abc-xyz?pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz?q=3&pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz?q=3',
    },
  ];
  entries.forEach((entry) => {
    const {
      url,
      expected,
    } = entry;
    const result = normalizeUrl(url);
    expect(result).toEqual(expected);
  });
});
