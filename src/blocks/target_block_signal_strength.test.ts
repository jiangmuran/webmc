import { describe, it, expect } from 'vitest';
import {
  signalFromDistance,
  BLOCK_RADIUS,
  SIGNAL_DURATION_ARROW,
  SIGNAL_DURATION_THROWABLE,
} from './target_block_signal_strength';

describe('target block signal', () => {
  it('bullseye full 15', () => {
    expect(signalFromDistance(0)).toBe(15);
  });

  it('edge minimal 1', () => {
    expect(signalFromDistance(BLOCK_RADIUS * 0.9)).toBeGreaterThanOrEqual(1);
  });

  it('miss zero', () => {
    expect(signalFromDistance(BLOCK_RADIUS * 2)).toBe(0);
  });

  it('midpoint around 8', () => {
    const v = signalFromDistance(BLOCK_RADIUS / 2);
    expect(v).toBeGreaterThanOrEqual(7);
    expect(v).toBeLessThanOrEqual(9);
  });

  it('arrow stays longer than snowball', () => {
    expect(SIGNAL_DURATION_ARROW).toBeGreaterThan(SIGNAL_DURATION_THROWABLE);
  });
});
