import { useEffect } from 'react'
// import { transition, send } from '../machine/machine'
import {
  feedbackMachine,
  transition,
  feedbackService
} from '../machine/feedbackMachine'
import '../styles/style00.scss'

export default function Exercise00() {
  // console.log('feedbackMachine:', feedbackMachine.initialState)
  // const clickGoodEvent = {
  //   type: 'CLICK_GOOD',
  //   time: Date().toString()
  // }
  // const submitEvent = {
  //   type: 'SUBMIT',
  //   feedback: 'Very clickGoodEvent, thank you!'
  // }
  // const nextState = feedbackMachine.transition(
  //   feedbackMachine.initialStat,
  //   clickGoodEvent
  // )
  // console.log('nextState:', nextState)

  // const output = (object, element) => {
  //   element.innerHTML = JSON.stringify(object, null, 2)
  // }

  useEffect(() => {
    // const user = {
    //   name: 'Oleksandra Holovko',
    //   company: 'freelancer',
    //   interests: ['frontend web development', 'diving', 'paddle boarding']
    // }
    // const elOutput = document.querySelector('#output')
    // const elButton = document.querySelector('#button')
    // elButton.addEventListener('click', () => {
    //   elButton.setAttribute('disabled', true)
    //   elButton.innerHTML = 'Loading data...'
    //   console.log('Loading data...', Date().toString())
    // })
    // output(user, elOutput)

    // testing  switch and object machine
    // console.log(transition('idle', 'FETCH'))
    // console.log(transition('pending', 'FETCH'))
    // console.log(transition('pending', 'RESOLVE'))
    // send('FETCH')
    // send('RESOLVE')

    // feedbackService
    //   .onTransition((state) => console.log('STATE:', state.value))
    //   .start()
    //   .send({ type: 'CLICK_GOOD' })

    // feedbackService.send('CLOSE')
    // feedbackService.stop()

    return () => {
      // feedbackService.stop()
    }
  }, [])

  return (
    <>
      <header>
        <h5>Goals</h5>
        <p>
          Use this exercise as a scratchpad{' '}
          <span aria-label="scratchpad" role="img">
            📝
          </span>
        </p>
      </header>
      <main>
        <button style={{ width: '11rem' }} id="button">
          click me
        </button>
        <pre id="output"></pre>
      </main>
    </>
  )
}
