export interface SpawnPoint {
  x: number;
  y: number;
  z: number;
  dimension: 'overworld' | 'nether' | 'end';
  anchor: boolean;
}

export function updateOnBedSleep(
  spawn: SpawnPoint | undefined,
  bed: { x: number; y: number; z: number },
): SpawnPoint {
  return { ...bed, dimension: 'overworld', anchor: false };
}

export function updateOnAnchorCharge(
  spawn: SpawnPoint | undefined,
  anchor: { x: number; y: number; z: number },
): SpawnPoint {
  return { ...anchor, dimension: 'nether', anchor: true };
}

export function isValid(s: SpawnPoint): boolean {
  return Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.z);
}
