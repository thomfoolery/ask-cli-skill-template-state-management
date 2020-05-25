const templateString = require('es6-template-strings')
const { getLocaleContent } = require('../content')
const Alexa = require('ask-sdk-core')
const R = require('ramda')

const applyStringTemplate = (values, template) => R.pipe(
  (tpl) => templateString(tpl, values),
  Alexa.escapeXmlCharacters,
  R.trim,
)(template)

function applyContent(handlerInput, contentKey) {
  const locale = Alexa.getLocale(handlerInput.requestEnvelope)
  const localeContent = getLocaleContent(locale)

  const content = localeContent[contentKey] ?
    localeContent[contentKey] :
    {}

  const reqAttrs = handlerInput.attributesManager.getRequestAttributes()
  // const sessAttrs = handlerInput.attributesManager.getSessionAttributes()
  const speechCache = handlerInput.attributesManager.getRequestAttribute('speechCache')

  const templateValues = {
    slots: reqAttrs.slots,
    // ...sessAttrs,
  }

  if ('speak' in content) {
    const template = content.speak;
    const speak = applyStringTemplate(templateValues, template)

    speechCache.push(speak)
  }

  for (action in content) {
    if (action === 'speak') continue
    const template = content[action];
    const value = (typeof content[action] === 'string') ?
      applyStringTemplate(templateValues, template) :
      content[action]

    handlerInput.responseBuilder[action](value)
  }

  return handlerInput.responseBuilder;
}

function delegateToIntent(handlerInput, intentName, slotNames = []) {
  const requestSlots = handlerInput.attributesManager.getRequestAttribute('slots')
  const slots = R.toPairs(requestSlots).reduce(
    (acc, [name, value]) => {
      acc = acc || {}
      return slotNames.includes(name) ?
        {
          ...acc,
          [name]: {
            name,
            value,
            confirmationStatus: 'NONE',
          },
        } :
        acc
    },
    undefined,
  )

  handlerInput.responseBuilder.addDelegateDirective({
    name: intentName,
    slots,
  })
  return handlerInput.responseBuilder
}

function extendResponseBuilder(handlerInput) {
  handlerInput.responseBuilder.applyContent = applyContent.bind(null, handlerInput)
  handlerInput.responseBuilder.delegateToIntent = delegateToIntent.bind(null, handlerInput)
}

module.exports = extendResponseBuilder
