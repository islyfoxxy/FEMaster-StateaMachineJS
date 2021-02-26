import { useState, useRef, useEffect } from 'react'
import { Machine, interpret } from 'xstate'
import '../styles/style11.scss'

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
      type: 'parallel',
      on: {
        OFF: 'hidden'
      },
      states: {
        hist: {
          type: 'history',
          history: 'deep'
        },
        mode: {
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
            }
          }
        },
        brightness: {
          initial: 'bright',
          states: {
            bright: {
              after: {
                3000: 'dim'
              }
            },
            dim: {
              on: {
                SWITCH: 'bright'
              }
            }
          }
        }
      }
    }
  }
}

const machine = Machine(machineDefinition)

export default function Exercise11() {
  const mainRef = useRef(null)
  const [service, setService] = useState({})
  const onClick = (evt) => {
    service.status !== 2 && service.send(evt.target.id)
  }

  useEffect(() => {
    const switchService = interpret(machine)
      .onTransition((state) => {
        console.log('onTransition', state.toStrings().join(' '))
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
          Currently, when our statechart is in the visible state, we can only
          control its mode - light or dark. However, we want some behavior to
          happen at the same time where the brightness of the screen changes
          after a few seconds, to either bright or dim. These states can happen
          orthogonal (concurrently) to the other states, so let's model this as
          parallel states! After 5 seconds, we should go from
          visible.brightness.bright to visible.brightness.dim When a SWITCH
          event happens in visible.brightness.dim, we should go back to
          visible.brightness.bright.
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
