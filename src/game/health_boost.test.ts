import { describe, it, expect } from 'vitest';
import {
  applyAbsorption,
  applyDamage,
  applyHealthBoost,
  removeAbsorption,
  removeHealthBoost,
  tickSaturation,
} from './health_boost';

const carrier = (): {
  maxHp: number;
  absorptionHp: number;
  hunger: number;
  saturation: number;
} => ({ maxHp: 20, absorptionHp: 0, hunger: 20, saturation: 5 });

describe('health boost', () => {
  it('raises max hp + 4 per amp+1', () => {
    const c = carrier();
    applyHealthBoost(c, 1);
    expect(c.maxHp).toBe(28);
    removeHealthBoost(c, 1);
    expect(c.maxHp).toBe(20);
  });
});

describe('absorption', () => {
  it('sets the golden hearts', () => {
    const c = carrier();
    applyAbsorption(c, 0);
    expect(c.absorptionHp).toBe(4);
  });

  it('damage consumes absorption first', () => {
    const c = carrier();
    applyAbsorption(c, 1);
    const remaining = applyDamage(c, 3);
    expect(remaining).toBe(0);
    expect(c.absorptionHp).toBe(5);
  });

  it('damage past absorption spills through', () => {
    const c = carrier();
    applyAbsorption(c, 0);
    const remaining = applyDamage(c, 10);
    expect(remaining).toBe(6);
  });

  it('remove clears absorption', () => {
    const c = carrier();
    applyAbsorption(c, 0);
    removeAbsorption(c);
    expect(c.absorptionHp).toBe(0);
  });
});

describe('saturation effect', () => {
  it('tickly restores hunger + saturation', () => {
    const c = carrier();
    c.hunger = 15;
    c.saturation = 0;
    tickSaturation(c, 1, 1);
    expect(c.hunger).toBeGreaterThan(15);
    expect(c.saturation).toBeGreaterThan(0);
  });
});
