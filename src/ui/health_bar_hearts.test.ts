import { describe, it, expect } from 'vitest';
import { hearts } from './health_bar_hearts';

describe('health bar hearts', () => {
  it('full row at 20/20', () => {
    const h = hearts(20, 20);
    expect(h).toHaveLength(10);
    expect(h.every((x) => x === 'full')).toBe(true);
  });

  it('half hearts render', () => {
    expect(hearts(1, 20)[0]).toBe('half');
  });

  it('empty after end', () => {
    expect(hearts(0, 20)[5]).toBe('empty');
  });

  it('partial depletion', () => {
    const h = hearts(5, 20);
    expect(h[0]).toBe('full');
    expect(h[2]).toBe('half');
  });
});
