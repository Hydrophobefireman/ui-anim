import { render, useState, h } from "./@hydrophobefireman/ui-lib.js";
import { AnimateLayout, Motion } from "./anim.js";

function App() {
  const [width, setWidth] = useState(`${100}px`);
  const [v, setV] = useState("");
  const [m, setM] = useState("");
  const [marginTop, setMarginTop] = useState(m);
  return h(
    Motion,
    null,
    h(
      "div",
      null,
      h(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            setWidth(`${v}px`);
            setMarginTop(m + "px");
          },
        },
        h("input", {
          value: v,
          onInput: (e) => setV(e.target.value),
          placeholder: "set width",
        }),
        h("input", {
          value: m,
          onInput: (e) => setM(e.target.value),
          placeholder: "set marginTop",
        }),
        h("div", null, h("button", null, "Submit"))
      ),
      h(AnimateLayout, {
        element: "div",
        animId: "div",
        time: 100,
        style: {
          marginLeft: "30px",
          marginTop,
          background: "#e3e3e3",
          borderRadius: "5px",
          padding: "1rem",
          textAlign: "center",
          width,
          display: "inline-block",
        },
      })
    )
  );
}

render(h(App), document.getElementById("app"));
