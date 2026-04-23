import { describe, it, expect } from 'vitest';
import {
  teleportTarget,
  pearlAllowed,
  OUTER_RADIUS,
  INNER_CLEAR_RADIUS,
} from './end_gateway_teleport_rules';

describe('end gateway teleport rules', () => {
  it('target in annulus', () => {
    for (let i = 0; i < 10; i++) {
      const t = teleportTarget(() => Math.random());
      const d = Math.hypot(t.x, t.z);
      expect(d).toBeGreaterThanOrEqual(INNER_CLEAR_RADIUS - 0.001);
      expect(d).toBeLessThanOrEqual(OUTER_RADIUS + 0.001);
    }
  });

  it('pearl works', () => {
    expect(pearlAllowed()).toBe(true);
  });
});
