const yargs = require('yargs')
const path = require('path')
const R = require('ramda')

const sample_tpl = require('./request.sample')
const help_tpl = require('./request.tpl.help')
const intent_tpl = require('./request.tpl.intent')
const launch_tpl = require('./request.tpl.launch')
const fallback_tpl = require('./request.tpl.fallback')
const canFulfill_tpl = require('./request.tpl.canFulfill')
const sessionEnded_tpl = require('./request.tpl.sessionEnded')

const { handler } = require('../index')

const { argv } = yargs
  .option('intent', {
    alias: 'i',
    default: false,
    type: 'string',
  })
  .option('launch', {
    alias: 'l',
    default: false,
    type: 'boolean',
  })
  .option('fallback', {
    alias: 'f',
    default: false,
    type: 'boolean',
  })
  .option('sample', {
    alias: 's',
    default: false,
    type: 'boolean',
  })
  .option('help', {
    alias: 'h',
    default: false,
    type: 'boolean',
  })
  .option('canFulfillIntent', {
    alias: 'c',
    default: false,
    type: 'boolean',
  })
  .help()

let requestEnvelope

if (argv.help) {
  requestEnvelope = help_tpl
}
if (argv.intent) {
  requestEnvelope = intent_tpl
  requestEnvelope.request.intent.name = argv.intent
}
else if (argv.launch) {
  requestEnvelope = launch_tpl
}
else if (argv.fallback) {
  requestEnvelope = fallback_tpl
}
else if (argv.sample) {
  requestEnvelope = sample_tpl
}
else if (argv.canFulfillIntent) {
  requestEnvelope = canFulfill_tpl
}
else {
  console.log('Please provide args')
  process.exit()
}

handler(requestEnvelope, {}, (err, responseEnvelope) => {
  if (err) {
    console.error(err)
  } else {
    console.log(
      JSON.stringify(responseEnvelope, null, 2)
    )
  }
});