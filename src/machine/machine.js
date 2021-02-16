// Interpreting state machines

const machine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        FETCH: "pending"
      }
    },
    pending: {
      on: {
        RESOLVE: "resolved",
        REJECT: "rejected"
      }
    },
    resolved: {},
    rejected: {}
  }
};

//keep track of current state
let currentState = machine.initial;

const transition = (state, event) => {
  return machine.states[state]?.on?.[event] || state;
};

//receive events
const send = (event) => {
  const nextState = transition(currentState, event);
  console.log(`${currentState} - ${event} - ${nextState}`);
  currentState = nextState;
};

function transitionSwitch(state, event) {
  switch (state) {
    case "idle":
      switch (event) {
        case "FETCH":
          return "pending";
        default:
          return state;
      }
    case "pending":
      switch (event) {
        case "RESOLVE":
          return "resolved";
        case "REJECT":
          return "rejected";
        default:
          return state;
      }
    case "resolved":
    case "rejected":
    default:
      return state;
  }
}

export { machine, transition, send, transitionSwitch };
