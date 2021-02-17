import { useState, useRef, useEffect } from 'react'
import { Machine, interpret } from 'xstate'
import '../styles/style04.scss'

const machine = Machine(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          mousedown: {
            target: 'dragging',
            actions: 'setPoint'
            // actions: (_, { pageX, pageY, target }) => {
            //   target.dataset.point = `pageX:${pageX}, pageY:${pageY}`
            // }
          }
        }
      },
      dragging: {
        on: {
          mouseup: 'idle'
        }
      }
    }
  },
  {
    actions: {
      setPoint: (_, { clientX, clientY, target }) => {
        target.dataset.point = `(X:${clientX}, Y:${clientY})`
      }
    }
  }
)

export default function Exercise04() {
  const boxRef = useRef(null)
  const [service, setService] = useState(null)
  const onMouseDown = service ? service.send : null
  const onMouseUp = service ? service.send : null

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
          Execute an action with XState that set's the data-point attribute of
          #box to wherever it was clicked on the mousedown event.
        </p>
      </header>
      <main>
        <div
          className="mt-5"
          id="box"
          ref={boxRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      </main>
    </div>
  )
}
