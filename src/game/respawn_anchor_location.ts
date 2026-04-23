export interface RespawnAnchor {
  x: number;
  y: number;
  z: number;
  charges: number;
  dimension: 'overworld' | 'nether' | 'end';
}

export interface SpawnFallback {
  bed?: { x: number; y: number; z: number };
  worldSpawn: { x: number; y: number; z: number };
}

export function respawnPosition(
  anchor: RespawnAnchor | undefined,
  fallback: SpawnFallback,
): { x: number; y: number; z: number } {
  if (anchor?.dimension === 'nether' && anchor.charges > 0) {
    return { x: anchor.x, y: anchor.y, z: anchor.z };
  }
  return fallback.bed ?? fallback.worldSpawn;
}

export function consumesCharge(anchor: RespawnAnchor | undefined): boolean {
  return anchor?.dimension === 'nether' && anchor.charges > 0;
}
