import { render, useState, h } from "./@hydrophobefireman/ui-lib.js";
import { AnimateLayout, Motion } from "./anim.js";

function App() {
  const [i, setI] = useState(null);
  const redActive = i === 1;
  const blueActive = i === 2;
  return h(
    "div",
    { class: "mob" },
    h(
      AnimateLayout,
      {
        element: "div",
        animId: "red",
        // time: 200,
        onClick: () => setI(redActive ? null : 1),
        style: {
          zIndex: blueActive ? 0 : 1,
          backgroundColor: "red",
          margin: i == null ? "1rem" : 0,
          flex: blueActive ? 0 : 1,
        },
        class: "component",
      },
      h(
        AnimateLayout,
        {
          element: "div",
          animId: "red-child",
          class: "bottom-bar",
          style: { opacity: blueActive ? "0" : "1" },
        },
        h(AnimateLayout, {
          class: `prof ${redActive ? "active" : ""}`,
          animId: "red-prof",
          element: "div",
          style: {
            background: "blue",
            marginLeft: redActive ? "8rem" : "1rem",
            marginTop: redActive ? "2rem" : "5px",
          },
        })
      )
    ),
    h(AnimateLayout, {
      element: "div",
      animId: "blue",

      onClick: () => setI(blueActive ? null : 2),
      style: {
        opacity: 0,
        zIndex: redActive ? 0 : 1,
        backgroundColor: "blue",
        margin: i == null ? "1rem" : 0,
        flex: redActive ? 0 : 1,
      },
      class: "component",
    })
  );
}

render(h(Motion, null, h(App)), document.getElementById("app"));
