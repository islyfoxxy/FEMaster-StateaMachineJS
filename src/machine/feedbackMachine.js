import { createMachine, interpret } from 'xstate'

const feedbackMachine = createMachine({
  initial: 'question',
  states: {
    question: {
      on: {
        CLICK_GOOD: 'thanks',
        CLIICK_BAD: 'form'
      }
    },
    form: {
      on: {
        SUBMIT: {
          target: 'thanks'
        }
      }
    },
    thanks: {
      on: {
        CLOSE: 'closed'
      }
    },
    closed: {
      type: 'final'
    }
  }
})

const transition = (state, event) =>
  feedbackMachine.states[state]?.on?.[event] || state

const feedbackService = interpret(feedbackMachine)

// function interpret(machine) {
//   let state = feedbackMachine.initial
//   let status = 1 // 1 means started
//   let listeners = new Set() //keep track of listeners

//   const send = (event) => {
//     // do not accept events if stopped
//     if (status === 2) return

//     const nextState = transition(state, event)
//     state = nextState
//     listeners.forEach((listener) => listener(state))
//   }

//   // register listener
//   const onTransition = (listener) => {
//     listeners.add(listener)
//   }

//   const stop = () => {
//     status = 2
//     listeners.clear()
//   }
//   return { send, stop, onTransition }
// }

export { transition, feedbackMachine, feedbackService }
