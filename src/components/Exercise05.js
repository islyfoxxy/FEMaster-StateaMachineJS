import { useState, useRef, useEffect } from 'react'
import { Machine, interpret, assign } from 'xstate'
import '../styles/style05.scss'

const machine = Machine(
  {
    initial: 'idle',
    context: {
      origin: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
      final: { x: 0, y: 0 }
    },
    states: {
      idle: {
        on: {
          mousedown: {
            target: 'dragging',
            actions: ['setPoint', 'setDatasetPoint']
          }
        }
      },
      dragging: {
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
            cond: (_, evt) => evt.key === 'Escape',
            actions: 'cancelGragging'
          }
        }
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
        final: (ctx, _) => ({
          x: ctx.final.x + ctx.delta.x,
          y: ctx.final.y + ctx.delta.y
        }),
        delta: { x: 0, y: 0 },
        origin: { x: 0, y: 0 }
      }),
      cancelGragging: assign((_, evt) => ({
        delta: { x: 0, y: 0 },
        origin: { x: 0, y: 0 }
      }))
    }
  }
)

export default function Exercise05() {
  const boxRef = useRef(null)
  const [service, setService] = useState(null)
  const onMouseDown = service ? service.send : null

  useEffect(() => {
    const boxService = interpret(machine).onTransition((state) => {
      boxRef.current.dataset.state = state.value
      if (state.changed) {
        console.log('context:', state.context)
        boxRef.current.style.setProperty('--dx', state.context.delta.x)
        boxRef.current.style.setProperty('--dy', state.context.delta.y)
        boxRef.current.style.setProperty('--x', state.context.final.x)
        boxRef.current.style.setProperty('--y', state.context.final.y)
      }
    })
    setService(boxService)
    boxService.start()

    const elBody = document.querySelector('body')
    elBody.addEventListener('mousemove', boxService.send)
    elBody.addEventListener('mouseup', boxService.send)
    elBody.addEventListener('keyup', boxService.send)

    return () => {
      elBody.removeEventListener('mousemove', boxService.send)
      elBody.removeEventListener('mouseup', boxService.send)
      boxService.stop()
    }
  }, [])

  return (
    <div>
      <header>
        <h5>Goals</h5>
        <p>
          Use context to update the extended state of the drag/drop state
          machine. You will need to: Assign the point values (px, py) to
          wherever the #box was clicked on the idle (mousedown) -> dragging
          transition. Assign the delta values (dx, dy) to how far from the
          original px and py values the mouse has moved on the dragging
          (mousemove) transition. Assign the resting position (x, y) as the
          current position + the delta on the dragging (mouseup) -> idle
          transition.
        </p>
      </header>
      <main>
        <div className="mt-5" id="box" ref={boxRef} onMouseDown={onMouseDown} />
      </main>
    </div>
  )
}
