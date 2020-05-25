const Alexa = require('ask-sdk-core')
const R = require('ramda')

const stateHandler = require('./state')

// Launch Handler
async function launchHandler(handlerInput) {
  const currentStateId = `@LaunchRequest`

  // Setup
  handlerInput.attributesManager.setRequestAttribute('requestHistory', [currentStateId])

  const result = await stateHandler(handlerInput)

  return result.responseBuilder.getResponse()
}

// Intent Handler
async function intentHandler(handlerInput) {
  const intentName = Alexa.getIntentName(handlerInput.requestEnvelope)
  const skillModel = handlerInput.attributesManager.getRequestAttribute('skillModel')
  const requestHistory = handlerInput.attributesManager.getRequestAttribute('requestHistory')
  const currentStateId = R.last(requestHistory)

  const currentState = skillModel.states.find(({ id }) => id === currentStateId)
  const defaultState = skillModel.states.find(({ id }) => id === '@Default')

  const request = currentState ?
    currentState.requests.find((child) => child.intentName === intentName) ||
    defaultState.requests.find((child) => child.intentName === intentName) :
    defaultState.requests.find((child) => child.intentName === intentName)

  const nextState = request ?
    skillModel.states.find((state) => state.id === request.stateId) :
    skillModel.states.find((state) => state.id === 'Error')

  requestHistory.push(nextState.id)
  handlerInput.attributesManager.setRequestAttribute('requestHistory', requestHistory)

  const result = await stateHandler(handlerInput)

  return result.responseBuilder.getResponse()
}

function canFulfillIntentHandler(handlerInput){
  const intentName = handlerInput.requestEnvelope.request.intent.name

  if (intentName === 'TellStory') {
    handlerInput.responseBuilder.withCanFulfillIntent({ canFulfill: 'YES' })
  }
  else {
    handlerInput.responseBuilder.withCanFulfillIntent({ canFulfill: 'NO' })
  }

  return handlerInput.responseBuilder.getResponse()
}

// Session Ended Handler
async function sessionEndedHandler(handlerInput) {
  const nextStateId = `Goodbye`
  const requestHistory = handlerInput.attributesManager.getRequestAttribute('requestHistory')

  // Cleanup

  requestHistory.push(nextStateId)
  handlerInput.attributesManager.setRequestAttribute('requestHistory', requestHistory)

  const result = await stateHandler(handlerInput)

  return result.responseBuilder.getResponse()
}

const requestHandlers = [
  {
    canHandle: () => true,
    handle(handlerInput) {
      const requestType = Alexa.getRequestType(handlerInput.requestEnvelope)

      if (requestType.startsWith('AudioPlayer')) {
        throw Error(`AudioPlayer not supported`);
      }
      else if (requestType.startsWith('GadgetController')) {
        throw Error(`GadgetController not supported`);
      }
      else if (requestType.startsWith('InputHandlerEvent')) {
        throw Error(`InputHandlerEvent not supported`);
      }
      else if (requestType.startsWith('PlaybackController')) {
        throw Error(`PlaybackController not supported`);
      }
      else if (requestType.startsWith('Alexa.Presentation.APL')) {
        throw Error(`Alexa.Presentation.APL not supported`);
      }

      switch(requestType) {
        case 'LaunchRequest':
          return launchHandler(handlerInput);
        case 'IntentRequest':
          return intentHandler(handlerInput);
        case 'SessionEndedRequest':
          return sessionEndedHandler(handlerInput);
        case 'CanFulfillIntentRequest':
          return canFulfillIntentHandler(handlerInput);
        case 'Connections.Response':
          throw Error(`Connections.Response not supported`);
        default:
          throw Error(`Request type not supported`);
      }
    },
  },
]

module.exports = requestHandlers
