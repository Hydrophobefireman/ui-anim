import { createContext, useMemo, createElement, useRef, useState, useContext, useLayoutEffect } from './@hydrophobefireman/ui-lib.js';

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

function animate({
  from,
  to,
  callback,
  steps
}) {
  const incrementValue = (to - from) / steps;
  return _createAnimation(from, to, incrementValue, callback);
}
function interpolate(from, to, progress) {
  return -progress * from + progress * to + from;
}

function _createAnimation(from, to, incrementValue, callback) {
  if (incrementValue > 0 ? from >= to : from <= to) return callback(to);
  requestAnimationFrame(() => _createAnimation(from + incrementValue, to, incrementValue, callback));
  callback(from);
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

function snapshot(el) {
  el.style.transform = "";
  const snap = el.getBoundingClientRect();
  const {
    height,
    width,
    x,
    y,
    left,
    right,
    top,
    bottom
  } = snap;
  return freeze({
    height,
    width,
    x,
    y,
    originPoints: {
      x: interpolate(left, right, 0.5),
      y: interpolate(top, bottom, 0.5)
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
function animateDelta(el, translateDelta, time = 300, treeScale, parentDelta) {
  return new Promise(resolve => {
    const {
      x,
      y
    } = translateDelta;
    animate({
      from: 0,
      to: 1,

      callback(progress) {
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
      },

      steps: time / 16
    });
  });
}

function relativeTranslate(curr, parent, scale) {
  return parent ? 0 : // ? (scale < 1 ? curr * (1 - scale) : curr - curr / scale) - parent
  curr;
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

  measure(id, e, t) {
    const newSnapshot = snapshot(e);

    this._snapshots.set(id, newSnapshot);

    this._snapshotToDomMap.set(newSnapshot, e);

    return newSnapshot;
  }

}
function Motion({
  children
}) {
  const manager = useMemo(() => new MotionManager(), []);
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
    this._config = {
      id: null,
      isRoot: null,
      time: null,
      wrappedDomNode: null,
      parent: null
    };
  }

  isReady() {
    return !!this._motionManager;
  }

  isAnimating() {
    return this._isAnimating;
  }

  setManager(m) {
    this._motionManager = m;
  }

  unmount() {
    window.removeEventListener("resize", this._resizeListener);
    this._motionManager = this._config = this._resizeListener = null;
  }

  getSnapshot() {
    return this._motionManager.getSnapshot(this._config.id);
  }

  attach(child) {
    this.children.add(child);
  }

  detach(child) {
    this.children.delete(child);
  }

  measure() {
    return this._motionManager.measure(this._config.id, this._config.wrappedDomNode, this._config.time || DEFAULT_ANIM_TIME);
  }

  safeRequestLayout({
    nextFrame
  }) {
    const fn = () => this.isReady() && !this.isAnimating() && this.requestLayout();

    nextFrame ? requestAnimationFrame(fn) : fn();
  }

  requestLayout($scale = {
    x: 1,
    y: 1
  }, parentDelta) {
    const existingSnapshot = this.getSnapshot();
    const currentSnapshot = this.measure();
    if (!existingSnapshot) return; // don't animate if we don't know where it started from

    const delta = calcDelta(currentSnapshot, existingSnapshot);
    const mapped = this.children;
    const nextScale = {
      x: delta.x.scale,
      y: delta.y.scale
    };
    mapped.forEach(tree => tree.requestLayout(nextScale, delta));
    this.animateTreeDelta(delta, $scale, parentDelta);
  }

  animateTreeDelta(delta, scale = {
    x: 1,
    y: 1
  }, parentDelta) {
    this._isAnimating = true;
    animateDelta(this._config.wrappedDomNode, delta, this._config.time, scale, parentDelta).then(x => {
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

    if (!isRoot) {
      if (this._resizeListener) {
        window.removeEventListener("resize", this._resizeListener);
        this._resizeListener = null;
      }
    } else {
      if (!this._resizeListener) {
        const listener = () => {
          this.measure();
          this.children.forEach(x => x.measure());
        };

        this._resizeListener = listener;
        window.addEventListener("resize", this._resizeListener);
      }
    }
  }

}

function isIsolatedAnimation(parent) {
  return !parent || !parent.isAnimating();
}

function AnimateLayout(p) {
  const {
    element,
    animId,
    time
  } = p,
        rest = _objectWithoutPropertiesLoose(p, ["element", "animId", "time"]);

  const ref = useRef();
  const [node, setNode] = useState(null);
  const manager = useContext(MotionContext);
  const parent = useContext(TreeContext);
  useLayoutEffect(() => {
    const node = new MotionTreeNode();
    parent && parent.attach(node);
    node.setManager(manager);
    setNode(node);
    if (!ref.current) return;
    node.setTreeState({
      id: animId,
      wrappedDomNode: ref.current,
      parent,
      time
    });
    node.safeRequestLayout({
      nextFrame: true
    });
    return () => {
      parent && parent.detach(node);
      node.unmount();
    };
  }, [ref.current, animId, time, parent, manager]);
  useLayoutEffect(() => {
    ref.current && node && isIsolatedAnimation(parent) && node.safeRequestLayout({});
  });
  return createElement(TreeContext.Provider, {
    value: node
  }, createElement(element, _extends({
    ref
  }, rest)));
} // export function $AnimateLayout<>(
//   p: AnimateLayoutProps<T
// ): JSX.Element {
//   const { element, animId, ref: providedRef, time, ...rest } = p;
//   const manager = useContext(MotionContext);
//   const parent = useContext(TreeContext);
//   const node = useMemo(() => new MotionTreeNode(), []);
//   const ref = useRef<HTMLElement>();
//   const didAdd = useRef(false);
//   const old = useRef<string>("");
//   useLayoutEffect(() => {
//     if (ref.current) {
//       old.current = ref.current.style.visibility;
//       ref.current.style.visibility = "hidden";
//     }
//     node.setManager(manager);
//   }, [manager, node]);
//   useEffect(() => {
//     providedRef && (providedRef.current = ref.current);
//     if (ref.current && !didAdd.current) {
//       didAdd.current = true;
//       parent && parent.attach(node);
//       node.setTreeState({
//         wrappedDomNode: ref.current,
//         time,
//         id: animId,
//         parent,
//       });
//       !node.getSnapshot() && node.measure();
//       node.requestLayout();
//       if (ref.current && old.current != null) {
//         ref.current.style.visibility = old.current;
//         old.current = null;
//       }
//       return () => {
//         parent && parent.detach(node);
//         didAdd.current = false;
//       };
//     }
//   }, [ref.current, animId, time, parent, node]);
//   useLayoutEffect(() => {
//     didAdd.current && !parent && node.requestLayout();
//   });
//   if (!manager)
//     throw new Error("Cannot render without an existing motion context!");
//   return createElement(
//     TreeContext.Provider as any,
//     { value: node } as any,
//     createElement(element, { ref, ...rest } as createElementPropType<any>)
//   );
// }

export { AnimateLayout, Motion };
//# sourceMappingURL=ui-anim.modern.js.map
