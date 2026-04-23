import { describe, it, expect } from 'vitest';
import {
  isEligibleFloorBlock,
  shouldEmbedSuspicious,
  SUSPICIOUS_GRAVEL_CHANCE,
} from './trail_ruins_decor';

describe('trail ruins decor', () => {
  it('gravel is decor', () => {
    expect(isEligibleFloorBlock('gravel')).toBe(true);
  });

  it('stone is not', () => {
    expect(isEligibleFloorBlock('stone')).toBe(false);
  });

  it('lucky embed', () => {
    expect(shouldEmbedSuspicious(() => 0)).toBe(true);
  });

  it('unlucky skip', () => {
    expect(shouldEmbedSuspicious(() => 0.99)).toBe(false);
  });

  it('chance reasonable', () => {
    expect(SUSPICIOUS_GRAVEL_CHANCE).toBeGreaterThan(0);
    expect(SUSPICIOUS_GRAVEL_CHANCE).toBeLessThan(1);
  });
});
