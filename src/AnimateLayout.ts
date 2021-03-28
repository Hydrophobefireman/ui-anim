import {
  createElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "@hydrophobefireman/ui-lib";
import { AnimateLayoutProps, DomElements } from "./types";
import { MotionContext } from "./Motion";
import { MotionTreeNode, TreeContext } from "./context/MotionTree";

function isIsolatedAnimation(parent: MotionTreeNode) {
  return !parent || !parent.isAnimating();
}

export function AnimateLayout<T extends DomElements = "div">(
  p: AnimateLayoutProps<T>
): JSX.Element {
  const { element, animId, time, ...rest } = p;
  const ref = useRef<HTMLElement>();
  const [node, setNode] = useState<MotionTreeNode>(null);

  const manager = useContext(MotionContext);
  const parent = useContext(TreeContext);
  useLayoutEffect(() => {
    const node = new MotionTreeNode();
    parent && parent.attach(node);
    node.setManager(manager);
    setNode(node);
    if (!ref.current) return;
    node
      .setTreeState({
        id: animId,
        wrappedDomNode: ref.current,
        parent,
        time,
      })
      .safeRequestLayout({ nextFrame: true });
    return () => {
      parent && parent.detach(node);
      node.unmount();
    };
  }, [ref.current, animId, time, parent, manager]);
  useLayoutEffect(() => {
    ref.current &&
      node &&
      isIsolatedAnimation(parent) &&
      node.safeRequestLayout({});
  });
  useEffect(() => () => node && node.cancel().unmount(), [node]);
  return createElement(
    TreeContext.Provider as any,
    { value: node as any },
    createElement(element, { ref, ...rest })
  );
}
