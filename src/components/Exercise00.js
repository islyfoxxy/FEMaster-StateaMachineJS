import { useEffect } from "react";
import { transition, send } from "../machine/machine";

import "../styles/style00.scss";

export default function Exercise00() {
  const output = (object, element) => {
    element.innerHTML = JSON.stringify(object, null, 2);
  };

  useEffect(() => {
    const user = {
      name: "Oleksandra Holovko",
      company: "freelancer",
      interests: ["frontend web development", "diving", "paddle boarding"]
    };
    const elOutput = document.querySelector("#output");
    const elButton = document.querySelector("#button");

    elButton.addEventListener("click", () => {
      elButton.setAttribute("disabled", true);
      elButton.innerHTML = "Loading data...";
      console.log("Loading data...", Date().toString());
    });

    output(user, elOutput);

    console.log(transition("idle", "FETCH"));
    console.log(transition("pending", "FETCH"));
    console.log(transition("pending", "RESOLVE"));

    send("FETCH");
    send("RESOLVE");
  }, []);

  return (
    <>
      <header>
        <h4>Exercise 00 - Welcome</h4>
      </header>
      <main>
        <button style={{ width: "11rem" }} id="button">
          click me
        </button>
        <pre id="output"></pre>
      </main>
    </>
  );
}
