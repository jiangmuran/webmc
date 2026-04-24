export type Dimension = 'overworld' | 'nether' | 'end';

export interface RespawnSpec {
  dimension: Dimension;
  x: number;
  y: number;
  z: number;
  bedValid: boolean;
  anchorValid: boolean;
  anchorCharges: number;
}

export function chooseRespawn(
  world: RespawnSpec | undefined,
  worldSpawn: { x: number; y: number; z: number },
): { x: number; y: number; z: number; dimension: Dimension; consumed?: 'anchor_charge' } {
  if (world?.dimension === 'overworld' && world.bedValid) {
    return { x: world.x, y: world.y, z: world.z, dimension: 'overworld' };
  }
  if (world?.dimension === 'nether' && world.anchorValid && world.anchorCharges > 0) {
    return { x: world.x, y: world.y, z: world.z, dimension: 'nether', consumed: 'anchor_charge' };
  }
  return { ...worldSpawn, dimension: 'overworld' };
}

export function preservesRespawnAfterDeath(
  s: RespawnSpec,
  survived: boolean,
): RespawnSpec | undefined {
  if (!survived) return undefined;
  return s;
}
