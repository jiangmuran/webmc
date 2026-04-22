import { describe, it, expect } from 'vitest';
import { planRuinedPortal, rollRuinedPortalLoot } from './ruined_portal';

describe('ruined portal', () => {
  it('frame count between 4 and 10', () => {
    for (let i = 0; i < 10; i++) {
      const p = planRuinedPortal({ dimension: 'overworld', rng: () => i / 10 });
      expect(p.frameBlockCount).toBeGreaterThanOrEqual(4);
      expect(p.frameBlockCount).toBeLessThanOrEqual(10);
    }
  });

  it('nether variant always has lava', () => {
    const p = planRuinedPortal({ dimension: 'nether', rng: () => 0.5 });
    expect(p.lava).toBe(true);
    expect(p.netherAnalog).toBe(true);
  });

  it('loot roll at low index = flint_and_steel', () => {
    const r = rollRuinedPortalLoot(0.001);
    expect(r?.item).toBe('webmc:flint_and_steel');
  });

  it('loot roll at high end returns an item', () => {
    expect(rollRuinedPortalLoot(0.99)).not.toBeNull();
  });

  it('missing frames + frame count = 10', () => {
    const p = planRuinedPortal({ dimension: 'overworld', rng: () => 0.5 });
    expect(p.frameBlockCount + p.missingFrames).toBe(10);
  });
});
