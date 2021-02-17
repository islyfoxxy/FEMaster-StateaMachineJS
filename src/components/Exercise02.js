import { useState, useRef } from 'react'
import { Machine } from 'xstate'
import { machine } from '../machine/boxMachine'
import '../styles/style02.scss'

export default function Exercise02() {
  const boxRef = useRef(null)
  const boxMachine = Machine(machine)
  const [currentState, setCurrentState] = useState(boxMachine.initial)

  const send = (event) => {
    const nextState = boxMachine.transition(currentState, event)
    setCurrentState(nextState.value)
  }

  const onClick = () => send('CLICK')

  return (
    <div>
      <header>
        <h5>Goals</h5>
        <p>Refactor the previous state machine with XState.</p>
      </header>
      <main>
        <div
          id="box"
          ref={boxRef}
          data-state={currentState}
          onClick={onClick}
        />
      </main>
    </div>
  )
}
