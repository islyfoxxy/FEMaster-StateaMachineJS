import { Machine } from 'xstate'

const someMachine = Machine(
  {
    initial: 'active',
    states: {
      active: {
        entry: ['enterActive', 'sendTelemetry'],
        on: {
          CLICK: {
            target: 'inactive',
            actions: 'clickActive'
          }
        },
        exit: 'exitActive'
      },
      inactive: {
        entry: 'enterInactive',
        on: {},
        exit: ''
      }
    }
  },
  {
    actions: {
      enterActive: () => console.log('ENTERED ACTIVE'),
      sendTelemetry: () => console.log('SENDING TELEMETRY'),
      clickActive: () => console.log('CLICKED on ACTIVE'),
      exitActive: () => console.log('EXITED ECTIVE'),
      enterInactive: () => console.log('ENTERED INACTIVE')
    }
  }
)

export default someMachine
