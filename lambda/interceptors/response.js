const Alexa = require('ask-sdk-core')
const R = require('ramda')

const responseInterceptors = [
  {
    process(handlerInput, response) {
      if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'CanFulfillIntentRequest') {
        return
      }

      const sessionHistory = handlerInput.attributesManager.getSessionAttribute('sessionHistory')
      const requestHistory = handlerInput.attributesManager.getRequestAttribute('requestHistory')
      const speechCache = handlerInput.attributesManager.getRequestAttribute('speechCache')
      const slots = handlerInput.attributesManager.getRequestAttribute('slots')

      if (speechCache.length > 0) {
        handlerInput.responseBuilder.speak(speechCache.join(' '))
      }

      sessionHistory.push(requestHistory)
      handlerInput.attributesManager.setSessionAttribute('slots', slots)
      handlerInput.attributesManager.setSessionAttribute('sessionHistory', sessionHistory)

      return Promise.resolve()
    }
  },
]

module.exports = responseInterceptors