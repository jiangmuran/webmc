import { describe, it, expect } from 'vitest';
import {
  makePiercingTracker,
  onEntityHit,
  piercingArrowCount,
  resetTracker,
} from './arrow_pierce_target';

describe('piercing arrow', () => {
  it('level 0 = 1 target', () => {
    expect(piercingArrowCount(0)).toBe(1);
  });

  it('level 4 = 5 targets', () => {
    expect(piercingArrowCount(4)).toBe(5);
  });

  it('first hit damages + continues', () => {
    const t = makePiercingTracker(2);
    const r = onEntityHit({ tracker: t, targetId: 1 });
    expect(r.kind).toBe('damage_and_continue');
  });

  it('stop after piercing limit', () => {
    const t = makePiercingTracker(1);
    onEntityHit({ tracker: t, targetId: 1 });
    const r = onEntityHit({ tracker: t, targetId: 2 });
    expect(r.kind).toBe('damage_and_stop');
  });

  it('already hit = skip', () => {
    const t = makePiercingTracker(3);
    onEntityHit({ tracker: t, targetId: 1 });
    const r = onEntityHit({ tracker: t, targetId: 1 });
    expect(r.kind).toBe('skip_already_hit');
  });

  it('reset clears tracker', () => {
    const t = makePiercingTracker(2);
    onEntityHit({ tracker: t, targetId: 1 });
    resetTracker(t);
    expect(t.alreadyHitIds.size).toBe(0);
  });
});
