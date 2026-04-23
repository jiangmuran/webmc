import { describe, it, expect } from 'vitest';
import { decays, placedByHand, naturalFromTree } from './leaves_persistent_distance';

describe('leaves persistent', () => {
  it('far natural leaves decay', () => {
    expect(decays({ persistent: false, distance: 7 })).toBe(true);
  });

  it('close natural survive', () => {
    expect(decays({ persistent: false, distance: 3 })).toBe(false);
  });

  it('persistent never decays', () => {
    expect(decays({ persistent: true, distance: 100 })).toBe(false);
  });

  it('handplaced is persistent', () => {
    expect(placedByHand().persistent).toBe(true);
  });

  it('natural carries distance', () => {
    expect(naturalFromTree(2).distance).toBe(2);
  });
});
