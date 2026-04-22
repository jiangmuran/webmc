// Endermite. 5% chance to spawn when a player throws an ender pearl;
// aggressive; despawns after 2 minutes; attacks enderman sometimes.

export const SPAWN_CHANCE_FROM_PEARL = 0.05;
export const DESPAWN_TICKS = 2400; // 2 min

export interface PearlThrow {
  rand: () => number;
}

export function spawnFromPearl(q: PearlThrow): boolean {
  return q.rand() < SPAWN_CHANCE_FROM_PEARL;
}

export interface Endermite {
  ageTicks: number;
  hp: number;
}

export function tickEndermite(e: Endermite): boolean {
  e.ageTicks += 1;
  return e.ageTicks >= DESPAWN_TICKS;
}

// Endermites attract endermen (who attack them).
export const ATTRACT_RADIUS = 64;

export function enderman_attacks_endermite(distance: number): boolean {
  return distance <= ATTRACT_RADIUS;
}
