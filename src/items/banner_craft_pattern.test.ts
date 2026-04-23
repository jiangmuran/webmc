import { describe, it, expect } from 'vitest';
import { canApplyPattern, requiresSpecial, MAX_BANNER_PATTERNS } from './banner_craft_pattern';

describe('banner craft pattern', () => {
  it('adds pattern when under limit', () => {
    expect(canApplyPattern([], 'stripe_bottom')).toBe(true);
  });

  it('rejects when full', () => {
    const filled = Array.from({ length: MAX_BANNER_PATTERNS }, () => ({
      id: 'cross' as const,
      color: 'red',
    }));
    expect(canApplyPattern(filled, 'border')).toBe(false);
  });

  it('creeper needs head', () => {
    expect(requiresSpecial('creeper')).toBe('creeper_head');
  });

  it('stripe no special', () => {
    expect(requiresSpecial('stripe_top')).toBeNull();
  });
});
