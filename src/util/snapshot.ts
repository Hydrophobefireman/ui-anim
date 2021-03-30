import { AnimateDeltaProps, Snapshot, Transform } from "../types";
import { animate, CANCELLED, interpolate } from "./animate";
import { freeze } from "./freeze";
import { applyTransform } from "./transform";

const doc = document.documentElement;

export function snapshot(el: HTMLElement): Snapshot {
  el.style.transform = "";
  const snap = el.getBoundingClientRect();
  const docSnap = doc.getBoundingClientRect();
  const { height, width, left, right, top, bottom } = snap;
  const { offsetHeight, offsetWidth } = doc;

  return freeze({
    height,
    width,
    originPoints: {
      x: interpolate(
        left - docSnap.left,
        right - (docSnap.right - offsetWidth),
        0.5
      ),
      y: interpolate(
        top - docSnap.top,
        bottom - (docSnap.bottom - offsetHeight),
        0.5
      ),
    },
  });
}

export function calcDelta(
  currentSnapshot: Snapshot,
  previousSnapshot: Snapshot
): Transform {
  const {
    originPoints: prevOriginPoints,
    width: prevWidth,
    height: prevHeight,
  } = previousSnapshot;
  const {
    originPoints: currOriginPoints,
    width: currWidth,
    height: currHeight,
  } = currentSnapshot;

  return {
    currWidth,
    currHeight,
    x: {
      translate: prevOriginPoints.x - currOriginPoints.x,
      scale: prevWidth / currWidth,
    },
    y: {
      translate: prevOriginPoints.y - currOriginPoints.y,
      scale: prevHeight / currHeight,
    },
  };
}

export function animateDelta({
  el,
  nodeInstance,
  time = 300,
  translateDelta,
  treeScale,
  parentDelta,
  fps = 60,
}: AnimateDeltaProps) {
  const prev = el.style.transition;
  el.style.transition = "0s";
  return new Promise((resolve) => {
    const { x, y } = translateDelta;
    if (
      x.scale === 1 &&
      x.translate === 0 &&
      y.scale === 1 &&
      y.translate === 0 &&
      treeScale.x === 1 &&
      treeScale.y === 1
    ) {
      return resolve(null); //don't waste animation frames for nothing
    }
    animate({
      from: 0,
      to: 1,
      callback(progress: number, cancel) {
        if (progress === CANCELLED) return resolve(null);
        const scaleX = x.scale / treeScale.x;
        const scaleY = y.scale / treeScale.y;
        const transform = {
          scaleX: interpolate(scaleX, 1, progress),
          scaleY: interpolate(scaleY, 1, progress),
          translateX: interpolate(
            relativeTranslate(
              x.translate,
              parentDelta && parentDelta.x.translate,
              scaleX
            ),
            0,
            progress
          ),
          translateY: interpolate(
            relativeTranslate(
              y.translate,
              parentDelta && parentDelta.y.translate,
              scaleY
            ),
            0,
            progress
          ),
        };
        applyTransform(el, transform);
        if (progress === 1) resolve(null);
        if (nodeInstance.isCancelled()) {
          cancel();
        }
      },
      steps: time / ((1 / fps) * 1000),
    });
  }).then(() => {
    requestAnimationFrame(() => (el.style.transition = prev));
    return null;
  });
}

function relativeTranslate(
  curr: number,
  parent: number | undefined,
  scale: number
) {
  return parent
    ? 0
    : // ? (scale < 1 ? curr * (1 - scale) : curr - curr / scale) - parent
      curr;
}

export function createSnapshot({
  height,
  width,
  originX,
  originY,
}: {
  height: number | string;
  width: number | string;
  originX: number | string;
  originY: number | string;
}): Snapshot {
  const { innerWidth, innerHeight } = window;
  const numHeight = _convertDimension(height, innerHeight);
  const numWidth = _convertDimension(width, innerWidth);
  const numOriginX = _convertCoord(originX, innerWidth / 2);
  const numOriginY = _convertCoord(originY, innerHeight / 2);
  return freeze({
    height: numHeight,
    width: numWidth,
    originPoints: { x: numOriginX, y: numOriginY },
  });
}

function _convertDimension(x: string | number, absoluteVal: number) {
  return _convert(x, (val) => absoluteVal * (val / 100));
}

function _convertCoord(x: string | number, absoluteVal: number) {
  return _convert(x, (val) => absoluteVal + absoluteVal * (val / 100));
}

function _convert(x: string | number, onPercent: (val: number) => number) {
  if (typeof x == "number") return x;
  const lastI = x.length - 1;
  x = x.trim();
  const isPercent = x[lastI] === "%";
  if (isPercent) {
    const rest = x.substr(0, lastI);
    return onPercent(parseFloat(rest));
  }
  return +x;
}
