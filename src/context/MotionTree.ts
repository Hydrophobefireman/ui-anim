import { FakeSet } from "@hydrophobefireman/j-utils";
import { createContext } from "@hydrophobefireman/ui-lib";
import { DEFAULT_ANIM_TIME } from "../util/constants";
import type { MotionManager } from "../Motion";
import { animateDelta, calcDelta } from "../util/snapshot";
import { Transform } from "../types";
export const TreeContext = createContext<MotionTreeNode>(null);
interface ResizeCallback {
  (): void;
}
interface MotionTreeConfig {
  wrappedDomNode: HTMLElement;
  id: string;
  time: number;
  isRoot: boolean;
  parent: MotionTreeNode | null;
}
export class MotionTreeNode {
  children = new FakeSet<MotionTreeNode>();
  private _resizeListener?: ResizeCallback;
  private _motionManager: MotionManager;
  private _config: MotionTreeConfig = {
    id: null,
    isRoot: null,
    time: null,
    wrappedDomNode: null,
    parent: null,
  };
  setManager(m: MotionManager) {
    this._motionManager = m;
  }
  getSnapshot() {
    return this._motionManager.getSnapshot(this._config.id);
  }
  attach(child: MotionTreeNode) {
    this.children.add(child);
  }
  detach(child: MotionTreeNode) {
    this.children.delete(child);
  }
  measure() {
    return this._motionManager.measure(
      this._config.id,
      this._config.wrappedDomNode,
      this._config.time || DEFAULT_ANIM_TIME
    );
  }
  requestLayout($scale = { x: 1, y: 1 }, parentDelta?: Transform) {
    const existingSnapshot = this.getSnapshot();
    if (!existingSnapshot) return; // don't animate if we don't know where it started from
    const currentSnapshot = this.measure();

    const delta = calcDelta(currentSnapshot, existingSnapshot);
    const mapped = this.children;
    const nextScale = {
      x: delta.x.scale,
      y: delta.y.scale,
    };

    mapped.forEach((tree) => tree.requestLayout(nextScale, delta));
    this.animateTreeDelta(delta, $scale, parentDelta);
  }
  animateTreeDelta(
    delta: Transform,
    scale = { x: 1, y: 1 },
    parentDelta?: Transform
  ) {
    animateDelta(
      this._config.wrappedDomNode,
      delta,
      this._config.time,
      scale,
      parentDelta
    );
  }
  setTreeState({
    wrappedDomNode,
    time,
    id,
    parent,
  }: Omit<MotionTreeConfig, "isRoot">) {
    const isRoot = parent == null;
    this._config = { wrappedDomNode, time, id, isRoot, parent };
    if (!isRoot) {
      if (this._resizeListener) {
        window.removeEventListener("resize", this._resizeListener);
        this._resizeListener = null;
      }
    } else {
      if (!this._resizeListener) {
        const listener = () => {
          this.measure();
          this.children.forEach((x) => x.measure());
        };
        this._resizeListener = listener;
        window.addEventListener("resize", this._resizeListener);
      }
    }
  }
}
