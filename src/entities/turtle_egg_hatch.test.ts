import { describe, it, expect } from 'vitest';
import { randomTick, hatches, tramples } from './turtle_egg_hatch';

describe('turtle egg hatch', () => {
  it('advances on low roll at night', () => {
    expect(randomTick({ stage: 0, onSand: true }, true, () => 0).stage).toBe(1);
  });

  it('no advance on high roll', () => {
    expect(randomTick({ stage: 0, onSand: true }, true, () => 0.9).stage).toBe(0);
  });

  it('day chance is 1/500 (wiki)', () => {
    // p=1/500=0.002 ⇒ rand 0.003 does not trigger
    expect(randomTick({ stage: 0, onSand: true }, false, () => 0.003).stage).toBe(0);
    // rand 0.001 does trigger
    expect(randomTick({ stage: 0, onSand: true }, false, () => 0.001).stage).toBe(1);
  });

  it('hatch only at stage 2 night on sand', () => {
    expect(hatches({ stage: 2, onSand: true }, true)).toBe(true);
    expect(hatches({ stage: 2, onSand: false }, true)).toBe(false);
    expect(hatches({ stage: 1, onSand: true }, true)).toBe(false);
    expect(hatches({ stage: 2, onSand: true }, false)).toBe(false);
  });

  it('tramples except cats + turtles', () => {
    expect(tramples('zombie')).toBe(true);
    expect(tramples('cat')).toBe(false);
    expect(tramples('turtle')).toBe(false);
  });
});
