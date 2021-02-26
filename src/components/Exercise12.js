import { useState, useRef, useEffect } from 'react'
import { Machine, interpret, send } from 'xstate'
import '../styles/style12.scss'

const randomFetch = () => {
  console.log('Fetching')

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        reject('Fetch Failed!')
      } else {
        resolve('Fetch succeeded!')
      }
    }, 3000)
  })
}

const machineDefinition = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'pending'
      }
    },
    pending: {
      invoke: {
        id: 'sender',
        src: (ctx, evt) => (sendBack, receive) => {
          receive((event) => {
            console.log('event type:', event.type)
            if (event.type === 'SEND_IT_ALREADY') {
              sendBack({ type: 'I_AM_DONE' })
            }
          })
        }
        // invoking actor
        // src: () => {
        //   return randomFetch()
        // },
        // onDone: {
        //   target: 'resolved',
        //   actions: (_, event) => console.log(event)
        // },
        // onError: 'rejected'
      },
      on: {
        CANCEL: 'idle',
        I_AM_DONE: 'resolved',
        SEND_IT_ALREADY: {
          actions: send({ type: 'SEND_IT_ALREADY' }, { to: 'sender' })
        }
      },
      after: {
        5000: 'rejected'
      }
    },
    resolved: {
      on: {
        FETCH: 'pending'
      }
    },
    rejected: {
      on: {
        FETCH: 'pending'
      }
    }
  }
}

const machine = Machine(machineDefinition)

export default function Exercise12() {
  const boxRef = useRef(null)
  const [service, setService] = useState({})
  const onClick = ({ target }) => {
    service.status !== 2 && service.send(target.dataset?.name)
  }

  useEffect(() => {
    const switchService = interpret(machine)
      .onTransition((state) => {
        console.log('onTransition', state.value)
        boxRef.current.dataset.state = state.toStrings().join(' ')
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
          Instead of a fire-and-forget action, we want to invoke an actor that
          will send an event back to the invoking machine. Using the invoke
          property, invoke a promise that eventually resolves (or rejects) with
          a value, and transition to the appropriate states (resolved or
          rejected).
        </p>
      </header>
      <main className="p-3">
        <div ref={boxRef} id="box" data-name="FETCH" onClick={onClick}>
          <span data-name="FETCH">Click to Fetch</span>
        </div>
        <button data-name="CANCEL" onClick={onClick}>
          CANCEL
        </button>
        <button data-name="SEND_IT_ALREADY" onClick={onClick}>
          SEND_IT_ALREADY
        </button>
      </main>
    </div>
  )
}
