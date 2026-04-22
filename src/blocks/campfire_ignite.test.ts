import { describe, it, expect } from 'vitest';
import { extinguish, ignite, isProducingSmoke, makeCampfireLit } from './campfire_ignite';

describe('campfire ignition', () => {
  it('flint_and_steel consumes durability', () => {
    const s = makeCampfireLit('campfire');
    s.lit = false;
    const r = ignite({ state: s, tool: 'flint_and_steel' });
    expect(r.lit).toBe(true);
    expect(r.consumedDurability).toBe(true);
  });

  it('fire charge consumed', () => {
    const s = makeCampfireLit('campfire');
    s.lit = false;
    const r = ignite({ state: s, tool: 'fire_charge' });
    expect(r.consumedItem).toBe(true);
  });

  it('already-lit = no-op', () => {
    const s = makeCampfireLit('campfire');
    const r = ignite({ state: s, tool: 'flint_and_steel' });
    expect(r.consumedDurability).toBe(false);
  });

  it('waterlogged cannot be lit', () => {
    const s = makeCampfireLit('campfire');
    s.waterlogged = true;
    s.lit = false;
    expect(ignite({ state: s, tool: 'flint_and_steel' }).lit).toBe(false);
  });

  it('shovel extinguishes', () => {
    const s = makeCampfireLit('campfire');
    expect(extinguish(s, 'shovel')).toBe(true);
    expect(s.lit).toBe(false);
  });

  it('waterlog also kills smoke', () => {
    const s = makeCampfireLit('campfire');
    extinguish(s, 'waterlog');
    expect(s.waterlogged).toBe(true);
    expect(isProducingSmoke(s)).toBe(false);
  });

  it('producing smoke when lit and dry', () => {
    const s = makeCampfireLit('campfire');
    expect(isProducingSmoke(s)).toBe(true);
  });
});
