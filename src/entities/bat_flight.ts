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

// Wiki (minecraft.wiki/w/Bat): "Bats can spawn in groups of 8 (JE)
// or 2 (BE) in the Overworld at a light level of 3 or less at any
// y-level, on blocks of stone, granite, diorite, andesite, tuff,
// or deepslate that are not directly exposed to the sky." The old
// `y < 63` floor was dropped in 24w33a / 1.21.2 — bats now spawn
// at any height as long as the light/sky/block conditions are met.
export interface SpawnQuery {
  lightLevel: number;
  exposedToSky?: boolean;
}

export function canSpawnBat(q: SpawnQuery): boolean {
  if (q.lightLevel > 3) return false;
  if (q.exposedToSky === true) return false;
  return true;
}
