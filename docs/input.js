import {
  render,
  useState,
  h,
} from "https://cdn.skypack.dev/@hydrophobefireman/ui-lib";
import { AnimateLayout, Motion } from "./anim.js";

function App() {
  const [_o, setO] = useState(false);
  const [v, setV] = useState("");
  const o = _o || v;

  return h(
    "div",
    { style: { margin: "3rem", position: "relative" } },
    o &&
      h(
        AnimateLayout,
        {
          time: "150",
          element: "label",
          animId: "placeholder",
          style: {
            marginTop: "-20px",
            display: "block",
            position: "absolute",
            pointerEvents: "none",
          },
        },
        "Placeholder"
      ),
    !o &&
      h(
        AnimateLayout,
        {
          time: "150",
          element: "label",
          animId: "placeholder",
          style: {
            marginTop: "5px",
            display: "block",
            position: "absolute",
            pointerEvents: "none",
          },
        },
        "Placeholder"
      ),
    h("input", {
      value: v,
      onInput: (e) => setV(e.currentTarget.value),
      style: { padding: ".5rem" },
      onFocus: function onFocus() {
        return setO(true);
      },
      onBlur: function onBlur() {
        return setO(false);
      },
    })
  );
}

render(h(Motion, null, h(App)), document.getElementById("app"));
