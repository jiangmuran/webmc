import type { BlockId } from './state';
import { AIR_ID } from './state';

export interface BlockDef {
  readonly name: string;
  readonly solid: boolean;
  readonly opaque: boolean;
  readonly lightEmission: number;
  readonly color: readonly [number, number, number];
  readonly hardness: number;
}

const AIR_DEF: BlockDef = {
  name: 'webmc:air',
  solid: false,
  opaque: false,
  lightEmission: 0,
  color: [0, 0, 0],
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

export function createDefaultRegistry(): BlockRegistry {
  const r = new BlockRegistry();
  r.register({
    name: 'webmc:stone',
    solid: true,
    opaque: true,
    lightEmission: 0,
    color: [128, 128, 128],
    hardness: 1.5,
  });
  r.register({
    name: 'webmc:dirt',
    solid: true,
    opaque: true,
    lightEmission: 0,
    color: [134, 96, 67],
    hardness: 0.5,
  });
  r.register({
    name: 'webmc:grass_block',
    solid: true,
    opaque: true,
    lightEmission: 0,
    color: [91, 153, 73],
    hardness: 0.6,
  });
  r.register({
    name: 'webmc:cobblestone',
    solid: true,
    opaque: true,
    lightEmission: 0,
    color: [110, 110, 110],
    hardness: 2,
  });
  r.register({
    name: 'webmc:oak_log',
    solid: true,
    opaque: true,
    lightEmission: 0,
    color: [110, 88, 57],
    hardness: 2,
  });
  r.register({
    name: 'webmc:glowstone',
    solid: true,
    opaque: true,
    lightEmission: 15,
    color: [255, 214, 138],
    hardness: 0.3,
  });
  return r;
}

export const DEFAULT_AIR_ID = AIR_ID;
