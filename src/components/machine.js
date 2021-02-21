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

const transition = (state, event) => {
  return machine.states[state]?.on?.[event] || state;
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

export { machine, transition, transitionSwitch };
