import AccordionItem from "./components/AccordionItem";
import Exercise00 from "./components/Exercise00";
import Exercise01 from "./components/Exercise01";

export default function App() {
  const exercises = [
    { title: "Exercise 00 - Welcome", component: <Exercise00 /> },
    {
      title: "Exercise 01 - Creating a state machine",
      component: <Exercise01 />
    }
    // { title: "Exercise 02 - Welcome", component: <Exercise02 /> }
  ];

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
  );
}
