export const MUSIC_DISC_IDS = [
  'music_disc_13',
  'music_disc_cat',
  'music_disc_blocks',
  'music_disc_chirp',
  'music_disc_far',
  'music_disc_mall',
  'music_disc_mellohi',
  'music_disc_stal',
  'music_disc_strad',
  'music_disc_ward',
  'music_disc_11',
  'music_disc_wait',
  'music_disc_otherside',
  'music_disc_pigstep',
  'music_disc_5',
  'music_disc_relic',
  'music_disc_creator',
  'music_disc_creator_music_box',
  'music_disc_precipice',
] as const;

export type MusicDiscId = (typeof MUSIC_DISC_IDS)[number];

export function isMusicDisc(id: string): id is MusicDiscId {
  return (MUSIC_DISC_IDS as readonly string[]).includes(id);
}

export const DISC_DURATION_TICKS: Record<MusicDiscId, number> = {
  music_disc_13: 3556,
  music_disc_cat: 3737,
  music_disc_blocks: 6900,
  music_disc_chirp: 3700,
  music_disc_far: 3480,
  music_disc_mall: 3970,
  music_disc_mellohi: 1920,
  music_disc_stal: 3000,
  music_disc_strad: 3740,
  music_disc_ward: 5040,
  music_disc_11: 1410,
  music_disc_wait: 4560,
  music_disc_otherside: 3900,
  music_disc_pigstep: 2960,
  music_disc_5: 3548,
  music_disc_relic: 4396,
  music_disc_creator: 3180,
  music_disc_creator_music_box: 1480,
  music_disc_precipice: 6036,
};

export function durationForDisc(id: MusicDiscId): number {
  return DISC_DURATION_TICKS[id];
}
