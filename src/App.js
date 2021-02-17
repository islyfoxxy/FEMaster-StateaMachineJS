import AccordionItem from './components/AccordionItem'
import Exercise00 from './components/Exercise00'
import Exercise01 from './components/Exercise01'
import Exercise02 from './components/Exercise02'
import Exercise03 from './components/Exercise03'
import Exercise04 from './components/Exercise04'
import Exercise05 from './components/Exercise05'

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
    { title: 'Exercise 05 - Context', component: <Exercise05 /> }
  ]

  return (
    <div className="App container">
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
