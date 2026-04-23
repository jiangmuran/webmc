// Smelting XP. Each recipe has a small XP reward; accumulated on the
// furnace until a player collects output.

export interface SmeltRecipe {
  input: string;
  output: string;
  xp: number;
  cookTicks: number;
}

const TABLE: Record<string, SmeltRecipe> = {
  iron_ore: { input: 'iron_ore', output: 'iron_ingot', xp: 0.7, cookTicks: 200 },
  gold_ore: { input: 'gold_ore', output: 'gold_ingot', xp: 1.0, cookTicks: 200 },
  diamond_ore: { input: 'diamond_ore', output: 'diamond', xp: 1.0, cookTicks: 200 },
  raw_beef: { input: 'raw_beef', output: 'cooked_beef', xp: 0.35, cookTicks: 200 },
  raw_chicken: { input: 'raw_chicken', output: 'cooked_chicken', xp: 0.35, cookTicks: 200 },
  sand: { input: 'sand', output: 'glass', xp: 0.1, cookTicks: 200 },
  cactus: { input: 'cactus', output: 'green_dye', xp: 1.0, cookTicks: 200 },
};

export function lookup(id: string): SmeltRecipe | null {
  return TABLE[id] ?? null;
}

export function accumulateXp(bank: number, recipe: SmeltRecipe, items: number): number {
  return bank + recipe.xp * items;
}

export function xpOrbsFromBank(bank: number): number {
  return Math.floor(bank);
}

export function canSmelt(input: string): boolean {
  return TABLE[input] !== undefined;
}
