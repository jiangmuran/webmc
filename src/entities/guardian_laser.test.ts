import { describe, it, expect } from 'vitest';
import { makeGuardianLaser, tickGuardian } from './guardian_laser';

describe('guardian laser', () => {
  it('charges for 4s then fires', () => {
    const s = makeGuardianLaser();
    let fired = false;
    for (let i = 0; i < 60; i++) {
      if (
        tickGuardian(s, {
          dtSec: 0.1,
          targetId: 1,
          lineOfSight: true,
          difficulty: 'normal',
        }).fired
      ) {
        fired = true;
      }
    }
    expect(fired).toBe(true);
  });

  it('losing LOS resets charge', () => {
    const s = makeGuardianLaser();
    tickGuardian(s, { dtSec: 2, targetId: 1, lineOfSight: true, difficulty: 'normal' });
    tickGuardian(s, { dtSec: 0.1, targetId: 1, lineOfSight: false, difficulty: 'normal' });
    expect(s.chargingSec).toBe(0);
  });

  it('damage scales with difficulty', () => {
    const easy = makeGuardianLaser();
    const hard = makeGuardianLaser();
    for (let i = 0; i < 50; i++) {
      tickGuardian(easy, { dtSec: 0.1, targetId: 1, lineOfSight: true, difficulty: 'easy' });
    }
    for (let i = 0; i < 50; i++) {
      tickGuardian(hard, { dtSec: 0.1, targetId: 1, lineOfSight: true, difficulty: 'hard' });
    }
    // After the fire window, extract damage from a fresh fire cycle
    const easyShot = tickGuardian(easy, {
      dtSec: 5,
      targetId: 1,
      lineOfSight: true,
      difficulty: 'easy',
    });
    const hardShot = tickGuardian(hard, {
      dtSec: 5,
      targetId: 1,
      lineOfSight: true,
      difficulty: 'hard',
    });
    expect(hardShot.damage).toBeGreaterThan(easyShot.damage);
  });
});
