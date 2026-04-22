import { describe, it, expect } from 'vitest';
import { AIR, stateId } from '@/blocks/state';
import { createDefaultRegistry } from '@/blocks/registry';
import { Chunk } from '../Chunk';
import { NetherGenerator } from './NetherGenerator';

const registry = createDefaultRegistry();
const NETHERRACK = registry.byName('webmc:netherrack');
const LAVA = registry.byName('webmc:lava');
const BEDROCK = registry.byName('webmc:bedrock');

describe('NetherGenerator', () => {
  it('caps with bedrock floor and ceiling', () => {
    const g = new NetherGenerator(17, registry);
    const c = new Chunk(0, 0);
    g.generateChunk(c);
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        expect(stateId(c.get(x, 0, z))).toBe(BEDROCK);
        expect(stateId(c.get(x, 128, z))).toBe(BEDROCK);
      }
    }
  });

  it('contains lava sea and netherrack', () => {
    const g = new NetherGenerator(42, registry);
    const c = new Chunk(0, 0);
    g.generateChunk(c);
    let lava = 0;
    let rack = 0;
    for (let y = 1; y < 128; y++) {
      for (let x = 0; x < 16; x++) {
        for (let z = 0; z < 16; z++) {
          const id = stateId(c.get(x, y, z));
          if (id === LAVA) lava++;
          if (id === NETHERRACK) rack++;
        }
      }
    }
    expect(lava).toBeGreaterThan(0);
    expect(rack).toBeGreaterThan(100);
  });

  it('clears air above the ceiling', () => {
    const g = new NetherGenerator(3, registry);
    const c = new Chunk(0, 0);
    g.generateChunk(c);
    expect(c.get(8, 200, 8)).toBe(AIR);
  });

  it('deterministic for same seed', () => {
    const a = new NetherGenerator(999, registry);
    const b = new NetherGenerator(999, registry);
    const ca = new Chunk(1, 1);
    const cb = new Chunk(1, 1);
    a.generateChunk(ca);
    b.generateChunk(cb);
    for (let y = 1; y < 128; y += 11) {
      expect(ca.get(3, y, 5)).toBe(cb.get(3, y, 5));
    }
  });
});
