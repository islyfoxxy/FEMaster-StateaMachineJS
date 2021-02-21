import { useState, useRef, useEffect } from 'react'
import { Machine, interpret, assign } from 'xstate'
import '../styles/style09.scss'

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
      initial: 'normal',
      states: {
        normal: {
          on: {
            'keydown.shift': 'lockedX',
            'keydown.control': 'lockedY'
          }
        },
        lockedX: {
          on: {
            'keyup.shift': 'normal',
            mousemove: {
              actions: ['setXDelta']
            }
          }
        },
        lockedY: {
          on: {
            'keyup.control': 'normal',
            mousemove: {
              actions: ['setYDelta']
            }
          }
        }
      },
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
    setXDelta: assign({
      delta: ({ origin }, evt) => ({
        x: evt.clientX - origin.x,
        y: 0
      })
    }),
    setYDelta: assign({
      delta: ({ origin }, evt) => ({
        x: 0,
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
    canDrag: (ctx) => ctx.drags < 10,
    isEscapePressed: (_, evt) => evt.key === 'Escape'
  },
  delays: {
    DRAG_TIMOUT: (context) => context?.delay || 6000
  }
}

const machine = Machine(machineDefinition, machineOptions)

export default function Exercise09() {
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
        boxRef.current.dataset.state = state.toStrings().join(' ')
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
    document.body.onkeyup = (evt) => {
      boxService.status !== 2 &&
        (evt.key === 'Shift'
          ? boxService.send('keyup.shift')
          : evt.key === 'Control'
          ? boxService.send('keyup.control')
          : boxService.send(evt))
    }
    document.body.onkeydown = (evt) => {
      boxService.status !== 2 &&
        evt.shiftKey &&
        boxService.send('keydown.shift')
      boxService.status !== 2 &&
        evt.ctrlKey &&
        boxService.send('keydown.control')
    }

    return () => {
      boxService.stop()
    }
  }, [])

  return (
    <div ref={mainRef} onMouseMove={onAction} onMouseUp={onAction}>
      <header>
        <h5>Goals</h5>
        <p>
          When the shift key is pressed while dragging, we want the #box to only
          move on the X-axis.
        </p>
      </header>
      <main>
        <div className="my-5" id="box" ref={boxRef} onMouseDown={onAction}>
          <button id="button" ref={signInBtnRef} onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </main>
    </div>
  )
}
