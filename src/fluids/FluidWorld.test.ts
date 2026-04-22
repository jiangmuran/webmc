import { describe, it, expect } from 'vitest';
import { World } from '@/world/World';
import { createDefaultRegistry } from '@/blocks/registry';
import { AIR, makeState, stateId } from '@/blocks/state';
import { FluidWorld } from './FluidWorld';

function setup(): { world: World; fluid: FluidWorld; registry: ReturnType<typeof createDefaultRegistry> } {
  const registry = createDefaultRegistry();
  const world = new World();
  const fluid = new FluidWorld({ world, registry });
  return { world, fluid, registry };
}

describe('FluidWorld', () => {
  it('places a water source block in the World', () => {
    const { world, fluid, registry } = setup();
    fluid.setSource(0, 10, 0, 'water');
    const s = world.get(0, 10, 0);
    expect(s).not.toBe(AIR);
    expect(registry.get(stateId(s)).name).toBe('webmc:water');
    expect(fluid.get(0, 10, 0)?.source).toBe(true);
  });

  it('tick flows water down through air', () => {
    const { world, fluid } = setup();
    fluid.setSource(0, 10, 0, 'water');
    fluid.tick();
    const below = fluid.get(0, 9, 0);
    expect(below).not.toBeNull();
    expect(below?.kind).toBe('water');
    expect(below?.source).toBe(false);
    expect(world.get(0, 9, 0)).not.toBe(AIR);
  });

  it('clears fluid block when source removed and dries up', () => {
    const { world, fluid, registry } = setup();
    const stoneId = registry.byName('webmc:stone');
    if (stoneId === undefined) throw new Error('missing stone');
    const stoneState = makeState(stoneId);
    for (let x = -5; x <= 5; x++) {
      for (let z = -5; z <= 5; z++) {
        world.set(x, 9, z, stoneState);
      }
    }
    fluid.setSource(0, 10, 0, 'water');
    for (let i = 0; i < 8; i++) fluid.tick();
    expect(fluid.size()).toBeGreaterThan(1);
    fluid.clear(0, 10, 0);
    for (let i = 0; i < 2; i++) fluid.tick();
    expect(fluid.size()).toBe(0);
    expect(world.get(1, 10, 0)).toBe(AIR);
  });

  it('lava attenuates faster than water', () => {
    const { fluid } = setup();
    fluid.setSource(0, 10, 0, 'lava');
    for (let i = 0; i < 5; i++) fluid.tick();
    const lavaCount = fluid.size();
    const second = setup();
    second.fluid.setSource(0, 10, 0, 'water');
    for (let i = 0; i < 5; i++) second.fluid.tick();
    const waterCount = second.fluid.size();
    expect(lavaCount).toBeLessThan(waterCount);
  });
});
