// visit https://alexa.design/cookbook for additional examples

const Alexa = require('ask-sdk-core')

const responseInterceptors = require('./interceptors/response')
const requestInterceptors = require('./interceptors/request')
const requestHandlers = require('./handlers/request')
const errorHandler = require('./handlers/error')

exports.handler = Alexa.SkillBuilders.custom()
  .addResponseInterceptors(...responseInterceptors)
  .addRequestInterceptors(...requestInterceptors)
  .addRequestHandlers(...requestHandlers)
  .addErrorHandlers(errorHandler)
  .lambda()
