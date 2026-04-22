import { type BlockState, AIR, makeState } from '@/blocks/state';
import type { BlockRegistry } from '@/blocks/registry';
import { CHUNK_DIM, CHUNK_HEIGHT, type Chunk } from '../Chunk';
import { Perlin, hash32 } from '../noise/perlin';

const CEILING_Y = 128;
const LAVA_SEA_Y = 32;
const TERRAIN_FREQ = 1 / 18;
const TERRAIN_THRESHOLD = 0.22;
const QUARTZ_RARITY = 280;
const GLOWSTONE_Y = 115;

interface Blocks {
  netherrack: BlockState;
  soulsand: BlockState;
  lava: BlockState;
  quartz: BlockState;
  magma: BlockState;
  glowstone: BlockState;
  bedrock: BlockState;
}

function resolve(r: BlockRegistry, name: string): BlockState {
  const id = r.byName(name);
  if (id === undefined) throw new Error(`NetherGenerator: missing ${name}`);
  return makeState(id, 0);
}

export class NetherGenerator {
  readonly terrainNoise: Perlin;
  readonly soulNoise: Perlin;
  private readonly b: Blocks;

  constructor(
    readonly seed: number,
    readonly registry: BlockRegistry,
  ) {
    this.terrainNoise = new Perlin(seed ^ 0x1efe01);
    this.soulNoise = new Perlin(seed ^ 0x5ad501);
    this.b = {
      netherrack: resolve(registry, 'webmc:netherrack'),
      soulsand: resolve(registry, 'webmc:soul_sand'),
      lava: resolve(registry, 'webmc:lava'),
      quartz: resolve(registry, 'webmc:nether_quartz_ore'),
      magma: resolve(registry, 'webmc:magma_block'),
      glowstone: resolve(registry, 'webmc:glowstone'),
      bedrock: resolve(registry, 'webmc:bedrock'),
    };
  }

  generateChunk(chunk: Chunk): void {
    const { netherrack, soulsand, lava, quartz, magma, glowstone, bedrock } = this.b;
    for (let lx = 0; lx < CHUNK_DIM; lx++) {
      for (let lz = 0; lz < CHUNK_DIM; lz++) {
        const wx = chunk.cx * CHUNK_DIM + lx;
        const wz = chunk.cz * CHUNK_DIM + lz;
        const soul = this.soulNoise.fbm2(wx * 0.02, wz * 0.02, 3) > 0.35;
        for (let y = 0; y < CEILING_Y + 1; y++) {
          if (y === 0 || y === CEILING_Y) {
            chunk.set(lx, y, lz, bedrock);
            continue;
          }
          if (y === CEILING_Y - 1 || y === CEILING_Y - 2) {
            const lit = ((hash32(wx, wz + y, this.seed ^ 0xb100) >>> 0) & 0xff) < 4;
            chunk.set(lx, y, lz, lit ? glowstone : netherrack);
            continue;
          }
          const n = this.terrainNoise.fbm3(
            wx * TERRAIN_FREQ,
            y * TERRAIN_FREQ,
            wz * TERRAIN_FREQ,
            3,
          );
          const solid = Math.abs(n) > TERRAIN_THRESHOLD;
          if (!solid) {
            if (y <= LAVA_SEA_Y) chunk.set(lx, y, lz, lava);
            else chunk.set(lx, y, lz, AIR);
            continue;
          }
          // Base material: soul-sand near the sea, netherrack otherwise.
          let state = netherrack;
          if (soul && y < LAVA_SEA_Y + 4 && y > LAVA_SEA_Y - 2) state = soulsand;
          if (y < LAVA_SEA_Y + 5) {
            const hm = (hash32(wx, wz + y, this.seed ^ 0x9a70) >>> 0) & 0xff;
            if (hm < 8) state = magma;
          }
          // Quartz ore scattered throughout.
          if (y > 4 && y < GLOWSTONE_Y) {
            const hq =
              (hash32(wx, wz ^ 0xba7, (this.seed ^ (y * 0x77)) >>> 0) >>> 0) % QUARTZ_RARITY;
            if (hq === 0) state = quartz;
          }
          chunk.set(lx, y, lz, state);
        }
        for (let y = CEILING_Y + 1; y < CHUNK_HEIGHT; y++) {
          chunk.set(lx, y, lz, AIR);
        }
      }
    }
  }
}
