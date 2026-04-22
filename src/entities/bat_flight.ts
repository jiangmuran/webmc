// Bat. Spawns in dark caves; erratic flight; sleeps on ceiling at day.
// Harmless. Despawns in daytime.

export interface Bat {
  hp: number;
  flying: boolean;
  sleepingOnCeiling: boolean;
  ageTicks: number;
}

export const MAX_HP = 6;

export function makeBat(): Bat {
  return { hp: MAX_HP, flying: false, sleepingOnCeiling: true, ageTicks: 0 };
}

export interface TickQuery {
  isDay: boolean;
  ceilingAbove: boolean;
  playerNearby: boolean;
}

export function tickBat(b: Bat, q: TickQuery): void {
  if (q.playerNearby) {
    b.flying = true;
    b.sleepingOnCeiling = false;
    return;
  }
  if (q.isDay && q.ceilingAbove) {
    b.flying = false;
    b.sleepingOnCeiling = true;
  } else {
    b.flying = true;
    b.sleepingOnCeiling = false;
  }
}

// Bats spawn only in dark places (light < 4) and y < 63.
export interface SpawnQuery {
  lightLevel: number;
  y: number;
}

export function canSpawnBat(q: SpawnQuery): boolean {
  return q.lightLevel < 4 && q.y < 63;
}
