import { useState, useRef, useEffect } from 'react'
import { Machine, interpret } from 'xstate'
import '../styles/style10.scss'

const machineDefinition = {
  initial: 'hidden',
  context: {},
  states: {
    hidden: {
      on: {
        ON: 'visible.hist'
      }
    },
    visible: {
      initial: 'light',
      states: {
        light: {
          on: {
            SWITCH: 'dark'
          }
        },
        dark: {
          on: {
            SWITCH: 'light'
          }
        },
        hist: {
          type: 'history',
          history: 'deep',
          target: 'light'
        }
      },
      on: {
        OFF: 'hidden'
      }
    }
  }
}

const machine = Machine(machineDefinition)

export default function Exercise10() {
  const mainRef = useRef(null)
  const [service, setService] = useState({})
  const onClick = (evt) => {
    service.status !== 2 && service.send(evt.target.id)
  }

  useEffect(() => {
    const switchService = interpret(machine)
      .onTransition((state) => {
        mainRef.current.dataset.state = state.toStrings().join(' ')
      })
      .start()
    setService(switchService)
    return () => {
      switchService.stop()
    }
  }, [])

  return (
    <div>
      <header>
        <h5>Goals</h5>
        <p>
          Create a machine that shows and hides a display. When that display is
          visible, we should be able to switch between light and dark mode for
          that display. However, when we go from visible to hidden and back to
          visible, the machine forgets what mode we were in! Use a history state
          to "remember" what the most recent mode (child state) of the visible
          state was.
        </p>
      </header>
      <main className="p-3" id="app" ref={mainRef}>
        <div className="mt-4">
          <button id="OFF" onClick={onClick}>
            Turn Off
          </button>
          <button id="ON" onClick={onClick}>
            Turn On
          </button>
        </div>
        <div id="display">
          <button id="SWITCH" onClick={onClick}>
            Switch mode
          </button>
        </div>
      </main>
    </div>
  )
}
