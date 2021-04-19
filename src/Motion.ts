import {
  createContext,
  createElement,
  useEffect,
  useMemo,
  useState,
} from "@hydrophobefireman/ui-lib";

import { Snapshot } from "./types";
import { getFps } from "./util/animate";
import { DeclarativeTransform } from "./util/declarative-transform";
import { snapshot } from "./util/snapshot";

export const MotionContext = createContext<MotionManager>(null);

export class MotionManager {
  private _snapshots: Map<string, Snapshot> = new Map();
  private _snapshotToDomMap = new WeakMap<Snapshot, HTMLElement>();
  public fps: number;
  getSnapshot(id: string): Snapshot {
    return this._snapshots.get(id) as Snapshot;
  }
  setFps(x: number) {
    this.fps = x;
  }
  unmount() {
    this._snapshots.clear();
  }
  overrideSnapshot(id: string, e: HTMLElement, snapshot: Snapshot) {
    return this._setSnapshot(id, e, snapshot);
  }
  _setSnapshot(id: string, e: HTMLElement, snapshot: Snapshot) {
    this._snapshots.set(id, snapshot);
    this._snapshotToDomMap.set(snapshot, e);
    return snapshot;
  }
  public measure(id: string, e: HTMLElement) {
    const newSnapshot = snapshot(e);
    return this._setSnapshot(id, e, newSnapshot);
  }
  public measureAll() {
    this._snapshots.forEach((snapshot, id) => {
      const dom = this._snapshotToDomMap.get(snapshot);
      if (!dom) return;
      if (dom && !dom.isConnected) {
        // we don't want to keep the snapshot of a deleted element as more often than not they're
        // going to end up animating from the top left of the screen which is absolutely not what we want
        this._snapshots.delete(id);
        this._snapshotToDomMap.delete(snapshot);
        return;
      }
      this.measure(id, dom);
    });
  }
}
export function Motion({ children }: any) {
  const manager = useMemo(() => new MotionManager(), []);
  const [fps, setFps] = useState(null);
  useEffect(() => {
    // in case our requestAnimationFrame code does not work
    // we do not want to end up with nothing on the screen
    // this will probably never happen
    // but just in case, we'd rather assume 60fps
    // than show nothin
    Promise.race([
      getFps(),
      new Promise((r) => setTimeout(() => r(60), 1000)),
    ]).then((x) => setFps(x));
  }, []);
  manager.setFps(fps);

  useEffect(() => {
    const l = () => manager.measureAll();
    window.addEventListener("resize", l);
    return () => {
      window.removeEventListener("resize", l);
      manager.unmount();
    };
  }, []);
  if (fps == null) return null;
  return createElement(
    MotionContext.Provider as any,
    {
      value: manager,
      children,
    } as any
  );
}
