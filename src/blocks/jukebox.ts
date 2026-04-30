// Jukebox + music discs. The block holds one disc at a time and plays it
// when inserted; emits a comparator signal equal to the disc's ordinal.

export type MusicDiscId =
  | 'thirteen'
  | 'cat'
  | 'blocks'
  | 'chirp'
  | 'far'
  | 'mall'
  | 'mellohi'
  | 'stal'
  | 'strad'
  | 'ward'
  | 'eleven'
  | 'wait'
  | 'pigstep'
  | 'otherside'
  | 'five'
  | 'relic';

export interface MusicDiscDef {
  id: MusicDiscId;
  displayName: string;
  durationSec: number;
  comparatorValue: number; // 1..15
}

// Wiki (minecraft.wiki/w/Music_Disc and per-disc pages): the
// canonical comparator values are
//   "13" → 1, cat → 2, blocks → 3, chirp → 4, far → 5,
//   mall → 6, mellohi → 7, stal → 8, strad → 9, ward → 10,
//   "11" → 11, wait → 12, pigstep → 13, otherside → 14, "5" → 15.
// Newer discs (Relic, Lava Chicken, etc.) reuse existing values
// per their wiki pages — Relic's signal is 14 (not 1) per the
// Music_Disc_Relic page and the 26.1 update line.
//
// Old table was missing the canonical "13" disc entirely AND
// gave Relic the comparator value 1 that "13" should hold —
// any redstone circuit gating off "signal == 1" was firing on
// Relic when the wiki says it should fire on "13".
export const MUSIC_DISCS: Record<MusicDiscId, MusicDiscDef> = {
  thirteen: { id: 'thirteen', displayName: 'C418 - 13', durationSec: 178, comparatorValue: 1 },
  cat: { id: 'cat', displayName: 'C418 - cat', durationSec: 185, comparatorValue: 2 },
  blocks: { id: 'blocks', displayName: 'C418 - blocks', durationSec: 345, comparatorValue: 3 },
  chirp: { id: 'chirp', displayName: 'C418 - chirp', durationSec: 185, comparatorValue: 4 },
  far: { id: 'far', displayName: 'C418 - far', durationSec: 174, comparatorValue: 5 },
  mall: { id: 'mall', displayName: 'C418 - mall', durationSec: 197, comparatorValue: 6 },
  mellohi: { id: 'mellohi', displayName: 'C418 - mellohi', durationSec: 96, comparatorValue: 7 },
  stal: { id: 'stal', displayName: 'C418 - stal', durationSec: 150, comparatorValue: 8 },
  strad: { id: 'strad', displayName: 'C418 - strad', durationSec: 188, comparatorValue: 9 },
  ward: { id: 'ward', displayName: 'C418 - ward', durationSec: 251, comparatorValue: 10 },
  eleven: { id: 'eleven', displayName: 'C418 - 11', durationSec: 71, comparatorValue: 11 },
  wait: { id: 'wait', displayName: 'C418 - wait', durationSec: 237, comparatorValue: 12 },
  pigstep: {
    id: 'pigstep',
    displayName: 'Lena Raine - Pigstep',
    durationSec: 149,
    comparatorValue: 13,
  },
  otherside: {
    id: 'otherside',
    displayName: 'Lena Raine - otherside',
    durationSec: 195,
    comparatorValue: 14,
  },
  // Wiki (minecraft.wiki/w/Music_Disc_5): 178 seconds (~2:58). Old
  // 36 was off by ~5×; sibling jukebox_music_disc_play.ts has the
  // correct duration.
  five: { id: 'five', displayName: 'Samuel Åberg - 5', durationSec: 178, comparatorValue: 15 },
  relic: {
    id: 'relic',
    displayName: 'Aaron Cherof - Relic',
    durationSec: 218,
    comparatorValue: 14,
  },
};

export interface JukeboxState {
  disc: MusicDiscId | null;
  playbackSec: number;
}

export function makeJukebox(): JukeboxState {
  return { disc: null, playbackSec: 0 };
}

export function insertDisc(state: JukeboxState, disc: MusicDiscId): boolean {
  if (state.disc !== null) return false;
  state.disc = disc;
  state.playbackSec = 0;
  return true;
}

export function ejectDisc(state: JukeboxState): MusicDiscId | null {
  const d = state.disc;
  state.disc = null;
  state.playbackSec = 0;
  return d;
}

export function tickJukebox(state: JukeboxState, dtSec: number): boolean {
  if (!state.disc) return false;
  state.playbackSec += dtSec;
  const def = MUSIC_DISCS[state.disc];
  if (state.playbackSec >= def.durationSec) {
    state.disc = null;
    state.playbackSec = 0;
    return true; // finished
  }
  return false;
}

export function comparatorOutput(state: JukeboxState): number {
  if (!state.disc) return 0;
  return MUSIC_DISCS[state.disc].comparatorValue;
}
