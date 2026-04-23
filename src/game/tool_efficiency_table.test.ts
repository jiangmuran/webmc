import { describe, it, expect } from 'vitest';
import { harvestDuration, toolStrongEnough } from './tool_efficiency_table';

describe('tool efficiency table', () => {
  it('diamond faster than wood', () => {
    expect(harvestDuration(3, 'diamond')).toBeLessThan(harvestDuration(3, 'wood'));
  });

  it('gold fastest speed mult', () => {
    expect(harvestDuration(3, 'gold')).toBeLessThan(harvestDuration(3, 'iron'));
  });

  it('iron strong for tier 2', () => {
    expect(toolStrongEnough('iron', 2)).toBe(true);
  });

  it('wood too weak for tier 2', () => {
    expect(toolStrongEnough('wood', 2)).toBe(false);
  });

  it('netherite top', () => {
    expect(toolStrongEnough('netherite', 4)).toBe(true);
  });
});
