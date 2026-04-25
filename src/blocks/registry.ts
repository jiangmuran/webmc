import type { BlockId } from './state';
import { AIR_ID } from './state';

export type RGB = readonly [number, number, number];

export interface BlockDef {
  readonly name: string;
  readonly solid: boolean;
  readonly opaque: boolean;
  readonly lightEmission: number;
  readonly color: RGB;
  readonly faceColors: {
    readonly top: RGB;
    readonly bottom: RGB;
    readonly side: RGB;
  };
  readonly hardness: number;
}

function uniformFace(c: RGB): BlockDef['faceColors'] {
  return { top: c, bottom: c, side: c };
}

const AIR_DEF: BlockDef = {
  name: 'webmc:air',
  solid: false,
  opaque: false,
  lightEmission: 0,
  color: [0, 0, 0],
  faceColors: uniformFace([0, 0, 0]),
  hardness: 0,
};

export class BlockRegistry {
  private readonly _defs: BlockDef[] = [];
  private readonly _byName = new Map<string, BlockId>();

  constructor() {
    this.register(AIR_DEF);
  }

  register(def: BlockDef): BlockId {
    if (this._byName.has(def.name)) {
      throw new Error(`BlockRegistry: duplicate name ${def.name}`);
    }
    const id: BlockId = this._defs.length;
    this._defs.push(def);
    this._byName.set(def.name, id);
    return id;
  }

  get(id: BlockId): BlockDef {
    const def = this._defs[id];
    if (!def) throw new Error(`BlockRegistry: no block with id ${String(id)}`);
    return def;
  }

  byName(name: string): BlockId | undefined {
    return this._byName.get(name);
  }

  get size(): number {
    return this._defs.length;
  }

  get defs(): readonly BlockDef[] {
    return this._defs;
  }

  overrideFaceColors(id: BlockId, colors: { top: RGB; bottom: RGB; side: RGB }): void {
    const def = this._defs[id];
    if (!def) return;
    (def as unknown as { faceColors: BlockDef['faceColors']; color: RGB }).faceColors = colors;
    (def as unknown as { color: RGB }).color = colors.side;
  }
}

interface SimpleBlock {
  name: string;
  solid?: boolean;
  opaque?: boolean;
  lightEmission?: number;
  color?: RGB;
  top?: RGB;
  bottom?: RGB;
  side?: RGB;
  hardness?: number;
}

function makeDef(s: SimpleBlock): BlockDef {
  const side: RGB = s.side ?? s.color ?? [200, 200, 200];
  const top: RGB = s.top ?? side;
  const bottom: RGB = s.bottom ?? side;
  return {
    name: s.name,
    solid: s.solid ?? true,
    opaque: s.opaque ?? true,
    lightEmission: s.lightEmission ?? 0,
    color: s.color ?? side,
    faceColors: { top, bottom, side },
    hardness: s.hardness ?? 1,
  };
}

export function createDefaultRegistry(): BlockRegistry {
  const r = new BlockRegistry();
  for (const def of [
    { name: 'webmc:stone', color: [128, 128, 128] as RGB, hardness: 1.5 },
    { name: 'webmc:granite', color: [168, 120, 95] as RGB, hardness: 1.5 },
    { name: 'webmc:diorite', color: [207, 207, 210] as RGB, hardness: 1.5 },
    { name: 'webmc:andesite', color: [138, 138, 140] as RGB, hardness: 1.5 },
    { name: 'webmc:deepslate', color: [80, 80, 82] as RGB, hardness: 3 },
    { name: 'webmc:dirt', color: [134, 96, 67] as RGB, hardness: 0.5 },
    {
      name: 'webmc:grass_block',
      top: [91, 153, 73] as RGB,
      side: [125, 133, 84] as RGB,
      bottom: [134, 96, 67] as RGB,
      color: [91, 153, 73] as RGB,
      hardness: 0.6,
    },
    { name: 'webmc:cobblestone', color: [110, 110, 110] as RGB, hardness: 2 },
    { name: 'webmc:mossy_cobblestone', color: [107, 125, 88] as RGB, hardness: 2 },
    {
      name: 'webmc:oak_log',
      top: [168, 141, 92] as RGB,
      bottom: [168, 141, 92] as RGB,
      side: [110, 88, 57] as RGB,
      color: [110, 88, 57] as RGB,
      hardness: 2,
    },
    { name: 'webmc:oak_planks', color: [176, 143, 86] as RGB, hardness: 2 },
    { name: 'webmc:oak_leaves', color: [68, 135, 54] as RGB, hardness: 0.2 },
    {
      name: 'webmc:spruce_log',
      top: [142, 104, 57] as RGB,
      side: [61, 45, 24] as RGB,
      color: [61, 45, 24] as RGB,
      hardness: 2,
    },
    {
      name: 'webmc:birch_log',
      top: [220, 220, 220] as RGB,
      side: [236, 236, 226] as RGB,
      color: [236, 236, 226] as RGB,
      hardness: 2,
    },
    { name: 'webmc:sand', color: [219, 208, 160] as RGB, hardness: 0.5 },
    { name: 'webmc:gravel', color: [143, 140, 134] as RGB, hardness: 0.6 },
    {
      name: 'webmc:water',
      solid: false,
      opaque: true,
      color: [64, 96, 200] as RGB,
      hardness: 100,
    },
    {
      name: 'webmc:lava',
      solid: false,
      opaque: true,
      color: [207, 86, 16] as RGB,
      lightEmission: 15,
      hardness: 100,
    },
    { name: 'webmc:iron_ore', color: [183, 158, 136] as RGB, hardness: 3 },
    { name: 'webmc:gold_ore', color: [214, 178, 80] as RGB, hardness: 3 },
    { name: 'webmc:diamond_ore', color: [110, 197, 203] as RGB, hardness: 3 },
    { name: 'webmc:coal_ore', color: [60, 60, 60] as RGB, hardness: 3 },
    { name: 'webmc:redstone_ore', color: [158, 55, 55] as RGB, lightEmission: 9, hardness: 3 },
    { name: 'webmc:lapis_ore', color: [52, 74, 155] as RGB, hardness: 3 },
    { name: 'webmc:glowstone', color: [255, 214, 138] as RGB, lightEmission: 15, hardness: 0.3 },
    { name: 'webmc:glass', color: [220, 240, 250] as RGB, hardness: 0.3 },
    { name: 'webmc:brick', color: [152, 94, 70] as RGB, hardness: 2 },
    { name: 'webmc:bookshelf', color: [124, 102, 63] as RGB, hardness: 1.5 },
    {
      name: 'webmc:redstone_dust',
      solid: false,
      opaque: false,
      color: [158, 55, 55] as RGB,
      hardness: 0,
    },
    {
      name: 'webmc:redstone_torch',
      solid: false,
      opaque: false,
      color: [255, 90, 70] as RGB,
      lightEmission: 7,
      hardness: 0,
    },
    {
      name: 'webmc:torch',
      solid: false,
      opaque: true,
      color: [245, 215, 110] as RGB,
      lightEmission: 14,
      hardness: 0,
    },
    {
      name: 'webmc:lever',
      solid: false,
      opaque: false,
      color: [140, 120, 90] as RGB,
      hardness: 0.5,
    },
    {
      name: 'webmc:stone_button',
      solid: false,
      opaque: false,
      color: [120, 120, 120] as RGB,
      hardness: 0.5,
    },
    {
      name: 'webmc:oak_pressure_plate',
      solid: false,
      opaque: false,
      color: [176, 143, 86] as RGB,
      hardness: 0.5,
    },
    {
      name: 'webmc:oak_door',
      solid: true,
      opaque: false,
      color: [148, 120, 75] as RGB,
      hardness: 3,
    },
    {
      name: 'webmc:oak_trapdoor',
      solid: true,
      opaque: false,
      color: [148, 120, 75] as RGB,
      hardness: 3,
    },
    { name: 'webmc:wool_white', color: [236, 236, 236] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_red', color: [182, 52, 48] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_blue', color: [51, 78, 178] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_yellow', color: [233, 208, 59] as RGB, hardness: 0.8 },
    { name: 'webmc:netherrack', color: [104, 35, 35] as RGB, hardness: 0.4 },
    { name: 'webmc:soul_sand', color: [82, 56, 41] as RGB, hardness: 0.5 },
    { name: 'webmc:nether_brick', color: [45, 23, 27] as RGB, hardness: 2 },
    { name: 'webmc:nether_quartz_ore', color: [180, 140, 130] as RGB, hardness: 3 },
    { name: 'webmc:magma_block', color: [150, 60, 20] as RGB, lightEmission: 3, hardness: 0.5 },
    { name: 'webmc:obsidian', color: [20, 10, 30] as RGB, hardness: 50 },
    { name: 'webmc:bedrock', color: [50, 50, 50] as RGB, hardness: -1 },
    {
      name: 'webmc:portal',
      solid: false,
      opaque: false,
      color: [170, 70, 240] as RGB,
      lightEmission: 11,
      hardness: -1,
    },
    { name: 'webmc:end_stone', color: [220, 220, 170] as RGB, hardness: 3 },
    { name: 'webmc:end_portal_frame', color: [80, 95, 85] as RGB, hardness: -1 },
    {
      name: 'webmc:end_portal',
      solid: false,
      opaque: false,
      color: [10, 10, 30] as RGB,
      lightEmission: 15,
      hardness: -1,
    },
    {
      name: 'webmc:dragon_egg',
      solid: true,
      opaque: false,
      color: [12, 6, 20] as RGB,
      hardness: 3,
    },
    { name: 'webmc:purpur_block', color: [170, 130, 170] as RGB, hardness: 1.5 },
    {
      name: 'webmc:end_rod',
      solid: false,
      opaque: false,
      color: [245, 235, 215] as RGB,
      lightEmission: 14,
      hardness: 0,
    },
    // M18 content expansion — extra wool colors.
    { name: 'webmc:wool_green', color: [88, 129, 41] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_light_blue', color: [114, 178, 220] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_lime', color: [123, 206, 68] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_pink', color: [235, 176, 194] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_gray', color: [80, 80, 80] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_light_gray', color: [170, 170, 170] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_cyan', color: [36, 136, 150] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_purple', color: [128, 65, 165] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_magenta', color: [198, 78, 188] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_orange', color: [240, 140, 40] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_brown', color: [108, 68, 38] as RGB, hardness: 0.8 },
    { name: 'webmc:wool_black', color: [22, 22, 22] as RGB, hardness: 0.8 },
    // Copper family.
    { name: 'webmc:copper_block', color: [216, 127, 77] as RGB, hardness: 3 },
    { name: 'webmc:exposed_copper', color: [186, 125, 93] as RGB, hardness: 3 },
    { name: 'webmc:weathered_copper', color: [120, 165, 125] as RGB, hardness: 3 },
    { name: 'webmc:oxidized_copper', color: [85, 170, 135] as RGB, hardness: 3 },
    { name: 'webmc:copper_ore', color: [160, 135, 110] as RGB, hardness: 3 },
    // Amethyst family.
    { name: 'webmc:amethyst_block', color: [134, 95, 174] as RGB, hardness: 1.5 },
    { name: 'webmc:budding_amethyst', color: [158, 121, 196] as RGB, hardness: 1.5 },
    {
      name: 'webmc:amethyst_cluster',
      solid: false,
      opaque: false,
      color: [200, 160, 220] as RGB,
      lightEmission: 5,
      hardness: 1.5,
    },
    // Deep-dark family.
    { name: 'webmc:sculk', color: [14, 22, 36] as RGB, hardness: 0.2 },
    {
      name: 'webmc:sculk_sensor',
      solid: false,
      opaque: false,
      color: [18, 46, 62] as RGB,
      lightEmission: 1,
      hardness: 1.5,
    },
    { name: 'webmc:reinforced_deepslate', color: [46, 51, 54] as RGB, hardness: 55 },
    // Calcite / tuff (1.17 deepdark + geode filler).
    { name: 'webmc:calcite', color: [231, 230, 224] as RGB, hardness: 0.75 },
    { name: 'webmc:tuff', color: [108, 108, 103] as RGB, hardness: 1.5 },
    // Mud + mangrove / cherry / azalea / bamboo blocks.
    { name: 'webmc:mud', color: [67, 54, 52] as RGB, hardness: 0.5 },
    { name: 'webmc:mangrove_log', color: [92, 55, 53] as RGB, hardness: 2 },
    { name: 'webmc:cherry_log', color: [80, 58, 60] as RGB, hardness: 2 },
    { name: 'webmc:stripped_oak_log', color: [188, 152, 98] as RGB, hardness: 2 },
    { name: 'webmc:stripped_spruce_log', color: [115, 85, 49] as RGB, hardness: 2 },
    { name: 'webmc:stripped_birch_log', color: [205, 192, 145] as RGB, hardness: 2 },
    { name: 'webmc:stripped_jungle_log', color: [167, 124, 79] as RGB, hardness: 2 },
    { name: 'webmc:stripped_mangrove_log', color: [120, 73, 60] as RGB, hardness: 2 },
    { name: 'webmc:stripped_cherry_log', color: [220, 175, 165] as RGB, hardness: 2 },
    { name: 'webmc:dirt_path', color: [148, 117, 73] as RGB, hardness: 0.65 },
    { name: 'webmc:farmland', color: [120, 80, 50] as RGB, hardness: 0.6 },
    { name: 'webmc:coarse_dirt', color: [110, 80, 53] as RGB, hardness: 0.5 },
    { name: 'webmc:rooted_dirt', color: [136, 99, 75] as RGB, hardness: 0.5 },
    // Decorative plants — non-solid, non-opaque "X-cross" sprites.
    { name: 'webmc:short_grass', solid: false, opaque: false, color: [110, 195, 90] as RGB, hardness: 0 },
    { name: 'webmc:tall_grass', solid: false, opaque: false, color: [110, 195, 90] as RGB, hardness: 0 },
    { name: 'webmc:dandelion', solid: false, opaque: false, color: [255, 235, 60] as RGB, hardness: 0 },
    { name: 'webmc:poppy', solid: false, opaque: false, color: [220, 30, 30] as RGB, hardness: 0 },
    { name: 'webmc:blue_orchid', solid: false, opaque: false, color: [50, 165, 220] as RGB, hardness: 0 },
    { name: 'webmc:allium', solid: false, opaque: false, color: [200, 130, 220] as RGB, hardness: 0 },
    { name: 'webmc:azure_bluet', solid: false, opaque: false, color: [220, 230, 240] as RGB, hardness: 0 },
    { name: 'webmc:oxeye_daisy', solid: false, opaque: false, color: [240, 240, 230] as RGB, hardness: 0 },
    { name: 'webmc:cornflower', solid: false, opaque: false, color: [85, 110, 220] as RGB, hardness: 0 },
    { name: 'webmc:lily_of_the_valley', solid: false, opaque: false, color: [240, 245, 230] as RGB, hardness: 0 },
    { name: 'webmc:cherry_leaves', color: [235, 180, 205] as RGB, hardness: 0.2 },
    { name: 'webmc:azalea_leaves', color: [100, 135, 55] as RGB, hardness: 0.2 },
    {
      name: 'webmc:bamboo',
      solid: false,
      opaque: false,
      color: [148, 192, 90] as RGB,
      hardness: 1,
    },
    // Ice / snow for cold biomes.
    { name: 'webmc:ice', opaque: false, color: [180, 200, 240] as RGB, hardness: 0.5 },
    { name: 'webmc:snow_block', color: [240, 250, 255] as RGB, hardness: 0.2 },
    { name: 'webmc:packed_ice', color: [145, 180, 230] as RGB, hardness: 0.5 },
    // End cities.
    { name: 'webmc:purpur_pillar', color: [170, 130, 170] as RGB, hardness: 1.5 },
    // Utility blocks (interactable).
    {
      name: 'webmc:bed',
      solid: true,
      opaque: true,
      top: [200, 40, 48] as RGB,
      side: [180, 28, 36] as RGB,
      bottom: [110, 80, 60] as RGB,
      color: [200, 40, 48] as RGB,
      hardness: 0.2,
    },
    {
      name: 'webmc:tnt',
      top: [220, 60, 60] as RGB,
      side: [200, 50, 50] as RGB,
      bottom: [100, 100, 100] as RGB,
      color: [210, 55, 55] as RGB,
      hardness: 0,
    },
    {
      name: 'webmc:ladder',
      solid: false,
      opaque: false,
      color: [130, 90, 52] as RGB,
      hardness: 0.4,
    },
    {
      name: 'webmc:chest',
      top: [120, 82, 36] as RGB,
      side: [132, 96, 45] as RGB,
      bottom: [85, 55, 25] as RGB,
      color: [132, 96, 45] as RGB,
      hardness: 2.5,
    },
    {
      name: 'webmc:crafting_table',
      top: [110, 75, 38] as RGB,
      side: [138, 96, 48] as RGB,
      bottom: [100, 72, 38] as RGB,
      color: [138, 96, 48] as RGB,
      hardness: 2.5,
    },
    {
      name: 'webmc:furnace',
      top: [72, 72, 72] as RGB,
      side: [96, 96, 96] as RGB,
      bottom: [72, 72, 72] as RGB,
      color: [96, 96, 96] as RGB,
      hardness: 3.5,
    },
  ] as SimpleBlock[]) {
    r.register(makeDef(def));
  }
  return r;
}

export const DEFAULT_AIR_ID = AIR_ID;
