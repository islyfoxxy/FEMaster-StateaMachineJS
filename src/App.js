import AccordionItem from './components/AccordionItem'
import Exercise00 from './components/Exercise00'
import Exercise01 from './components/Exercise01'
import Exercise02 from './components/Exercise02'
import Exercise03 from './components/Exercise03'
import Exercise04 from './components/Exercise04'
import Exercise05 from './components/Exercise05'
import Exercise06 from './components/Exercise06'
import Exercise07 from './components/Exercise07'
import Exercise08 from './components/Exercise08'
import Exercise09 from './components/Exercise09'
import Exercise10 from './components/Exercise10'
import Exercise11 from './components/Exercise11'
import Exercise12 from './components/Exercise12'

export default function App() {
  const exercises = [
    { title: 'Exercise 00 - Welcome', component: <Exercise00 /> },
    {
      title: 'Exercise 01 - Creating a state machine',
      component: <Exercise01 />
    },
    { title: 'Exercise 02 - XState', component: <Exercise02 /> },
    {
      title: 'Exercise 03 - Interpreter',
      component: <Exercise03 />
    },
    { title: 'Exercise 04 - Actions', component: <Exercise04 /> },
    { title: 'Exercise 05 - Context', component: <Exercise05 /> },
    { title: 'Exercise 06 - Guarded Transitions', component: <Exercise06 /> },
    { title: 'Exercise 07 - Transient Transitions', component: <Exercise07 /> },
    { title: 'Exercise 08 - Delayed Transitions', component: <Exercise08 /> },
    { title: 'Exercise 09 - Hierarchical States', component: <Exercise09 /> },
    { title: 'Exercise 10 - History States', component: <Exercise10 /> },
    { title: 'Exercise 11 - Parallel States', component: <Exercise11 /> },
    { title: 'Exercise 12 - Invoking Actors', component: <Exercise12 /> }
  ]

  return (
    <div className="App container pb-5">
      <div className="row m-2">
        <div className="col-auto mx-auto">
          <h3>State Machine in Javascript</h3>
        </div>
      </div>
      <div className="accordion" id="exercises">
        {exercises.map(({ title, component }, index) => (
          <AccordionItem key={index} {...{ title, component, index }} />
        ))}
      </div>
    </div>
  )
}
