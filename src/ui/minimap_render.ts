// Minimap: top-down color sampling of heightmap, cropped to a circle.

export interface MiniMapCtx {
  heightmap: number[]; // row-major length w*h, height = y value
  w: number;
  h: number;
  centerX: number;
  centerZ: number;
  radius: number;
}

export function sampleHeight(m: MiniMapCtx, x: number, z: number): number | undefined {
  const cx = Math.floor(x - m.centerX + m.radius);
  const cz = Math.floor(z - m.centerZ + m.radius);
  if (cx < 0 || cz < 0 || cx >= m.w || cz >= m.h) return undefined;
  return m.heightmap[cz * m.w + cx];
}

export function colorForHeight(y: number, minY: number, maxY: number): number {
  const t = Math.max(0, Math.min(1, (y - minY) / Math.max(1, maxY - minY)));
  const r = Math.round(30 + t * 170);
  const g = Math.round(90 + t * 140);
  const b = Math.round(60 + t * 60);
  return (r << 16) | (g << 8) | b;
}

export function isVisiblePixel(
  px: number,
  py: number,
  centerPx: number,
  radiusPx: number,
): boolean {
  const dx = px - centerPx;
  const dy = py - centerPx;
  return dx * dx + dy * dy <= radiusPx * radiusPx;
}
