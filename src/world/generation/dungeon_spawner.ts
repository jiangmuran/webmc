export type DungeonMob = 'zombie' | 'skeleton' | 'spider';

export const MOB_WEIGHTS: Record<DungeonMob, number> = {
  zombie: 50,
  skeleton: 25,
  spider: 25,
};

export function pickMob(rng: () => number): DungeonMob {
  const total = Object.values(MOB_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  const entries: DungeonMob[] = ['zombie', 'skeleton', 'spider'];
  for (const m of entries) {
    roll -= MOB_WEIGHTS[m];
    if (roll <= 0) return m;
  }
  return 'zombie';
}

export function chestsCount(rng: () => number): number {
  if (rng() < 0.5) return 1;
  if (rng() < 0.5) return 2;
  return 0;
}
