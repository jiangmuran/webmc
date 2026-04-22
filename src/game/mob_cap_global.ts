// World-level mob cap. Caps total mobs per category across the
// server. When over cap, block spawn attempts of that category.

export type Category = 'hostile' | 'passive' | 'ambient' | 'water' | 'water_ambient' | 'misc';

export interface WorldMobState {
  byCat: Map<Category, number>;
}

export const WORLD_CAPS: Record<Category, number> = {
  hostile: 70,
  passive: 10,
  ambient: 15,
  water: 5,
  water_ambient: 20,
  misc: Infinity,
};

export function makeMobState(): WorldMobState {
  return { byCat: new Map() };
}

export function canSpawn(s: WorldMobState, cat: Category): boolean {
  const current = s.byCat.get(cat) ?? 0;
  return current < WORLD_CAPS[cat];
}

export function onSpawn(s: WorldMobState, cat: Category): void {
  s.byCat.set(cat, (s.byCat.get(cat) ?? 0) + 1);
}

export function onDespawn(s: WorldMobState, cat: Category): void {
  s.byCat.set(cat, Math.max(0, (s.byCat.get(cat) ?? 0) - 1));
}

export function currentCount(s: WorldMobState, cat: Category): number {
  return s.byCat.get(cat) ?? 0;
}
