import { useState, useRef, useEffect } from 'react'
import { Machine, interpret, assign } from 'xstate'
import '../styles/style06.scss'

const machine = Machine(
  {
    initial: 'idle',
    context: {
      origin: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
      final: { x: 0, y: 0 },
      drags: 0
    },
    states: {
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
      }
    }
  },
  {
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
      canDrag: (ctx, _) => ctx.drags < 5,
      isEscapePressed: (_, evt) => evt.key === 'Escape'
    }
  }
)

export default function Exercise06() {
  const boxRef = useRef(null)
  const mainRef = useRef(null)
  const [service, setService] = useState({})
  const onAction = (evt) => service.status !== 2 && service.send(evt)

  useEffect(() => {
    const boxService = interpret(machine).onTransition((state) => {
      boxRef.current.dataset.state = state.value
      boxRef.current.dataset.drags = state.context.drags

      if (state.changed) {
        boxRef.current.style.setProperty('--dx', state.context.delta.x)
        boxRef.current.style.setProperty('--dy', state.context.delta.y)
        boxRef.current.style.setProperty('--x', state.context.final.x)
        boxRef.current.style.setProperty('--y', state.context.final.y)
      }
    })
    setService(boxService)
    boxService.start()

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
        <div className="mt-5" id="box" ref={boxRef} onMouseDown={onAction} />
      </main>
    </div>
  )
}
