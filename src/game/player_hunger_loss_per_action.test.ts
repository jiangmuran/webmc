import { describe, it, expect } from 'vitest';
import { addExhaustion, saturationConsumesAt, EXHAUSTION } from './player_hunger_loss_per_action';

describe('hunger per action', () => {
  it('sprint > walk', () => {
    expect(addExhaustion(0, 'sprint')).toBeGreaterThan(addExhaustion(0, 'walk'));
  });

  it('regen heavy', () => {
    expect(EXHAUSTION['regen']).toBeGreaterThan(1);
  });

  it('unknown no-op', () => {
    expect(addExhaustion(5, 'sneeze')).toBe(5);
  });

  it('saturation bucket 4', () => {
    expect(saturationConsumesAt()).toBe(4);
  });
});
