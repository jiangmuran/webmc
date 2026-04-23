// Cave spider spawners appear in abandoned mineshaft corridors
// wrapped in cobwebs.

export const SPAWNER_CORRIDOR_INTERVAL_BLOCKS = 40;
export const SPAWNER_COBWEB_WRAP_RADIUS = 2;
export const SPAWNER_LIGHT_REQUIREMENT = 0; // spawns regardless of light

export function isSpawnerSpot(corridorBlock: number): boolean {
  return corridorBlock > 0 && corridorBlock % SPAWNER_CORRIDOR_INTERVAL_BLOCKS === 0;
}

export function cobwebCellsAround(
  cx: number,
  cy: number,
  cz: number,
): { x: number; y: number; z: number }[] {
  const out: { x: number; y: number; z: number }[] = [];
  for (let dx = -SPAWNER_COBWEB_WRAP_RADIUS; dx <= SPAWNER_COBWEB_WRAP_RADIUS; dx++) {
    for (let dy = -SPAWNER_COBWEB_WRAP_RADIUS; dy <= SPAWNER_COBWEB_WRAP_RADIUS; dy++) {
      for (let dz = -SPAWNER_COBWEB_WRAP_RADIUS; dz <= SPAWNER_COBWEB_WRAP_RADIUS; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        out.push({ x: cx + dx, y: cy + dy, z: cz + dz });
      }
    }
  }
  return out;
}
