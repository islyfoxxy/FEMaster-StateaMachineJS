import { assign, Machine } from 'xstate'

const lightbulbMachine = Machine({
  initial: 'turnedOff',
  context: {
    count: 0
  },
  states: {
    turnedOff: {
      on: {
        TOGGLE: {
          target: 'turnedOn',
          actions: 'turnOn'
        }
      }
    },
    turnedOn: {
      entry: assign({
        count: (context, _) => context.count + 1
      }),
      on: {
        TOGGLE: {
          target: 'turnedOff',
          actions: 'turnOff'
        }
      }
    }
  }
})

const assignAction = assign({
  message: 'Hello',
  count: (context, event) => context.count + event.value
})

export { lightbulbMachine, assignAction }
