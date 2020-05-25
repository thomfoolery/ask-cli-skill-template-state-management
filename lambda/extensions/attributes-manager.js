const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter')
const AWS = require('aws-sdk')

const isAWSLambdaEnvironment = !('AWS_LAMBDA_FUNCTION_NAME' in process.env)

const dynamoDBClient = isAWSLambdaEnvironment?
  new AWS.DynamoDB({
    region: 'us-east-1',
    credentials: new AWS.SharedIniFileCredentials({ profile: 'ask-cli' }),
  }) :
  null

const dynamoDbPersistenceAdapter = new DynamoDbPersistenceAdapter({
  dynamoDBClient,
  createTable: true,
  tableName: 'askBedTimeStory',
})

function extendAttributesManager(handlerInput) {
  // request
  handlerInput.attributesManager.getRequestAttribute = (key) => {
    const attrs = handlerInput.attributesManager.getRequestAttributes()
    return attrs[key]
  }

  handlerInput.attributesManager.setRequestAttribute = (key, value) => {
    const attrs = handlerInput.attributesManager.getRequestAttributes()

    handlerInput.attributesManager.setRequestAttributes({
      ...attrs,
      [key]: value,
    })
  }

  // session
  handlerInput.attributesManager.getSessionAttribute = (key) => {
    const attrs = handlerInput.attributesManager.getSessionAttributes()
    return attrs[key]
  }

  handlerInput.attributesManager.setSessionAttribute = (key, value) => {
    const attrs = handlerInput.attributesManager.getSessionAttributes()

    handlerInput.attributesManager.setSessionAttributes({
      ...attrs,
      [key]: value,
    })
  }

  // persistent
  handlerInput.attributesManager.getPersistentAttributes = dynamoDbPersistenceAdapter.getAttributes.bind(dynamoDbPersistenceAdapter, handlerInput.requestEnvelope)
  handlerInput.attributesManager.setPersistentAttributes = dynamoDbPersistenceAdapter.saveAttributes.bind(dynamoDbPersistenceAdapter, handlerInput.requestEnvelope)
  handlerInput.attributesManager.deletePersistentAttributes = dynamoDbPersistenceAdapter.deleteAttributes.bind(dynamoDbPersistenceAdapter, handlerInput.requestEnvelope)

  handlerInput.attributesManager.getPersistentAttribute = async (key) => {
    const attrs = await dynamoDbPersistenceAdapter.getAttributes(handlerInput.requestEnvelope)
    return attrs[key]
  }

  handlerInput.attributesManager.setPersistentAttribute = async (key, value) => {
    const attrs = await  dynamoDbPersistenceAdapter.getAttributes(handlerInput.requestEnvelope)

    return dynamoDbPersistenceAdapter.saveAttributes(handlerInput.requestEnvelope, {
      ...attrs,
      [key]: value,
    })
  }
}

module.exports = extendAttributesManager
