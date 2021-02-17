import { useEffect, useState, useRef } from 'react'
// import { switchTransition } from "../machine/boxMachine";
import { send, state } from '../machine/boxMachine'
import '../styles/style01.scss'

export default function Exercise01() {
  const boxRef = useRef(null)
  const [currentState, setCurrentState] = useState('inactive')
  const onClick = () => {
    // switch state machine example
    // const nextState = switchTransition(currentState, "CLICK");
    // setCurrentState(nextState);

    // object state machine example
    send('CLICK')
    setCurrentState(state)
  }

  useEffect(() => {
    setCurrentState(state)
  }, [])

  return (
    <div>
      <header>
        <h5>Goals</h5>
        <p>
          Create a state machine that toggles the #box between the inactive and
          active states when clicked.
        </p>
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
