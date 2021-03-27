import { render, useState, h } from "./@hydrophobefireman/ui-lib.js";
import { AnimateLayout, Motion } from "./anim.js";

const getList = (x) => Array.from({ length: x }).map((_, i) => i);
function App() {
  const [count, setCount] = useState(20);
  const [time, setTime] = useState(300);
  const [arr, setArr] = useState(() => getList(count));
  function $setCount(x) {
    setCount(x);
    setArr(getList(x));
  }
  return h(
    Motion,
    null,
    h("input", {
      placeholder: "time in ms",
      value: time,
      onInput: ({ target }) => setTime(+target.value),
    }),
    h("button", { onClick: () => $setCount(count + 1) }, "add box"),
    h("button", { onClick: () => $setCount(count - 1) }, "remove box"),
    h("button", { onClick: () => setArr(shuffleArray(arr)) }, "Shuffle"),

    h("div", { style: { marginTop: "30px" } }),
    h(
      "div",
      null,
      arr.map((i) =>
        h(
          AnimateLayout,
          {
            time,
            element: "div",
            animId: `${count - i}`,
            "data-anim": `${count - i}`,
            style: {
              width: "100px",
              height: "100px",
              border: "2px solid red",
              margin: "5px",
              display: "inline-block",
            },
          },
          count - i
        )
      )
    )
  );
}
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
render(h(App), document.getElementById("app"));
