import React from 'react';

import styles from './styles.module.css'

function Edge({ intentName, source, target }) {
  return (
    <div className={styles.Edge}>
      <header>
        {intentName}
      </header>
      <div>
        Source: {source}
      </div>
      <div>
        Target: {target}
      </div>
    </div>
  )
}

export default Edge