import { describe, it, expect } from 'vitest';
import {
  signalStrengthFromDistance,
  onHit,
  currentOutput,
  affectedByArrow,
  affectedBySnowball,
  PULSE_TICKS_ARROW,
  PULSE_TICKS_THROWABLE,
} from './target_block_signal';

describe('target block signal', () => {
  it('center = 15', () => {
    expect(signalStrengthFromDistance(0, 1)).toBe(15);
  });

  it('edge = 1', () => {
    expect(signalStrengthFromDistance(1, 1)).toBe(1);
  });

  it('mid is in between', () => {
    const mid = signalStrengthFromDistance(0.5, 1);
    expect(mid).toBeGreaterThan(1);
    expect(mid).toBeLessThan(15);
  });

  it('pulse decays', () => {
    const s = onHit(0, 10);
    expect(currentOutput(s, 0)).toBe(10);
    expect(currentOutput(s, 100)).toBe(0);
  });

  it('accepts arrows + snowballs', () => {
    expect(affectedByArrow()).toBe(true);
    expect(affectedBySnowball()).toBe(true);
  });

  it('arrow pulses 20 ticks, throwable 8 (wiki)', () => {
    // Wiki (minecraft.wiki/w/Target): "...the target emits redstone power
    // for 8 game ticks. Arrows and tridents instead cause the target to
    // emit power for 20 game ticks..."
    expect(PULSE_TICKS_ARROW).toBe(20);
    expect(PULSE_TICKS_THROWABLE).toBe(8);
    const arrow = onHit(0, 10, 'arrow');
    const snow = onHit(0, 10, 'throwable');
    expect(currentOutput(arrow, 19)).toBe(10);
    expect(currentOutput(arrow, 20)).toBe(0);
    expect(currentOutput(snow, 7)).toBe(10);
    expect(currentOutput(snow, 8)).toBe(0);
  });
});
