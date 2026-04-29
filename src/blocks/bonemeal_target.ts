// Bonemeal targets: grows plant / spreads grass / accelerates crop.

export type BoneTarget =
  | { kind: 'crop'; cropId: string; age: number; maxAge: number }
  | { kind: 'sapling'; treeType: string; stage: number }
  | { kind: 'grass_block' }
  | { kind: 'mushroom'; huge: boolean }
  | { kind: 'kelp_or_seagrass' }
  | { kind: 'azalea' }
  | { kind: 'none' };

export function accepts(t: BoneTarget): boolean {
  return t.kind !== 'none';
}

export function advanceCrop(t: BoneTarget, rand: () => number): BoneTarget {
  if (t.kind !== 'crop') return t;
  // Wiki: bone meal advances crops by 1-5 stages randomly. Was 2-5
  // (`2 + floor(rand() * 4)`) — missing the 1-stage minimum.
  const stepped = Math.min(t.maxAge, t.age + 1 + Math.floor(rand() * 5));
  return { ...t, age: stepped };
}

export function advanceSapling(t: BoneTarget): BoneTarget {
  if (t.kind !== 'sapling') return t;
  return { ...t, stage: Math.min(1, t.stage + 1) };
}

export function bonemealStackCost(): number {
  return 1;
}
