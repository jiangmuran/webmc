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

// Wiki (minecraft.wiki/w/Wither_Rose#Placement): "Wither roses can
// be placed on dirt, grass blocks, podzol, mycelium, farmland, mud,
// coarse dirt, rooted dirt, moss blocks, nether wart blocks, warped
// wart blocks, and soul soil." Old set was missing coarse_dirt,
// mycelium, mud, muddy_mangrove_roots, rooted_dirt, moss_block, and
// warped_wart_block — six of the canonical surfaces.
const PLACEABLE_ON = new Set([
  'webmc:dirt',
  'webmc:grass_block',
  'webmc:podzol',
  'webmc:mycelium',
  'webmc:farmland',
  'webmc:mud',
  'webmc:coarse_dirt',
  'webmc:rooted_dirt',
  'webmc:muddy_mangrove_roots',
  'webmc:moss_block',
  'webmc:pale_moss_block',
  'webmc:nether_wart_block',
  'webmc:warped_wart_block',
  'webmc:soul_soil',
]);

export function canPlantWitherRoseOn(surface: string): boolean {
  return PLACEABLE_ON.has(surface);
}
