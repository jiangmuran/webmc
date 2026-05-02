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

  it('eating restores 6 hunger + 7.2 saturation + effect (wiki)', () => {
    const s = new Stub();
    eatSuspiciousStew('cornflower', s);
    expect(s.hunger).toBe(16); // 10 starting + 6
    expect(s.saturation).toBeCloseTo(7.2);
    expect(s.effects[0]?.id).toBe('jump_boost');
  });

  it('weakness duration is 7s per wiki 24w45a', () => {
    expect(STEW_EFFECTS.tulip.durationSec).toBe(7);
  });

  it('blindness duration is 11s per wiki 24w45a', () => {
    expect(STEW_EFFECTS.azure_bluet.durationSec).toBe(11);
  });

  it('poison duration is 11s per wiki 24w45a', () => {
    expect(STEW_EFFECTS.lily_of_the_valley.durationSec).toBe(11);
  });

  it('fire_resistance is 3s per wiki 24w45a', () => {
    expect(STEW_EFFECTS.allium.durationSec).toBe(3);
  });

  it('lily of the valley poisons', () => {
    const s = new Stub();
    eatSuspiciousStew('lily_of_the_valley', s);
    expect(s.effects[0]?.id).toBe('poison');
  });
});
