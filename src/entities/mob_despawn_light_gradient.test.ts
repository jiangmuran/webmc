import { describe, it, expect } from 'vitest';
import { shouldDespawnFromLight, canNaturallyRespawn } from './mob_despawn_light_gradient';

describe('mob despawn light gradient', () => {
  it('zombie in sun would burn', () => {
    expect(
      shouldDespawnFromLight({ type: 'zombie', skyLight: 15, blockLight: 0, ticksAlive: 100 }),
    ).toBe(true);
  });

  it('cow immune', () => {
    expect(
      shouldDespawnFromLight({ type: 'cow', skyLight: 15, blockLight: 0, ticksAlive: 100 }),
    ).toBe(false);
  });

  it('dark spawn allowed', () => {
    expect(
      canNaturallyRespawn({ type: 'zombie', skyLight: 0, blockLight: 0, ticksAlive: 0 }),
    ).toBe(true);
  });
});
