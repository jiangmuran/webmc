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
      opaque: false,
      color: [64, 96, 200] as RGB,
      hardness: 100,
    },
    {
      name: 'webmc:lava',
      solid: false,
      opaque: false,
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
    { name: 'webmc:glass', opaque: false, color: [220, 240, 250] as RGB, hardness: 0.3 },
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
  ] as SimpleBlock[]) {
    r.register(makeDef(def));
  }
  return r;
}

export const DEFAULT_AIR_ID = AIR_ID;
