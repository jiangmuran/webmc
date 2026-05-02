// Squid / glow squid ink cloud. On damage, squid sheds an ink cloud
// (particle region) up to 3 times before fleeing. Glow squid sheds a
// glow cloud that briefly disables darkness in the area.

export interface SquidState {
  inkReserves: number;
  lastInkTick: number;
  glow: boolean;
}

export const MAX_INK = 3;
export const INK_COOLDOWN_TICKS = 40;

export function makeSquid(glow: boolean): SquidState {
  return { inkReserves: MAX_INK, lastInkTick: -Infinity, glow };
}

export interface InkResult {
  emitted: boolean;
  radius: number;
  glow: boolean;
}

export function shedInk(s: SquidState, nowTick: number): InkResult {
  if (s.inkReserves <= 0) return { emitted: false, radius: 0, glow: false };
  if (nowTick - s.lastInkTick < INK_COOLDOWN_TICKS) {
    return { emitted: false, radius: 0, glow: false };
  }
  s.inkReserves -= 1;
  s.lastInkTick = nowTick;
  return {
    emitted: true,
    radius: s.glow ? 4 : 3,
    glow: s.glow,
  };
}

// Wiki (minecraft.wiki/w/Ink_Sac, /w/Squid): squid drop "1-3 ink
// sacs (lootingquantity=0-1)" — i.e. Looting adds an EXTRA 0-1 per
// level. With Looting III: 1-3 base + 0-3 from Looting = 1-6 total.
//
// Old comment "unaffected by looting" was wrong (sibling
// glow_squid drop tables follow the same rule). Function now
// accepts an optional lootingLevel and applies the per-level
// 0..lootingLevel bonus that wiki canon documents.
export function inkSacDrops(rand: () => number, lootingLevel = 0): number {
  const base = 1 + Math.floor(rand() * 3);
  if (lootingLevel <= 0) return base;
  const bonus = Math.floor(rand() * (lootingLevel + 1));
  return base + bonus;
}
