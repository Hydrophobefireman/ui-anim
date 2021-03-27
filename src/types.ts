import { ComponentType } from "@hydrophobefireman/ui-lib";

export interface Snapshot {
  height: number;
  width: number;
  x: number;
  y: number;
  originPoints: { x: number; y: number };
}

export interface Transform {
  x: AxisTransform;
  y: AxisTransform;
  currWidth: number;
  currHeight: number;
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
  (progress: number): void;
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
  children?: any;
}
export type DomElements = keyof JSX.IntrinsicElements;

export type AnimateLayoutProps<T extends DomElements> = Omit<
  JSX.IntrinsicElements[T],
  "children"
> &
  AnimationProps<string>;
export {};
