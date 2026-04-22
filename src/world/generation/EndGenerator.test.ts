import { describe, it, expect } from 'vitest';
import { AIR, stateId } from '@/blocks/state';
import { createDefaultRegistry } from '@/blocks/registry';
import { Chunk } from '../Chunk';
import { EndGenerator } from './EndGenerator';

const registry = createDefaultRegistry();
const END = registry.byName('webmc:end_stone');
const OBSIDIAN = registry.byName('webmc:obsidian');

describe('EndGenerator', () => {
  it('central island has end stone at y=60', () => {
    const g = new EndGenerator(1, registry);
    const c = new Chunk(0, 0);
    g.generateChunk(c);
    expect(stateId(c.get(8, 60, 8))).toBe(END);
  });

  it('far from island is empty air', () => {
    const g = new EndGenerator(1, registry);
    const c = new Chunk(30, 30); // ~480 blocks away
    g.generateChunk(c);
    expect(c.get(0, 60, 0)).toBe(AIR);
  });

  it('places obsidian pillars somewhere', () => {
    const g = new EndGenerator(1, registry);
    let obsidianCount = 0;
    for (let cx = -3; cx <= 3 && obsidianCount === 0; cx++) {
      for (let cz = -3; cz <= 3 && obsidianCount === 0; cz++) {
        const c = new Chunk(cx, cz);
        g.generateChunk(c);
        for (let y = 60; y < 120; y++) {
          for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
              if (stateId(c.get(x, y, z)) === OBSIDIAN) {
                obsidianCount++;
                break;
              }
            }
            if (obsidianCount > 0) break;
          }
          if (obsidianCount > 0) break;
        }
      }
    }
    expect(obsidianCount).toBeGreaterThan(0);
  });
});
