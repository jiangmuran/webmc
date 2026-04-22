import { describe, it, expect } from 'vitest';
import { applyDarknessAround } from './warden_darkness';

describe('warden darkness', () => {
  it('applies to entities within 20 blocks', () => {
    const out = applyDarknessAround({ x: 0, y: 0, z: 0 }, [
      { id: 1, position: { x: 5, y: 0, z: 0 } },
      { id: 2, position: { x: 30, y: 0, z: 0 } },
    ]);
    expect(out.some((e) => e.entityId === 1)).toBe(true);
    expect(out.some((e) => e.entityId === 2)).toBe(false);
  });

  it('effect duration is 12s', () => {
    const out = applyDarknessAround({ x: 0, y: 0, z: 0 }, [
      { id: 1, position: { x: 1, y: 0, z: 0 } },
    ]);
    expect(out[0]?.effectDurationSec).toBe(12);
  });

  it('empty target list → no applications', () => {
    expect(applyDarknessAround({ x: 0, y: 0, z: 0 }, []).length).toBe(0);
  });
});
