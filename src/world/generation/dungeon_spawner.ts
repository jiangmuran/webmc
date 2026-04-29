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

// Wiki (minecraft.wiki/w/Dungeon): every dungeon contains 1 or 2
// chests (≈50/50). Old code allowed a 0-chest outcome, which doesn't
// exist in vanilla.
export function chestsCount(rng: () => number): number {
  return rng() < 0.5 ? 1 : 2;
}
