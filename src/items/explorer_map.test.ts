import { describe, it, expect } from 'vitest';
import { makeExplorerMap, markerFor, maybeDiscover } from './explorer_map';

describe('explorer map', () => {
  it('shows marker when within 2048 blocks', () => {
    const m = makeExplorerMap('ocean_monument', 1000, 1000);
    expect(markerFor(m, { playerX: 0, playerZ: 0 })).toBe('ocean_monument');
  });

  it('hides marker far away', () => {
    const m = makeExplorerMap('ancient_city', 5000, 5000);
    expect(markerFor(m, { playerX: 0, playerZ: 0 })).toBeNull();
  });

  it('discovers when player close enough', () => {
    const m = makeExplorerMap('village', 50, 0);
    expect(maybeDiscover(m, { playerX: 0, playerZ: 0 })).toBe(true);
    expect(m.discovered).toBe(true);
  });

  it('already-discovered returns false', () => {
    const m = makeExplorerMap('trial_chamber', 0, 0);
    maybeDiscover(m, { playerX: 0, playerZ: 0 });
    expect(maybeDiscover(m, { playerX: 0, playerZ: 0 })).toBe(false);
  });
});
