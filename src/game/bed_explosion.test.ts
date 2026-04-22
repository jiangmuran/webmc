import { describe, it, expect } from 'vitest';
import { tryUseAnchor, tryUseBed } from './bed_explosion';

describe('bed explosion', () => {
  it('bed in nether explodes', () => {
    const r = tryUseBed({ dimension: 'nether', isNight: true });
    expect(r.explodes).toBe(true);
    expect(r.explosionPower).toBe(5);
    expect(r.canSleep).toBe(false);
  });

  it('bed in end explodes', () => {
    const r = tryUseBed({ dimension: 'end', isNight: true });
    expect(r.explodes).toBe(true);
  });

  it('overworld night sleep works', () => {
    const r = tryUseBed({ dimension: 'overworld', isNight: true });
    expect(r.canSleep).toBe(true);
    expect(r.explodes).toBe(false);
  });

  it('overworld day refuses sleep', () => {
    const r = tryUseBed({ dimension: 'overworld', isNight: false });
    expect(r.canSleep).toBe(false);
    expect(r.explodes).toBe(false);
  });
});

describe('respawn anchor', () => {
  it('charged anchor in nether sets spawn', () => {
    const r = tryUseAnchor({ dimension: 'nether', charges: 3 });
    expect(r.canRespawn).toBe(true);
    expect(r.chargesAfter).toBe(2);
  });

  it('uncharged anchor does nothing', () => {
    const r = tryUseAnchor({ dimension: 'nether', charges: 0 });
    expect(r.canRespawn).toBe(false);
    expect(r.explodes).toBe(false);
  });

  it('anchor in overworld explodes', () => {
    const r = tryUseAnchor({ dimension: 'overworld', charges: 4 });
    expect(r.explodes).toBe(true);
    expect(r.explosionPower).toBe(5);
  });
});
