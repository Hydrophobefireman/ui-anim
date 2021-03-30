import { createContext, useMemo, useState, useEffect, createElement, useRef, useContext, useLayoutEffect } from './@hydrophobefireman/ui-lib.js';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const CANCELLED = {};
function animate({
  from,
  to,
  callback,
  steps
}) {
  const incrementValue = (to - from) / steps;
  const cancelToken = {
    cancelled: false
  };

  function cancel() {
    cancelToken.cancelled = true;
  }

  return _createAnimation(from, to, incrementValue, callback, cancelToken, cancel);
}
function interpolate(from, to, progress) {
  return -progress * from + progress * to + from;
}

function _createAnimation(from, to, incrementValue, callback, cancelToken, cancel) {
  if (cancelToken.cancelled) return callback(CANCELLED, cancel);
  if (incrementValue > 0 ? from >= to : from <= to) return callback(to, cancel);
  requestAnimationFrame(() => _createAnimation(from + incrementValue, to, incrementValue, callback, cancelToken, cancel));
  callback(from, cancel);
}

function getFps() {
  return new Promise(resolve => requestAnimationFrame(t1 => requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))));
}

const freeze = "freeze" in Object ? Object.freeze : function freeze(obj) {
  return obj;
};

function applyTransform(el, transform) {
  el.style.transform = `
  translateX(${transform.translateX}px) 
  translateY(${transform.translateY}px) 
  scaleX(${transform.scaleX}) 
  scaleY(${transform.scaleY})`;
} // export function applyBorderRadius(el: HTMLElement, t: Transform) {
//   const { currHeight, currWidth } = t;
//   const currRadius 
// }

const doc = document.documentElement;
function snapshot(el) {
  el.style.transform = "";
  const snap = el.getBoundingClientRect();
  const docSnap = doc.getBoundingClientRect();
  const {
    height,
    width,
    left,
    right,
    top,
    bottom
  } = snap;
  const {
    offsetHeight,
    offsetWidth
  } = doc;
  return freeze({
    height,
    width,
    originPoints: {
      x: interpolate(left - docSnap.left, right - (docSnap.right - offsetWidth), 0.5),
      y: interpolate(top - docSnap.top, bottom - (docSnap.bottom - offsetHeight), 0.5)
    }
  });
}
function calcDelta(currentSnapshot, previousSnapshot) {
  const {
    originPoints: prevOriginPoints,
    width: prevWidth,
    height: prevHeight
  } = previousSnapshot;
  const {
    originPoints: currOriginPoints,
    width: currWidth,
    height: currHeight
  } = currentSnapshot;
  return {
    currWidth,
    currHeight,
    x: {
      translate: prevOriginPoints.x - currOriginPoints.x,
      scale: prevWidth / currWidth
    },
    y: {
      translate: prevOriginPoints.y - currOriginPoints.y,
      scale: prevHeight / currHeight
    }
  };
}
function animateDelta({
  el,
  nodeInstance,
  time = 300,
  translateDelta,
  treeScale,
  parentDelta,
  fps = 60
}) {
  const prev = el.style.transition;
  el.style.transition = "0s";
  return new Promise(resolve => {
    const {
      x,
      y
    } = translateDelta;

    if (x.scale === 1 && x.translate === 0 && y.scale === 1 && y.translate === 0 && treeScale.x === 1 && treeScale.y === 1) {
      return resolve(null); //don't waste animation frames for nothing
    }

    animate({
      from: 0,
      to: 1,

      callback(progress, cancel) {
        if (progress === CANCELLED) return resolve(null);
        const scaleX = x.scale / treeScale.x;
        const scaleY = y.scale / treeScale.y;
        const transform = {
          scaleX: interpolate(scaleX, 1, progress),
          scaleY: interpolate(scaleY, 1, progress),
          translateX: interpolate(relativeTranslate(x.translate, parentDelta && parentDelta.x.translate), 0, progress),
          translateY: interpolate(relativeTranslate(y.translate, parentDelta && parentDelta.y.translate), 0, progress)
        };
        applyTransform(el, transform);
        if (progress === 1) resolve(null);

        if (nodeInstance.isCancelled()) {
          cancel();
        }
      },

      steps: time / (1 / fps * 1000)
    });
  }).then(() => {
    requestAnimationFrame(() => el.style.transition = prev);
    return null;
  });
}

function relativeTranslate(curr, parent, scale) {
  return parent ? 0 : // ? (scale < 1 ? curr * (1 - scale) : curr - curr / scale) - parent
  curr;
}

function createSnapshot({
  height,
  width,
  originX,
  originY
}) {
  const {
    innerWidth,
    innerHeight
  } = window;

  let numHeight = _convertDimension(height, innerHeight);

  let numWidth = _convertDimension(width, innerWidth);

  let numOriginX = _convertCoord(originX, innerWidth / 2);

  let numOriginY = _convertCoord(originY, innerHeight / 2);

  return {
    height: numHeight,
    width: numWidth,
    originPoints: {
      x: numOriginX,
      y: numOriginY
    }
  };
}

function _convertDimension(x, absoluteVal) {
  return _convert(x, val => absoluteVal * (val / 100));
}

function _convertCoord(x, absoluteVal) {
  return _convert(x, val => absoluteVal + absoluteVal * (val / 100));
}

function _convert(x, onPercent) {
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

const MotionContext = createContext(null);
class MotionManager {
  constructor() {
    this._snapshots = new Map();
    this._snapshotToDomMap = new WeakMap();
  }

  getSnapshot(id) {
    return this._snapshots.get(id);
  }

  setFps(x) {
    this.fps = x;
  }

  unmount() {
    this._snapshots.clear();
  }

  overrideSnapshot(id, e, snapshot) {
    return this._setSnapshot(id, e, snapshot);
  }

  _setSnapshot(id, e, snapshot) {
    this._snapshots.set(id, snapshot);

    this._snapshotToDomMap.set(snapshot, e);

    return snapshot;
  }

  measure(id, e) {
    const newSnapshot = snapshot(e);
    return this._setSnapshot(id, e, newSnapshot);
  }

  measureAll() {
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
function Motion({
  children
}) {
  const manager = useMemo(() => new MotionManager(), []);
  const [fps, setFps] = useState(null);
  useEffect(() => {
    // in case our requestAnimationFrame code does not work
    // we do not want to end up with nothing on the screen
    // this will probably never happen
    // but just in case, we'd rather assume 60fps
    // than show nothin
    Promise.race([getFps(), new Promise(r => setTimeout(() => r(60), 1000))]).then(x => setFps(x));
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
  return createElement(MotionContext.Provider, {
    value: manager,
    children
  });
}

const DEFAULT_ANIM_TIME = 300;

const TreeContext = createContext(null);
class MotionTreeNode {
  constructor() {
    this.children = new Set();
    this._isAnimating = false;
    this._cancelled = false;
    this._config = {
      id: null,
      isRoot: null,
      time: null,
      wrappedDomNode: null,
      parent: null
    };
  }

  _reset() {
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

  setManager(m) {
    this._motionManager = m;
    return this;
  }

  unmount() {
    this._motionManager = this._config = null;
    return this;
  }

  overrideSnapshot(snap) {
    this._motionManager.overrideSnapshot(this._config.id, this._config.wrappedDomNode, snap);
  }

  getSnapshot() {
    return this._motionManager.getSnapshot(this._config.id);
  }

  attach(child) {
    this.children.add(child);
    return this;
  }

  detach(child) {
    this.children.delete(child);
    return this;
  }

  measure() {
    return this._motionManager.measure(this._config.id, this._config.wrappedDomNode);
  }

  safeRequestLayout({
    nextFrame
  }) {
    return new Promise(resolve => {
      const fn = () => {
        if (this.isReady()) return this.requestLayout().then(() => resolve(null));
        resolve(null);
      };

      nextFrame ? requestAnimationFrame(fn) : fn();
      return this;
    });
  }

  requestLayout($scale = {
    x: 1,
    y: 1
  }, parentDelta) {
    this._reset();

    const existingSnapshot = this.getSnapshot();
    const currentSnapshot = this.measure(); // don't animate if we don't know where it started from

    if (!existingSnapshot) return Promise.resolve(null);
    const delta = calcDelta(currentSnapshot, existingSnapshot);
    const mapped = this.children;
    const nextScale = {
      x: delta.x.scale,
      y: delta.y.scale
    };
    mapped.forEach(tree => tree.requestLayout(nextScale, delta));
    return this.animateTreeDelta(delta, $scale, parentDelta);
  }

  animateTreeDelta(delta, scale = {
    x: 1,
    y: 1
  }, parentDelta) {
    this._isAnimating = true;
    this._cancelled = false;
    return animateDelta({
      el: this._config.wrappedDomNode,
      translateDelta: delta,
      time: this._config.time || DEFAULT_ANIM_TIME,
      nodeInstance: this,
      treeScale: scale,
      parentDelta,
      fps: this._motionManager.fps
    }).then(x => {
      this._isAnimating = false;
    });
  }

  setTreeState({
    wrappedDomNode,
    time,
    id,
    parent
  }) {
    const isRoot = parent == null;
    this._config = {
      wrappedDomNode,
      time,
      id,
      isRoot,
      parent
    };
    return this;
  }

}

function isIsolatedAnimation(parent) {
  return !parent || !parent.isAnimating();
}

function AnimateLayout(p) {
  const {
    element,
    animId,
    time,
    initialSnapshot
  } = p,
        rest = _objectWithoutPropertiesLoose(p, ["element", "animId", "time", "initialSnapshot"]);

  const ref = useRef();
  const nodeRef = useRef();
  const firstRender = useRef(false);
  const manager = useContext(MotionContext);
  const parent = useContext(TreeContext);
  const node = nodeRef.current;
  const [, reRender] = useState(null);
  useLayoutEffect(() => {
    const node = nodeRef.current || (nodeRef.current = new MotionTreeNode());
    parent && parent.attach(node);
    node.setManager(manager);
    if (!ref.current) return;
    node.setTreeState({
      id: animId,
      wrappedDomNode: ref.current,
      parent,
      time
    });
    const obj = {};

    if (!firstRender.current) {
      initialSnapshot && node.overrideSnapshot(initialSnapshot);
      reRender(obj);
    }

    firstRender.current = true;
    node.safeRequestLayout(obj);
    return () => {
      parent && parent.detach(node);
      node.unmount();
    };
  }, [ref.current, animId, time, parent, manager, initialSnapshot]);
  useLayoutEffect(() => {
    ref.current && node && isIsolatedAnimation(parent) && node.safeRequestLayout({});
  });
  useEffect(() => () => node && node.cancel().unmount(), [node]);
  return createElement(TreeContext.Provider, {
    value: node
  }, createElement(element, _extends({
    ref
  }, rest)));
}

export { AnimateLayout, Motion, animate, createSnapshot, interpolate };
//# sourceMappingURL=ui-anim.modern.js.map
