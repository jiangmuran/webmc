import { describe, it, expect } from 'vitest';
import {
  nextShot,
  shear,
  BOGGED_DRAW_COOLDOWN_TICKS,
  BOGGED_POISON_DURATION_TICKS,
  BOGGED_MAX_HEALTH,
} from './bogged_skeleton';

describe('bogged skeleton', () => {
  it('shoots tipped poison', () => {
    expect(nextShot().arrowType).toBe('tipped_poison');
  });

  it('poison 7s', () => {
    expect(nextShot().poisonDurationTicks).toBe(140);
    expect(BOGGED_POISON_DURATION_TICKS).toBe(140);
  });

  it('cooldown slower than skeleton', () => {
    expect(nextShot().cooldownTicks).toBe(BOGGED_DRAW_COOLDOWN_TICKS);
    expect(BOGGED_DRAW_COOLDOWN_TICKS).toBeGreaterThanOrEqual(40);
  });

  it('health 16', () => {
    expect(BOGGED_MAX_HEALTH).toBe(16);
  });

  it('shear converts + drops mushrooms', () => {
    const r = shear();
    expect(r.becomesSkeleton).toBe(true);
    expect(r.mushroomsDropped).toBeGreaterThan(0);
  });
});
