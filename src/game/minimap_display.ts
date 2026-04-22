// Minimap HUD. A small top-corner widget shows a top-down view of
// nearby chunks (typically 4-chunk radius) with player arrow and
// markers. Rotation follows player yaw unless locked.

export type MinimapShape = 'square' | 'circle';

export interface MinimapConfig {
  visible: boolean;
  shape: MinimapShape;
  sizeChunks: number; // half-radius in chunks
  rotateWithPlayer: boolean;
  showCoords: boolean;
  markerOpacity: number;
}

export function defaultMinimap(): MinimapConfig {
  return {
    visible: true,
    shape: 'square',
    sizeChunks: 4,
    rotateWithPlayer: true,
    showCoords: true,
    markerOpacity: 0.9,
  };
}

export interface MinimapSample {
  cx: number;
  cz: number;
  colorRGB: [number, number, number];
}

// Given the player's center chunk and the minimap radius, return the
// set of chunks to sample.
export function chunksToSample(
  cx: number,
  cz: number,
  radius: number,
): { cx: number; cz: number }[] {
  const out: { cx: number; cz: number }[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      out.push({ cx: cx + dx, cz: cz + dz });
    }
  }
  return out;
}

// Rotate a vector by yaw for circular minimaps.
export function rotatePoint(dx: number, dz: number, yawRad: number): { x: number; z: number } {
  const cos = Math.cos(yawRad);
  const sin = Math.sin(yawRad);
  return { x: dx * cos - dz * sin, z: dx * sin + dz * cos };
}

// Is a world position inside the minimap's view?
export interface VisibleQuery {
  playerCx: number;
  playerCz: number;
  targetCx: number;
  targetCz: number;
  config: MinimapConfig;
}

export function inView(q: VisibleQuery): boolean {
  const dx = q.targetCx - q.playerCx;
  const dz = q.targetCz - q.playerCz;
  if (q.config.shape === 'square') {
    return Math.abs(dx) <= q.config.sizeChunks && Math.abs(dz) <= q.config.sizeChunks;
  }
  return Math.hypot(dx, dz) <= q.config.sizeChunks;
}
