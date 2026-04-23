import { describe, it, expect } from 'vitest';
import {
  connectionCount,
  isCross,
  isStraight,
  alwaysRendersAsPillar,
} from './glass_pane_connect_rules';

describe('glass pane connect rules', () => {
  it('cross all 4', () => {
    expect(isCross({ north: true, south: true, east: true, west: true })).toBe(true);
  });

  it('straight N-S', () => {
    expect(isStraight({ north: true, south: true, east: false, west: false })).toBe(true);
  });

  it('L-corner not straight', () => {
    expect(isStraight({ north: true, south: false, east: true, west: false })).toBe(false);
  });

  it('pillar when isolated', () => {
    expect(alwaysRendersAsPillar({ north: false, south: false, east: false, west: false })).toBe(
      true,
    );
  });

  it('connection count accurate', () => {
    expect(connectionCount({ north: true, south: false, east: true, west: false })).toBe(2);
  });
});
