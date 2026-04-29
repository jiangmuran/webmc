// Goat horn — 8 tonal variants. Per wiki: 4 are obtained by getting
// rammed by a screaming goat (admire, call, yearn, dream); 4 are
// found in Ancient City chests (ponder, sing, seek, feel). Blowing
// the horn plays a sound + pulses nearby raid villagers.

export type HornVariant =
  | 'ponder'
  | 'sing'
  | 'seek'
  | 'feel'
  | 'admire'
  | 'call'
  | 'yearn'
  | 'dream';

export interface HornDef {
  variant: HornVariant;
  pitchHz: number;
  durationSec: number;
  rangeBlocks: number;
}

// Tones are approximately major triad notes.
export const HORN_DEFS: Record<HornVariant, HornDef> = {
  ponder: { variant: 'ponder', pitchHz: 261.63, durationSec: 7, rangeBlocks: 256 },
  sing: { variant: 'sing', pitchHz: 329.63, durationSec: 7, rangeBlocks: 256 },
  seek: { variant: 'seek', pitchHz: 392.0, durationSec: 7, rangeBlocks: 256 },
  feel: { variant: 'feel', pitchHz: 523.25, durationSec: 7, rangeBlocks: 256 },
  admire: { variant: 'admire', pitchHz: 659.25, durationSec: 7, rangeBlocks: 256 },
  call: { variant: 'call', pitchHz: 783.99, durationSec: 7, rangeBlocks: 256 },
  yearn: { variant: 'yearn', pitchHz: 1046.5, durationSec: 7, rangeBlocks: 256 },
  dream: { variant: 'dream', pitchHz: 207.65, durationSec: 7, rangeBlocks: 256 },
};

const COOLDOWN_SEC = 7;

export interface HornState {
  cooldownSec: number;
}

export function makeHornState(): HornState {
  return { cooldownSec: 0 };
}

export interface BlowResult {
  played: boolean;
  variant?: HornVariant;
}

export function blowHorn(state: HornState, variant: HornVariant): BlowResult {
  if (state.cooldownSec > 0) return { played: false };
  state.cooldownSec = COOLDOWN_SEC;
  return { played: true, variant };
}

export function tickHorn(state: HornState, dtSec: number): void {
  state.cooldownSec = Math.max(0, state.cooldownSec - dtSec);
}
