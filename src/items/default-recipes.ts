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

  // Planks from logs (one log → 4 planks). Was oak-only — players with
  // spruce / birch / jungle / acacia / dark_oak / cherry / mangrove /
  // crimson / warped logs had no way to turn them into planks.
  const WOODS = [
    'oak',
    'spruce',
    'birch',
    'jungle',
    'acacia',
    'dark_oak',
    'cherry',
    'mangrove',
    'crimson',
    'warped',
    'pale_oak',
    'bamboo',
  ];
  for (const w of WOODS) {
    L([`webmc:${w}_log`], `webmc:${w}_planks`, 4);
    // Also: stripped logs craft to the same planks.
    L([`webmc:stripped_${w}_log`], `webmc:${w}_planks`, 4);
  }
  // Sticks + crafting table from any plank type. Registering one-per-wood
  // works even though the recipe matcher is exact-id (it tries each
  // recipe in turn). Was oak-only — players with a spruce or birch
  // base couldn't craft a crafting table or sticks.
  for (const w of WOODS) {
    S(['P', 'P'], { P: `webmc:${w}_planks` }, 'webmc:stick', 4);
    S(['PP', 'PP'], { P: `webmc:${w}_planks` }, 'webmc:crafting_table');
  }
  // Furnace.
  S(['CCC', 'C C', 'CCC'], { C: 'webmc:cobblestone' }, 'webmc:furnace');
  // Chest from any plank type.
  for (const w of WOODS) {
    S(['PPP', 'P P', 'PPP'], { P: `webmc:${w}_planks` }, 'webmc:chest');
  }
  // Torch — coal + stick. Charcoal also works (vanilla).
  S(['C', 'S'], { C: 'webmc:coal', S: 'webmc:stick' }, 'webmc:torch', 4);
  S(['C', 'S'], { C: 'webmc:charcoal', S: 'webmc:stick' }, 'webmc:torch', 4);
  // Wood pickaxe / sword / axe / shovel / hoe from any plank type. Was
  // oak-only, breaking the wood→stone progression for non-oak biomes.
  for (const w of WOODS) {
    S(['PPP', ' S ', ' S '], { P: `webmc:${w}_planks`, S: 'webmc:stick' }, 'webmc:wood_pickaxe');
    S(['P', 'P', 'S'], { P: `webmc:${w}_planks`, S: 'webmc:stick' }, 'webmc:wood_sword');
    S(['PP ', 'PS ', ' S '], { P: `webmc:${w}_planks`, S: 'webmc:stick' }, 'webmc:wood_axe');
    S(['P', 'S', 'S'], { P: `webmc:${w}_planks`, S: 'webmc:stick' }, 'webmc:wood_shovel');
    S(['PP ', ' S ', ' S '], { P: `webmc:${w}_planks`, S: 'webmc:stick' }, 'webmc:wood_hoe');
  }
  // Stone pickaxe / sword / axe / shovel / hoe.
  S(['CCC', ' S ', ' S '], { C: 'webmc:cobblestone', S: 'webmc:stick' }, 'webmc:stone_pickaxe');
  S(['C', 'C', 'S'], { C: 'webmc:cobblestone', S: 'webmc:stick' }, 'webmc:stone_sword');
  S(['CC ', 'CS ', ' S '], { C: 'webmc:cobblestone', S: 'webmc:stick' }, 'webmc:stone_axe');
  S(['C', 'S', 'S'], { C: 'webmc:cobblestone', S: 'webmc:stick' }, 'webmc:stone_shovel');
  S(['CC ', ' S ', ' S '], { C: 'webmc:cobblestone', S: 'webmc:stick' }, 'webmc:stone_hoe');
  // Iron pickaxe / sword / axe / shovel / hoe.
  S(['III', ' S ', ' S '], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_pickaxe');
  S(['I', 'I', 'S'], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_sword');
  S(['II ', 'IS ', ' S '], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_axe');
  S(['I', 'S', 'S'], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_shovel');
  S(['II ', ' S ', ' S '], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:iron_hoe');
  // Gold pickaxe / sword / axe / shovel / hoe.
  S(['GGG', ' S ', ' S '], { G: 'webmc:gold_ingot', S: 'webmc:stick' }, 'webmc:gold_pickaxe');
  S(['G', 'G', 'S'], { G: 'webmc:gold_ingot', S: 'webmc:stick' }, 'webmc:gold_sword');
  S(['GG ', 'GS ', ' S '], { G: 'webmc:gold_ingot', S: 'webmc:stick' }, 'webmc:gold_axe');
  S(['G', 'S', 'S'], { G: 'webmc:gold_ingot', S: 'webmc:stick' }, 'webmc:gold_shovel');
  S(['GG ', ' S ', ' S '], { G: 'webmc:gold_ingot', S: 'webmc:stick' }, 'webmc:gold_hoe');
  // Diamond pickaxe / sword / axe / shovel / hoe.
  S(['DDD', ' S ', ' S '], { D: 'webmc:diamond', S: 'webmc:stick' }, 'webmc:diamond_pickaxe');
  S(['D', 'D', 'S'], { D: 'webmc:diamond', S: 'webmc:stick' }, 'webmc:diamond_sword');
  S(['DD ', 'DS ', ' S '], { D: 'webmc:diamond', S: 'webmc:stick' }, 'webmc:diamond_axe');
  S(['D', 'S', 'S'], { D: 'webmc:diamond', S: 'webmc:stick' }, 'webmc:diamond_shovel');
  S(['DD ', ' S ', ' S '], { D: 'webmc:diamond', S: 'webmc:stick' }, 'webmc:diamond_hoe');
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
  // Shears: 2 iron diagonal. Vanilla recipe.
  S([' I', 'I '], { I: 'webmc:iron_ingot' }, 'webmc:shears');
  // Flint and steel.
  S([' I', 'F '], { I: 'webmc:iron_ingot', F: 'webmc:flint' }, 'webmc:flint_and_steel');
  // Bucket.
  S(['I I', ' I '], { I: 'webmc:iron_ingot' }, 'webmc:bucket');
  // Compass.
  S([' I ', 'IRI', ' I '], { I: 'webmc:iron_ingot', R: 'webmc:redstone' }, 'webmc:compass');
  // Clock.
  S([' G ', 'GRG', ' G '], { G: 'webmc:gold_ingot', R: 'webmc:redstone' }, 'webmc:clock');
  // Fishing rod.
  S(['  S', ' SL', 'S L'], { S: 'webmc:stick', L: 'webmc:string' }, 'webmc:fishing_rod');
  // Lead.
  S(['SS ', 'SB ', '  S'], { S: 'webmc:string', B: 'webmc:slime_ball' }, 'webmc:lead', 2);
  // Carrot on a stick.
  S(['F ', ' C'], { F: 'webmc:fishing_rod', C: 'webmc:carrot' }, 'webmc:carrot_on_a_stick');
  // Saddle (vanilla doesn't have a recipe — only via dungeon loot — but webmc
  // can offer one for crafting completeness). Skip for now.
  // Bed + bookshelf from any plank type. Was 'webmc:wool_white' which
  // isn't actually registered in the item registry — only 'webmc:wool'
  // is — so the bed recipe silently failed to register entirely. Fixed.
  for (const w of WOODS) {
    S(['WWW', 'PPP'], { W: 'webmc:wool', P: `webmc:${w}_planks` }, 'webmc:bed');
    S(['PPP', 'BBB', 'PPP'], { P: `webmc:${w}_planks`, B: 'webmc:book' }, 'webmc:bookshelf');
  }
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
  // Shield from any plank type.
  for (const w of WOODS) {
    S(['PIP', 'PPP', ' P '], { P: `webmc:${w}_planks`, I: 'webmc:iron_ingot' }, 'webmc:shield');
  }
  // Armor sets — were unrecipeable. Only ARMOR_DEFS metadata + the
  // item-registry loop existed, so /give worked but crafting did not.
  // Vanilla shapes:
  //   helmet:     XXX / X X
  //   chestplate: X X / XXX / XXX
  //   leggings:   XXX / X X / X X
  //   boots:      X X / X X
  // Where X is the material ingot/leather/diamond. Netherite is upgraded
  // via smithing template (M12) and isn't auto-craftable from ingots.
  const ARMOR_MATS: { mat: string; tier: string }[] = [
    { mat: 'webmc:leather', tier: 'leather' },
    { mat: 'webmc:iron_ingot', tier: 'iron' },
    { mat: 'webmc:gold_ingot', tier: 'gold' },
    { mat: 'webmc:diamond', tier: 'diamond' },
  ];
  for (const { mat, tier } of ARMOR_MATS) {
    S(['XXX', 'X X'], { X: mat }, `webmc:${tier}_helmet`);
    S(['X X', 'XXX', 'XXX'], { X: mat }, `webmc:${tier}_chestplate`);
    S(['XXX', 'X X', 'X X'], { X: mat }, `webmc:${tier}_leggings`);
    S(['X X', 'X X'], { X: mat }, `webmc:${tier}_boots`);
  }
  // Hopper.
  S(['I I', 'ICI', ' I '], { I: 'webmc:iron_ingot', C: 'webmc:chest' }, 'webmc:hopper');
  // Anvil.
  S(['III', ' I ', 'III'], { I: 'webmc:iron_ingot' }, 'webmc:anvil');
  // Iron bars (16 from 6 ingots).
  S(['III', 'III'], { I: 'webmc:iron_ingot' }, 'webmc:iron_bars', 16);
  // Piston.
  S(
    ['PPP', 'CIC', 'CRC'],
    {
      P: 'webmc:oak_planks',
      C: 'webmc:cobblestone',
      I: 'webmc:iron_ingot',
      R: 'webmc:redstone',
    },
    'webmc:piston',
  );
  // Sticky piston.
  S([' S ', ' P '], { S: 'webmc:slime_ball', P: 'webmc:piston' }, 'webmc:sticky_piston');
  // Repeater.
  S(
    ['TRT', 'SSS'],
    { T: 'webmc:redstone_torch', R: 'webmc:redstone', S: 'webmc:stone' },
    'webmc:repeater',
  );
  // Comparator.
  S(
    ['TTT', 'TQT', 'SSS'],
    { T: 'webmc:redstone_torch', Q: 'webmc:quartz', S: 'webmc:stone' },
    'webmc:comparator',
  );
  // Lever.
  S(['S', 'C'], { S: 'webmc:stick', C: 'webmc:cobblestone' }, 'webmc:lever');
  // Redstone torch.
  S(['R', 'S'], { R: 'webmc:redstone', S: 'webmc:stick' }, 'webmc:redstone_torch');
  // Smithing table — basic plank+iron recipe.
  for (const w of WOODS) {
    S(
      ['II ', 'PP ', 'PP '],
      { I: 'webmc:iron_ingot', P: `webmc:${w}_planks` },
      'webmc:smithing_table',
    );
  }
  // Wood-family blocks: door / trapdoor / slab / stairs / fence /
  // fence_gate / button / pressure_plate / sign for every plank type.
  // All registered as blocks since M3 but unrecipeable — players had
  // to /give to test even basic builds.
  for (const w of WOODS) {
    const P = `webmc:${w}_planks`;
    // 6 planks → 3 doors.
    S(['PP', 'PP', 'PP'], { P }, `webmc:${w}_door`, 3);
    // 6 planks → 2 trapdoors.
    S(['PPP', 'PPP'], { P }, `webmc:${w}_trapdoor`, 2);
    // 3 planks → 6 slabs.
    S(['PPP'], { P }, `webmc:${w}_slab`, 6);
    // 6 planks → 4 stairs.
    S(['P  ', 'PP ', 'PPP'], { P }, `webmc:${w}_stairs`, 4);
    // 4 planks + 2 sticks → 3 fences.
    S(['PSP', 'PSP'], { P, S: 'webmc:stick' }, `webmc:${w}_fence`, 3);
    // 4 planks + 2 sticks → 1 fence gate (vanilla shape).
    S(['SPS', 'SPS'], { P, S: 'webmc:stick' }, `webmc:${w}_fence_gate`);
    // 1 plank → 1 button (shapeless).
    L([P], `webmc:${w}_button`);
    // 2 planks → 1 pressure plate.
    S(['PP'], { P }, `webmc:${w}_pressure_plate`);
    // 6 planks + 1 stick → 3 signs.
    S(['PPP', 'PPP', ' S '], { P, S: 'webmc:stick' }, `webmc:${w}_sign`, 3);
  }
  // Stone family — slab / stairs / wall / button / pressure plate.
  // Same vanilla shapes as wood but with stone material. Was missing
  // for cobblestone, stone, mossy_cobblestone, andesite, granite, diorite.
  const STONES = [
    'cobblestone',
    'mossy_cobblestone',
    'stone',
    'smooth_stone',
    'sandstone',
    'red_sandstone',
    'stone_bricks',
    'mossy_stone_bricks',
    'andesite',
    'polished_andesite',
    'granite',
    'polished_granite',
    'diorite',
    'polished_diorite',
    'deepslate',
    'cobbled_deepslate',
    'polished_deepslate',
    'deepslate_bricks',
    'nether_brick',
    'red_nether_brick',
    'blackstone',
    'polished_blackstone',
    'quartz_block',
    'purpur_block',
    'prismarine',
    'prismarine_bricks',
    'dark_prismarine',
    'end_stone_bricks',
    'bricks',
  ];
  for (const s of STONES) {
    const M = `webmc:${s}`;
    S(['MMM'], { M }, `webmc:${s}_slab`, 6);
    S(['M  ', 'MM ', 'MMM'], { M }, `webmc:${s}_stairs`, 4);
    S(['MMM', 'MMM'], { M }, `webmc:${s}_wall`, 6);
  }
  // Stone button + pressure plate (vanilla only stone, not cobble etc.).
  L(['webmc:stone'], 'webmc:stone_button');
  S(['MM'], { M: 'webmc:stone' }, 'webmc:stone_pressure_plate');
  // Iron / gold pressure plate (1 ingot wide pair).
  S(['MM'], { M: 'webmc:iron_ingot' }, 'webmc:heavy_weighted_pressure_plate');
  S(['MM'], { M: 'webmc:gold_ingot' }, 'webmc:light_weighted_pressure_plate');
  // Glass family — pane (already have generic) + colored stained glass
  // (skip color crafting — would need dye recipes wired). Iron door +
  // trapdoor:
  S(['II', 'II', 'II'], { I: 'webmc:iron_ingot' }, 'webmc:iron_door', 3);
  S(['II', 'II'], { I: 'webmc:iron_ingot' }, 'webmc:iron_trapdoor');
  // Item frame.
  S(['SSS', 'SLS', 'SSS'], { S: 'webmc:stick', L: 'webmc:leather' }, 'webmc:item_frame');
  // Painting (8 sticks + 1 wool).
  S(['SSS', 'SWS', 'SSS'], { S: 'webmc:stick', W: 'webmc:wool' }, 'webmc:painting');
  // Boat (5 planks).
  for (const w of WOODS) {
    S(['P P', 'PPP'], { P: `webmc:${w}_planks` }, `webmc:${w}_boat`);
  }
  // Stick-from-bamboo (1 bamboo → 1 stick, vanilla 1.14+).
  L(['webmc:bamboo'], 'webmc:stick');
  // Smoker / blast furnace.
  for (const w of WOODS) {
    S([' L ', 'LFL', ' L '], { L: `webmc:${w}_log`, F: 'webmc:furnace' }, 'webmc:smoker');
  }
  S(
    ['III', 'IFI', 'SSS'],
    { I: 'webmc:iron_ingot', F: 'webmc:furnace', S: 'webmc:smooth_stone' },
    'webmc:blast_furnace',
  );
  // Beacon — 5 glass + 3 obsidian + nether_star (registered + dropped
  // by wither). Hard recipe to acquire but registered now.
  S(
    ['GGG', 'GNG', 'OOO'],
    {
      G: 'webmc:glass',
      N: 'webmc:nether_star',
      O: 'webmc:obsidian',
    },
    'webmc:beacon',
  );
  // Cauldron.
  S(['I I', 'I I', 'III'], { I: 'webmc:iron_ingot' }, 'webmc:cauldron');
  // Brewing stand.
  S([' B ', 'CCC'], { B: 'webmc:blaze_rod', C: 'webmc:cobblestone' }, 'webmc:brewing_stand');
  // Enchanting table.
  S(
    [' B ', 'DOD', 'OOO'],
    {
      B: 'webmc:book',
      D: 'webmc:diamond',
      O: 'webmc:obsidian',
    },
    'webmc:enchanting_table',
  );
  // Jukebox.
  S(['PPP', 'PDP', 'PPP'], { P: 'webmc:oak_planks', D: 'webmc:diamond' }, 'webmc:jukebox');
  // Note block (8 planks + 1 redstone).
  S(['PPP', 'PRP', 'PPP'], { P: 'webmc:oak_planks', R: 'webmc:redstone' }, 'webmc:noteblock');
  // Loom.
  S(['SS', 'PP'], { S: 'webmc:string', P: 'webmc:oak_planks' }, 'webmc:loom');
  // Cartography table.
  S(['SS', 'PP', 'PP'], { S: 'webmc:paper', P: 'webmc:oak_planks' }, 'webmc:cartography_table');
  // Stonecutter.
  S([' I ', 'SSS'], { I: 'webmc:iron_ingot', S: 'webmc:stone' }, 'webmc:stonecutter');
  // Grindstone.
  S(
    ['SIS', 'P P'],
    { S: 'webmc:stick', I: 'webmc:iron_ingot', P: 'webmc:oak_planks' },
    'webmc:grindstone',
  );
  // Lectern.
  S(['SSS', ' B ', ' S '], { S: 'webmc:oak_slab', B: 'webmc:bookshelf' }, 'webmc:lectern');
  // Fletching table.
  S(['FF', 'PP', 'PP'], { F: 'webmc:flint', P: 'webmc:oak_planks' }, 'webmc:fletching_table');
  // Trapped chest.
  L(['webmc:chest', 'webmc:tripwire_hook'], 'webmc:trapped_chest');
  // Daylight detector.
  S(
    ['GGG', 'QQQ', 'SSS'],
    { G: 'webmc:glass', Q: 'webmc:quartz', S: 'webmc:oak_slab' },
    'webmc:daylight_detector',
  );
  // Observer.
  S(
    ['CCC', 'RRQ', 'CCC'],
    {
      C: 'webmc:cobblestone',
      R: 'webmc:redstone',
      Q: 'webmc:quartz',
    },
    'webmc:observer',
  );
  // Hopper minecart, chest minecart, furnace minecart, TNT minecart.
  S(['M', 'C'], { M: 'webmc:minecart', C: 'webmc:chest' }, 'webmc:chest_minecart');
  S(['M', 'F'], { M: 'webmc:minecart', F: 'webmc:furnace' }, 'webmc:furnace_minecart');
  S(['M', 'H'], { M: 'webmc:minecart', H: 'webmc:hopper' }, 'webmc:hopper_minecart');
  S(['M', 'T'], { M: 'webmc:minecart', T: 'webmc:tnt' }, 'webmc:tnt_minecart');
  // Minecart.
  S(['I I', 'III'], { I: 'webmc:iron_ingot' }, 'webmc:minecart');
  // Rails (16 from 6 ingots + 1 stick).
  S(['I I', 'ISI', 'I I'], { I: 'webmc:iron_ingot', S: 'webmc:stick' }, 'webmc:rail', 16);
  // Powered rail (6 gold + 1 stick + 1 redstone → 6 powered rails).
  S(
    ['G G', 'GSG', 'GRG'],
    { G: 'webmc:gold_ingot', S: 'webmc:stick', R: 'webmc:redstone' },
    'webmc:powered_rail',
    6,
  );
  // Detector rail.
  S(
    ['I I', 'IPI', 'IRI'],
    { I: 'webmc:iron_ingot', P: 'webmc:stone_pressure_plate', R: 'webmc:redstone' },
    'webmc:detector_rail',
    6,
  );

  return count;
}
