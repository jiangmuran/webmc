import { describe, it, expect } from 'vitest';
import { AIR, makeState } from '@/blocks/state';
import { Chunk } from '@/world/Chunk';
import { newChunkLight } from '@/world/lighting';
import { decodeChunk, encodeChunk } from './chunk-codec';

const STONE = makeState(1, 0);
const DIRT = makeState(2, 0);
const GRASS = makeState(3, 0);

describe('chunk-codec', () => {
  it('round-trips an all-air (empty) chunk', () => {
    const c = new Chunk(5, -3);
    const bytes = encodeChunk(c);
    const { chunk, cx, cz } = decodeChunk(bytes);
    expect(cx).toBe(5);
    expect(cz).toBe(-3);
    expect(chunk.get(0, 40, 0)).toBe(AIR);
  });

  it('round-trips a sparse chunk with a handful of blocks', () => {
    const c = new Chunk(0, 0);
    c.set(0, 32, 0, STONE);
    c.set(15, 70, 15, DIRT);
    c.set(7, 80, 9, GRASS);
    const bytes = encodeChunk(c);
    const { chunk } = decodeChunk(bytes);
    expect(chunk.get(0, 32, 0)).toBe(STONE);
    expect(chunk.get(15, 70, 15)).toBe(DIRT);
    expect(chunk.get(7, 80, 9)).toBe(GRASS);
    expect(chunk.get(1, 32, 0)).toBe(AIR);
  });

  it('round-trips a dense terrain-shaped chunk', () => {
    const c = new Chunk(12, -7);
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        for (let y = 0; y < 40; y++) c.set(x, y, z, STONE);
        for (let y = 40; y < 44; y++) c.set(x, y, z, DIRT);
        c.set(x, 44, z, GRASS);
      }
    }
    const bytes = encodeChunk(c);
    const { chunk } = decodeChunk(bytes);
    for (const [x, y, z, expected] of [
      [0, 30, 0, STONE],
      [15, 42, 15, DIRT],
      [8, 44, 8, GRASS],
      [0, 45, 0, AIR],
    ] as const) {
      expect(chunk.get(x, y, z)).toBe(expected);
    }
  });

  it('round-trips with baked light', () => {
    const c = new Chunk(0, 0);
    c.set(0, 32, 0, STONE);
    const light = newChunkLight();
    const secLight = new Uint8Array(4096);
    secLight.fill(0xf0);
    light.sections[2] = secLight;
    const bytes = encodeChunk(c, light);
    const decoded = decodeChunk(bytes);
    expect(decoded.light).not.toBeNull();
    const decodedSecLight = decoded.light?.sections[2];
    if (!decodedSecLight) throw new Error('missing decoded section light');
    expect(decodedSecLight[0]).toBe(0xf0);
    expect(decodedSecLight[4095]).toBe(0xf0);
  });

  it('rejects a tampered CRC', () => {
    const c = new Chunk(0, 0);
    c.set(0, 32, 0, STONE);
    const bytes = encodeChunk(c);
    const last = bytes[bytes.length - 1] ?? 0;
    bytes[bytes.length - 1] = last ^ 0xff;
    expect(() => {
      decodeChunk(bytes);
    }).toThrow(/CRC/);
  });

  it('rejects a wrong magic', () => {
    const bytes = new Uint8Array(24 + 4);
    const dv = new DataView(bytes.buffer);
    dv.setUint32(0, 0xdeadbeef, true);
    expect(() => {
      decodeChunk(bytes);
    }).toThrow(/bad magic/);
  });

  it('bit-identical encoding of identical chunks', () => {
    const a = new Chunk(1, 1);
    const b = new Chunk(1, 1);
    a.set(3, 40, 4, STONE);
    b.set(3, 40, 4, STONE);
    const bytesA = encodeChunk(a);
    const bytesB = encodeChunk(b);
    expect(bytesA).toEqual(bytesB);
  });
});
