const Alexa = require('ask-sdk-core')

const errorHandler = {
  canHandle: () => true,
  handle(handlerInput, error) {
    const contentKey = `@Error`

    console.log(`~~~~ Error handled: ${error.stack}`)

    return handlerInput.responseBuilder
      .applyContent(contentKey)
      .getResponse()
  }
}

module.exports = errorHandler