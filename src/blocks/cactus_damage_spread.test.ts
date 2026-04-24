import { describe, it, expect } from 'vitest';
import {
  canPlace,
  shouldGrow,
  damagesEntity,
  breaksAdjacentItem,
  MAX_HEIGHT,
} from './cactus_damage_spread';

describe('cactus damage spread', () => {
  it('sand placeable', () => {
    expect(canPlace('sand', false)).toBe(true);
  });

  it('rejects adjacent blocks', () => {
    expect(canPlace('sand', true)).toBe(false);
  });

  it('dirt invalid', () => {
    expect(canPlace('dirt', false)).toBe(false);
  });

  it('grows on lucky roll', () => {
    expect(shouldGrow(0, () => 0)).toBe(true);
  });

  it('max height caps', () => {
    expect(shouldGrow(MAX_HEIGHT, () => 0)).toBe(false);
  });

  it('damages entity touching', () => {
    expect(damagesEntity(true, false)).toBeGreaterThan(0);
  });

  it('invulnerable unharmed', () => {
    expect(damagesEntity(true, true)).toBe(0);
  });

  it('breaks adjacent items', () => {
    expect(breaksAdjacentItem(true)).toBe(true);
  });
});
