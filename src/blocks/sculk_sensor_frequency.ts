export type GameEvent =
  | 'step'
  | 'projectile_land'
  | 'block_place'
  | 'block_destroy'
  | 'container_open'
  | 'drink'
  | 'eat'
  | 'swim'
  | 'mob_interact'
  | 'explode'
  | 'lightning_strike'
  | 'entity_die'
  | 'equip';

export const FREQUENCY: Record<GameEvent, number> = {
  step: 1,
  projectile_land: 2,
  swim: 4,
  container_open: 6,
  drink: 7,
  eat: 8,
  equip: 9,
  block_destroy: 11,
  block_place: 12,
  mob_interact: 13,
  explode: 14,
  lightning_strike: 15,
  entity_die: 15,
};

export const COOLDOWN_TICKS = 40;
export const SIGNAL_RADIUS = 8;

export function redstoneSignalForEvent(e: GameEvent): number {
  return FREQUENCY[e];
}
