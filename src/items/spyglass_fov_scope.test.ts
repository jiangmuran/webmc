import { describe, it, expect } from 'vitest';
import {
  effectiveFov,
  effectiveSensitivity,
  durabilityCostPerUse,
  SPYGLASS_FOV_DEG,
} from './spyglass_fov_scope';

describe('spyglass fov scope', () => {
  it('zoom FOV tight', () => {
    expect(effectiveFov({ using: true, baseFov: 75, baseSensitivity: 1 })).toBe(SPYGLASS_FOV_DEG);
  });

  it('not using = base', () => {
    expect(effectiveFov({ using: false, baseFov: 75, baseSensitivity: 1 })).toBe(75);
  });

  it('sensitivity reduced', () => {
    expect(effectiveSensitivity({ using: true, baseFov: 75, baseSensitivity: 1 })).toBeLessThan(1);
  });

  it('no durability cost', () => {
    expect(durabilityCostPerUse()).toBe(0);
  });
});
