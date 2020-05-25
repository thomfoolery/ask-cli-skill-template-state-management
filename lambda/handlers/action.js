const R = require('ramda')

const stateHandler = require('./state')
const ruleHandler = require('./rule')

const ACTIONS = {
  random,
  applyContent,
  transitionToState,
  setRequestAttribute,
}

async function random(actions, handlerInput) {
  const allIndices = Array(actions.length).fill(1).map((x, index) => index)
  const currentStateId = R.last(handlerInput.attributesManager.getRequestAttribute('requestHistory'))
  let visitedIndices = await handlerInput.attributesManager.getPersistentAttribute(`random.${currentStateId}`) || []

  if (visitedIndices.length === actions.length) {
    visitedIndices = [R.last(visitedIndices)] // new cache
  }

  const remainingIndices = visitedIndices.length > 0 ?
    R.without(visitedIndices, allIndices) :
    allIndices

  const index = remainingIndices[Math.floor(Math.random() * remainingIndices.length)]
  const action = actions[index]

  visitedIndices.push(index)

  await handlerInput.attributesManager.setPersistentAttribute(`random.${currentStateId}`, visitedIndices)

  actionHandler(action.id, action.args, handlerInput)
  return handlerInput
}

function applyContent(contentKey, handlerInput) {
  handlerInput.responseBuilder.applyContent(contentKey)

  return handlerInput
}

function setRequestAttribute(key, value, handlerInput) {
  handlerInput.attributesManager.setRequestAttribute(key, value)

  return handlerInput
}

async function transitionToState(nextStateId, handlerInput) {
  const skillModel = handlerInput.attributesManager.getRequestAttribute('skillModel')

  const destination =
    skillModel.states.find(({ id }) => id === nextStateId) ||
    skillModel.states.find(({ id }) => id === 'Error')

  const { actions = [] } = destination
  const requestHistory = handlerInput.attributesManager.getRequestAttribute('requestHistory')
  handlerInput.attributesManager.setRequestAttribute('requestHistory', requestHistory.concat(nextStateId))

  return await stateHandler(handlerInput)
}

function actionHandler(actionId, args, handlerInput) {
  let result = handlerInput

  if (ACTIONS[actionId]) {
    const action = ACTIONS[actionId]

    result = action(...args, handlerInput)
  }
  else if (handlerInput[actionId]) {
    const action = handlerInput[actionId]

    action.call(handlerInput, ...args)
  }
  else if (handlerInput.responseBuilder[actionId]) {
    const action = handlerInput.responseBuilder[actionId]

    action.call(handlerInput.responseBuilder, ...args)
  }

  return !isPromise(result) ?
    Promise.resolve(result) :
    result

  throw Error(`Invalid action '${actionId}' provided.`)
}

function isPromise(obj) {
  return typeof obj.then === 'function'
}

module.exports = actionHandler