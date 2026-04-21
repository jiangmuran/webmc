import type { BlockId } from '@/blocks/state';

export type ItemId = number;

export interface ItemDef {
  readonly id: ItemId;
  readonly name: string;
  readonly maxStack: number;
  readonly durability: number;
  readonly blockId?: BlockId;
  readonly hungerRestore?: number;
  readonly saturation?: number;
  readonly attackDamage?: number;
  readonly toolTier?: number;
  readonly toolKind?: 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword';
}

export const AIR_ITEM: ItemId = 0;

export interface ItemStack {
  readonly itemId: ItemId;
  readonly count: number;
  readonly damage: number;
}

export function stack(itemId: ItemId, count: number, damage = 0): ItemStack {
  return { itemId, count, damage };
}

export function isEmpty(s: ItemStack | null): boolean {
  return !s || s.count <= 0 || s.itemId === AIR_ITEM;
}

export function canMerge(a: ItemStack, b: ItemStack): boolean {
  return a.itemId === b.itemId && a.damage === b.damage;
}

export class ItemRegistry {
  private readonly _defs: ItemDef[] = [];
  private readonly _byName = new Map<string, ItemId>();

  constructor() {
    this.register({ id: AIR_ITEM, name: 'webmc:air', maxStack: 0, durability: 0 });
  }

  register(def: Omit<ItemDef, 'id'> & { id?: ItemId }): ItemId {
    if (this._byName.has(def.name)) throw new Error(`ItemRegistry: duplicate ${def.name}`);
    const id = def.id ?? this._defs.length;
    if (id !== this._defs.length) {
      throw new Error(`ItemRegistry: non-sequential id ${String(id)}`);
    }
    const full: ItemDef = { ...def, id };
    this._defs.push(full);
    this._byName.set(def.name, id);
    return id;
  }

  get(id: ItemId): ItemDef {
    const d = this._defs[id];
    if (!d) throw new Error(`ItemRegistry: no item ${String(id)}`);
    return d;
  }

  byName(name: string): ItemId | undefined {
    return this._byName.get(name);
  }

  get size(): number {
    return this._defs.length;
  }

  maxStack(id: ItemId): number {
    return this.get(id).maxStack;
  }
}
