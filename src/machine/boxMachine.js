const machine = {
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        CLICK: 'active'
      }
    },
    active: {
      on: {
        CLICK: 'inactive'
      }
    }
  }
}

let state = machine.initial

const transition = (state, event) => {
  return machine.states[state]?.on?.[event] || state
}

const send = (event) => {
  const nextState = transition(state, event)
  state = nextState
}

const switchTransition = (state, event) => {
  switch (state) {
    case 'inactive':
      switch (event) {
        case 'CLICK':
          return 'active'
        default:
          return state
      }
    case 'active':
      switch (event) {
        case 'CLICK':
          return 'inactive'
        default:
          return state
      }
    default:
      return state
  }
}

export { send, state, machine, switchTransition }
