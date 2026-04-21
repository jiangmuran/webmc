import { type BlockState, AIR, makeState } from '@/blocks/state';
import { type BlockRegistry } from '@/blocks/registry';
import { CHUNK_DIM, CHUNK_HEIGHT, type Chunk } from '../Chunk';
import { Perlin, hash32 } from '../noise/perlin';

export const PLAINS = 0;
export const FOREST = 1;
export type BiomeId = typeof PLAINS | typeof FOREST;

const HEIGHT_FREQ = 1 / 80;
const BIOME_FREQ = 1 / 220;
const BIOME_THRESHOLD = 0.1;
const SEA_LEVEL = 62;
const MIN_HEIGHT = 52;
const MAX_HEIGHT = 92;
const TREE_DENSITY = 0.04;
const TREE_HEIGHT = 4;

export interface GeneratedBlocks {
  stone: BlockState;
  dirt: BlockState;
  grass: BlockState;
  sand: BlockState;
  log: BlockState;
  leaves: BlockState;
}

function resolve(registry: BlockRegistry, name: string): BlockState {
  const id = registry.byName(name);
  if (id === undefined) throw new Error(`WorldGenerator: missing block ${name}`);
  return makeState(id, 0);
}

export class WorldGenerator {
  readonly heightNoise: Perlin;
  readonly biomeNoise: Perlin;
  private readonly blocks: GeneratedBlocks;

  constructor(
    readonly seed: number,
    readonly registry: BlockRegistry,
  ) {
    this.heightNoise = new Perlin(seed);
    this.biomeNoise = new Perlin(seed ^ 0x5eed1de);
    this.blocks = {
      stone: resolve(registry, 'webmc:stone'),
      dirt: resolve(registry, 'webmc:dirt'),
      grass: resolve(registry, 'webmc:grass_block'),
      sand: resolve(registry, 'webmc:sand'),
      log: resolve(registry, 'webmc:oak_log'),
      leaves: resolve(registry, 'webmc:oak_leaves'),
    };
  }

  biomeAt(wx: number, wz: number): BiomeId {
    const n = this.biomeNoise.fbm2(wx * BIOME_FREQ, wz * BIOME_FREQ, 2);
    return n > BIOME_THRESHOLD ? FOREST : PLAINS;
  }

  surfaceAt(wx: number, wz: number): number {
    const n = this.heightNoise.fbm2(wx * HEIGHT_FREQ, wz * HEIGHT_FREQ, 4);
    const t = (n + 1) * 0.5;
    return Math.round(MIN_HEIGHT + t * (MAX_HEIGHT - MIN_HEIGHT));
  }

  generateChunk(chunk: Chunk): void {
    const { stone, dirt, grass, sand, log, leaves } = this.blocks;
    const cx = chunk.cx;
    const cz = chunk.cz;
    for (let lx = 0; lx < CHUNK_DIM; lx++) {
      for (let lz = 0; lz < CHUNK_DIM; lz++) {
        const wx = cx * CHUNK_DIM + lx;
        const wz = cz * CHUNK_DIM + lz;
        const surface = this.surfaceAt(wx, wz);
        const biome = this.biomeAt(wx, wz);
        const topBlock = surface <= SEA_LEVEL ? sand : grass;
        for (let y = 0; y <= surface; y++) {
          let state = stone;
          if (y === surface) state = topBlock;
          else if (y >= surface - 3) state = topBlock === sand ? sand : dirt;
          chunk.set(lx, y, lz, state);
        }
        if (biome === FOREST && topBlock === grass) {
          const h = hash32(wx, wz, this.seed);
          if ((h & 0xffff) / 0xffff < TREE_DENSITY) {
            this.plantTree(wx, wz, surface + 1, log, leaves, chunk);
          }
        }
      }
    }
  }

  private plantTree(
    wx: number,
    wz: number,
    baseY: number,
    log: BlockState,
    leaves: BlockState,
    chunk: Chunk,
  ): void {
    const lx = wx - chunk.cx * CHUNK_DIM;
    const lz = wz - chunk.cz * CHUNK_DIM;
    for (let i = 0; i < TREE_HEIGHT; i++) {
      const y = baseY + i;
      if (y < 0 || y >= CHUNK_HEIGHT) continue;
      chunk.set(lx, y, lz, log);
    }
    const canopyBase = baseY + TREE_HEIGHT - 2;
    for (let dy = 0; dy < 3; dy++) {
      const radius = dy < 2 ? 2 : 1;
      const y = canopyBase + dy;
      if (y < 0 || y >= CHUNK_HEIGHT) continue;
      for (let ox = -radius; ox <= radius; ox++) {
        for (let oz = -radius; oz <= radius; oz++) {
          const tx = lx + ox;
          const tz = lz + oz;
          if (tx < 0 || tx >= CHUNK_DIM || tz < 0 || tz >= CHUNK_DIM) continue;
          if (ox === 0 && oz === 0 && dy < 2) continue;
          if (Math.abs(ox) === radius && Math.abs(oz) === radius && radius > 1) continue;
          const current = chunk.get(tx, y, tz);
          if (current === AIR) chunk.set(tx, y, tz, leaves);
        }
      }
    }
  }
}
