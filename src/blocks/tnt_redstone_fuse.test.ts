import { describe, it, expect } from 'vitest';
import { tryIgnite, pistonPushIgnites, TNT_FUSE_TICKS } from './tnt_redstone_fuse';

describe('tnt redstone fuse', () => {
  it('powered redstone activates', () => {
    expect(tryIgnite({ poweredByRedstone: true }, 'redstone').activated).toBe(true);
  });

  it('unpowered redstone no-op', () => {
    expect(tryIgnite({ poweredByRedstone: false }, 'redstone').activated).toBe(false);
  });

  it('flint ignites regardless', () => {
    expect(tryIgnite({ poweredByRedstone: false }, 'flint_and_steel').fuseTicks).toBe(
      TNT_FUSE_TICKS,
    );
  });

  it('chained explosion shorter fuse', () => {
    const r = tryIgnite({ poweredByRedstone: false }, 'explosion');
    expect(r.fuseTicks).toBeLessThan(TNT_FUSE_TICKS);
  });

  it('piston push no ignite', () => {
    expect(pistonPushIgnites()).toBe(false);
  });
});
