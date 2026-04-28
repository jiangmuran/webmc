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
  coalOre: BlockState;
  ironOre: BlockState;
  goldOre: BlockState;
  diamondOre: BlockState;
  redstoneOre: BlockState;
  lapisOre: BlockState;
  deepslate: BlockState;
  mossyCobble: BlockState;
  cobble: BlockState;
  water: BlockState;
  bedrock: BlockState;
}

interface OreBand {
  readonly block: keyof GeneratedBlocks;
  readonly peak: number; // y of max density
  readonly halfWidth: number; // taper
  readonly rarity: number; // hash mask threshold (smaller = rarer)
  readonly salt: number;
}

const CAVE_FREQ = 1 / 24;
// Carve when noise is within ±THRESHOLD of zero (noodle-style passages).
// 0.32 was way too wide — fbm3 clusters tightly around 0, so |n| < 0.32
// carved ~50% of underground, leaving a swiss-cheese world. 0.03 keeps
// caves to thin worm-like passages around noise zero-crossings (~10-20%
// of underground volume).
const CAVE_THRESHOLD = 0.03;
const DEEPSLATE_Y = 4;
const DUNGEON_CHANCE = 1 / 30;
const DUNGEON_SALT = 0xd00f00d;
const DUNGEON_HALF_X = 2;
const DUNGEON_HALF_Z = 2;
const DUNGEON_Y_MIN = 12;
const DUNGEON_Y_MAX = 50;

function resolve(registry: BlockRegistry, name: string): BlockState {
  const id = registry.byName(name);
  if (id === undefined) throw new Error(`WorldGenerator: missing block ${name}`);
  return makeState(id, 0);
}

const ORE_BANDS: readonly OreBand[] = [
  { block: 'coalOre', peak: 55, halfWidth: 45, rarity: 512, salt: 0xc0a1 },
  { block: 'ironOre', peak: 20, halfWidth: 30, rarity: 900, salt: 0x1702 },
  { block: 'goldOre', peak: 14, halfWidth: 18, rarity: 1700, salt: 0x9010 },
  { block: 'redstoneOre', peak: 8, halfWidth: 14, rarity: 1400, salt: 0xd571 },
  { block: 'lapisOre', peak: 14, halfWidth: 16, rarity: 2100, salt: 0x1a15 },
  { block: 'diamondOre', peak: 5, halfWidth: 10, rarity: 3400, salt: 0xd1a3 },
];

export class WorldGenerator {
  readonly heightNoise: Perlin;
  readonly biomeNoise: Perlin;
  readonly caveNoise: Perlin;
  private readonly blocks: GeneratedBlocks;

  constructor(
    readonly seed: number,
    readonly registry: BlockRegistry,
  ) {
    this.heightNoise = new Perlin(seed);
    this.biomeNoise = new Perlin(seed ^ 0x5eed1de);
    this.caveNoise = new Perlin(seed ^ 0xcafe01);
    this.blocks = {
      stone: resolve(registry, 'webmc:stone'),
      dirt: resolve(registry, 'webmc:dirt'),
      grass: resolve(registry, 'webmc:grass_block'),
      sand: resolve(registry, 'webmc:sand'),
      log: resolve(registry, 'webmc:oak_log'),
      leaves: resolve(registry, 'webmc:oak_leaves'),
      coalOre: resolve(registry, 'webmc:coal_ore'),
      ironOre: resolve(registry, 'webmc:iron_ore'),
      goldOre: resolve(registry, 'webmc:gold_ore'),
      diamondOre: resolve(registry, 'webmc:diamond_ore'),
      redstoneOre: resolve(registry, 'webmc:redstone_ore'),
      lapisOre: resolve(registry, 'webmc:lapis_ore'),
      deepslate: resolve(registry, 'webmc:deepslate'),
      mossyCobble: resolve(registry, 'webmc:mossy_cobblestone'),
      cobble: resolve(registry, 'webmc:cobblestone'),
      water: resolve(registry, 'webmc:water'),
      bedrock: resolve(registry, 'webmc:bedrock'),
    };
  }

  isCave(wx: number, wy: number, wz: number): boolean {
    if (wy < 2 || wy > 60) return false;
    const n = this.caveNoise.fbm3(wx * CAVE_FREQ, wy * CAVE_FREQ, wz * CAVE_FREQ, 3);
    return Math.abs(n) < CAVE_THRESHOLD;
  }

  oreAt(wx: number, wy: number, wz: number): BlockState | null {
    if (wy > 70) return null;
    for (const band of ORE_BANDS) {
      const dist = Math.abs(wy - band.peak);
      if (dist > band.halfWidth) continue;
      const density = 1 - dist / band.halfWidth;
      const h = hash32(wx, wz ^ band.salt, (this.seed ^ (wy * 0x9e3779b1)) >>> 0);
      if ((h % band.rarity) / band.rarity < density * 0.04) {
        return this.blocks[band.block];
      }
    }
    return null;
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
    const { stone, dirt, grass, sand, log, leaves, deepslate, water, bedrock } = this.blocks;
    const cx = chunk.cx;
    const cz = chunk.cz;
    // Hoist this.caveNoise once. Method-dispatch through `this.isCave`
    // was inlined into the y-loop below — one method-call per cave-
    // eligible cell × 16x16x~50 = ~13K calls per chunk gen.
    const caveNoise = this.caveNoise;
    for (let lx = 0; lx < CHUNK_DIM; lx++) {
      for (let lz = 0; lz < CHUNK_DIM; lz++) {
        const wx = cx * CHUNK_DIM + lx;
        const wz = cz * CHUNK_DIM + lz;
        const surface = this.surfaceAt(wx, wz);
        const isUnderwater = surface <= SEA_LEVEL;
        const topBlock = isUnderwater ? sand : grass;
        // Subsurface band (the 3 cells below topBlock): sand under
        // beaches/oceans, dirt under regular terrain. Hoist out of the
        // y-loop instead of recomputing `topBlock === sand ? sand :
        // dirt` per cell — saves ~4 ternaries per column × 256 cols
        // per chunk = ~1K ternary evals per chunk gen.
        const subSurfaceBlock = isUnderwater ? sand : dirt;
        // biomeAt is only consulted below for tree placement, which
        // never happens underwater (gated by topBlock === grass). Skip
        // the fbm noise call entirely for underwater columns — large
        // ocean chunks gen substantially faster.
        const biome = isUnderwater ? PLAINS : this.biomeAt(wx, wz);
        // Pre-multiply the per-column components of the cave-noise
        // sample. wy varies per cell but wx/wz are loop-invariant —
        // hoist their *CAVE_FREQ multiplies once per column instead
        // of per cave-check call (~50 cave checks per column).
        const cavewx = wx * CAVE_FREQ;
        const cavewz = wz * CAVE_FREQ;
        for (let y = 0; y <= surface; y++) {
          let state = stone;
          if (y === 0) state = bedrock;
          else if (y <= DEEPSLATE_Y) state = deepslate;
          if (y === surface) state = topBlock;
          else if (y >= surface - 3) state = subSurfaceBlock;
          // Cave carve — inlined isCave with hoisted CAVE_FREQ multiplies.
          // Same y range gate (2..60) as the public method.
          if (y < surface && y >= 2 && y <= 60) {
            const n = caveNoise.fbm3(cavewx, y * CAVE_FREQ, cavewz, 3);
            if (n < CAVE_THRESHOLD && n > -CAVE_THRESHOLD) {
              chunk.set(lx, y, lz, AIR);
              continue;
            }
          }
          if (y < surface - 4 && y > DEEPSLATE_Y) {
            const ore = this.oreAt(wx, y, wz);
            if (ore !== null) state = ore;
          }
          chunk.set(lx, y, lz, state);
        }
        // Flood oceans, rivers, and low terrain with water up to sea level.
        if (surface < SEA_LEVEL) {
          for (let y = surface + 1; y <= SEA_LEVEL; y++) {
            chunk.set(lx, y, lz, water);
          }
        }
        if (biome === FOREST && topBlock === grass) {
          const h = hash32(wx, wz, this.seed);
          if ((h & 0xffff) / 0xffff < TREE_DENSITY) {
            this.plantTree(wx, wz, surface + 1, log, leaves, chunk);
          }
        }
      }
    }
    this.maybePlaceDungeon(chunk);
  }

  private maybePlaceDungeon(chunk: Chunk): void {
    const h = hash32(chunk.cx, chunk.cz, this.seed ^ DUNGEON_SALT);
    if ((h % 10000) / 10000 >= DUNGEON_CHANCE) return;
    const cornerX = (h >>> 4) % 16;
    const cornerZ = (h >>> 12) % 16;
    const cornerY = DUNGEON_Y_MIN + ((h >>> 20) % (DUNGEON_Y_MAX - DUNGEON_Y_MIN));
    const { mossyCobble, cobble } = this.blocks;
    for (let dx = -DUNGEON_HALF_X; dx <= DUNGEON_HALF_X; dx++) {
      for (let dz = -DUNGEON_HALF_Z; dz <= DUNGEON_HALF_Z; dz++) {
        for (let dy = 0; dy <= 3; dy++) {
          const lx = cornerX + dx;
          const lz = cornerZ + dz;
          const y = cornerY + dy;
          if (lx < 0 || lx >= CHUNK_DIM || lz < 0 || lz >= CHUNK_DIM) continue;
          if (y < 1 || y >= CHUNK_HEIGHT) continue;
          const onWall =
            Math.abs(dx) === DUNGEON_HALF_X ||
            Math.abs(dz) === DUNGEON_HALF_Z ||
            dy === 0 ||
            dy === 3;
          if (onWall) {
            const mossy = ((hash32(lx, y * 17 + lz, this.seed) >>> 0) & 3) === 0;
            chunk.set(lx, y, lz, mossy ? mossyCobble : cobble);
          } else {
            chunk.set(lx, y, lz, AIR);
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
