import { MotionTreeNode } from "./context/MotionTree";
import { DeclarativeTransform } from "./util/declarative-transform";

export interface Snapshot {
  height: number;
  width: number;

  originPoints: { x: number; y: number };
}

export interface Transform {
  x: AxisTransform;
  y: AxisTransform;
}

export interface CSSTransform {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}

interface AxisTransform {
  scale: number;
  translate: number;
}
export interface AnimationCallback {
  (
    progress: number | typeof import("./util/animate")["CANCELLED"],
    cancel?: () => void
  ): void;
}

export interface AnimateOptions {
  from: number;
  to: number;
  callback: AnimationCallback;
  steps: number;
}

interface AnimationProps<T = string> {
  element: T;
  animId: string;
  time?: number;
  initialSnapshot?: Snapshot | DeclarativeTransform;
  children?: any;
}
export type DomElements = keyof JSX.IntrinsicElements;

export type AnimateLayoutProps<T extends DomElements> = Omit<
  JSX.IntrinsicElements[T],
  "children"
> &
  AnimationProps<string>;
export interface AnimateDeltaProps {
  el: HTMLElement;
  translateDelta: Transform;
  time: number;
  nodeInstance: MotionTreeNode;
  treeScale: { x: number; y: number };
  parentDelta?: Transform;
  fps: number;
}
export {};
