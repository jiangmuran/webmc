// Fishing rod reel-in. Reeling pulls hooked entity toward player.

export interface ReelCtx {
  hookedEntity: string | null;
  hookPosition: { x: number; y: number; z: number };
  playerPosition: { x: number; y: number; z: number };
}

export const REEL_VELOCITY_MULT = 0.15;

export function reelVelocity(c: ReelCtx): { vx: number; vy: number; vz: number } {
  if (!c.hookedEntity) return { vx: 0, vy: 0, vz: 0 };
  const dx = c.playerPosition.x - c.hookPosition.x;
  const dy = c.playerPosition.y - c.hookPosition.y;
  const dz = c.playerPosition.z - c.hookPosition.z;
  return { vx: dx * REEL_VELOCITY_MULT, vy: dy * REEL_VELOCITY_MULT, vz: dz * REEL_VELOCITY_MULT };
}

export function breakOnDistance(distance: number): boolean {
  return distance > 33;
}

export function durabilityCostPerUse(): number {
  return 1;
}
