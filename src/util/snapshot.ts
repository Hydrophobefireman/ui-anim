import { Snapshot, Transform } from "../types";
import { animate, interpolate } from "./animate";
import { freeze } from "./freeze";
import { applyTransform } from "./transform";

export function snapshot(el: HTMLElement): Snapshot {
  el.style.transform = "";
  const snap = el.getBoundingClientRect();
  const { height, width, x, y, left, right, top, bottom } = snap;

  return freeze({
    height,
    width,
    x,
    y,
    originPoints: {
      x: interpolate(left, right, 0.5),
      y: interpolate(top, bottom, 0.5),
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

export function animateDelta(
  el: HTMLElement,
  translateDelta: Transform,
  time: number = 300,
  treeScale: { x: number; y: number },
  parentDelta?: Transform
) {
  const { x, y } = translateDelta;

  animate({
    from: 0,
    to: 1,
    callback(progress) {
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
    },
    steps: time / 16,
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
