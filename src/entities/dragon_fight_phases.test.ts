import { describe, it, expect } from 'vitest';
import {
  chooseNextPhase,
  shouldEnterLanding,
  dyingDuration,
  LANDING_MIN_TICKS,
} from './dragon_fight_phases';

describe('dragon fight phases', () => {
  it('dead → dying', () => {
    expect(
      chooseNextPhase(
        { health: 0, maxHealth: 200, currentPhase: 'strafing', phaseTicks: 0 },
        () => 0.5,
      ),
    ).toBe('dying');
  });

  it('low health flees or strafes', () => {
    const r = chooseNextPhase(
      { health: 10, maxHealth: 200, currentPhase: 'strafing', phaseTicks: 0 },
      () => 0.1,
    );
    expect(['strafing', 'fleeing']).toContain(r);
  });

  it('enter landing after holding', () => {
    expect(
      shouldEnterLanding({
        health: 200,
        maxHealth: 200,
        currentPhase: 'holding_pattern',
        phaseTicks: LANDING_MIN_TICKS + 1,
      }),
    ).toBe(true);
  });

  it('dying duration > 0', () => {
    expect(dyingDuration()).toBeGreaterThan(0);
  });
});
