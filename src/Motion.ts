import {
  createContext,
  createElement,
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

  public measure(id: string, e: HTMLElement, t: number) {
    const newSnapshot = snapshot(e);
    this._snapshots.set(id, newSnapshot);
    this._snapshotToDomMap.set(newSnapshot, e);
    return newSnapshot;
  }
}
export function Motion({ children }: any) {
  const manager = useMemo(() => new MotionManager(), []);

  return createElement(
    MotionContext.Provider as any,
    {
      value: manager,
      children,
    } as any
  );
}
