const R = require('ramda')

const RULES = {
  ...R,
  pathEqOneOf: (path, oneOf, attrs) => {
    const value = R.path(path, attrs)

    return R.contains(value, oneOf)
  },
}

function rulesHandler(hasFailed, rule, handlerInput) {
  const attrs = handlerInput.attributesManager.getRequestAttributes()

  return !hasFailed ?
    !RULES[rule.operator](...rule.args, attrs) :
    hasFailed
}


module.exports = rulesHandler
