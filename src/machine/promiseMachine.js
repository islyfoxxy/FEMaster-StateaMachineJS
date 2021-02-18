import { Machine } from 'xstate'

const promiseMachine = Machine({
  initial: 'idle',
  context: {
    rejections: 0
  },
  states: {
    idle: {
      on: {
        FETCH: 'pending'
      }
    },
    pending: {
      on: {
        RESOLVE: 'resolved',
        REJECT: [
          { target: 'rejected', cond: (ctx, _) => ctx.rejections < 5 },
          { target: 'failure' }
        ]
      }
    },
    resolved: {},
    rejected: {
      on: {
        FETCH: {
          target: 'pending',
          actions: (ctx, evt) => ctx.rejections + 1
        }
      },
      failure: {}
    }
  }
})

export default promiseMachine
