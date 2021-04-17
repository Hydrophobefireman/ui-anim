export function convertDimension(x: string | number, absoluteVal: number) {
  if (x == null) return x as any;
  return _convert(x, (val) => absoluteVal * (val / 100));
}

export function convertCoord(x: string | number, absoluteVal: number) {
  if (x == null) return x as any;
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
