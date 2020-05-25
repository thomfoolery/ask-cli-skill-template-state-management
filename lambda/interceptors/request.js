const Alexa = require('ask-sdk-core')
const R = require('ramda')

const extendAttributesManager = require('../extensions/attributes-manager')
const extendResponseBuilder = require('../extensions/response-builder')

const { getRequestSlots } = require('../utils')

const skillModel = require('../model')

const requestInterceptors = [
  {
    process(handlerInput) {
      extendAttributesManager(handlerInput)
      extendResponseBuilder(handlerInput)
      return Promise.resolve()
    }
  },
  {
    process(handlerInput) {
      if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'CanFulfillIntentRequest') {
        return
      }

      const locale = Alexa.getLocale(handlerInput.requestEnvelope)
      const requestType = Alexa.getRequestType(handlerInput.requestEnvelope)

      if (Alexa.isNewSession(handlerInput.requestEnvelope) ||
        handlerInput.attributesManager.getSessionAttribute('sessionHistory') === undefined) {
        handlerInput.attributesManager.setSessionAttribute('sessionHistory', [])
        handlerInput.attributesManager.setRequestAttribute('requestHistory', [])
      } else {
        const sessionHistory = handlerInput.attributesManager.getSessionAttribute('sessionHistory') || [[]]
        const currentStateId = R.last(R.last(sessionHistory))

        handlerInput.attributesManager.setRequestAttribute('requestHistory', [currentStateId])
      }

      if (requestType === 'IntentRequest') {
        const sessionSlots = handlerInput.attributesManager.getSessionAttribute('slots') || {}
        const dialogState = Alexa.getDialogState(handlerInput.requestEnvelope)
        const slots = R.merge(
          sessionSlots,
          getRequestSlots(handlerInput.requestEnvelope),
        )

        handlerInput.attributesManager.setRequestAttribute('dialogState', dialogState)
        handlerInput.attributesManager.setRequestAttribute('slots', slots)
      }

      handlerInput.attributesManager.setRequestAttribute('skillModel', skillModel)
      handlerInput.attributesManager.setRequestAttribute('speechCache', [])
      handlerInput.attributesManager.setRequestAttribute('locale', locale)

      return Promise.resolve()
    }
  },
]

module.exports = requestInterceptors
