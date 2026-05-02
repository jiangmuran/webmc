import type { World } from '@/world/World';
import type { BlockRegistry } from '@/blocks/registry';
import { AIR, type BlockState, makeState, stateId } from '@/blocks/state';
import { lavaMeetsWater } from '@/blocks/lava_encounter_water';
import {
  type FluidCell,
  type FluidKind,
  type PosKey,
  LEVEL_SOURCE,
  applyFluidUpdates,
  keyOfXYZ,
  parseKeyInto,
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
  // Pre-resolved transformation states for lava-water interaction:
  // water src + lava src → obsidian, water flow + lava src → obsidian,
  // water src + lava flow → cobblestone, both flowing → stone. The
  // exact mapping comes from blocks/lava_encounter_water.
  private readonly obsidianState: BlockState;
  private readonly cobbleState: BlockState;
  private readonly stoneState: BlockState;
  // Reused per-tick scratches. The result wrapper + changed[] +
  // per-cell parseKey result were all fresh on every fluid tick (4Hz
  // baseline; way more often near active lava lakes / flowing
  // rivers). Caller iterates `changed` synchronously and doesn't keep
  // the reference, so reusing one array is safe.
  private readonly changedScratch: { x: number; y: number; z: number }[] = [];
  private readonly changedPool: { x: number; y: number; z: number }[] = [];
  private readonly tickResultScratch: {
    stabilized: boolean;
    changed: readonly { x: number; y: number; z: number }[];
  } = { stabilized: false, changed: this.changedScratch };
  // Stable bound isSolid closure — was allocated fresh as
  // `(x, y, z) => this.isSolid(...)` on every tick() call. tickFluid
  // can fire hundreds of times per second during active lava/water
  // flow; eating one closure per call is pure GC pressure.
  private readonly isSolidBound = (x: number, y: number, z: number): boolean =>
    this.isSolid(x, y, z);
  // Per-cell parseKey scratch for tick() + deserialize(). field.ts
  // already exposes parseKeyInto for in-place writes; the caller reads
  // p.x/y/z synchronously and never retains the ref.
  private readonly posScratch: PosKey = { x: 0, y: 0, z: 0 };

  constructor(opts: FluidWorldOptions) {
    this.world = opts.world;
    this.registry = opts.registry;
    this.waterState = this.stateFor('webmc:water');
    this.lavaState = this.stateFor('webmc:lava');
    this.obsidianState = this.stateFor('webmc:obsidian');
    this.cobbleState = this.stateFor('webmc:cobblestone');
    this.stoneState = this.stateFor('webmc:stone');
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
    const k = keyOfXYZ(x, y, z);
    this.cells.set(k, { kind, level: LEVEL_SOURCE, source: true });
    this.world.set(x, y, z, this.blockStateFor(kind));
  }

  clear(x: number, y: number, z: number): void {
    const k = keyOfXYZ(x, y, z);
    this.cells.delete(k);
    this.world.set(x, y, z, AIR);
  }

  get(x: number, y: number, z: number): FluidCell | null {
    return this.cells.get(keyOfXYZ(x, y, z)) ?? null;
  }

  size(): number {
    return this.cells.size;
  }

  // Lava-water adjacency scan: per wiki, when lava has a horizontal-
  // or-above water neighbor, the lava transforms (water unchanged):
  //   water src + lava src → obsidian
  //   water flow + lava src → obsidian
  //   water src + lava flow → stone
  //   water flow + lava flow → cobblestone
  // Run once per tick before the simulation step so the resulting
  // solid block blocks subsequent flow attempts. Returns true if any
  // transformation fired (caller appends those positions to changed).
  private convertLavaWaterMeet(
    changed: { x: number; y: number; z: number }[],
    pool: { x: number; y: number; z: number }[],
  ): void {
    // Find cells with kind='lava' whose horizontal/above neighbors
    // contain water. The 5-neighbor check (excludes below) matches
    // vanilla — water below lava just dries the bottom of the lava
    // column, no obsidian forms there.
    for (const k of this.cells.keys()) {
      const cell = this.cells.get(k);
      if (cell?.kind !== 'lava') continue;
      const p = parseKeyInto(k, this.posScratch);
      const px = p.x;
      const py = p.y;
      const pz = p.z;
      let waterSrc = false;
      let waterFound = false;
      // Five neighbors: NSEW + above. The first water neighbor wins,
      // but we prefer source-water (deterministic choice when both
      // adjacencies exist and one is a source).
      const probes: [number, number, number][] = [
        [px + 1, py, pz],
        [px - 1, py, pz],
        [px, py, pz + 1],
        [px, py, pz - 1],
        [px, py + 1, pz],
      ];
      for (const [nx, ny, nz] of probes) {
        const nc = this.cells.get(keyOfXYZ(nx, ny, nz));
        if (nc?.kind === 'water') {
          waterFound = true;
          if (nc.source) {
            waterSrc = true;
            break;
          }
        }
      }
      if (!waterFound) continue;
      const result = lavaMeetsWater(cell.source, waterSrc);
      const newState =
        result === 'obsidian'
          ? this.obsidianState
          : result === 'stone'
            ? this.stoneState
            : this.cobbleState;
      this.world.set(px, py, pz, newState);
      this.cells.delete(k);
      const recycled = pool.pop();
      const slot = recycled ?? { x: 0, y: 0, z: 0 };
      slot.x = px;
      slot.y = py;
      slot.z = pz;
      changed.push(slot);
    }
  }

  tick(): { stabilized: boolean; changed: readonly { x: number; y: number; z: number }[] } {
    // Fast path: no fluid in this world. Skip the worker call + post-
    // processing, which all collapse to no-ops on empty input but
    // still pay function-call + iterator overhead.
    if (this.cells.size === 0) {
      this.changedScratch.length = 0;
      this.tickResultScratch.stabilized = true;
      return this.tickResultScratch;
    }
    // Recycle the previous tick's changed entries back into the pool
    // before we start writing this tick's transformations.
    const changed = this.changedScratch;
    for (let i = 0; i < changed.length; i++) {
      this.changedPool.push(changed[i]!);
    }
    changed.length = 0;
    // Pre-tick: scan for lava-water adjacencies and transform lava
    // into obsidian/cobblestone/stone before the flow simulation runs.
    // The new solid block blocks downstream flow within the same tick.
    this.convertLavaWaterMeet(changed, this.changedPool);
    const { updates, stabilized } = tickFluid(this.cells, this.isSolidBound);
    applyFluidUpdates(this.cells, updates);
    // Iterate keys + lookup vs entries — destructuring `[k, cell]`
    // allocates a fresh 2-tuple per update, and a busy fluid tick can
    // process hundreds of cells. keys()+get() trades the tuple alloc
    // for one hash lookup per cell, which is cheap.
    for (const k of updates.keys()) {
      const cell = updates.get(k);
      if (cell === undefined) continue;
      const p = parseKeyInto(k, this.posScratch);
      // Skip writebacks to unloaded chunks. world.set on a non-AIR
      // state would call ensureChunk and materialise an empty chunk
      // far away, leaking memory and corrupting future generation.
      if (!this.world.has(p.x >> 4, p.z >> 4)) continue;
      const recycled = this.changedPool.pop();
      const slot = recycled ?? { x: 0, y: 0, z: 0 };
      slot.x = p.x;
      slot.y = p.y;
      slot.z = p.z;
      if (cell === null) {
        const existing = this.world.get(p.x, p.y, p.z);
        if (existing === this.waterState || existing === this.lavaState) {
          this.world.set(p.x, p.y, p.z, AIR);
          changed.push(slot);
          continue;
        }
        this.changedPool.push(slot);
      } else {
        // Don't overwrite a non-fluid block. If the player placed stone
        // where a flowing water cell was previously registered, the cell
        // map still iterates that position; without this guard, the next
        // tick would re-spawn water on top of the stone. Drop the cell
        // from the map instead.
        const here = this.world.get(p.x, p.y, p.z);
        // Cache blockStateFor(cell.kind) once — was called twice per
        // cell (sameFluid compare + the world.set arg). Each call is
        // a property read + ternary, but at active flow with thousands
        // of fluid updates per tick the redundant call adds up.
        const cellKindState = cell.kind === 'water' ? this.waterState : this.lavaState;
        const sameFluid = here === cellKindState;
        const placeable = here === AIR || sameFluid;
        if (!placeable) {
          this.cells.delete(k);
          this.changedPool.push(slot);
          continue;
        }
        if (!sameFluid) {
          this.world.set(p.x, p.y, p.z, cellKindState);
          changed.push(slot);
        } else {
          this.changedPool.push(slot);
        }
      }
    }
    this.tickResultScratch.stabilized = stabilized;
    return this.tickResultScratch;
  }

  private isSolid(x: number, y: number, z: number): boolean {
    const s = this.world.get(x, y, z);
    if (s === AIR) return false;
    if (s === this.waterState || s === this.lavaState) return false;
    return this.registry.get(stateId(s)).solid;
  }

  // Snapshot the current cell map for persistence.
  serialize(): {
    x: number;
    y: number;
    z: number;
    kind: FluidKind;
    level: number;
    source: boolean;
  }[] {
    const out: {
      x: number;
      y: number;
      z: number;
      kind: FluidKind;
      level: number;
      source: boolean;
    }[] = [];
    for (const [k, c] of this.cells) {
      const p = parseKeyInto(k, this.posScratch);
      out.push({ x: p.x, y: p.y, z: p.z, kind: c.kind, level: c.level, source: c.source });
    }
    return out;
  }

  // Restore cells from a previous snapshot. Skips entries whose
  // corresponding world block is no longer the matching fluid (covers
  // the case where the saved chunks were edited offline).
  deserialize(
    cells: readonly {
      x: number;
      y: number;
      z: number;
      kind: FluidKind;
      level: number;
      source: boolean;
    }[],
  ): void {
    for (const c of cells) {
      const here = this.world.get(c.x, c.y, c.z);
      if (here !== this.blockStateFor(c.kind)) continue;
      this.cells.set(keyOfXYZ(c.x, c.y, c.z), {
        kind: c.kind,
        level: c.level,
        source: c.source,
      });
    }
  }
}
