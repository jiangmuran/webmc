import { describe, it, expect } from 'vitest';
import { createDefaultRegistry } from '@/blocks/registry';
import { World } from './World';
import { WorldGenerator } from './generation/WorldGenerator';
import { ChunkLoader } from './ChunkLoader';

function build() {
  const world = new World();
  const registry = createDefaultRegistry();
  const generator = new WorldGenerator(42, registry);
  const loader = new ChunkLoader(world, generator, {
    viewRadius: 2,
    unloadPadding: 1,
    perFrameBudget: 4,
  });
  return { world, loader };
}

describe('ChunkLoader', () => {
  it('loads chunks around the player across multiple ticks', () => {
    const { world, loader } = build();
    const unloaded: [number, number][] = [];
    const onUnload = (cx: number, cz: number) => unloaded.push([cx, cz]);
    for (let ticks = 0; ticks < 200; ticks++) {
      const stats = loader.update(0, 0, onUnload);
      if (stats.pending === 0) break;
    }
    const loaded = world.chunkCount;
    expect(loaded).toBe(5 * 5);
    expect(unloaded).toEqual([]);
  });

  it('unloads chunks when the player moves far enough away', () => {
    const { world, loader } = build();
    for (let i = 0; i < 200; i++) loader.update(0, 0, () => undefined);
    expect(world.chunkCount).toBe(5 * 5);

    const unloaded: [number, number][] = [];
    for (let i = 0; i < 200; i++) {
      loader.update(500 * 16, 500 * 16, (cx, cz) => unloaded.push([cx, cz]));
    }
    expect(unloaded.length).toBeGreaterThanOrEqual(25);
    for (const c of world.chunks()) {
      const dx = c.cx - 500;
      const dz = c.cz - 500;
      expect(dx * dx + dz * dz).toBeLessThanOrEqual(3 * 3);
    }
  });

  it('respects the per-frame budget', () => {
    const { loader } = build();
    const stats0 = loader.update(0, 0, () => undefined);
    expect(stats0.loaded).toBeLessThanOrEqual(4);
    const stats1 = loader.update(0, 0, () => undefined);
    expect(stats1.loaded).toBeLessThanOrEqual(8);
  });

  it('prioritizes chunks closer to the player', () => {
    const { world, loader } = build();
    loader.update(0, 0, () => undefined);
    expect(world.has(0, 0)).toBe(true);
  });
});
