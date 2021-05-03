import { AnimateDeltaProps, OnlyAnimate, Snapshot, Transform } from "../types";
import { CANCELLED, animate, interpolate } from "./animate";
import { convertCoord, convertDimension } from "./converters";

import { DeclarativeTransform } from "./declarative-transform";
import { applyTransform } from "./transform";
import { freeze } from "./freeze";

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
  previousSnapshot: Snapshot | DeclarativeTransform
): Transform {
  const {
    originPoints: currOriginPoints,
    width: currWidth,
    height: currHeight,
  } = currentSnapshot;
  if (previousSnapshot instanceof DeclarativeTransform) {
    const { snap } = previousSnapshot;
    const { scaleX, scaleY, translateX, translateY } = snap;
    return {
      x: {
        translate: translateX == null ? 0 : translateX,
        scale: scaleX == null ? 1 : scaleX,
      },
      y: {
        translate: translateY == null ? 0 : translateY,
        scale: scaleY == null ? 1 : scaleY,
      },
    };
  }
  const {
    originPoints: prevOriginPoints,
    width: prevWidth,
    height: prevHeight,
  } = previousSnapshot;
  return {
    x: {
      translate:
        prevOriginPoints.x == null
          ? 0
          : prevOriginPoints.x - currOriginPoints.x,
      scale: prevWidth == null ? 1 : prevWidth / currWidth,
    },
    y: {
      translate:
        prevOriginPoints.y == null
          ? 0
          : prevOriginPoints.y - currOriginPoints.y,
      scale: prevHeight == null ? 1 : prevHeight / currHeight,
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
  onlyAnimate,
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
    const getAnim = shouldAnimate(onlyAnimate);
    const scaleX = getAnim("scaleX", x.scale / treeScale.x, 1);
    const scaleY = getAnim("scaleY", y.scale / treeScale.y, 1);
    const relativeXTranslate = getAnim(
      "translateX",
      relativeTranslate(
        x.translate,
        parentDelta && parentDelta.x.translate,
        scaleX
      ),
      0
    );
    const relativeYTranslate = getAnim(
      "translateY",
      relativeTranslate(
        y.translate,
        parentDelta && parentDelta.y.translate,
        scaleY
      ),
      0
    );
    animate({
      from: 0,
      to: 1,
      callback(progress: number, cancel) {
        if (progress === CANCELLED) return resolve(null);
        if (progress === 1) {
          el.style.transform = "";
          return resolve(null);
        }
        const transform = {
          scaleX: interpolate(scaleX, 1, progress),
          scaleY: interpolate(scaleY, 1, progress),
          translateX: interpolate(relativeXTranslate, 0, progress),
          translateY: interpolate(relativeYTranslate, 0, progress),
        };
        applyTransform(el, transform);
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
  height?: number | string;
  width?: number | string;
  originX?: number | string;
  originY?: number | string;
}): Snapshot {
  const { innerWidth, innerHeight } = window;
  const numHeight = convertDimension(height, innerHeight);
  const numWidth = convertDimension(width, innerWidth);
  const numOriginX = convertCoord(originX, innerWidth / 2);
  const numOriginY = convertCoord(originY, innerHeight / 2);
  return freeze({
    height: numHeight,
    width: numWidth,
    originPoints: { x: numOriginX, y: numOriginY },
  });
}

function shouldAnimate(onlyAnimate: OnlyAnimate) {
  return function (
    prop: keyof OnlyAnimate,
    value: number,
    defaultValue: number
  ) {
    if (onlyAnimate == null) return value;
    return onlyAnimate[prop] ? value : defaultValue;
  };
}
