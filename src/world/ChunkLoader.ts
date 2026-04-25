import type { Chunk } from './Chunk';
import type { World } from './World';
import type { WorldGenerator } from './generation/WorldGenerator';

export interface ChunkLoaderOptions {
  viewRadius: number;
  unloadPadding: number;
  perFrameBudget: number;
}

const DEFAULTS: ChunkLoaderOptions = {
  viewRadius: 6,
  unloadPadding: 2,
  perFrameBudget: 4,
};

export interface ChunkLoaderStats {
  loaded: number;
  pending: number;
  generating: boolean;
}

export type PopulateFn = (chunk: Chunk) => Promise<void> | void;

export class ChunkLoader {
  private readonly opts: ChunkLoaderOptions;
  private readonly pending: { cx: number; cz: number; priority: number }[] = [];
  private lastCx = Number.NaN;
  private lastCz = Number.NaN;
  private generating = false;
  private populate: PopulateFn;

  constructor(world: World, generator: WorldGenerator, opts: Partial<ChunkLoaderOptions> = {}) {
    this.world = world;
    this.opts = { ...DEFAULTS, ...opts };
    this.populate = (chunk) => {
      generator.generateChunk(chunk);
    };
  }

  setPopulate(fn: PopulateFn): void {
    this.populate = fn;
  }

  private readonly world: World;

  setViewRadius(r: number): void {
    this.opts.viewRadius = Math.max(1, Math.floor(r));
    this.lastCx = Number.NaN;
  }

  setPerFrameBudget(n: number): void {
    this.opts.perFrameBudget = Math.max(1, Math.floor(n));
  }

  get viewRadius(): number {
    return this.opts.viewRadius;
  }

  get perFrameBudget(): number {
    return this.opts.perFrameBudget;
  }

  update(
    playerWx: number,
    playerWz: number,
    onUnload: (cx: number, cz: number) => void,
    onLoad: (cx: number, cz: number) => void = () => undefined,
    playerVx = 0,
    playerVz = 0,
  ): ChunkLoaderStats {
    const cx = Math.floor(playerWx / 16);
    const cz = Math.floor(playerWz / 16);

    if (cx !== this.lastCx || cz !== this.lastCz) {
      this.lastCx = cx;
      this.lastCz = cz;
      this.rebuildPending(cx, cz, playerVx, playerVz);
      this.unloadDistant(cx, cz, onUnload);
    }

    let generated = 0;
    while (generated < this.opts.perFrameBudget && this.pending.length > 0 && !this.generating) {
      const entry = this.pending.shift();
      if (!entry) break;
      if (this.world.has(entry.cx, entry.cz)) continue;
      const chunk = this.world.ensureChunk(entry.cx, entry.cz);
      const result = this.populate(chunk);
      if (result instanceof Promise) {
        this.generating = true;
        void result
          .catch((err: unknown) => {
            console.error('[ChunkLoader] populate failed', err);
          })
          .finally(() => {
            this.generating = false;
            onLoad(entry.cx, entry.cz);
          });
        generated++;
        break;
      }
      onLoad(entry.cx, entry.cz);
      generated++;
    }

    return {
      loaded: this.world.chunkCount,
      pending: this.pending.length,
      generating: this.generating,
    };
  }

  private rebuildPending(centerCx: number, centerCz: number, playerVx = 0, playerVz = 0): void {
    this.pending.length = 0;
    const r = this.opts.viewRadius;
    const vlen = Math.hypot(playerVx, playerVz);
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        const cx = centerCx + dx;
        const cz = centerCz + dz;
        if (this.world.has(cx, cz)) continue;
        let priority = dx * dx + dz * dz;
        if (vlen > 0.5) {
          const dist = Math.sqrt(priority);
          if (dist > 0) {
            const dot = ((dx * playerVx + dz * playerVz) / (dist * vlen));
            priority -= dot * 4;
          }
        }
        this.pending.push({ cx, cz, priority });
      }
    }
    this.pending.sort((a, b) => a.priority - b.priority);
  }

  private unloadDistant(
    centerCx: number,
    centerCz: number,
    onUnload: (cx: number, cz: number) => void,
  ): void {
    const maxR = this.opts.viewRadius + this.opts.unloadPadding;
    const maxRSq = maxR * maxR;
    const toDrop: [number, number][] = [];
    for (const chunk of this.world.chunks()) {
      const dx = chunk.cx - centerCx;
      const dz = chunk.cz - centerCz;
      if (dx * dx + dz * dz > maxRSq) toDrop.push([chunk.cx, chunk.cz]);
    }
    for (const [cx, cz] of toDrop) {
      this.world.removeChunk(cx, cz);
      onUnload(cx, cz);
    }
  }
}
