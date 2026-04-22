import { describe, it, expect } from 'vitest';
import { STEW_EFFECTS, eatSuspiciousStew } from './suspicious_stew';

class Stub {
  effects: { id: string; amplifier: number; durationSec: number }[] = [];
  hunger = 10;
  saturation = 0;
  applyEffect(id: string, amplifier: number, durationSec: number): void {
    this.effects.push({ id, amplifier, durationSec });
  }
  eat(h: number, s: number): void {
    this.hunger += h;
    this.saturation += s;
  }
}

describe('suspicious stew', () => {
  it('all 10 flowers have an effect', () => {
    expect(Object.keys(STEW_EFFECTS).length).toBe(10);
  });

  it('wither rose applies wither', () => {
    expect(STEW_EFFECTS.wither_rose.id).toBe('wither');
  });

  it('eating restores hunger + saturation + effect', () => {
    const s = new Stub();
    eatSuspiciousStew('cornflower', s);
    expect(s.hunger).toBeGreaterThan(10);
    expect(s.effects[0]?.id).toBe('jump_boost');
  });

  it('lily of the valley poisons', () => {
    const s = new Stub();
    eatSuspiciousStew('lily_of_the_valley', s);
    expect(s.effects[0]?.id).toBe('poison');
  });
});
