import React, {useState, useEffect} from 'react'

import State from '../State'

import styles from './styles.module.css'

function App() {
  const [stateModel, setStateModel] = useState(null)

  useEffect(() => {
    fetch('/api/state/model')
      .then((resp) => resp.json())
      .then((stateModel) => setStateModel(stateModel))
  }, [])

  if (!stateModel) {
    return null
  }

  const rootIds = stateModel.states.reduce(
    (acc, state) => state.id.startsWith('@') ? acc.concat(state.id) : acc,
    []
  )

  const crawlArgs = (args, acc = []) => {
    return args.reduce(
      (acc2, { id, args }) => {
        if (id === undefined || !Array.isArray(args)) {
          return acc2
        }
        if (id === 'random') {
          return acc2.concat(crawlArgs(args[0]))
        }
        if (id === 'transitionToState') {
          return acc2.concat(Render(args[0]))
        }
        // if (id === 'delegateToIntent') {
        //   return acc2.concat(Render(args[0]))
        // }
        return acc2
      },
      acc
    )
  }

  const Render = (id) => {
    const node = stateModel.states.find((state) => state.id === id)

    return (
      <div key={id} className={styles.Node}>
        <State {...node}/>
        <div className={styles.Children}>
          { node.requests.map(({ stateId }) => Render(stateId)) }
          { crawlArgs(node.actions) }
        </div>
      </div>
    )
  }

  return (
    <div className={styles.App}>
      { rootIds.map(Render) }
    </div>
  )
}

export default App
