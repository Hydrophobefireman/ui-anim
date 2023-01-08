import {CSSTransform} from "../types.js";

export class DeclarativeTransform {
  constructor(public snap: Partial<CSSTransform>) {}
}
