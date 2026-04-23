export interface Jukebox {
  disc?: string;
  playingSinceTick: number;
}

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
  music_disc_pigstep: 2520,
  music_disc_otherside: 3920,
  music_disc_5: 3580,
  music_disc_relic: 4180,
  music_disc_precipice: 5980,
  music_disc_creator: 3600,
};

export function shouldStop(j: Jukebox, nowTick: number): boolean {
  if (!j.disc) return false;
  const dur = DISC_DURATION_TICKS[j.disc];
  if (dur === undefined) return false;
  return nowTick - j.playingSinceTick >= dur;
}

export function comparatorOutputForDisc(j: Jukebox): number {
  if (!j.disc) return 0;
  const idx = Object.keys(DISC_DURATION_TICKS).indexOf(j.disc);
  return Math.max(0, Math.min(15, idx + 1));
}
