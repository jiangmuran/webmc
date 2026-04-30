// Smelting registry + furnace tick logic. Given a fuel + input slot + an
// output slot, tickFurnace advances smelt progress until it completes a
// recipe, consumes one input, and deposits the result in the output.
// Pure — the caller wires this to a furnace tile-entity.

import type { ItemStack } from './item';

export interface SmeltingRecipe {
  input: string; // item name
  output: string;
  cookSec: number; // usually 10 seconds
  experience: number; // XP reward when output collected
}

// Wiki (minecraft.wiki/w/Smelting): canonical furnace recipes with
// XP rewards. Earlier table missed:
//  - cod/salmon (used legacy 'raw_fish'/'cooked_fish' which aren't
//    registered in webmc — the recipe was dead),
//  - raw_iron / raw_gold / raw_copper (standard ore-mining path —
//    iron_ore drops raw_iron and that's what players smelt),
//  - emerald_ore, lapis_ore, redstone_ore, nether_gold_ore,
//    ancient_debris (all wiki-canonical smelting inputs).
export const SMELTING_RECIPES: readonly SmeltingRecipe[] = [
  // Foods
  { input: 'webmc:raw_beef', output: 'webmc:cooked_beef', cookSec: 10, experience: 0.35 },
  { input: 'webmc:raw_chicken', output: 'webmc:cooked_chicken', cookSec: 10, experience: 0.35 },
  { input: 'webmc:raw_porkchop', output: 'webmc:cooked_porkchop', cookSec: 10, experience: 0.35 },
  { input: 'webmc:raw_mutton', output: 'webmc:cooked_mutton', cookSec: 10, experience: 0.35 },
  { input: 'webmc:raw_rabbit', output: 'webmc:cooked_rabbit', cookSec: 10, experience: 0.35 },
  { input: 'webmc:cod', output: 'webmc:cooked_cod', cookSec: 10, experience: 0.35 },
  { input: 'webmc:salmon', output: 'webmc:cooked_salmon', cookSec: 10, experience: 0.35 },
  { input: 'webmc:potato', output: 'webmc:baked_potato', cookSec: 10, experience: 0.35 },
  // Raw metals (mining drop is raw, smelt to ingot).
  { input: 'webmc:raw_iron', output: 'webmc:iron_ingot', cookSec: 10, experience: 0.7 },
  { input: 'webmc:raw_gold', output: 'webmc:gold_ingot', cookSec: 10, experience: 1 },
  { input: 'webmc:raw_copper', output: 'webmc:copper_ingot', cookSec: 10, experience: 0.7 },
  // Ore blocks (silk-touch drop path).
  { input: 'webmc:iron_ore', output: 'webmc:iron_ingot', cookSec: 10, experience: 0.7 },
  { input: 'webmc:gold_ore', output: 'webmc:gold_ingot', cookSec: 10, experience: 1 },
  { input: 'webmc:copper_ore', output: 'webmc:copper_ingot', cookSec: 10, experience: 0.7 },
  // Wiki (minecraft.wiki/w/Smelting): diamond_ore → diamond gives 1.0
  // XP, the same as gold_ore → ingot. Old 1.3 was non-canonical.
  { input: 'webmc:diamond_ore', output: 'webmc:diamond', cookSec: 10, experience: 1 },
  { input: 'webmc:emerald_ore', output: 'webmc:emerald', cookSec: 10, experience: 1 },
  { input: 'webmc:lapis_ore', output: 'webmc:lapis_lazuli', cookSec: 10, experience: 0.2 },
  { input: 'webmc:redstone_ore', output: 'webmc:redstone', cookSec: 10, experience: 0.7 },
  { input: 'webmc:nether_quartz_ore', output: 'webmc:nether_quartz', cookSec: 10, experience: 0.2 },
  { input: 'webmc:nether_gold_ore', output: 'webmc:gold_nugget', cookSec: 10, experience: 1 },
  { input: 'webmc:ancient_debris', output: 'webmc:netherite_scrap', cookSec: 10, experience: 2 },
  // Stone family
  { input: 'webmc:cobblestone', output: 'webmc:stone', cookSec: 10, experience: 0.1 },
  { input: 'webmc:stone', output: 'webmc:smooth_stone', cookSec: 10, experience: 0.1 },
  { input: 'webmc:sand', output: 'webmc:glass', cookSec: 10, experience: 0.1 },
  { input: 'webmc:clay', output: 'webmc:terracotta', cookSec: 10, experience: 0.35 },
  { input: 'webmc:netherrack', output: 'webmc:nether_brick', cookSec: 10, experience: 0.1 },
];

export function findRecipe(inputName: string): SmeltingRecipe | null {
  for (const r of SMELTING_RECIPES) if (r.input === inputName) return r;
  return null;
}

// Fuel burn time in seconds (MC units scaled ×0.05 to real seconds).
export const FUEL_BURN_SEC: Record<string, number> = {
  'webmc:coal': 80,
  'webmc:charcoal': 80,
  'webmc:coal_block': 800,
  'webmc:oak_planks': 15,
  'webmc:oak_log': 15,
  'webmc:stick': 5,
  'webmc:lava_bucket': 1000,
  'webmc:blaze_rod': 120,
};

export function fuelBurnTime(itemName: string): number {
  return FUEL_BURN_SEC[itemName] ?? 0;
}

export interface FurnaceState {
  input: ItemStack | null;
  fuel: ItemStack | null;
  output: ItemStack | null;
  fuelRemainingSec: number;
  smeltProgressSec: number;
}

export function makeFurnace(): FurnaceState {
  return {
    input: null,
    fuel: null,
    output: null,
    fuelRemainingSec: 0,
    smeltProgressSec: 0,
  };
}

export interface TickContext {
  itemName: (itemId: number) => string;
  itemId: (name: string) => number | undefined;
  maxStack: (name: string) => number;
}

export function tickFurnace(state: FurnaceState, dtSec: number, ctx: TickContext): boolean {
  // No input → stop.
  if (!state.input) {
    state.smeltProgressSec = 0;
    return false;
  }
  const inputName = ctx.itemName(state.input.itemId);
  const recipe = findRecipe(inputName);
  if (!recipe) {
    state.smeltProgressSec = 0;
    return false;
  }
  // No room in output → stop.
  if (state.output) {
    const outName = ctx.itemName(state.output.itemId);
    if (outName !== recipe.output) return false;
    if (state.output.count >= ctx.maxStack(outName)) return false;
  }
  // Need fuel; consume a new piece if current burn ran out.
  if (state.fuelRemainingSec <= 0) {
    if (!state.fuel) return false;
    const fuelName = ctx.itemName(state.fuel.itemId);
    const burn = fuelBurnTime(fuelName);
    if (burn <= 0) return false;
    state.fuelRemainingSec = burn;
    state.fuel = state.fuel.count > 1 ? { ...state.fuel, count: state.fuel.count - 1 } : null;
  }
  // Burn fuel + advance smelt.
  state.fuelRemainingSec = Math.max(0, state.fuelRemainingSec - dtSec);
  state.smeltProgressSec += dtSec;
  if (state.smeltProgressSec < recipe.cookSec) return false;
  // Complete one smelt.
  const outputId = ctx.itemId(recipe.output);
  if (outputId === undefined) return false;
  if (state.output) {
    state.output = { ...state.output, count: state.output.count + 1 };
  } else {
    state.output = { itemId: outputId, count: 1, damage: 0 };
  }
  state.input = state.input.count > 1 ? { ...state.input, count: state.input.count - 1 } : null;
  state.smeltProgressSec = 0;
  return true;
}
