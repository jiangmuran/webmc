import { describe, it, expect } from 'vitest';
import { enable, disable, isEnabled, enabledParts, DEFAULT_ALL_ENABLED } from './player_skin_parts';

describe('player skin parts', () => {
  it('enable sets bit', () => {
    expect(isEnabled(enable(0, 'cape'), 'cape')).toBe(true);
  });

  it('disable clears bit', () => {
    const m = enable(0, 'cape');
    expect(isEnabled(disable(m, 'cape'), 'cape')).toBe(false);
  });

  it('parts independent', () => {
    const m = enable(enable(0, 'cape'), 'hat');
    expect(isEnabled(m, 'cape')).toBe(true);
    expect(isEnabled(m, 'hat')).toBe(true);
  });

  it('all enabled default', () => {
    expect(enabledParts(DEFAULT_ALL_ENABLED).length).toBe(7);
  });

  it('none enabled empty list', () => {
    expect(enabledParts(0)).toEqual([]);
  });
});
