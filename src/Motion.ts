import {
  createContext,
  createElement,
  useEffect,
  useMemo,
} from "@hydrophobefireman/ui-lib";

import { Snapshot } from "./types";
import { snapshot } from "./util/snapshot";

export const MotionContext = createContext<MotionManager>(null);

export class MotionManager {
  private _snapshots: Map<string, Snapshot> = new Map();
  private _snapshotToDomMap = new WeakMap<Snapshot, HTMLElement>();

  getSnapshot(id: string): Snapshot {
    return this._snapshots.get(id);
  }
  unmount() {
    this._snapshots.clear();
  }

  public measure(id: string, e: HTMLElement) {
    const newSnapshot = snapshot(e);
    this._snapshots.set(id, newSnapshot);
    this._snapshotToDomMap.set(newSnapshot, e);
    return newSnapshot;
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
  useEffect(() => {
    const l = () => manager.measureAll();
    window.addEventListener("resize", l);
    return () => {
      window.removeEventListener("resize", l);
      manager.unmount();
    };
  }, []);
  return createElement(
    MotionContext.Provider as any,
    {
      value: manager,
      children,
    } as any
  );
}
