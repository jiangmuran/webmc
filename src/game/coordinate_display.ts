// F3 debug overlay coordinate display. Shows position, facing, block
// below, light levels, biome, and target block.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DebugCoords {
  pos: Vec3;
  blockPos: Vec3;
  chunkPos: { cx: number; cy: number; cz: number };
  facing: CardinalFacing;
  facingAngleDeg: number;
}

export type CardinalFacing = 'N' | 'E' | 'S' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

export function cardinalFromYaw(yawRad: number): CardinalFacing {
  const deg = ((yawRad * 180) / Math.PI + 360) % 360;
  if (deg >= 337.5 || deg < 22.5) return 'S';
  if (deg < 67.5) return 'SW';
  if (deg < 112.5) return 'W';
  if (deg < 157.5) return 'NW';
  if (deg < 202.5) return 'N';
  if (deg < 247.5) return 'NE';
  if (deg < 292.5) return 'E';
  return 'SE';
}

export function debugCoordsFor(pos: Vec3, yawRad: number): DebugCoords {
  const bx = Math.floor(pos.x);
  const by = Math.floor(pos.y);
  const bz = Math.floor(pos.z);
  return {
    pos,
    blockPos: { x: bx, y: by, z: bz },
    chunkPos: { cx: Math.floor(bx / 16), cy: Math.floor(by / 16), cz: Math.floor(bz / 16) },
    facing: cardinalFromYaw(yawRad),
    facingAngleDeg: ((yawRad * 180) / Math.PI + 360) % 360,
  };
}

// Formats a coordinate line like "XYZ: 12.5 / 64 / -132.8".
export function formatXYZ(pos: Vec3): string {
  return `XYZ: ${pos.x.toFixed(1)} / ${pos.y.toFixed(0)} / ${pos.z.toFixed(1)}`;
}

export function formatBlock(pos: Vec3): string {
  return `Block: ${Math.floor(pos.x).toString()} ${Math.floor(pos.y).toString()} ${Math.floor(pos.z).toString()}`;
}

export function formatChunk(pos: Vec3): string {
  const cx = Math.floor(pos.x / 16);
  const cy = Math.floor(pos.y / 16);
  const cz = Math.floor(pos.z / 16);
  return `Chunk: ${cx.toString()} ${cy.toString()} ${cz.toString()}`;
}
