// Jukebox. Insert a music disc → plays once (3-6 minutes). Emits
// level-15 redstone via comparator while playing. Popping the disc
// stops playback and ejects as item entity.

export type MusicDisc =
  | 'webmc:music_disc_13'
  | 'webmc:music_disc_cat'
  | 'webmc:music_disc_blocks'
  | 'webmc:music_disc_chirp'
  | 'webmc:music_disc_far'
  | 'webmc:music_disc_mall'
  | 'webmc:music_disc_mellohi'
  | 'webmc:music_disc_stal'
  | 'webmc:music_disc_strad'
  | 'webmc:music_disc_ward'
  | 'webmc:music_disc_11'
  | 'webmc:music_disc_wait'
  | 'webmc:music_disc_pigstep'
  | 'webmc:music_disc_otherside'
  | 'webmc:music_disc_5';

const DURATIONS_SEC: Record<MusicDisc, number> = {
  'webmc:music_disc_13': 178,
  'webmc:music_disc_cat': 185,
  'webmc:music_disc_blocks': 345,
  'webmc:music_disc_chirp': 185,
  'webmc:music_disc_far': 174,
  'webmc:music_disc_mall': 197,
  'webmc:music_disc_mellohi': 96,
  'webmc:music_disc_stal': 150,
  'webmc:music_disc_strad': 188,
  'webmc:music_disc_ward': 251,
  'webmc:music_disc_11': 71,
  'webmc:music_disc_wait': 238,
  'webmc:music_disc_pigstep': 148,
  'webmc:music_disc_otherside': 195,
  'webmc:music_disc_5': 178,
};

export interface Jukebox {
  disc: MusicDisc | null;
  playingUntilMs: number;
}

export function makeJukebox(): Jukebox {
  return { disc: null, playingUntilMs: 0 };
}

export function insert(j: Jukebox, disc: MusicDisc, nowMs: number): boolean {
  if (j.disc !== null) return false;
  j.disc = disc;
  j.playingUntilMs = nowMs + DURATIONS_SEC[disc] * 1000;
  return true;
}

export function eject(j: Jukebox): MusicDisc | null {
  const d = j.disc;
  j.disc = null;
  j.playingUntilMs = 0;
  return d;
}

export function isPlaying(j: Jukebox, nowMs: number): boolean {
  return j.disc !== null && nowMs < j.playingUntilMs;
}

// Wiki (minecraft.wiki/w/Jukebox + per-disc pages): the comparator
// reads a disc-specific value, not a flat 15. Canonical values:
//   "13" → 1, cat → 2, blocks → 3, chirp → 4, far → 5,
//   mall → 6, mellohi → 7, stal → 8, strad → 9, ward → 10,
//   "11" → 11, wait → 12, pigstep → 13, otherside → 14, "5" → 15.
// Old `15 if playing else 0` made every disc indistinguishable to
// redstone — circuits gating off `disc == "13"` couldn't work.
// Sibling jukebox.ts already had per-disc comparator values.
const COMPARATOR_VALUES: Record<MusicDisc, number> = {
  'webmc:music_disc_13': 1,
  'webmc:music_disc_cat': 2,
  'webmc:music_disc_blocks': 3,
  'webmc:music_disc_chirp': 4,
  'webmc:music_disc_far': 5,
  'webmc:music_disc_mall': 6,
  'webmc:music_disc_mellohi': 7,
  'webmc:music_disc_stal': 8,
  'webmc:music_disc_strad': 9,
  'webmc:music_disc_ward': 10,
  'webmc:music_disc_11': 11,
  'webmc:music_disc_wait': 12,
  'webmc:music_disc_pigstep': 13,
  'webmc:music_disc_otherside': 14,
  'webmc:music_disc_5': 15,
};

export function comparatorOutput(j: Jukebox, nowMs: number): number {
  if (!isPlaying(j, nowMs) || j.disc === null) return 0;
  return COMPARATOR_VALUES[j.disc];
}
