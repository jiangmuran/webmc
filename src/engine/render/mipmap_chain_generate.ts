export interface Level {
  width: number;
  height: number;
}

export function chainLevels(baseW: number, baseH: number): Level[] {
  const out: Level[] = [];
  let w = baseW;
  let h = baseH;
  while (w >= 1 && h >= 1) {
    out.push({ width: w, height: h });
    if (w === 1 && h === 1) break;
    w = Math.max(1, w >> 1);
    h = Math.max(1, h >> 1);
  }
  return out;
}

export function bytesForRGBA(level: Level): number {
  return level.width * level.height * 4;
}

export function totalBytes(baseW: number, baseH: number): number {
  return chainLevels(baseW, baseH).reduce((acc, l) => acc + bytesForRGBA(l), 0);
}
