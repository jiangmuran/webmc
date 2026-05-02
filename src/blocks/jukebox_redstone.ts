// Jukebox emits comparator signal based on which disc is playing.
//
// Wiki (minecraft.wiki/w/Music_Disc#Comparator_signals): comparator
// output is unique per legacy disc (1–15), but newer 1.21 discs share
// signal slots with older discs. Old table only listed the 15 legacy
// discs; the four 1.21 additions (relic, precipice, creator,
// creator_music_box) returned 0, so a comparator next to a jukebox
// playing relic silently read "no disc". Sibling
// jukebox_music_disc_play.ts already has the 1.21 entries; bringing
// this copy into line.

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
  music_disc_creator_music_box: 11,
  music_disc_wait: 12,
  music_disc_creator: 12,
  music_disc_pigstep: 13,
  music_disc_precipice: 13,
  music_disc_otherside: 14,
  music_disc_relic: 14,
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
