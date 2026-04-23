export interface TeleportAttempt {
  originX: number;
  originY: number;
  originZ: number;
  rng: () => number;
}

export const SEARCH_RADIUS = 8;

export function proposedTarget(t: TeleportAttempt): { x: number; y: number; z: number } {
  const dx = (t.rng() - 0.5) * SEARCH_RADIUS * 2;
  const dy = (t.rng() - 0.5) * SEARCH_RADIUS * 2;
  const dz = (t.rng() - 0.5) * SEARCH_RADIUS * 2;
  return {
    x: t.originX + dx,
    y: Math.max(0, t.originY + dy),
    z: t.originZ + dz,
  };
}

export function hurtsOnFall(): boolean {
  return false;
}
