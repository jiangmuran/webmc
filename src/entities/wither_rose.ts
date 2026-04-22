// Wither rose. Flower dropped when a mob is killed by the wither's
// skull. Standing on it inflicts the wither effect for 2 seconds per
// tick; the wither itself is immune. Also damages all but a few undead
// and wither-skeleton-kin mobs.

export interface WitherRoseQuery {
  entityKind: string;
  inContactWithRose: boolean;
  dtSec: number;
}

export interface WitherRoseResult {
  applyWitherSec: number;
}

const IMMUNE = new Set<string>(['wither', 'wither_skeleton', 'wither_skull_projectile']);

export function witherRoseEffect(q: WitherRoseQuery): WitherRoseResult {
  if (!q.inContactWithRose) return { applyWitherSec: 0 };
  if (IMMUNE.has(q.entityKind)) return { applyWitherSec: 0 };
  return { applyWitherSec: 2 };
}

// A wither-kill on a valid mob drops a wither rose at the mob's position.
export interface WitherKillQuery {
  victimKind: string;
  roseNotYetPlaced: boolean;
}

const NO_ROSE_FROM = new Set<string>(['wither', 'wither_skeleton', 'ender_dragon']);

export function dropsWitherRose(q: WitherKillQuery): boolean {
  if (!q.roseNotYetPlaced) return false;
  return !NO_ROSE_FROM.has(q.victimKind);
}

// Wither rose doesn't break on bone meal (doesn't do anything).
export function isWitherRoseBoneMealable(): boolean {
  return false;
}

// Planting a wither rose on any dirt/grass/podzol/farmland succeeds;
// all other targets reject.
export function canPlantWitherRoseOn(surface: string): boolean {
  const ok = ['webmc:dirt', 'webmc:grass_block', 'webmc:podzol', 'webmc:farmland'];
  return (
    ok.includes(surface) || surface === 'webmc:nether_wart_block' || surface === 'webmc:soul_soil'
  );
}
