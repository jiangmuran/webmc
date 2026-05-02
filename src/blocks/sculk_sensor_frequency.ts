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

// Wiki (minecraft.wiki/w/Vibration): vibration frequency table for
// sculk sensors. Most of the old values were drifted by 1-9: swim=4
// (wiki: 1), container_open=6 (wiki: 10), drink=7 (wiki: 8),
// equip=9 (wiki: 5), block_destroy=11 (wiki: 12), block_place=12
// (wiki: 13), mob_interact=13 (wiki: entity_interact=6), explode=14
// (wiki: 15), lightning_strike=15 (wiki: 14). With the wrong table
// any redstone circuit gating off "container_open" was reading 6
// when the real signal is 10 — wiring would silently miscompare.
export const FREQUENCY: Record<GameEvent, number> = {
  step: 1,
  swim: 1,
  projectile_land: 2,
  equip: 5,
  mob_interact: 6,
  drink: 8,
  eat: 8,
  container_open: 10,
  block_destroy: 12,
  block_place: 13,
  lightning_strike: 14,
  explode: 15,
  entity_die: 15,
};

// Wiki: "When the signal arrives, the sensor is activated for 30
// game ticks (1.5 seconds)." Old constant was 40 (2.0s).
export const COOLDOWN_TICKS = 30;
export const SIGNAL_RADIUS = 8;

export function redstoneSignalForEvent(e: GameEvent): number {
  return FREQUENCY[e];
}
