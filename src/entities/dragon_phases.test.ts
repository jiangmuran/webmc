import { describe, it, expect } from 'vitest';
import { makeDragonPhaseState, onAllCrystalsDestroyed, tickDragonPhases } from './dragon_phases';

describe('dragon phases', () => {
  it('starts circling', () => {
    expect(makeDragonPhaseState().current).toBe('circling');
  });

  it('transitions out of circling after 20s', () => {
    const s = makeDragonPhaseState();
    tickDragonPhases(s, { dtSec: 21, rng: () => 0.2 });
    expect(s.current).not.toBe('circling');
  });

  it('dying overrides everything at 0 HP', () => {
    const s = makeDragonPhaseState();
    s.health = 0;
    tickDragonPhases(s, { dtSec: 0.1, rng: () => 0 });
    expect(s.current).toBe('dying');
  });

  it('crystals destroyed forces landing', () => {
    const s = makeDragonPhaseState();
    onAllCrystalsDestroyed(s);
    expect(s.cratesLeft).toBe(0);
    expect(s.current).toBe('landing_approach');
  });

  it('low health triggers aggressive charging', () => {
    const s = makeDragonPhaseState();
    s.health = 50;
    // Force the phase timer but ensure ctx.rng triggers aggressive branch.
    let sawCharging = false;
    for (let i = 0; i < 1000; i++) {
      tickDragonPhases(s, { dtSec: 0.1, rng: Math.random });
      if (s.current === 'charging_player') sawCharging = true;
    }
    expect(sawCharging).toBe(true);
  });
});
