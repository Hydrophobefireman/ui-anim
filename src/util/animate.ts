import { AnimateOptions } from "../types";
export const CANCELLED = {};
export function animate({ from, to, callback, steps }: AnimateOptions) {
  const incrementValue = (to - from) / steps;
  const cancelToken = { cancelled: false };
  function cancel() {
    cancelToken.cancelled = true;
  }
  return _createAnimation(
    from,
    to,
    incrementValue,
    callback,
    cancelToken,
    cancel
  );
}

export function interpolate(from: number, to: number, progress: number) {
  return -progress * from + progress * to + from;
}

function _createAnimation(
  from: number,
  to: number,
  incrementValue: number,
  callback: AnimateOptions["callback"],
  cancelToken: { cancelled: boolean },
  cancel: () => void
) {
  if (cancelToken.cancelled) return callback(CANCELLED, cancel);
  if (incrementValue > 0 ? from >= to : from <= to) return callback(to, cancel);
  requestAnimationFrame(() =>
    _createAnimation(
      from + incrementValue,
      to,
      incrementValue,
      callback,
      cancelToken,
      cancel
    )
  );
  callback(from, cancel);
}

export function getFps(): Promise<number> {
  return new Promise((resolve) =>
    requestAnimationFrame((t1) =>
      requestAnimationFrame((t2) => resolve(1000 / (t2 - t1)))
    )
  );
}
