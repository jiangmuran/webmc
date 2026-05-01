import { describe, it, expect } from 'vitest';
import { FOODS, applyFood, isFood } from './food';

class StubPlayer {
  hunger = 10;
  saturation = 0;
  effects: { id: string; amp: number; dur: number }[] = [];
  eat(h: number, s: number): void {
    this.hunger = Math.min(20, this.hunger + h);
    this.saturation = Math.min(this.hunger, this.saturation + s);
  }
  applyEffect(id: string, amp: number, dur: number): void {
    this.effects.push({ id, amp, dur });
  }
}

describe('food', () => {
  it('has 20+ canonical foods', () => {
    expect(Object.keys(FOODS).length).toBeGreaterThanOrEqual(20);
  });

  it('cooked > raw for every beef/pork/chicken/mutton/rabbit pair', () => {
    const pairs = [
      ['cooked_beef', 'raw_beef'],
      ['cooked_porkchop', 'raw_porkchop'],
      ['cooked_chicken', 'raw_chicken'],
      ['cooked_mutton', 'raw_mutton'],
      ['cooked_rabbit', 'raw_rabbit'],
    ] as const;
    for (const [cooked, raw] of pairs) {
      expect(FOODS[cooked]?.hunger).toBeGreaterThan(FOODS[raw]?.hunger ?? 99);
    }
  });

  it('applyFood restores hunger', () => {
    const p = new StubPlayer();
    p.hunger = 10;
    applyFood('bread', p);
    expect(p.hunger).toBe(15); // bread = 5
  });

  it('applyFood rejects when full', () => {
    const p = new StubPlayer();
    p.hunger = 20;
    expect(applyFood('bread', p)).toBe(false);
  });

  it('golden apple bypasses the full-hunger check', () => {
    const p = new StubPlayer();
    p.hunger = 20;
    expect(applyFood('golden_apple', p)).toBe(true);
    expect(p.effects.length).toBe(1);
    expect(p.effects[0]?.id).toBe('regeneration');
  });

  it('spider eye applies poison for 5 seconds (wiki)', () => {
    const p = new StubPlayer();
    applyFood('spider_eye', p, () => 0.5);
    const poison = p.effects.find((e) => e.id === 'poison');
    expect(poison).toBeDefined();
    expect(poison?.dur).toBe(5);
  });

  it('raw chicken sometimes applies hunger', () => {
    const p1 = new StubPlayer();
    applyFood('raw_chicken', p1, () => 0.01); // below 0.3 chance
    expect(p1.effects.some((e) => e.id === 'hunger')).toBe(true);
    const p2 = new StubPlayer();
    applyFood('raw_chicken', p2, () => 0.9); // above 0.3 chance
    expect(p2.effects.some((e) => e.id === 'hunger')).toBe(false);
  });

  it('isFood distinguishes food from non-food', () => {
    expect(isFood('webmc:bread')).toBe(true);
    expect(isFood('webmc:stone')).toBe(false);
  });
});
