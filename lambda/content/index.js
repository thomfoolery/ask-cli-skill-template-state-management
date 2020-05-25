const enUS = require('./en-US/index.json');

const localizedContent = {
  'en-US': enUS,
  default: enUS,
}

function getLocaleContent(locale) {
  return localizedContent[locale] ?
    localizedContent[locale] :
    localizedContent.default;
}

module.exports = {
  getLocaleContent,
}
