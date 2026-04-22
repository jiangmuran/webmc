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

// Ink sac drops. 1..3 when killed, unaffected by looting.
export function inkSacDrops(rand: () => number): number {
  return 1 + Math.floor(rand() * 3);
}
