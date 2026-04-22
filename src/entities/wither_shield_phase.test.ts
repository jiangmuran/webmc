import { describe, it, expect } from 'vitest';
import {
  makeWither,
  tickPhase,
  damageWither,
  CHARGE_TICKS,
  ARMORED_THRESHOLD,
  MAX_HP,
} from './wither_shield_phase';

describe('wither', () => {
  it('charging invulnerable', () => {
    const w = makeWither(0);
    expect(damageWither(w, { amount: 100, fromExplosion: false })).toBe(0);
  });

  it('after charge normal phase', () => {
    const w = makeWither(0);
    tickPhase(w, CHARGE_TICKS);
    expect(w.phase).toBe('normal');
    expect(w.hp).toBe(MAX_HP);
  });

  it('armored below half hp', () => {
    const w = makeWither(0);
    tickPhase(w, CHARGE_TICKS);
    w.hp = MAX_HP * ARMORED_THRESHOLD - 1;
    tickPhase(w, CHARGE_TICKS + 1);
    expect(w.phase).toBe('armored');
  });

  it('armored immune to explosion', () => {
    const w = { hp: 100, maxHp: MAX_HP, phase: 'armored' as const, spawnTick: 0 };
    expect(damageWither(w, { amount: 50, fromExplosion: true })).toBe(0);
    expect(damageWither(w, { amount: 50, fromExplosion: false })).toBe(50);
  });

  it('hp 0 → dead', () => {
    const w = makeWither(0);
    tickPhase(w, CHARGE_TICKS);
    w.hp = 0;
    tickPhase(w, CHARGE_TICKS + 10);
    expect(w.phase).toBe('dead');
  });
});
