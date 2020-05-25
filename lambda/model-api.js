function StateModel({ states = [], edges = [] }) {
  this.states = []
  this.edge = []
}

function State({ id, actions = [], requests = [] }) {
  this.id = id
  this.actions = actions
  this.requests = requests
}

function Edge({ intentName, source, target }) {
  this.id = `${intentName}:${source}:${target}`
  this.source = source
  this.target = target
  this.intentName = intentName
}

StateModel.prototype.addState = function(stateConfig) {
  this.states.push(new State(stateConfig))
}

StateModel.prototype.addEdge = function(id, edgeConfig) {
  this.states.push(new Edge(edgeConfig))
}

module.exports = {
  StateModel,
  State,
  Edge,
}

// EXAMPLE

// const model = require('./model.json')
// const stateModel = new StateModel(model)

// stateModel.addState({
//   id: 'HelloWorld',
//   actions: [
//     {
//       id: 'applyContent',
//       args: ['HelloWorld']
//     },
//     {
//       id: 'transitionToState',
//       args: ['HelloWorld2']
//     },
//   ],
// })
