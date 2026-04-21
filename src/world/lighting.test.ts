import { describe, it, expect } from 'vitest';
import { AIR, type BlockState, makeState, stateId } from '@/blocks/state';
import { createDefaultRegistry } from '@/blocks/registry';
import { Chunk, CHUNK_HEIGHT } from './Chunk';
import {
  MAX_LIGHT,
  buildLight,
  computeBlockLight,
  computeSkyLight,
  flatLightForSection,
  getLightByte,
  newChunkLight,
  packLight,
  unpackBlock,
  unpackSky,
} from './lighting';

const registry = createDefaultRegistry();
const STONE = makeState(registry.byName('webmc:stone') ?? 1, 0);
const GLOW = makeState(registry.byName('webmc:glowstone') ?? 1, 0);

const oracle = {
  isOpaque: (s: BlockState) => s !== AIR && registry.get(stateId(s)).opaque,
  lightEmission: (s: BlockState) => (s === AIR ? 0 : registry.get(stateId(s)).lightEmission),
};

describe('packLight / unpack', () => {
  it('round-trips sky and block values', () => {
    for (let s = 0; s <= 15; s++) {
      for (let b = 0; b <= 15; b++) {
        const p = packLight(s, b);
        expect(unpackSky(p)).toBe(s);
        expect(unpackBlock(p)).toBe(b);
      }
    }
  });
});

describe('computeSkyLight', () => {
  it('all-air chunk: every voxel has max sky light', () => {
    const c = new Chunk(0, 0);
    const light = newChunkLight();
    computeSkyLight(c, oracle, light);
    expect(unpackSky(getLightByte(light, 8, 100, 8))).toBe(MAX_LIGHT);
    expect(unpackSky(getLightByte(light, 0, 0, 0))).toBe(MAX_LIGHT);
  });

  it('stone floor at y=40: above is 15, at/below is 0', () => {
    const c = new Chunk(0, 0);
    for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) c.set(x, 40, z, STONE);
    const light = newChunkLight();
    computeSkyLight(c, oracle, light);
    expect(unpackSky(getLightByte(light, 8, 60, 8))).toBe(MAX_LIGHT);
    expect(unpackSky(getLightByte(light, 8, 40, 8))).toBe(0);
    expect(unpackSky(getLightByte(light, 8, 10, 8))).toBe(0);
  });

  it('cave: carving a hole in stone does not restore sky light', () => {
    const c = new Chunk(0, 0);
    for (let y = 30; y <= 50; y++) {
      for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) c.set(x, y, z, STONE);
    }
    c.set(8, 40, 8, AIR);
    const light = newChunkLight();
    computeSkyLight(c, oracle, light);
    expect(unpackSky(getLightByte(light, 8, 40, 8))).toBe(0);
  });
});

describe('computeBlockLight', () => {
  it('glowstone emits max block light at its own cell', () => {
    const c = new Chunk(0, 0);
    c.set(8, 40, 8, GLOW);
    const light = newChunkLight();
    computeBlockLight(c, oracle, light);
    expect(unpackBlock(getLightByte(light, 8, 40, 8))).toBeGreaterThanOrEqual(14);
  });

  it('glowstone propagates with attenuation', () => {
    const c = new Chunk(0, 0);
    c.set(8, 40, 8, GLOW);
    const light = newChunkLight();
    computeBlockLight(c, oracle, light);
    expect(unpackBlock(getLightByte(light, 8, 40, 8))).toBe(15);
    expect(unpackBlock(getLightByte(light, 9, 40, 8))).toBe(14);
    expect(unpackBlock(getLightByte(light, 10, 40, 8))).toBe(13);
  });

  it('opaque blocks do not receive propagated block light', () => {
    const c = new Chunk(0, 0);
    c.set(8, 40, 8, GLOW);
    c.set(9, 40, 8, STONE);
    const light = newChunkLight();
    computeBlockLight(c, oracle, light);
    expect(unpackBlock(getLightByte(light, 9, 40, 8))).toBe(0);
  });
});

describe('buildLight integration', () => {
  it('combines sky and block: cave with torch has nonzero block, zero sky', () => {
    const c = new Chunk(0, 0);
    for (let y = 30; y <= 60; y++) {
      for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) c.set(x, y, z, STONE);
    }
    for (let x = 5; x <= 10; x++) for (let z = 5; z <= 10; z++) c.set(x, 40, z, AIR);
    c.set(8, 40, 8, GLOW);
    const light = buildLight(c, oracle);
    expect(unpackSky(getLightByte(light, 8, 40, 8))).toBe(0);
    expect(unpackBlock(getLightByte(light, 8, 40, 8))).toBeGreaterThan(10);
  });

  it('flatLightForSection returns two 4096-entry arrays', () => {
    const c = new Chunk(0, 0);
    const light = buildLight(c, oracle);
    const { sky, block } = flatLightForSection(light, 2);
    expect(sky.length).toBe(4096);
    expect(block.length).toBe(4096);
  });
  it('CHUNK_HEIGHT sanity', () => {
    expect(CHUNK_HEIGHT).toBe(384);
  });
});
