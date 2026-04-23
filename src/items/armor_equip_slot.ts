export type Slot = 'helmet' | 'chestplate' | 'leggings' | 'boots';

const BY_SUFFIX: Record<string, Slot> = {
  helmet: 'helmet',
  cap: 'helmet',
  chestplate: 'chestplate',
  tunic: 'chestplate',
  leggings: 'leggings',
  pants: 'leggings',
  boots: 'boots',
};

export function slotForItem(id: string): Slot | undefined {
  for (const suffix of Object.keys(BY_SUFFIX)) {
    if (id.endsWith(suffix)) return BY_SUFFIX[suffix];
  }
  return undefined;
}

export function autoEquipOnRightClick(slotBefore: unknown): boolean {
  return slotBefore === undefined;
}
