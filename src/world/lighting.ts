import type { BlockState } from '@/blocks/state';
import { SUBCHUNK_DIM, SUBCHUNK_VOLUME, localIndex } from './SubChunk';
import { CHUNK_DIM, CHUNK_HEIGHT, CHUNK_SECTIONS, type Chunk } from './Chunk';

export const MAX_LIGHT = 15;

export interface LightOracle {
  isOpaque: (state: BlockState) => boolean;
  lightEmission: (state: BlockState) => number;
}

// Per-subchunk flat light array (4096 bytes), each byte = (sky << 4) | block.
export function packLight(sky: number, block: number): number {
  return ((sky & 0xf) << 4) | (block & 0xf);
}

export function unpackSky(byte: number): number {
  return (byte >>> 4) & 0xf;
}

export function unpackBlock(byte: number): number {
  return byte & 0xf;
}

export interface ChunkLight {
  readonly sections: (Uint8Array | null)[];
}

export function newChunkLight(): ChunkLight {
  const sections: (Uint8Array | null)[] = new Array<Uint8Array | null>(24).fill(null);
  return { sections };
}

export function getLightByte(light: ChunkLight, lx: number, y: number, lz: number): number {
  const cy = y >> 4;
  const sec = light.sections[cy];
  if (!sec) return y >= 0 && y < CHUNK_HEIGHT ? packLight(MAX_LIGHT, 0) : 0;
  return sec[localIndex(lx, y & 0xf, lz)] ?? 0;
}

function ensureSection(light: ChunkLight, cy: number, skyInit: number): Uint8Array {
  const existing = light.sections[cy];
  if (existing) return existing;
  const arr = new Uint8Array(SUBCHUNK_VOLUME);
  if (skyInit > 0) arr.fill(packLight(skyInit, 0));
  light.sections[cy] = arr;
  return arr;
}

// Direct sunlight model: for each column, find the highest opaque y.
// Above that, skyLight = MAX_LIGHT. At and below, 0 (no horizontal bleed in
// M3; diagonal/under-overhang darkening is a post-M3 upgrade).
export function computeSkyLight(chunk: Chunk, oracle: LightOracle, light: ChunkLight): void {
  // Find the highest section that contains any opaque blocks. Above it
  // every column is fully sky-lit (skip the top-search for those
  // columns entirely). Was scanning from y=383 down through 300+ air
  // cells per column for typical surface-altitude chunks — 16x16x300
  // = 76K wasted chunk.get calls per column-search pass.
  let highestNonEmptySection = -1;
  for (let cy = CHUNK_SECTIONS - 1; cy >= 0; cy--) {
    const sec = chunk.section(cy);
    if (sec && sec.nonAirCount > 0) {
      // Also check palette has at least one opaque block — sections of
      // pure non-opaque (water-only, leaves-only) don't block sky.
      let anyOpaque = false;
      const pal = sec.palette;
      for (let i = 0; i < pal.size; i++) {
        if (oracle.isOpaque(pal.get(i))) {
          anyOpaque = true;
          break;
        }
      }
      if (anyOpaque) {
        highestNonEmptySection = cy;
        break;
      }
    }
  }
  // Top of the world for the search start. Below this is where we
  // scan; everything above is fully lit.
  const searchTopY =
    highestNonEmptySection < 0 ? -1 : (highestNonEmptySection + 1) * SUBCHUNK_DIM - 1;

  // First pass: compute topOpaque per column + track the global max so
  // we can wholesale-fill sections that are entirely above max with
  // skyLight=15. Use the module scratch — caller iterates synchronously
  // and never retains the reference.
  const topByCol = TOP_BY_COL_SCRATCH;
  let maxTopOpaque = -1;
  for (let lx = 0; lx < CHUNK_DIM; lx++) {
    for (let lz = 0; lz < CHUNK_DIM; lz++) {
      let topOpaque = -1;
      for (let y = searchTopY; y >= 0; y--) {
        const state = chunk.get(lx, y, lz);
        if (oracle.isOpaque(state)) {
          topOpaque = y;
          break;
        }
      }
      topByCol[lx * CHUNK_DIM + lz] = topOpaque;
      if (topOpaque > maxTopOpaque) maxTopOpaque = topOpaque;
    }
  }
  // Sections wholly above maxTopOpaque (section min y > max) get filled
  // with the all-lit byte (skyLight=15 << 4 | 0). The straddling section
  // (containing maxTopOpaque) needs per-column handling.
  const ALL_LIT = packLight(MAX_LIGHT, 0);
  const firstFullyLitCy = Math.floor(maxTopOpaque / SUBCHUNK_DIM) + 1;
  for (let cy = firstFullyLitCy; cy < CHUNK_SECTIONS; cy++) {
    const sec = ensureSection(light, cy, 0);
    sec.fill(ALL_LIT);
  }
  // Per-column write for the remaining cells (≤ end of straddling
  // section). computeBlockLight runs after, so unpackBlock is always
  // 0 here — write the packed byte directly.
  const writeUntilY = Math.min(CHUNK_HEIGHT - 1, firstFullyLitCy * SUBCHUNK_DIM - 1);
  for (let lx = 0; lx < CHUNK_DIM; lx++) {
    for (let lz = 0; lz < CHUNK_DIM; lz++) {
      const topOpaque = topByCol[lx * CHUNK_DIM + lz] ?? -1;
      for (let y = 0; y <= writeUntilY; y++) {
        const cy = y >> 4;
        const sec = ensureSection(light, cy, 0);
        const skyVal = y > topOpaque ? MAX_LIGHT : 0;
        sec[localIndex(lx, y & 0xf, lz)] = packLight(skyVal, 0);
      }
    }
  }
}

// Parallel neighbor-offset arrays. Was a tuple-of-tuples; each BFS
// step pulled the inner tuple then read off[0]/off[1]/off[2]. Index
// access on three flat readonly number[]s skips the tuple deref.
const NEIGHBOR_DX_6: readonly number[] = [-1, 1, 0, 0, 0, 0];
const NEIGHBOR_DY_6: readonly number[] = [0, 0, -1, 1, 0, 0];
const NEIGHBOR_DZ_6: readonly number[] = [0, 0, 0, 0, -1, 1];

// Shared per-column top-opaque scratch. computeSkyLight was allocating
// a fresh Int16Array(16*16) per call — buildLight runs hundreds of
// times during chunk streaming, so a module-scope scratch saves the
// allocation churn. Reads + writes are synchronous, never recursive.
const TOP_BY_COL_SCRATCH = new Int16Array(CHUNK_DIM * CHUNK_DIM);
// Parallel arrays for the BFS queue. Was an Array<LightNode> with a
// fresh {x,y,z,value} literal per emissive source AND per propagation
// step (chunks with many torches/glowstone hit thousands per chunk
// load). buildLight is called serially on the main thread, so per-
// module reuse is safe.
const BFS_QUEUE_X: number[] = [];
const BFS_QUEUE_Y: number[] = [];
const BFS_QUEUE_Z: number[] = [];
const BFS_QUEUE_VALUE: number[] = [];

// BFS block-light propagation from emissive voxels. Attenuates by 1 per step.
// Scoped to a single chunk for M3 — cross-chunk bleed is an upgrade.
export function computeBlockLight(chunk: Chunk, oracle: LightOracle, light: ChunkLight): void {
  const qx = BFS_QUEUE_X;
  const qy = BFS_QUEUE_Y;
  const qz = BFS_QUEUE_Z;
  const qv = BFS_QUEUE_VALUE;
  qx.length = 0;
  qy.length = 0;
  qz.length = 0;
  qv.length = 0;
  // Scan section-by-section. Skip whole sections that can't contain any
  // emissive voxel — uniform sections with non-emissive palette[0] (most
  // sky/stone/grass sections), and palette-mixed sections where every
  // palette entry has emission 0. Saves ~98K chunk.get + lightEmission
  // calls per chunk for the common no-light-block case.
  for (let cy = 0; cy < CHUNK_SECTIONS; cy++) {
    const sec = chunk.section(cy);
    if (!sec) continue;
    let sectionHasEmissive = false;
    const palette = sec.palette;
    for (let i = 0; i < palette.size; i++) {
      if (oracle.lightEmission(palette.get(i)) > 0) {
        sectionHasEmissive = true;
        break;
      }
    }
    if (!sectionHasEmissive) continue;
    const yBase = cy * SUBCHUNK_DIM;
    for (let dy = 0; dy < SUBCHUNK_DIM; dy++) {
      const y = yBase + dy;
      for (let lx = 0; lx < CHUNK_DIM; lx++) {
        for (let lz = 0; lz < CHUNK_DIM; lz++) {
          const state = chunk.get(lx, y, lz);
          const e = oracle.lightEmission(state);
          if (e > 0) {
            const lightSec = ensureSection(light, cy, 0);
            const prev = lightSec[localIndex(lx, y & 0xf, lz)] ?? 0;
            lightSec[localIndex(lx, y & 0xf, lz)] = packLight(unpackSky(prev), e);
            qx.push(lx);
            qy.push(y);
            qz.push(lz);
            qv.push(e);
          }
        }
      }
    }
  }
  // Head-pointer dequeue (FIFO without shift). The original
  // queue.shift() is O(N) per pop, so a chunk with N emissive sources
  // and ~10K total propagation nodes ran O(N^2) ≈ 100M ops. With the
  // head pointer, dequeue is O(1) and the whole BFS is linear in the
  // number of voxels lit.
  let head = 0;
  while (head < qx.length) {
    const cx2 = qx[head]!;
    const cy2 = qy[head]!;
    const cz2 = qz[head]!;
    const cv2 = qv[head]!;
    head++;
    const next = cv2 - 1;
    if (next <= 0) continue;
    // Iterate the 6 neighbors via parallel readonly number[]s; was a
    // tuple-of-tuples (one inner tuple deref + 3 indexed reads per
    // step) — three flat indexed reads instead.
    for (let ni = 0; ni < 6; ni++) {
      const nx = cx2 + NEIGHBOR_DX_6[ni]!;
      const ny = cy2 + NEIGHBOR_DY_6[ni]!;
      const nz = cz2 + NEIGHBOR_DZ_6[ni]!;
      if (nx < 0 || nx >= CHUNK_DIM || ny < 0 || ny >= CHUNK_HEIGHT || nz < 0 || nz >= CHUNK_DIM) {
        continue;
      }
      const state = chunk.get(nx, ny, nz);
      if (oracle.isOpaque(state)) continue;
      const ncy = ny >> 4;
      const sec = ensureSection(light, ncy, 0);
      const idx = localIndex(nx, ny & 0xf, nz);
      const prev = sec[idx] ?? 0;
      const prevBlock = unpackBlock(prev);
      if (next <= prevBlock) continue;
      sec[idx] = packLight(unpackSky(prev), next);
      qx.push(nx);
      qy.push(ny);
      qz.push(nz);
      qv.push(next);
    }
  }
}

export function buildLight(chunk: Chunk, oracle: LightOracle): ChunkLight {
  const light = newChunkLight();
  computeSkyLight(chunk, oracle, light);
  computeBlockLight(chunk, oracle, light);
  return light;
}

// Shared mutable result wrapper. The Uint8Arrays themselves are
// allocated fresh per call because they're transferred to the mesher
// worker (and become detached on the main thread after postMessage),
// but the wrapping {sky, block} object is just a temp shell — the
// caller reads it synchronously and copies the typed-array refs into
// its own dispatch options. Avoids a per-mesh-dispatch object literal.
const flatLightSliceScratch: { sky: Uint8Array; block: Uint8Array } = {
  sky: new Uint8Array(0),
  block: new Uint8Array(0),
};

export function flatLightForSection(
  light: ChunkLight,
  cy: number,
): { sky: Uint8Array; block: Uint8Array } {
  const sec = light.sections[cy];
  const sky = new Uint8Array(SUBCHUNK_VOLUME);
  const block = new Uint8Array(SUBCHUNK_VOLUME);
  if (!sec) {
    sky.fill(MAX_LIGHT);
    flatLightSliceScratch.sky = sky;
    flatLightSliceScratch.block = block;
    return flatLightSliceScratch;
  }
  for (let i = 0; i < SUBCHUNK_VOLUME; i++) {
    const b = sec[i] ?? 0;
    sky[i] = unpackSky(b);
    block[i] = unpackBlock(b);
  }
  flatLightSliceScratch.sky = sky;
  flatLightSliceScratch.block = block;
  return flatLightSliceScratch;
}
void SUBCHUNK_DIM;
