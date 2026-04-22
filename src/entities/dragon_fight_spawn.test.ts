import { describe, it, expect } from 'vitest';
import {
  initialFight,
  destroyPillar,
  dragonHasHealBeam,
  dragonDies,
  placeResurrectCrystal,
  completeRespawn,
  PILLAR_COUNT,
  RESPAWN_CRYSTALS,
} from './dragon_fight_spawn';

describe('dragon fight', () => {
  it('pillars at start', () => {
    const s = initialFight();
    expect(s.pillarsStanding).toBe(PILLAR_COUNT);
    expect(dragonHasHealBeam(s)).toBe(true);
  });

  it('no heal without pillars', () => {
    const s = initialFight();
    for (let i = 0; i < PILLAR_COUNT; i++) destroyPillar(s);
    expect(dragonHasHealBeam(s)).toBe(false);
  });

  it('respawn needs 4 crystals', () => {
    const s = initialFight();
    dragonDies(s);
    for (let i = 0; i < RESPAWN_CRYSTALS - 1; i++) {
      expect(placeResurrectCrystal(s)).toBe('placed');
    }
    expect(placeResurrectCrystal(s)).toBe('complete');
    expect(s.dragonRespawning).toBe(true);
  });

  it('cannot respawn while alive', () => {
    const s = initialFight();
    expect(placeResurrectCrystal(s)).toBe('dragon_alive');
  });

  it('completeRespawn restores', () => {
    const s = initialFight();
    dragonDies(s);
    for (let i = 0; i < RESPAWN_CRYSTALS; i++) placeResurrectCrystal(s);
    completeRespawn(s);
    expect(s.dragonAlive).toBe(true);
    expect(s.pillarsStanding).toBe(PILLAR_COUNT);
  });
});
