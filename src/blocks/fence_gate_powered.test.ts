import { describe, it, expect } from 'vitest';
import { verticalOffset, opensFromRedstone, allowsEntities } from './fence_gate_powered';

describe('fence gate powered', () => {
  const base = { facing: 'n' as const, open: false, powered: false, inWall: false };

  it('in-wall offset', () => {
    expect(verticalOffset({ ...base, inWall: true })).toBeGreaterThan(0);
  });

  it('no offset outside wall', () => {
    expect(verticalOffset(base)).toBe(0);
  });

  it('redstone opens', () => {
    expect(opensFromRedstone({ ...base, powered: true })).toBe(true);
  });

  it('open passes entities', () => {
    expect(allowsEntities({ ...base, open: true })).toBe(true);
  });
});
