import { render, useState, h } from "./@hydrophobefireman/ui-lib.js";
import {
  AnimateLayout,
  Motion,
  DeclarativeTransform,
  createSnapshot,
} from "./anim.js";

function App() {
  const [k, setK] = useState(false);
  return h(
    Motion,
    null,
    h(
      "div",
      null,
      h("button", { onClick: () => setK(!k) }, !k ? "Enable" : "Disable"),
      k &&
        h(AnimateLayout, {
          initialSnapshot: new DeclarativeTransform({ translateX: 200 }),
          element: "div",
          animId: "div",
          time: 100,
          style: {
            width: "20px",
            height: "20px",

            border: "2px solid red",
            margin: "auto",
            marginTop: "30vh",
          },
        })
    )
  );
}

render(h(App), document.getElementById("app"));
