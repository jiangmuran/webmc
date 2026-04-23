import { describe, it, expect } from 'vitest';
import { hitDetected, damageOnHit, DASH_DAMAGE } from './camel_dash_attack';

describe('camel dash attack', () => {
  it('close dashing hits', () => {
    expect(hitDetected({ dashing: true, targetX: 1, targetZ: 0, myX: 0, myZ: 0 })).toBe(true);
  });

  it('not dashing misses', () => {
    expect(hitDetected({ dashing: false, targetX: 1, targetZ: 0, myX: 0, myZ: 0 })).toBe(false);
  });

  it('far miss', () => {
    expect(hitDetected({ dashing: true, targetX: 10, targetZ: 10, myX: 0, myZ: 0 })).toBe(false);
  });

  it('damage on hit', () => {
    expect(damageOnHit({ dashing: true, targetX: 1, targetZ: 0, myX: 0, myZ: 0 })).toBe(
      DASH_DAMAGE,
    );
  });
});
