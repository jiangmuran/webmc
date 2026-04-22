// Sculk sensor vibration frequency table. Every game event maps to a
// frequency 1..15; the sensor emits that redstone power when activated.
// Calibrated sculk sensors filter by matching the frequency of the
// comparator input on their side.

export type VibrationEvent =
  | 'step'
  | 'swim'
  | 'fly'
  | 'hit_ground'
  | 'splash'
  | 'wolf_howl'
  | 'armor_stand'
  | 'projectile_land'
  | 'eat'
  | 'elytra_glide'
  | 'container_close'
  | 'block_change'
  | 'block_destroy'
  | 'fluid_pickup'
  | 'fluid_place'
  | 'container_open'
  | 'piston_extend'
  | 'piston_contract'
  | 'block_place'
  | 'entity_place'
  | 'shear'
  | 'instrument_play'
  | 'lightning_strike'
  | 'explode'
  | 'note_play';

export const FREQUENCY: Record<VibrationEvent, number> = {
  step: 1,
  swim: 1,
  fly: 1,
  hit_ground: 2,
  splash: 2,
  wolf_howl: 3,
  armor_stand: 4,
  projectile_land: 4,
  eat: 5,
  elytra_glide: 6,
  container_close: 7,
  block_change: 8,
  block_destroy: 8,
  fluid_pickup: 9,
  fluid_place: 9,
  container_open: 10,
  piston_extend: 10,
  piston_contract: 10,
  block_place: 11,
  entity_place: 12,
  shear: 13,
  instrument_play: 13,
  lightning_strike: 14,
  explode: 15,
  note_play: 15,
};

export function frequencyOf(event: VibrationEvent): number {
  return FREQUENCY[event];
}

// Calibrated sensor: fires only if the incoming vibration matches the
// signal on its "filter" side (0..15 comparator input).
export interface CalibratedQuery {
  event: VibrationEvent;
  filterSignal: number;
}

export function calibratedMatches(q: CalibratedQuery): boolean {
  return frequencyOf(q.event) === q.filterSignal;
}
