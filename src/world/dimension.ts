// Lightweight dimension index. Each dimension owns an independent World +
// generator; the player carries a dimensionId and swaps when entering a
// portal. Not multi-threaded; meant as scaffolding for M13/M14.

import type { World } from './World';

export type DimensionId = 'overworld' | 'nether' | 'end';

export interface DimensionInfo {
  id: DimensionId;
  world: World;
  // How many blocks in the overworld equal one block in this dimension when
  // translating portal coordinates. Nether scale = 8, end scale = 1.
  scale: number;
  // Y at which portals land by default.
  portalY: number;
}

export class DimensionRegistry {
  private readonly dims = new Map<DimensionId, DimensionInfo>();

  register(info: DimensionInfo): void {
    if (this.dims.has(info.id)) throw new Error(`dimension already registered: ${info.id}`);
    this.dims.set(info.id, info);
  }

  get(id: DimensionId): DimensionInfo {
    const d = this.dims.get(id);
    if (!d) throw new Error(`unknown dimension: ${id}`);
    return d;
  }

  has(id: DimensionId): boolean {
    return this.dims.has(id);
  }

  translate(from: DimensionId, to: DimensionId, x: number, z: number): { x: number; z: number } {
    const a = this.get(from);
    const b = this.get(to);
    const factor = a.scale / b.scale;
    return { x: Math.round(x * factor), z: Math.round(z * factor) };
  }

  all(): IterableIterator<DimensionInfo> {
    return this.dims.values();
  }
}
