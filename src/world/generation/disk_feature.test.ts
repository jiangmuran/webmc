import { describe, it, expect } from 'vitest';
import { pointInDisk, rollDisk } from './disk_feature';

describe('disk feature', () => {
  it('center is inside', () => {
    const d = rollDisk(() => 0.5, 'sand');
    expect(pointInDisk(0, 0, d)).toBe(true);
  });

  it('far is outside', () => {
    const d = rollDisk(() => 0.5, 'sand');
    expect(pointInDisk(100, 0, d)).toBe(false);
  });

  it('has replaceable set', () => {
    const d = rollDisk(() => 0.5, 'clay');
    expect(d.replaceableBlocks.has('dirt')).toBe(true);
  });

  it('small radius', () => {
    const d = rollDisk(() => 0, 'sand');
    expect(d.radius).toBeGreaterThan(0);
  });
});
