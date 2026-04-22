// Enderman teleport. On damage or when stuck in water/rain, teleport
// to a random block up to 32 blocks away. Must land on a solid block
// with 2 blocks of clearance above.

export interface TeleportQuery {
  from: { x: number; y: number; z: number };
  rand: () => number;
  validLanding: (x: number, y: number, z: number) => boolean;
  maxAttempts?: number;
}

export const TP_RADIUS = 32;

export function tryTeleport(q: TeleportQuery): { x: number; y: number; z: number } | null {
  const attempts = q.maxAttempts ?? 16;
  for (let i = 0; i < attempts; i++) {
    const dx = Math.floor((q.rand() - 0.5) * 2 * TP_RADIUS);
    const dy = Math.floor((q.rand() - 0.5) * 2 * TP_RADIUS);
    const dz = Math.floor((q.rand() - 0.5) * 2 * TP_RADIUS);
    const x = q.from.x + dx;
    const y = q.from.y + dy;
    const z = q.from.z + dz;
    if (q.validLanding(x, y, z)) return { x, y, z };
  }
  return null;
}

// Enderman takes damage from water; teleport-from-water triggered once
// per water tick until escape.
export function triggersTeleport(water: boolean, rain: boolean, damaged: boolean): boolean {
  return water || rain || damaged;
}
