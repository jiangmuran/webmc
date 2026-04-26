import type { BlockState } from '@/blocks/state';
import { SUBCHUNK_DIM, SUBCHUNK_VOLUME, localIndex } from './SubChunk';
import { CHUNK_DIM, CHUNK_HEIGHT, type Chunk } from './Chunk';

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
  for (let lx = 0; lx < CHUNK_DIM; lx++) {
    for (let lz = 0; lz < CHUNK_DIM; lz++) {
      let topOpaque = -1;
      for (let y = CHUNK_HEIGHT - 1; y >= 0; y--) {
        const state = chunk.get(lx, y, lz);
        if (oracle.isOpaque(state)) {
          topOpaque = y;
          break;
        }
      }
      for (let y = 0; y < CHUNK_HEIGHT; y++) {
        const cy = y >> 4;
        const sec = ensureSection(light, cy, 0);
        const skyVal = y > topOpaque ? MAX_LIGHT : 0;
        const prev = sec[localIndex(lx, y & 0xf, lz)] ?? 0;
        sec[localIndex(lx, y & 0xf, lz)] = packLight(skyVal, unpackBlock(prev));
      }
    }
  }
}

interface LightNode {
  x: number;
  y: number;
  z: number;
  value: number;
}

// BFS block-light propagation from emissive voxels. Attenuates by 1 per step.
// Scoped to a single chunk for M3 — cross-chunk bleed is an upgrade.
export function computeBlockLight(chunk: Chunk, oracle: LightOracle, light: ChunkLight): void {
  const queue: LightNode[] = [];
  for (let y = 0; y < CHUNK_HEIGHT; y++) {
    const cy = y >> 4;
    const sec = chunk.section(cy);
    if (!sec) continue;
    for (let lx = 0; lx < CHUNK_DIM; lx++) {
      for (let lz = 0; lz < CHUNK_DIM; lz++) {
        const state = chunk.get(lx, y, lz);
        const e = oracle.lightEmission(state);
        if (e > 0) {
          const lightSec = ensureSection(light, cy, 0);
          const prev = lightSec[localIndex(lx, y & 0xf, lz)] ?? 0;
          lightSec[localIndex(lx, y & 0xf, lz)] = packLight(unpackSky(prev), e);
          queue.push({ x: lx, y, z: lz, value: e });
        }
      }
    }
  }
  const neighbors: [number, number, number][] = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ];
  // Head-pointer dequeue (FIFO without shift). The original
  // queue.shift() is O(N) per pop, so a chunk with N emissive sources
  // and ~10K total propagation nodes ran O(N^2) ≈ 100M ops. With the
  // head pointer, dequeue is O(1) and the whole BFS is linear in the
  // number of voxels lit.
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    if (!node) break;
    const next = node.value - 1;
    if (next <= 0) continue;
    for (const [dx, dy, dz] of neighbors) {
      const nx = node.x + dx;
      const ny = node.y + dy;
      const nz = node.z + dz;
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
      queue.push({ x: nx, y: ny, z: nz, value: next });
    }
  }
}

export function buildLight(chunk: Chunk, oracle: LightOracle): ChunkLight {
  const light = newChunkLight();
  computeSkyLight(chunk, oracle, light);
  computeBlockLight(chunk, oracle, light);
  return light;
}

export function flatLightForSection(
  light: ChunkLight,
  cy: number,
): { sky: Uint8Array; block: Uint8Array } {
  const sec = light.sections[cy];
  const sky = new Uint8Array(SUBCHUNK_VOLUME);
  const block = new Uint8Array(SUBCHUNK_VOLUME);
  if (!sec) {
    sky.fill(MAX_LIGHT);
    return { sky, block };
  }
  for (let i = 0; i < SUBCHUNK_VOLUME; i++) {
    const b = sec[i] ?? 0;
    sky[i] = unpackSky(b);
    block[i] = unpackBlock(b);
  }
  return { sky, block };
}
void SUBCHUNK_DIM;
