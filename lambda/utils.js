const Alexa = require('ask-sdk-core')
const R = require('ramda')

const AWS = require('aws-sdk')
const s3SigV4Client = new AWS.S3({ signatureVersion: 'v4' })

function getS3PreSignedUrl(s3ObjectKey) {
  const bucketName = process.env.S3_PERSISTENCE_BUCKET
  const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
    Key: s3ObjectKey,
    Bucket: bucketName,
    Expires: 60 * 1 // 1 minute
  })

  // console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`)

  return s3PreSignedUrl
}

function getRequestSlots(requestEnvelope) {
  const slots = R.values(requestEnvelope.request.intent.slots)

  return slots.reduce((acc, item) => {
    const { name, value } = item;

    if (R.hasPath(['resolutions', 'resolutionsPerAuthority', 0], item)) {
      const statusCode = R.path(['resolutions', 'resolutionsPerAuthority', 0, 'status', 'code'])

      switch (statusCode) {
        case 'ER_SUCCESS_MATCH':
          return R.set(
            R.lensProp(name),
            R.path(['resolutions', 'resolutionsPerAuthority', 0, 'values', 0, 'value', 'name'], item),
            acc,
          )
        case 'ER_SUCCESS_NO_MATCH':
        default:
          return R.set(R.lensProp(name), value, acc)
      }
    } else {
      return R.set(R.lensProp(name), value, acc);
    }
  }, {});
}

module.exports = {
  getS3PreSignedUrl,
  getRequestSlots,
}