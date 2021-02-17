# Exercise 00 - Welcome

## Goals

Use this exercise as a scratchpad 📝

## Tips

- If you `output(someObject)`, it will print out onto the screen:

# Exercise 01 - Creating a State Machine

## Goals

Create a state machine that toggles the `#box` between the `inactive` and `active` states when clicked.

## Tips

- Start by using a `switch` statement for each of the states.
- Keep track of the current state (start with `inactive`).
- Listen for `click` events on `#box`, and "send" a click event that your state machine will interpret.
- Create a transition function that will return the next state given the current `state` and the `event` sent.
- Set the `data-state` attribute of the `#box` element to the current state.

## Extra Credit

- Use object syntax instead of a `switch` statement instead.
- Create a self-contained interpreter that uses a closure to keep track of the current state machine value. Get creative!

# Exercise 03 - Interpreter

## Goals

Interpret state machines by using an interpreter. The machine should toggle between the `inactive` and `active` states:

- In the `inactive` state, when a `mousedown` event happens, go to `active`.
- In the `active` state, when a `mouseup` event happens, go to `inactive`.

## Tips

- Use the same machine as [Exercise 02](../02/README.md).
- Use `interpret(...)` to create a `service` that interprets the machine.
- Start the service with `service.start()`.
- Use `service.send(...)` to send events to the running service.

## Extra Credit

- Send the raw event from the event handler to the service instead. Notice how it fits the event object shape!
- Practice stopping the service when you no longer need it with `service.stop()` (e.g., after 10 seconds or so).


# Exercise 04 - Actions

## Goals

Execute an action with XState that set's the `data-point` attribute of `#box` to wherever it was clicked on the `mousedown` event.

## Tips

- Start with the previous state machine in Exercise 03.
- Use an inline function first for the transition action. Remember that action functions take two arguments - `context` and `event`.

## Extra Credit

- Separate the action into its own named function.
- Configure the action in the machine in the `options.actions` property in the second argument to `createMachine(def, options)`:

```js
createMachine(
  {
    // ...
  },
  {
    actions: {
      // ...
    },
  }
);
```