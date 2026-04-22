import { describe, it, expect } from 'vitest';
import { fill, canBrew, LINGERING_CLOUD_DURATION_TICKS } from './dragon_breath';

describe('dragon breath', () => {
  it('fills in cloud', () => {
    expect(fill({ insideBreathCloud: true, bottleEmpty: true })).toBe('filled');
  });

  it('not in cloud', () => {
    expect(fill({ insideBreathCloud: false, bottleEmpty: true })).toBe('not_in_cloud');
  });

  it('bottle not empty', () => {
    expect(fill({ insideBreathCloud: true, bottleEmpty: false })).toBe('bottle_not_empty');
  });

  it('brews lingering', () => {
    expect(canBrew({ input: 'splash_potion', ingredient: 'dragon_breath' })).toBe(true);
  });

  it('rejects normal potion', () => {
    expect(canBrew({ input: 'potion', ingredient: 'dragon_breath' })).toBe(false);
  });

  it('lingering cloud 30s', () => {
    expect(LINGERING_CLOUD_DURATION_TICKS).toBe(600);
  });
});
