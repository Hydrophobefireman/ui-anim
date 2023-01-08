import {CSSTransform} from "../types.js";

export function applyTransform(el: HTMLElement, transform: CSSTransform) {
  el.style.transform = `
  translateX(${transform.translateX}px) 
  translateY(${transform.translateY}px) 
  scaleX(${transform.scaleX}) 
  scaleY(${transform.scaleY})`;
}

// export function applyBorderRadius(el: HTMLElement, t: Transform) {
//   const { currHeight, currWidth } = t;
//   const currRadius
// }
