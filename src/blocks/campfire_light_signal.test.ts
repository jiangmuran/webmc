import { describe, it, expect } from 'vitest';
import { lightLevel, smokeColumnDistance, damageToEntities } from './campfire_light_signal';

describe('campfire light signal', () => {
  it('lit campfire 15', () => {
    expect(lightLevel('campfire', true)).toBe(15);
  });

  it('unlit is 0', () => {
    expect(lightLevel('campfire', false)).toBe(0);
  });

  it('soul lower light', () => {
    expect(lightLevel('soul_campfire', true)).toBe(10);
  });

  it('hay doubles smoke', () => {
    expect(smokeColumnDistance('campfire', true)).toBeGreaterThan(
      smokeColumnDistance('campfire', false),
    );
  });

  it('soul campfire more damage', () => {
    expect(damageToEntities('soul_campfire', true)).toBeGreaterThan(
      damageToEntities('campfire', true),
    );
  });
});
