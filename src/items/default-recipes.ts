// Common crafting recipes registered into a RecipeRegistry. Names are
// resolved via an ItemRegistry at load time — pass in the registries and
// get a populated RecipeRegistry back.

import type { ItemRegistry } from './item';
import type { RecipeRegistry } from './recipe';

// Compact helper: (pattern rows, legend, output name, output count) → shaped.
function shaped(
  reg: RecipeRegistry,
  items: ItemRegistry,
  rows: readonly string[],
  legend: Record<string, string>,
  output: string,
  count = 1,
): boolean {
  const outId = items.byName(output);
  if (outId === undefined) return false;
  const resolved: Record<string, number> = {};
  for (const [ch, nm] of Object.entries(legend)) {
    const id = items.byName(nm);
    if (id === undefined) return false;
    resolved[ch] = id;
  }
  const pattern: (number | null)[][] = rows.map((row) =>
    Array.from(row, (ch) => (ch === ' ' ? null : (resolved[ch] ?? null))),
  );
  reg.register({
    kind: 'shaped',
    pattern,
    result: { itemId: outId, count, damage: 0 },
  });
  return true;
}

function shapeless(
  reg: RecipeRegistry,
  items: ItemRegistry,
  ingredients: readonly string[],
  output: string,
  count = 1,
): boolean {
  const outId = items.byName(output);
  if (outId === undefined) return false;
  const ids: number[] = [];
  for (const n of ingredients) {
    const id = items.byName(n);
    if (id === undefined) return false;
    ids.push(id);
  }
  reg.register({
    kind: 'shapeless',
    ingredients: ids,
    result: { itemId: outId, count, damage: 0 },
  });
  return true;
}

// Registers the canonical crafting recipes for everything that's both
// craftable in vanilla MC and present in our block/item registries.
// Returns the number of recipes successfully registered.
export function registerDefaultRecipes(items: ItemRegistry, reg: RecipeRegistry): number {
  let count = 0;
  const S = (rows: readonly string[], legend: Record<string, string>, out: string, n = 1): void => {
    if (shaped(reg, items, rows, legend, out, n)) count++;
  };
  const L = (ingredients: readonly string[], out: string, n = 1): void => {
    if (shapeless(reg, items, ingredients, out, n)) count++;
  };

  // Planks from logs (one log → 4 planks).
  L(['webmc:oak_log'], 'webmc:oak_planks', 4);
  // Sticks (two planks → 4 sticks).
  S(['P', 'P'], { P: 'webmc:oak_planks' }, 'webmc:stick', 4);
  // Crafting table.
  S(['PP', 'PP'], { P: 'webmc:oak_planks' }, 'webmc:crafting_table');
  // Furnace.
  S(['CCC', 'C C', 'CCC'], { C: 'webmc:cobblestone' }, 'webmc:furnace');
  // Chest.
  S(['PPP', 'P P', 'PPP'], { P: 'webmc:oak_planks' }, 'webmc:chest');
  // Torch — coal + stick.
  S(['C', 'S'], { C: 'webmc:coal', S: 'webmc:stick' }, 'webmc:torch', 4);
  // Wood pickaxe.
  S(['PPP', ' S ', ' S '], { P: 'webmc:oak_planks', S: 'webmc:stick' }, 'webmc:wood_pickaxe');
  // Stone pickaxe.
  S(['CCC', ' S ', ' S '], { C: 'webmc:cobblestone', S: 'webmc:stick' }, 'webmc:stone_pickaxe');
  // Iron pickaxe.
  S(['III', ' S ', ' S '], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_pickaxe');
  // Gold pickaxe.
  S(['GGG', ' S ', ' S '], { G: 'webmc:gold_ingot', S: 'webmc:stick' }, 'webmc:gold_pickaxe');
  // Diamond pickaxe.
  S(['DDD', ' S ', ' S '], { D: 'webmc:diamond', S: 'webmc:stick' }, 'webmc:diamond_pickaxe');
  // Wood sword.
  S(['P', 'P', 'S'], { P: 'webmc:oak_planks', S: 'webmc:stick' }, 'webmc:wood_sword');
  // Stone sword.
  S(['C', 'C', 'S'], { C: 'webmc:cobblestone', S: 'webmc:stick' }, 'webmc:stone_sword');
  // Iron sword.
  S(['I', 'I', 'S'], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_sword');
  // Diamond sword.
  S(['D', 'D', 'S'], { D: 'webmc:diamond', S: 'webmc:stick' }, 'webmc:diamond_sword');
  // Iron axe.
  S(['II ', 'IS ', ' S '], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_axe');
  // Shovel.
  S(['I', 'S', 'S'], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_shovel');
  // Bread.
  S(['WWW'], { W: 'webmc:wheat' }, 'webmc:bread');
  // Cookie.
  L(['webmc:wheat', 'webmc:wheat', 'webmc:cocoa_beans'], 'webmc:cookie', 8);
  // Cake.
  S(
    ['MMM', 'ESE', 'WWW'],
    {
      M: 'webmc:milk_bucket',
      E: 'webmc:egg',
      S: 'webmc:sugar',
      W: 'webmc:wheat',
    },
    'webmc:cake',
  );
  // Glass pane (6 glass → 16 panes).
  S(['GGG', 'GGG'], { G: 'webmc:glass' }, 'webmc:glass_pane', 16);
  // Ladder.
  S(['S S', 'SSS', 'S S'], { S: 'webmc:stick' }, 'webmc:ladder', 3);
  // Bed.
  S(['WWW', 'PPP'], { W: 'webmc:wool_white', P: 'webmc:oak_planks' }, 'webmc:bed');
  // Bookshelf.
  S(['PPP', 'BBB', 'PPP'], { P: 'webmc:oak_planks', B: 'webmc:book' }, 'webmc:bookshelf');
  // Book.
  L(['webmc:paper', 'webmc:paper', 'webmc:paper', 'webmc:leather'], 'webmc:book');
  // Paper from sugar cane.
  S(['SSS'], { S: 'webmc:sugar_cane' }, 'webmc:paper', 3);
  // Iron ingot from 9 nuggets + reverse.
  S(['NNN', 'NNN', 'NNN'], { N: 'webmc:iron_nugget' }, 'webmc:iron_ingot');
  // Iron block from 9 ingots + reverse.
  S(['III', 'III', 'III'], { I: 'webmc:iron_ingot' }, 'webmc:iron_block');
  L(['webmc:iron_block'], 'webmc:iron_ingot', 9);
  // Gold block.
  S(['GGG', 'GGG', 'GGG'], { G: 'webmc:gold_ingot' }, 'webmc:gold_block');
  L(['webmc:gold_block'], 'webmc:gold_ingot', 9);
  // Diamond block.
  S(['DDD', 'DDD', 'DDD'], { D: 'webmc:diamond' }, 'webmc:diamond_block');
  L(['webmc:diamond_block'], 'webmc:diamond', 9);
  // Bow.
  S([' SL', 'S L', ' SL'], { S: 'webmc:stick', L: 'webmc:string' }, 'webmc:bow');
  // Arrow.
  S(['F', 'S', 'E'], { F: 'webmc:flint', S: 'webmc:stick', E: 'webmc:feather' }, 'webmc:arrow', 4);
  // TNT.
  S(['GSG', 'SGS', 'GSG'], { G: 'webmc:gunpowder', S: 'webmc:sand' }, 'webmc:tnt');
  // Shield.
  S(['PIP', 'PPP', ' P '], { P: 'webmc:oak_planks', I: 'webmc:iron_ingot' }, 'webmc:shield');

  return count;
}
