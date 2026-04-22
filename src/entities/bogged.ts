// Bogged (1.21 swamp variant of skeleton). Moss-covered, slower to fire
// than a skeleton but shoots tipped poison arrows at range. Drops a
// mossy-carpet-ish mossy skull item rarely.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BoggedState {
  id: number;
  position: Vec3;
  health: number;
  drawTicks: number;
  targetId: number | null;
}

export const BOGGED_MAX_HEALTH = 16;
const DRAW_TICKS_REQUIRED = 30; // slower than skeleton's 20

export function makeBogged(id: number, at: Vec3): BoggedState {
  return { id, position: { ...at }, health: BOGGED_MAX_HEALTH, drawTicks: 0, targetId: null };
}

export interface BoggedTickCtx {
  hasTarget: boolean;
}

export interface BoggedTickResult {
  fireArrow: boolean;
}

export function tickBogged(state: BoggedState, ctx: BoggedTickCtx): BoggedTickResult {
  if (!ctx.hasTarget) {
    state.drawTicks = 0;
    return { fireArrow: false };
  }
  state.drawTicks++;
  if (state.drawTicks >= DRAW_TICKS_REQUIRED) {
    state.drawTicks = 0;
    return { fireArrow: true };
  }
  return { fireArrow: false };
}

export interface BoggedArrow {
  item: 'webmc:arrow';
  tip: 'poison';
  durationSec: number;
}

export function boggedArrow(): BoggedArrow {
  return { item: 'webmc:arrow', tip: 'poison', durationSec: 3.75 };
}

export function boggedDrops(lootingLevel: number): { item: string; count: number }[] {
  const drops: { item: string; count: number }[] = [
    { item: 'webmc:arrow', count: Math.floor(Math.random() * 3) },
    { item: 'webmc:bone', count: Math.floor(Math.random() * 3) },
  ];
  if (Math.random() < 0.025 + lootingLevel * 0.01) {
    drops.push({ item: 'webmc:bogged_skull', count: 1 });
  }
  return drops.filter((d) => d.count > 0);
}
