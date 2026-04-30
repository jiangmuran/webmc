// Fishing catch table. 3 pools: fish (85%), treasure (5%), junk (10%).
// Luck-of-the-sea rebalances; lure reduces wait time (not rolled here).

export interface CatchEntry {
  itemId: string;
  weight: number;
}

// Wiki (minecraft.wiki/w/Fishing#Catch_table): canonical weights are
// cod 60, salmon 25, pufferfish 13, tropical_fish 2 (total 100). Old
// pufferfish weight 2 was 1/6.5× the wiki value, making pufferfish
// essentially as rare as tropical fish — not vanilla.
export const FISH_POOL: CatchEntry[] = [
  { itemId: 'webmc:cod', weight: 60 },
  { itemId: 'webmc:salmon', weight: 25 },
  { itemId: 'webmc:pufferfish', weight: 13 },
  { itemId: 'webmc:tropical_fish', weight: 2 },
];

export const TREASURE_POOL: CatchEntry[] = [
  { itemId: 'webmc:bow_enchanted', weight: 1 },
  { itemId: 'webmc:fishing_rod_enchanted', weight: 1 },
  { itemId: 'webmc:name_tag', weight: 1 },
  { itemId: 'webmc:nautilus_shell', weight: 1 },
  { itemId: 'webmc:saddle', weight: 1 },
  { itemId: 'webmc:enchanted_book', weight: 1 },
];

export const JUNK_POOL: CatchEntry[] = [
  { itemId: 'webmc:bowl', weight: 10 },
  { itemId: 'webmc:bamboo', weight: 10 },
  { itemId: 'webmc:leather', weight: 10 },
  { itemId: 'webmc:leather_boots', weight: 10 },
  { itemId: 'webmc:lily_pad', weight: 17 },
  { itemId: 'webmc:rotten_flesh', weight: 10 },
  { itemId: 'webmc:stick', weight: 5 },
  { itemId: 'webmc:string', weight: 5 },
  { itemId: 'webmc:water_bottle', weight: 10 },
  { itemId: 'webmc:bone', weight: 10 },
  { itemId: 'webmc:ink_sac', weight: 1 },
  { itemId: 'webmc:tripwire_hook', weight: 10 },
];

export interface FishingQuery {
  luckOfTheSeaLevel: number;
  rand: () => number;
}

export function pickPool(q: FishingQuery): 'fish' | 'treasure' | 'junk' {
  const luck = q.luckOfTheSeaLevel;
  const treasureChance = 0.05 + luck * 0.02;
  const junkChance = Math.max(0, 0.1 - luck * 0.025);
  const r = q.rand();
  if (r < treasureChance) return 'treasure';
  if (r < treasureChance + junkChance) return 'junk';
  return 'fish';
}

export function pickFromPool(pool: CatchEntry[], rand: () => number): string | null {
  const total = pool.reduce((s, e) => s + e.weight, 0);
  if (total <= 0) return null;
  let r = rand() * total;
  for (const e of pool) {
    r -= e.weight;
    if (r <= 0) return e.itemId;
  }
  return pool[pool.length - 1]?.itemId ?? null;
}
