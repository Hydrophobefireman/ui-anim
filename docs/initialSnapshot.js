import { render, useState, h } from "./@hydrophobefireman/ui-lib.js";
import { AnimateLayout, Motion, createSnapshot } from "./anim.js";

function shuffleArray(a) {
  const array = a.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
function App() {
  const [arr, setArr] = useState(() =>
    Array.from({ length: 5 }).map((x, i) =>
      h(AnimateLayout, {
        element: "div",
        animId: i + "",
        class: "line",
        style: { height: `${0.9 + Math.random() * 2.5}rem` },
      })
    )
  );
  return h(
    AnimateLayout,
    {
      class: "card",
      element: "div",
      animId: "card",
      initialSnapshot: createSnapshot({
        height: "2%",
        width: "2%",
        originX: "0%",
        originY: "0%",
      }),
    },
    arr,
    h(
      "div",
      { style: "margin:auto;text-align:center" },
      h(
        "button",
        {
          onClick: () => setArr(shuffleArray(arr)),
          style: { color: "var(--c)", "--c": "blue" },
        },
        "Shuffle"
      )
    )
  );
}

render(h(Motion, null, h(App)), document.getElementById("app"));
