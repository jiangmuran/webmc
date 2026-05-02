export interface Jukebox {
  disc?: string;
  playingSinceTick: number;
}

// Wiki (minecraft.wiki/w/Music_Disc, table column "Length"):
//   pigstep 2:28, relic 3:39, creator 2:56 — the old values
//   were 2520/4180/3600 ticks (126/209/180 s), the first two
//   way too short. Aligned to canonical lengths × 20 ticks/s.
export const DISC_DURATION_TICKS: Record<string, number> = {
  music_disc_13: 3560,
  music_disc_cat: 3700,
  music_disc_blocks: 6920,
  music_disc_chirp: 3700,
  music_disc_far: 3500,
  music_disc_mall: 3940,
  music_disc_mellohi: 1940,
  music_disc_stal: 3000,
  music_disc_strad: 3760,
  music_disc_ward: 5040,
  music_disc_11: 1420,
  music_disc_wait: 4760,
  music_disc_pigstep: 2960,
  music_disc_otherside: 3920,
  music_disc_5: 3580,
  music_disc_relic: 4380,
  music_disc_precipice: 5980,
  music_disc_creator: 3520,
};

export function shouldStop(j: Jukebox, nowTick: number): boolean {
  if (!j.disc) return false;
  const dur = DISC_DURATION_TICKS[j.disc];
  if (dur === undefined) return false;
  return nowTick - j.playingSinceTick >= dur;
}

// Wiki (per-disc pages on minecraft.wiki): each music disc has a
// fixed comparator value, NOT an index-derived one. The classic
// 15 discs follow a 1..15 sequence (13 → 1, ..., 5 → 15) but the
// newer Relic/Precipice/Creator discs reuse existing slots:
//   minecraft.wiki/w/Music_Disc_Relic     → 14
//   minecraft.wiki/w/Music_Disc_Precipice → 13
//   minecraft.wiki/w/Music_Disc_Creator   → 12
// Old code used `idx + 1` of the DISC_DURATION_TICKS map, which
// returned 16/17/18 (then clamped to 15) for relic/precipice/
// creator — every newer disc reported "5"-strength signal.
const COMPARATOR_VALUES: Record<string, number> = {
  music_disc_13: 1,
  music_disc_cat: 2,
  music_disc_blocks: 3,
  music_disc_chirp: 4,
  music_disc_far: 5,
  music_disc_mall: 6,
  music_disc_mellohi: 7,
  music_disc_stal: 8,
  music_disc_strad: 9,
  music_disc_ward: 10,
  music_disc_11: 11,
  music_disc_wait: 12,
  music_disc_pigstep: 13,
  music_disc_otherside: 14,
  music_disc_5: 15,
  music_disc_relic: 14,
  music_disc_precipice: 13,
  music_disc_creator: 12,
};

export function comparatorOutputForDisc(j: Jukebox): number {
  if (!j.disc) return 0;
  return COMPARATOR_VALUES[j.disc] ?? 0;
}
