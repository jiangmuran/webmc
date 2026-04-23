// Greedy quad merge helper: given a 2D mask on a plane, produce rectangles
// covering same-value runs. Used by binary greedy mesher.

export interface Quad {
  x: number;
  y: number;
  w: number;
  h: number;
  value: number;
}

export function mergeQuads(mask: number[], width: number, height: number): Quad[] {
  const m = mask.slice();
  const quads: Quad[] = [];
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; ) {
      const v = m[j * width + i];
      if (v === undefined || v === 0) {
        i++;
        continue;
      }
      let w = 1;
      while (i + w < width && m[j * width + i + w] === v) w++;
      let h = 1;
      outer: while (j + h < height) {
        for (let k = 0; k < w; k++) {
          if (m[(j + h) * width + i + k] !== v) break outer;
        }
        h++;
      }
      quads.push({ x: i, y: j, w, h, value: v });
      for (let jj = j; jj < j + h; jj++) {
        for (let ii = i; ii < i + w; ii++) m[jj * width + ii] = 0;
      }
      i += w;
    }
  }
  return quads;
}
