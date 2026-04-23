export interface DispenseCtx {
  itemId: string;
  targetEntity?: 'player' | 'armor_stand' | 'horse';
  targetWearsSlot: 'helmet' | 'chestplate' | 'leggings' | 'boots' | undefined;
}

export function equipsInsteadOfEjects(c: DispenseCtx): boolean {
  if (!c.targetEntity) return false;
  if (c.targetWearsSlot) return false;
  return (
    c.itemId.endsWith('_helmet') ||
    c.itemId.endsWith('_chestplate') ||
    c.itemId.endsWith('_leggings') ||
    c.itemId.endsWith('_boots')
  );
}

export function shearWaterBucketPlaces(c: DispenseCtx): boolean {
  return c.itemId === 'water_bucket';
}
