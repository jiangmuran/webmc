// Glow squid. Emits 0 block light (it glows visually only). Damaged
// → dims for 100 ticks (visually). Drops glow ink sac.

export interface GlowSquid {
  hp: number;
  dimmedUntilTick: number;
  depth: number;
}

export const DIM_TICKS = 100;
export const MAX_HP = 10;

export function makeGlowSquid(y: number): GlowSquid {
  return { hp: MAX_HP, dimmedUntilTick: 0, depth: y };
}

export function onDamaged(g: GlowSquid, nowTick: number): void {
  g.dimmedUntilTick = nowTick + DIM_TICKS;
}

export function isDimmed(g: GlowSquid, nowTick: number): boolean {
  return nowTick < g.dimmedUntilTick;
}

// Glow ink sac drops: 1-3 on kill.
export function inkSacDrops(rand: () => number): number {
  return 1 + Math.floor(rand() * 3);
}

// Glow squids only spawn in dark water below y=30.
export interface SpawnQuery {
  y: number;
  lightLevel: number;
  underwater: boolean;
}

export function canSpawnGlowSquid(q: SpawnQuery): boolean {
  if (!q.underwater) return false;
  if (q.y > 30) return false;
  return q.lightLevel === 0;
}
