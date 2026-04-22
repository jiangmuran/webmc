import type { World } from '@/world/World';
import type { BlockRegistry } from '@/blocks/registry';
import { AIR, type BlockState, makeState, stateId } from '@/blocks/state';
import {
  type FluidCell,
  type FluidKind,
  LEVEL_SOURCE,
  applyFluidUpdates,
  keyOf,
  parseKey,
  tickFluid,
} from './field';

export interface FluidWorldOptions {
  world: World;
  registry: BlockRegistry;
}

export class FluidWorld {
  private readonly world: World;
  private readonly registry: BlockRegistry;
  private readonly cells = new Map<string, FluidCell>();
  private readonly waterState: BlockState;
  private readonly lavaState: BlockState;

  constructor(opts: FluidWorldOptions) {
    this.world = opts.world;
    this.registry = opts.registry;
    this.waterState = this.stateFor('webmc:water');
    this.lavaState = this.stateFor('webmc:lava');
  }

  private stateFor(name: string): BlockState {
    const id = this.registry.byName(name);
    if (id === undefined) throw new Error(`FluidWorld: unknown block ${name}`);
    return makeState(id);
  }

  private blockStateFor(kind: FluidKind): BlockState {
    return kind === 'water' ? this.waterState : this.lavaState;
  }

  setSource(x: number, y: number, z: number, kind: FluidKind): void {
    const k = keyOf({ x, y, z });
    this.cells.set(k, { kind, level: LEVEL_SOURCE, source: true });
    this.world.set(x, y, z, this.blockStateFor(kind));
  }

  clear(x: number, y: number, z: number): void {
    const k = keyOf({ x, y, z });
    this.cells.delete(k);
    this.world.set(x, y, z, AIR);
  }

  get(x: number, y: number, z: number): FluidCell | null {
    return this.cells.get(keyOf({ x, y, z })) ?? null;
  }

  size(): number {
    return this.cells.size;
  }

  tick(): { stabilized: boolean; changed: readonly { x: number; y: number; z: number }[] } {
    const { updates, stabilized } = tickFluid(this.cells, (x, y, z) => this.isSolid(x, y, z));
    applyFluidUpdates(this.cells, updates);
    const changed: { x: number; y: number; z: number }[] = [];
    for (const [k, cell] of updates) {
      const p = parseKey(k);
      if (cell === null) {
        const existing = this.world.get(p.x, p.y, p.z);
        if (existing === this.waterState || existing === this.lavaState) {
          this.world.set(p.x, p.y, p.z, AIR);
          changed.push(p);
        }
      } else {
        this.world.set(p.x, p.y, p.z, this.blockStateFor(cell.kind));
        changed.push(p);
      }
    }
    return { stabilized, changed };
  }

  private isSolid(x: number, y: number, z: number): boolean {
    const s = this.world.get(x, y, z);
    if (s === AIR) return false;
    if (s === this.waterState || s === this.lavaState) return false;
    return this.registry.get(stateId(s)).solid;
  }
}
