import { useState, useRef, useEffect } from 'react'
import { Machine, interpret, assign } from 'xstate'
import '../styles/style07.scss'

const machineDefinition = {
  initial: 'checkingAuth',
  context: {
    origin: { x: 0, y: 0 },
    delta: { x: 0, y: 0 },
    final: { x: 0, y: 0 },
    drags: 0,
    user: null
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
          actions: 'cancelGragging'
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
    cancelGragging: assign({
      delta: { x: 0, y: 0 },
      origin: { x: 0, y: 0 }
    })
  },
  guards: {
    isAuthorized: (ctx) => !!ctx.user,
    canDrag: (ctx) => ctx.drags < 5,
    isEscapePressed: (_, evt) => evt.key === 'Escape'
  }
}

const machine = Machine(machineDefinition, machineOptions)

const machineCreator = (user) =>
  Machine(
    {
      initial: 'checkingAuth',
      context: {
        origin: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
        final: { x: 0, y: 0 },
        drags: 0,
        user: user
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
              actions: 'cancelGragging'
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
    },
    machineOptions
  )

export default function Exercise07() {
  const boxRef = useRef(null)
  const mainRef = useRef(null)
  const signInBtnRef = useRef(null)
  const [service, setService] = useState({})
  const onAction = (evt) => service.status !== 2 && service.send(evt)
  const onSignIn = () =>
    service.status !== 2 && service.send({ type: 'signin' })

  useEffect(() => {
    const boxService = interpret(machineCreator({ name: 'Alexa' }))
      // const boxService = interpret(
      //   machine.withContext({
      //     ...machine.initialState.context,
      //     user: { name: 'Alexa' }
      //   })
      // )
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

    return () => {
      boxService.stop()
    }
  }, [])

  return (
    <div
      ref={mainRef}
      onMouseMove={onAction}
      onMouseUp={onAction}
      onKeyUp={onAction}
    >
      <header>
        <h5>Goals</h5>
        <p>
          Use a guarded transition and context to prevent the #box from being
          dragged more than 5 times.
        </p>
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
