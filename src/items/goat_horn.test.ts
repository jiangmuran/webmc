import { describe, it, expect } from 'vitest';
import { HORN_DEFS, blowHorn, makeHornState, tickHorn } from './goat_horn';

describe('goat horn', () => {
  it('has 8 horn variants', () => {
    expect(Object.keys(HORN_DEFS).length).toBe(8);
  });

  it('blowHorn succeeds on fresh state', () => {
    const s = makeHornState();
    const r = blowHorn(s, 'ponder');
    expect(r.played).toBe(true);
    expect(r.variant).toBe('ponder');
  });

  it('cooldown blocks immediate re-use', () => {
    const s = makeHornState();
    blowHorn(s, 'sing');
    const r = blowHorn(s, 'sing');
    expect(r.played).toBe(false);
  });

  it('tickHorn clears cooldown', () => {
    const s = makeHornState();
    blowHorn(s, 'seek');
    tickHorn(s, 10);
    expect(s.cooldownSec).toBe(0);
    const r = blowHorn(s, 'seek');
    expect(r.played).toBe(true);
  });

  it('pitches vary across variants', () => {
    const ponder = HORN_DEFS.ponder.pitchHz;
    const yearn = HORN_DEFS.yearn.pitchHz;
    expect(yearn).toBeGreaterThan(ponder);
  });
});
