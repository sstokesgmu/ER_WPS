export function distance(x1, y1, x2, y2) {
  let sumX = (x2 - x1) * (x2 - x1);
  let sumY = (y2 - y1) * (y2 - y1);
  return roundDownTwo(Math.sqrt(sumX + sumY));
}

export function roundDownTwo(value) {
  return Math.floor(value * 100) / 100;
}
