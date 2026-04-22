// Recipe unlock events. Collecting certain items unlocks derived
// recipes in the recipe book. E.g. picking up wood unlocks planks;
// planks unlocks crafting table; etc.

const TRIGGERS: Record<string, string[]> = {
  'webmc:oak_log': ['planks'],
  'webmc:oak_planks': ['crafting_table', 'wooden_pickaxe', 'wooden_sword', 'sticks'],
  'webmc:stick': ['torch', 'wooden_pickaxe'],
  'webmc:cobblestone': ['stone_pickaxe', 'furnace', 'stone_sword'],
  'webmc:furnace': ['iron_ingot_smelt'],
  'webmc:iron_ingot': ['iron_pickaxe', 'iron_sword', 'shears', 'bucket'],
  'webmc:diamond': ['diamond_pickaxe', 'diamond_sword'],
  'webmc:redstone': ['torch_redstone', 'repeater', 'piston'],
  'webmc:blaze_rod': ['brewing_stand', 'eye_of_ender'],
};

export function unlocksFromItem(itemId: string): string[] {
  return TRIGGERS[itemId] ?? [];
}

export class RecipeBookState {
  readonly unlocked = new Set<string>();

  pickup(itemId: string): string[] {
    const triggered = unlocksFromItem(itemId);
    const newlyUnlocked: string[] = [];
    for (const r of triggered) {
      if (!this.unlocked.has(r)) {
        this.unlocked.add(r);
        newlyUnlocked.push(r);
      }
    }
    return newlyUnlocked;
  }

  isUnlocked(r: string): boolean {
    return this.unlocked.has(r);
  }

  get size(): number {
    return this.unlocked.size;
  }
}
