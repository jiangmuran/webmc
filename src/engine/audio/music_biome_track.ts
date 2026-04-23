export type Biome =
  | 'overworld_day'
  | 'overworld_night'
  | 'underwater'
  | 'nether'
  | 'end'
  | 'end_boss'
  | 'creative'
  | 'menu';

const TRACKS: Record<Biome, readonly string[]> = {
  overworld_day: ['music.overworld.calm1', 'music.overworld.calm2', 'music.overworld.calm3'],
  overworld_night: ['music.overworld.night1', 'music.overworld.night2'],
  underwater: ['music.underwater.1', 'music.underwater.2'],
  nether: ['music.nether.1', 'music.nether.2', 'music.nether.crimson_forest'],
  end: ['music.end.1', 'music.end.2'],
  end_boss: ['music.end.boss_fight'],
  creative: ['music.creative.1', 'music.creative.2'],
  menu: ['music.menu.menu1', 'music.menu.menu2'],
};

export function pickTrack(biome: Biome, rng: () => number): string {
  const list = TRACKS[biome];
  const i = Math.floor(rng() * list.length);
  return list[i] ?? list[0] ?? '';
}

export interface MusicState {
  currentBiome?: Biome;
  nextPlayAtMs: number;
}

export const MIN_INTERVAL_MS = 20 * 1000;
export const MAX_INTERVAL_MS = 120 * 1000;

export function nextInterval(rng: () => number): number {
  return MIN_INTERVAL_MS + Math.floor(rng() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS));
}
