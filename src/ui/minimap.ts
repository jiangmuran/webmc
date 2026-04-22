// Minimap projection. Given the player's world position + a list of
// entities, produce pixel coordinates for a circular minimap of radius
// N blocks.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MinimapQuery {
  playerPos: Vec3;
  playerYaw: number;
  radiusBlocks: number;
  pixelRadius: number;
}

export interface MinimapPoint {
  px: number;
  py: number;
  insideCircle: boolean;
}

export function projectToMinimap(
  q: MinimapQuery,
  worldPos: { x: number; z: number },
): MinimapPoint {
  const dx = worldPos.x - q.playerPos.x;
  const dz = worldPos.z - q.playerPos.z;
  // Rotate by -playerYaw so "forward" points up on the minimap.
  const sin = Math.sin(-q.playerYaw);
  const cos = Math.cos(-q.playerYaw);
  const rotX = dx * cos - dz * sin;
  const rotZ = dx * sin + dz * cos;
  const scale = q.pixelRadius / q.radiusBlocks;
  const px = rotX * scale;
  const py = rotZ * scale;
  const distSq = px * px + py * py;
  return { px, py, insideCircle: distSq <= q.pixelRadius * q.pixelRadius };
}
