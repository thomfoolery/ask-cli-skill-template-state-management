import React from 'react'
import styles from './styles.module.css'

// function Action({ id, args }) {
//   return (
//     <div key={id}
//       className={styles.StateAction}>
//       <header>
//         {id}
//       </header>
//       {
//         args.map((arg, index) => {
//           return (
//             <pre key={index}>
//               {JSON.stringify(arg, null, 2)}
//             </pre>
//           )
//         })
//       }
//     </div>
//   )
// }

function State({ id, actions, requests }) {
  return (
    <div className={styles.State}>
      <header>
        {id}
      </header>
      {/*
        actions.length > 0 &&
        <strong>
          Actions
        </strong>
      }
      {
        actions.map((action) => (
          <Action
            key={action.id}
            {...action}
          />
        ))
      */}
    </div>
  )
}

export default State