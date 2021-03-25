import {
  render,
  useState,
  h,
} from "https://cdn.skypack.dev/@hydrophobefireman/ui-lib";
import { AnimateLayout, Motion } from "./anim.js";

function App() {
  const [count, setCount] = useState(1);
  const [time, setTime] = useState(300);
  return h(
    Motion,
    null,
    h("input", {
      placeholder: "time in ms",
      value: time,
      onInput: (e) => setTime(+e.target.value),
    }),
    h("button", { onClick: () => setCount(count + 1) }, "add box"),
    h("button", { onClick: () => setCount(count - 1) }, "remove box"),
    h("div", { style: { marginTop: "30px" } }),
    Array.from({ length: count }).map((x, i) =>
      h(AnimateLayout, {
        time,
        element: "div",
        animId: "" + (count - i),
        "data-anim": "" + (count - i),
        style: {
          width: "100px",
          height: "100px",
          border: "2px solid red",
          margin: "5px",
          display: "inline-block",
        },
      })
    )
  );
}

render(h(App), document.getElementById("app"));
