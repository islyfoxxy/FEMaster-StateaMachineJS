import { Machine } from 'xstate'

const appMachine = Machine(
  {
    initial: 'checkingAuth',
    context: {
      user: null
    },
    states: {
      checkingAuth: {
        on: {
          '': [
            { target: 'dashboard', cond: 'isAuthorized' },
            { target: 'login' }
          ]
        }
      },
      login: {},
      dashboard: {}
    }
  },
  {
    guars: {
      isAuthorized: (context) => !!context.user
    }
  }
)

export default appMachine
