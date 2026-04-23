// Jukebox emits comparator signal based on which disc is playing.

export const DISC_SIGNAL_VALUES: Record<string, number> = {
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
};

export function comparatorSignal(discId: string | null): number {
  if (!discId) return 0;
  return DISC_SIGNAL_VALUES[discId] ?? 0;
}

export function canInsertDisc(currentDisc: string | null): boolean {
  return currentDisc === null;
}

export function ejectDisc(): { item: 'music_disc'; stopsMusic: true } {
  return { item: 'music_disc', stopsMusic: true };
}
