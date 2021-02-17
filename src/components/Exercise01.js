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
        <h4>Exercise 01 - Creating a state machine</h4>
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
