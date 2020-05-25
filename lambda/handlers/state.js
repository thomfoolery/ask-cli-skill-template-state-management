const Alexa = require('ask-sdk-core')
const R = require('ramda')

async function stateHandler(handlerInput) {
  const requestHistory = handlerInput.attributesManager.getRequestAttribute('requestHistory')
  const skillModel = handlerInput.attributesManager.getRequestAttribute('skillModel')
  const currentStateId = R.last(requestHistory)
  const actionHandler = require('./action')

  const currentState =
    skillModel.states.find(({ id }) => id === currentStateId) ||
    skillModel.states.find(({ id }) => id === 'Error')

  return await currentState.actions.reduce(
    (acc, { id, args }) => {
      return acc.then((handlerInput) => actionHandler(id, args, handlerInput))
    },
    Promise.resolve(handlerInput),
  )
}

module.exports = stateHandler