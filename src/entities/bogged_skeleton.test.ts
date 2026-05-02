import { describe, it, expect } from 'vitest';
import {
  nextShot,
  shear,
  drawCooldownTicks,
  BOGGED_DRAW_COOLDOWN_TICKS,
  BOGGED_DRAW_COOLDOWN_NORMAL_TICKS,
  BOGGED_DRAW_COOLDOWN_HARD_TICKS,
  BOGGED_POISON_DURATION_TICKS,
  BOGGED_MAX_HEALTH,
} from './bogged_skeleton';

describe('bogged skeleton', () => {
  it('shoots tipped poison', () => {
    expect(nextShot().arrowType).toBe('tipped_poison');
  });

  it('poison 4s = 80 ticks (wiki Bogged: Arrow of Poison for 4 seconds)', () => {
    expect(nextShot().poisonDurationTicks).toBe(80);
    expect(BOGGED_POISON_DURATION_TICKS).toBe(80);
  });

  it('cooldown defaults to Normal/Easy 3.5s (70 ticks) per wiki', () => {
    // Wiki minecraft.wiki/w/Bogged: 3.5s on Easy/Normal, 2.5s on
    // Hard, both 1.5s slower than skeleton. Default is Normal so the
    // bare nextShot() and the BOGGED_DRAW_COOLDOWN_TICKS constant
    // both report 70 ticks.
    expect(nextShot().cooldownTicks).toBe(70);
    expect(BOGGED_DRAW_COOLDOWN_TICKS).toBe(70);
    expect(BOGGED_DRAW_COOLDOWN_NORMAL_TICKS).toBe(70);
  });

  it('Hard difficulty cooldown 2.5s (50 ticks) per wiki', () => {
    expect(nextShot('hard').cooldownTicks).toBe(50);
    expect(drawCooldownTicks('hard')).toBe(50);
    expect(BOGGED_DRAW_COOLDOWN_HARD_TICKS).toBe(50);
  });

  it('Easy uses Normal cooldown per wiki (3.5s)', () => {
    expect(drawCooldownTicks('easy')).toBe(70);
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
