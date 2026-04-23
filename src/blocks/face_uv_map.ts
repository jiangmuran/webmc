// Per-face UV map for a block model element. Given a cuboid (from/to)
// in 0..16 units and the element's texture override, compute UVs.

export interface Cuboid {
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
}

export type Face = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

export interface FaceUv {
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

export function defaultUv(c: Cuboid, face: Face): FaceUv {
  if (face === 'up' || face === 'down') {
    return { u0: c.from.x, v0: c.from.z, u1: c.to.x, v1: c.to.z };
  }
  if (face === 'north' || face === 'south') {
    return { u0: c.from.x, v0: 16 - c.to.y, u1: c.to.x, v1: 16 - c.from.y };
  }
  return { u0: c.from.z, v0: 16 - c.to.y, u1: c.to.z, v1: 16 - c.from.y };
}

export function applyTextureRect(
  uv: FaceUv,
  textureU0: number,
  textureV0: number,
  size: number,
): FaceUv {
  return {
    u0: textureU0 + (uv.u0 / 16) * size,
    v0: textureV0 + (uv.v0 / 16) * size,
    u1: textureU0 + (uv.u1 / 16) * size,
    v1: textureV0 + (uv.v1 / 16) * size,
  };
}
