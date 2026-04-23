// Hostile mob equipment roll at spawn (zombies, skeletons). Chance +
// material tier driven by local difficulty.

export type MobEquipSlot = 'mainhand' | 'helmet' | 'chestplate' | 'leggings' | 'boots';

export interface EquipCtx {
  localDifficulty: number;
  rand: () => number;
  isBaby: boolean;
  mobType: 'zombie' | 'skeleton' | 'husk' | 'stray' | 'bogged' | 'wither_skeleton';
}

const SLOT_CHANCES: Record<MobEquipSlot, number> = {
  mainhand: 0.15,
  helmet: 0.04,
  chestplate: 0.03,
  leggings: 0.025,
  boots: 0.02,
};

export function rollEquipment(c: EquipCtx): Record<MobEquipSlot, string | null> {
  const r: Record<MobEquipSlot, string | null> = {
    mainhand: null,
    helmet: null,
    chestplate: null,
    leggings: null,
    boots: null,
  };
  for (const slot of Object.keys(SLOT_CHANCES) as MobEquipSlot[]) {
    const chance = SLOT_CHANCES[slot] * (1 + c.localDifficulty * 0.1);
    if (c.rand() < chance) r[slot] = pickMaterial(slot, c);
  }
  return r;
}

function pickMaterial(slot: MobEquipSlot, c: EquipCtx): string {
  const tier = tierByDifficulty(c.localDifficulty, c.rand);
  if (slot === 'mainhand') return tier + '_sword';
  return tier + '_' + slotName(slot);
}

function tierByDifficulty(d: number, rand: () => number): string {
  const r = rand();
  if (d > 4) return r < 0.3 ? 'diamond' : r < 0.7 ? 'iron' : 'chainmail';
  if (d > 2) return r < 0.5 ? 'iron' : 'chainmail';
  return r < 0.3 ? 'chainmail' : 'leather';
}

function slotName(slot: MobEquipSlot): string {
  return slot;
}
