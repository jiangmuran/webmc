import { describe, it, expect } from 'vitest';
import { EXHAUSTION_COSTS, addExhaustion, makeHungerState } from './hunger';

describe('hunger exhaustion', () => {
  it('starts at full + 0 exhaustion', () => {
    const h = makeHungerState();
    expect(h.hunger).toBe(20);
    expect(h.exhaustion).toBe(0);
  });

  it('accumulating exhaustion drains saturation first', () => {
    const h = makeHungerState();
    addExhaustion(h, 5);
    expect(h.exhaustion).toBeLessThan(4);
    expect(h.saturation).toBeLessThan(5);
  });

  it('empty saturation then drains hunger', () => {
    const h = makeHungerState();
    h.saturation = 0;
    addExhaustion(h, 4);
    expect(h.hunger).toBe(19);
  });

  it('large exhaustion dump consumes multiple units', () => {
    const h = makeHungerState();
    h.saturation = 0;
    addExhaustion(h, 16);
    expect(h.hunger).toBeLessThan(20);
  });

  it('costs table has expected actions', () => {
    expect(EXHAUSTION_COSTS.sprint_per_meter).toBeGreaterThan(0);
    expect(EXHAUSTION_COSTS.attack).toBeGreaterThan(0);
  });
});
