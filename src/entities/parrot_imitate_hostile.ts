export type HostileId =
  | 'zombie'
  | 'husk'
  | 'drowned'
  | 'skeleton'
  | 'stray'
  | 'bogged'
  | 'wither_skeleton'
  | 'creeper'
  | 'spider'
  | 'cave_spider'
  | 'enderman'
  | 'blaze'
  | 'ghast'
  | 'magma_cube'
  | 'witch'
  | 'phantom';

export const IMITATE_RADIUS = 20;

const IMITATE_SOUND: Record<HostileId, string> = {
  zombie: 'parrot.imitate.zombie',
  husk: 'parrot.imitate.husk',
  drowned: 'parrot.imitate.drowned',
  skeleton: 'parrot.imitate.skeleton',
  stray: 'parrot.imitate.stray',
  bogged: 'parrot.imitate.bogged',
  wither_skeleton: 'parrot.imitate.wither_skeleton',
  creeper: 'parrot.imitate.creeper',
  spider: 'parrot.imitate.spider',
  cave_spider: 'parrot.imitate.cave_spider',
  enderman: 'parrot.imitate.enderman',
  blaze: 'parrot.imitate.blaze',
  ghast: 'parrot.imitate.ghast',
  magma_cube: 'parrot.imitate.magma_cube',
  witch: 'parrot.imitate.witch',
  phantom: 'parrot.imitate.phantom',
};

export function imitateSound(id: HostileId): string {
  return IMITATE_SOUND[id];
}

export const IMITATE_INTERVAL_MIN_TICKS = 30;
export const IMITATE_INTERVAL_MAX_TICKS = 70;

export function shouldImitateThisTick(ticksSinceLast: number, rng: () => number): boolean {
  if (ticksSinceLast < IMITATE_INTERVAL_MIN_TICKS) return false;
  if (ticksSinceLast >= IMITATE_INTERVAL_MAX_TICKS) return true;
  return rng() < 0.5;
}
