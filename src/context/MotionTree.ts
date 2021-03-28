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
  protected children = new Set<MotionTreeNode>();
  private _resizeListener?: ResizeCallback;
  private _motionManager: MotionManager;
  private _isAnimating = false;
  private _cancelled = false;
  isReady() {
    return !!this._motionManager;
  }
  isAnimating() {
    return this._isAnimating;
  }
  isCancelled() {
    return this._cancelled;
  }
  cancel() {
    this._cancelled = true;
    return this;
  }
  private _config: MotionTreeConfig = {
    id: null,
    isRoot: null,
    time: null,
    wrappedDomNode: null,
    parent: null,
  };
  setManager(m: MotionManager) {
    this._motionManager = m;
    return this;
  }
  unmount() {
    window.removeEventListener("resize", this._resizeListener);
    this._motionManager = this._config = this._resizeListener = null;
    return this;
  }
  getSnapshot() {
    return this._motionManager.getSnapshot(this._config.id);
  }
  attach(child: MotionTreeNode) {
    this.children.add(child);
    return this;
  }
  detach(child: MotionTreeNode) {
    this.children.delete(child);
    return this;
  }
  measure() {
    return this._motionManager.measure(
      this._config.id,
      this._config.wrappedDomNode,
      this._config.time || DEFAULT_ANIM_TIME
    );
  }
  safeRequestLayout({ nextFrame }: { nextFrame?: boolean }) {
    const fn = () =>
      this.isReady() && !this.isAnimating() && this.requestLayout();
    nextFrame ? requestAnimationFrame(fn) : fn();
    return this;
  }
  requestLayout($scale = { x: 1, y: 1 }, parentDelta?: Transform) {
    const existingSnapshot = this.getSnapshot();
    const currentSnapshot = this.measure();
    if (!existingSnapshot) return; // don't animate if we don't know where it started from

    const delta = calcDelta(currentSnapshot, existingSnapshot);
    const mapped = this.children;
    const nextScale = {
      x: delta.x.scale,
      y: delta.y.scale,
    };

    mapped.forEach((tree) => tree.requestLayout(nextScale, delta));
    this.animateTreeDelta(delta, $scale, parentDelta);
    return this;
  }
  protected animateTreeDelta(
    delta: Transform,
    scale = { x: 1, y: 1 },
    parentDelta?: Transform
  ) {
    this._isAnimating = true;
    animateDelta({
      el: this._config.wrappedDomNode,
      translateDelta: delta,
      time: this._config.time,
      nodeInstance: this,
      treeScale: scale,
      parentDelta,
    }).then((x) => {
      this._isAnimating = false;
    });
    return this;
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
    return this;
  }
}
