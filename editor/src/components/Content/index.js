import React from 'react';

import styles from './styles.module.css'

function Content({ id, speak, reprompt }) {
  return (
    <div className={styles.Content}>
      <header>
        {id}
      </header>
      <div>
        <p>
          <strong>Speak</strong><br/>
          {speak}
        </p>
      </div>
      <div>
        <p>
          <strong>Reprompt</strong><br/>
          {reprompt}
        </p>
      </div>
    </div>
  )
}

export default Content