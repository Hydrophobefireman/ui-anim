import {createContext} from "@hydrophobefireman/ui-lib";

import type {MotionManager} from "../Motion.js";
import {OnlyAnimate, Snapshot, Transform} from "../types.js";
import {DEFAULT_ANIM_TIME} from "../util/constants.js";
import {animateDelta, calcDelta} from "../util/snapshot.js";

export const TreeContext = createContext<MotionTreeNode>(null);

interface MotionTreeConfig {
  wrappedDomNode: HTMLElement;
  id: string;
  time: number;
  isRoot: boolean;
  parent: MotionTreeNode | null;
  onlyAnimate?: OnlyAnimate;
}
export class MotionTreeNode {
  protected children = new Set<MotionTreeNode>();

  private _motionManager: MotionManager;
  private _isAnimating = false;
  private _cancelled = false;
  private _reset() {
    this.cancel();
    this._isAnimating = false;
  }
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
    this._isAnimating = false;
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
    this._motionManager = this._config = null;
    return this;
  }
  overrideSnapshot(snap: Snapshot) {
    this._motionManager.overrideSnapshot(
      this._config.id,
      this._config.wrappedDomNode,
      snap
    );
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
      this._config.wrappedDomNode
    );
  }
  safeRequestLayout({nextFrame}: {nextFrame?: boolean}) {
    return new Promise((resolve) => {
      const fn = () => {
        if (this.isReady())
          return this.requestLayout().then(() => resolve(null));
        resolve(null);
      };
      nextFrame ? requestAnimationFrame(fn) : fn();
      return this;
    });
  }
  requestLayout($scale = {x: 1, y: 1}, parentDelta?: Transform) {
    this._reset();
    const existingSnapshot = this.getSnapshot();
    const currentSnapshot = this.measure();
    // don't animate if we don't know where it started from
    if (!existingSnapshot) return Promise.resolve(null);

    const delta = calcDelta(currentSnapshot, existingSnapshot);
    const mapped = this.children;
    const nextScale = {
      x: delta.x.scale,
      y: delta.y.scale,
    };

    mapped.forEach((tree) => tree.requestLayout(nextScale, delta));
    return this.animateTreeDelta(delta, $scale, parentDelta);
  }
  protected animateTreeDelta(
    delta: Transform,
    scale = {x: 1, y: 1},
    parentDelta?: Transform
  ) {
    this._isAnimating = true;
    this._cancelled = false;
    return animateDelta({
      el: this._config.wrappedDomNode,
      translateDelta: delta,
      time: this._config.time || DEFAULT_ANIM_TIME,
      nodeInstance: this,
      treeScale: scale,
      parentDelta,
      fps: this._motionManager.fps,
      onlyAnimate: this._config.onlyAnimate,
    }).then((x) => {
      this._isAnimating = false;
    });
  }
  setTreeState({
    wrappedDomNode,
    time,
    onlyAnimate,
    id,
    parent,
  }: Omit<MotionTreeConfig, "isRoot">) {
    const isRoot = parent == null;
    this._config = {wrappedDomNode, time, id, isRoot, parent, onlyAnimate};
    return this;
  }
}
