import { type BlockState, AIR, makeState } from '@/blocks/state';
import type { BlockRegistry } from '@/blocks/registry';
import { CHUNK_DIM, CHUNK_HEIGHT, type Chunk } from '../Chunk';
import { Perlin, hash32 } from '../noise/perlin';

// Main end island radius ≈ 1000 blocks in MC. We ship a compact version:
// central disk r=80 at y≈60 with obsidian pillars + a spawn platform.
const ISLAND_CENTER_Y = 60;
const ISLAND_RADIUS = 80;
const ISLAND_FREQ = 1 / 90;
const PILLAR_COUNT = 10;

interface Blocks {
  endStone: BlockState;
  obsidian: BlockState;
}

function resolve(r: BlockRegistry, name: string): BlockState {
  const id = r.byName(name);
  if (id === undefined) throw new Error(`EndGenerator: missing ${name}`);
  return makeState(id, 0);
}

export class EndGenerator {
  readonly islandNoise: Perlin;
  private readonly b: Blocks;

  constructor(
    readonly seed: number,
    readonly registry: BlockRegistry,
  ) {
    this.islandNoise = new Perlin(seed ^ 0xe11d00);
    this.b = {
      endStone: resolve(registry, 'webmc:end_stone'),
      obsidian: resolve(registry, 'webmc:obsidian'),
    };
  }

  // Returns the top-y (inclusive) of end stone at this xz, or -1 if empty air.
  islandTopAt(wx: number, wz: number): number {
    const dx = wx;
    const dz = wz;
    const dist = Math.hypot(dx, dz);
    if (dist > ISLAND_RADIUS) return -1;
    const taper = 1 - dist / ISLAND_RADIUS;
    const n = this.islandNoise.fbm2(wx * ISLAND_FREQ, wz * ISLAND_FREQ, 3);
    const thickness = Math.max(0, Math.round(taper * 8 + n * 4));
    if (thickness <= 0) return -1;
    return ISLAND_CENTER_Y + Math.round(n * 3);
  }

  pillarAt(wx: number, wz: number): { top: number } | null {
    // Place 10 pillars around the central disk deterministically.
    for (let i = 0; i < PILLAR_COUNT; i++) {
      const angle = (i / PILLAR_COUNT) * Math.PI * 2;
      const r = 42 + ((hash32(i, 0, this.seed ^ 0x9a77) >>> 0) % 18);
      const cx = Math.round(Math.cos(angle) * r);
      const cz = Math.round(Math.sin(angle) * r);
      const dx = wx - cx;
      const dz = wz - cz;
      if (dx * dx + dz * dz <= 9) {
        const height = 30 + ((hash32(i, 1, this.seed ^ 0x9a77) >>> 0) % 22);
        return { top: ISLAND_CENTER_Y + height };
      }
    }
    return null;
  }

  generateChunk(chunk: Chunk): void {
    const { endStone, obsidian } = this.b;
    for (let lx = 0; lx < CHUNK_DIM; lx++) {
      for (let lz = 0; lz < CHUNK_DIM; lz++) {
        const wx = chunk.cx * CHUNK_DIM + lx;
        const wz = chunk.cz * CHUNK_DIM + lz;
        const top = this.islandTopAt(wx, wz);
        const pillar = this.pillarAt(wx, wz);
        for (let y = 0; y < CHUNK_HEIGHT; y++) {
          if (top >= 0 && y >= ISLAND_CENTER_Y - 6 && y <= top) {
            chunk.set(lx, y, lz, endStone);
            continue;
          }
          if (pillar && y >= ISLAND_CENTER_Y && y <= pillar.top) {
            chunk.set(lx, y, lz, obsidian);
            continue;
          }
          chunk.set(lx, y, lz, AIR);
        }
      }
    }
  }
}
