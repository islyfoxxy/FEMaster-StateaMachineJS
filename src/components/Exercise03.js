import { useState, useRef, useEffect } from 'react'
import { Machine, interpret } from 'xstate'
import '../styles/style03.scss'

const machine = Machine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        mousedown: 'active'
      }
    },
    active: {
      on: {
        mouseup: 'inactive'
      }
    }
  }
})

export default function Exercise03() {
  const boxRef = useRef(null)
  const [service, setService] = useState(null)
  const onMouseDown = (evt) => service.send(evt)
  const onMouseUp = (evt) => service.send(evt)

  useEffect(() => {
    const boxService = interpret(machine).onTransition((state) => {
      boxRef.current.dataset.state = state.value
    })
    setService(boxService)
    boxService.start()

    return () => {
      boxService.stop()
    }
  }, [])

  return (
    <div>
      <header>
        <h5>Goals</h5>
        <p>
          Interpret state machines by using an interpreter. The machine should
          toggle between the `inactive` and `active` states
        </p>
      </header>
      <main>
        <div
          id="box"
          ref={boxRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      </main>
    </div>
  )
}
