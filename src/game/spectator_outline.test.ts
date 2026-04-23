import { describe, it, expect } from 'vitest';
import {
  shouldDrawOutline,
  outlineColorForTeam,
  SPECTATOR_OUTLINE_DISTANCE,
} from './spectator_outline';

describe('spectator outline', () => {
  it('near player outlined', () => {
    expect(shouldDrawOutline({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 })).toBe(true);
  });

  it('far player not', () => {
    expect(
      shouldDrawOutline({ x: 0, y: 0, z: 0 }, { x: SPECTATOR_OUTLINE_DISTANCE + 1, y: 0, z: 0 }),
    ).toBe(false);
  });

  it('team color', () => {
    expect(outlineColorForTeam('red')).toBe(0xff5555);
  });

  it('unknown team white', () => {
    expect(outlineColorForTeam('purple')).toBe(0xffffff);
  });
});
