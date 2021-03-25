import { AnimateOptions } from "../types";

export function animate({ from, to, callback, steps }: AnimateOptions) {
  const incrementValue = (to - from) / steps;
  return _createAnimation(from, to, incrementValue, callback);
}

export function interpolate(from: number, to: number, progress: number) {
  return -progress * from + progress * to + from;
}

function _createAnimation(
  from: number,
  to: number,
  incrementValue: number,
  callback: AnimateOptions["callback"]
) {
  if (incrementValue > 0 ? from >= to : from <= to) return callback(to);
  requestAnimationFrame(() =>
    _createAnimation(from + incrementValue, to, incrementValue, callback)
  );
  callback(from);
}
