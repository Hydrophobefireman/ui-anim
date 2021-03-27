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

export function AnimateLayout<T extends DomElements = "div">(
  p: AnimateLayoutProps<T>
): JSX.Element {
  const { element, animId, time, ...rest } = p;
  const ref = useRef<HTMLElement>();
  const [node, setNode] = useState<MotionTreeNode>(null);

  const manager = useContext(MotionContext);
  const parent = useContext(TreeContext);

  useLayoutEffect(() => {
    ref.current && node && node.isReady() && node.requestLayout();
  });
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
      time,
    });
    return () => {
      parent && parent.detach(node);
      node.unmount();
    };
  }, [ref.current, animId, time, parent, manager]);

  return createElement(
    TreeContext.Provider as any,
    { value: node as any },
    createElement(element, { ref, ...rest })
  );
}

// export function $AnimateLayout<>(
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
