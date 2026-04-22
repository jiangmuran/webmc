import { describe, it, expect } from 'vitest';
import { ItemRegistry } from './item';
import { RecipeRegistry } from './recipe';
import { registerDefaultRecipes } from './default-recipes';

// Names referenced by default-recipes that must all be registerable. We
// register them with arbitrary stats here — real values come from the
// actual block/item loaders in main.ts.
const NAMES = [
  'webmc:oak_log',
  'webmc:oak_planks',
  'webmc:stick',
  'webmc:crafting_table',
  'webmc:furnace',
  'webmc:chest',
  'webmc:cobblestone',
  'webmc:coal',
  'webmc:torch',
  'webmc:wood_pickaxe',
  'webmc:stone_pickaxe',
  'webmc:iron_pickaxe',
  'webmc:gold_pickaxe',
  'webmc:diamond_pickaxe',
  'webmc:wood_sword',
  'webmc:stone_sword',
  'webmc:iron_sword',
  'webmc:diamond_sword',
  'webmc:iron_axe',
  'webmc:iron_shovel',
  'webmc:iron_ingot',
  'webmc:gold_ingot',
  'webmc:diamond',
  'webmc:wheat',
  'webmc:bread',
  'webmc:cocoa_beans',
  'webmc:cookie',
  'webmc:milk_bucket',
  'webmc:egg',
  'webmc:sugar',
  'webmc:cake',
  'webmc:glass',
  'webmc:glass_pane',
  'webmc:ladder',
  'webmc:wool_white',
  'webmc:bed',
  'webmc:book',
  'webmc:bookshelf',
  'webmc:paper',
  'webmc:leather',
  'webmc:sugar_cane',
  'webmc:iron_nugget',
  'webmc:iron_block',
  'webmc:gold_block',
  'webmc:diamond_block',
  'webmc:bow',
  'webmc:string',
  'webmc:flint',
  'webmc:feather',
  'webmc:arrow',
  'webmc:gunpowder',
  'webmc:sand',
  'webmc:tnt',
  'webmc:shield',
];

describe('default-recipes', () => {
  it('registers at least 30 recipes when all items exist', () => {
    const items = new ItemRegistry();
    for (const n of NAMES) {
      items.register({ name: n, maxStack: 64, durability: 0 });
    }
    const recipes = new RecipeRegistry();
    const count = registerDefaultRecipes(items, recipes);
    expect(count).toBeGreaterThanOrEqual(30);
    expect(recipes.all().length).toBe(count);
  });

  it('silently skips recipes referencing unknown items', () => {
    const items = new ItemRegistry();
    items.register({ name: 'webmc:oak_log', maxStack: 64, durability: 0 });
    items.register({ name: 'webmc:oak_planks', maxStack: 64, durability: 0 });
    const recipes = new RecipeRegistry();
    const count = registerDefaultRecipes(items, recipes);
    expect(count).toBeGreaterThanOrEqual(1); // at least the log→planks works
  });
});
