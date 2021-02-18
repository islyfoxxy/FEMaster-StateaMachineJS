import { useState, useRef, useEffect } from 'react'
import { Machine, interpret, assign } from 'xstate'
import '../styles/style08.scss'

const machineDefinition = {
  initial: 'checkingAuth',
  context: {
    origin: { x: 0, y: 0 },
    delta: { x: 0, y: 0 },
    final: { x: 0, y: 0 },
    drags: 0,
    user: null
    // delay: 2000
  },
  states: {
    checkingAuth: {
      always: [
        {
          target: 'idle',
          cond: 'isAuthorized'
        },
        { target: 'unauthorized' }
      ],
      on: {}
    },
    idle: {
      on: {
        mousedown: [
          {
            cond: 'canDrag',
            target: 'dragging',
            actions: ['setPoint', 'setDatasetPoint']
          },
          {
            target: 'graggedOut'
          }
        ]
      }
    },
    dragging: {
      entry: ['countDrags'],
      after: {
        DRAG_TIMOUT: {
          target: 'idle',
          actions: ['resetPosition']
        }
      },
      on: {
        mousemove: {
          actions: ['setDelta', 'setDatasetPoint']
        },
        mouseup: {
          target: 'idle',
          actions: ['setRestPoint']
        },
        keyup: {
          target: 'idle',
          cond: 'isEscapePressed',
          actions: 'resetPosition'
        }
      }
    },
    graggedOut: {
      type: 'final'
    },
    unauthorized: {
      on: {
        signin: 'idle'
      }
    }
  }
}

const machineOptions = {
  actions: {
    setPoint: assign({
      origin: (_, evt) => ({ x: evt.clientX, y: evt.clientY })
    }),
    setDatasetPoint: (_, { clientX, clientY, target }) => {
      target.dataset.point = `(X:${clientX}, Y:${clientY})`
    },
    setDelta: assign({
      delta: ({ origin }, evt) => ({
        x: evt.clientX - origin.x,
        y: evt.clientY - origin.y
      })
    }),
    setRestPoint: assign({
      final: (ctx) => ({
        x: ctx.final.x + ctx.delta.x,
        y: ctx.final.y + ctx.delta.y
      }),
      delta: { x: 0, y: 0 },
      origin: { x: 0, y: 0 }
    }),
    countDrags: assign({
      drags: (ctx) => ctx.drags + 1
    }),
    resetPosition: assign({
      delta: { x: 0, y: 0 },
      origin: { x: 0, y: 0 }
    })
  },
  guards: {
    isAuthorized: (ctx) => !!ctx.user,
    canDrag: (ctx) => ctx.drags < 5,
    isEscapePressed: (_, evt) => evt.key === 'Escape'
  },
  delays: {
    DRAG_TIMOUT: (context) => context?.delay || 2000
  }
}

const machine = Machine(machineDefinition, machineOptions)

export default function Exercise08() {
  const boxRef = useRef(null)
  const mainRef = useRef(null)
  const signInBtnRef = useRef(null)
  const [service, setService] = useState({})
  const onAction = (evt) => service.status !== 2 && service.send(evt)
  const onSignIn = () =>
    service.status !== 2 && service.send({ type: 'signin' })

  useEffect(() => {
    const boxService = interpret(
      machine.withContext({
        ...machine.initialState.context,
        user: { name: 'Alexa' }
      })
    )
      .onTransition((state) => {
        boxRef.current.dataset.state = state.value
        boxRef.current.dataset.drags = state.context.drags
        signInBtnRef.current.dataset.state = state.value

        if (state.changed) {
          // console.log('state', state.value, state.context)
          boxRef.current.style.setProperty('--dx', state.context.delta.x)
          boxRef.current.style.setProperty('--dy', state.context.delta.y)
          boxRef.current.style.setProperty('--x', state.context.final.x)
          boxRef.current.style.setProperty('--y', state.context.final.y)
        }
      })
      .start()

    setService(boxService)
    document.body.onkeyup = (evt) =>
      boxService.status !== 2 && boxService.send(evt)

    return () => {
      boxService.stop()
    }
  }, [])

  return (
    <div ref={mainRef} onMouseMove={onAction} onMouseUp={onAction}>
      <header>
        <h5>Goals</h5>
        <p>Ensure that you can't drag the box for more than 2 seconds.</p>
      </header>
      <main>
        <div className="mt-5" id="box" ref={boxRef} onMouseDown={onAction}>
          <button id="button" ref={signInBtnRef} onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </main>
    </div>
  )
}
