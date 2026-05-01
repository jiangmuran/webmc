export type Instrument =
  | 'harp'
  | 'bass'
  | 'snare'
  | 'hat'
  | 'basedrum'
  | 'bell'
  | 'flute'
  | 'chime'
  | 'guitar'
  | 'xylophone'
  | 'iron_xylophone'
  | 'cow_bell'
  | 'didgeridoo'
  | 'bit'
  | 'banjo'
  | 'pling'
  | 'trumpet';

// Wiki (minecraft.wiki/w/Note_Block): the instrument is determined by
// the block BELOW the note block (the block above must be air or
// non-solid for the block to play). Old name `instrumentForBlockAbove`
// inverted the relationship in the API surface; kept the alias for
// backward compatibility. Old BY_BLOCK exact-match table missed every
// real game block name (e.g. "wood" doesn't exist — it's "oak_wood",
// "spruce_wood", etc.), so the function returned harp for everything.
// Now delegates to noteblock_pitch.instrumentForBelow which handles
// the full wiki classification by family.
import { instrumentForBelow } from './noteblock_pitch';

export function instrumentForBlockBelow(block: string): Instrument {
  return instrumentForBelow(block) as Instrument;
}

/** @deprecated Wiki: instrument is selected by the block BELOW.
 * Use {@link instrumentForBlockBelow}. */
export function instrumentForBlockAbove(block: string): Instrument {
  return instrumentForBlockBelow(block);
}

export function notePitch(note: number): number {
  const n = Math.max(0, Math.min(24, note));
  return Math.pow(2, (n - 12) / 12);
}
