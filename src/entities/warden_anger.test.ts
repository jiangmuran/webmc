import { describe, it, expect } from 'vitest';
import {
  addAnger,
  angerLevel,
  decayAnger,
  makeWardenAnger,
  primaryTarget,
  WARDEN_ANGER_MAX,
} from './warden_anger';

describe('warden anger', () => {
  it('starts calm', () => {
    const a = makeWardenAnger();
    expect(angerLevel(a, 'p1')).toBe('calm');
  });

  it('vibration raises calm → suspect (wiki: any non-projectile vibration adds 35)', () => {
    const a = makeWardenAnger();
    addAnger(a, 'p1', 'vibration_close');
    expect(angerLevel(a, 'p1')).toBe('suspect');
  });

  it('melee escalates to target', () => {
    const a = makeWardenAnger();
    addAnger(a, 'p1', 'melee_hit');
    addAnger(a, 'p1', 'melee_hit');
    addAnger(a, 'p1', 'melee_hit');
    expect(angerLevel(a, 'p1')).toBe('target');
  });

  it('caps at max', () => {
    const a = makeWardenAnger();
    for (let i = 0; i < 20; i++) addAnger(a, 'p1', 'melee_hit');
    expect(a.perTarget.get('p1')).toBe(WARDEN_ANGER_MAX);
    expect(angerLevel(a, 'p1')).toBe('sonic_windup');
  });

  it('projectile adds 10 anger (wiki)', () => {
    const a = makeWardenAnger();
    addAnger(a, 'p1', 'projectile_hit');
    expect(a.perTarget.get('p1')).toBe(10);
  });

  it('decays over time', () => {
    const a = makeWardenAnger();
    addAnger(a, 'p1', 'melee_hit'); // 35
    decayAnger(a, 5);
    expect(a.perTarget.get('p1')).toBe(30);
  });

  it('clears target below zero', () => {
    const a = makeWardenAnger();
    addAnger(a, 'p1', 'projectile_hit'); // +10
    decayAnger(a, 11);
    expect(a.perTarget.has('p1')).toBe(false);
  });

  it('primary target is the highest-anger entity', () => {
    const a = makeWardenAnger();
    addAnger(a, 'p1', 'melee_hit'); // 35
    addAnger(a, 'p1', 'melee_hit'); // 70
    addAnger(a, 'p2', 'projectile_hit'); // 10
    expect(primaryTarget(a)).toBe('p1');
  });

  it('non-projectile vibrations add 35 (wiki, no close/far falloff)', () => {
    const a = makeWardenAnger();
    addAnger(a, 'p1', 'vibration_close');
    expect(a.perTarget.get('p1')).toBe(35);
    const b = makeWardenAnger();
    addAnger(b, 'p1', 'vibration_far');
    expect(b.perTarget.get('p1')).toBe(35);
  });

  it('null when no angers', () => {
    expect(primaryTarget(makeWardenAnger())).toBeNull();
  });
});
