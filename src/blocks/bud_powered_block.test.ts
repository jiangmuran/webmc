import { describe, it, expect } from 'vitest';
import {
  quasiConnectivityFires,
  neighborUpdateCount,
  requiresBUDTrigger,
} from './bud_powered_block';

describe('bud powered block', () => {
  it('quasi fires', () => {
    expect(quasiConnectivityFires(true)).toBe(true);
    expect(quasiConnectivityFires(false)).toBe(false);
  });

  it('neighbor update counts', () => {
    expect(
      neighborUpdateCount({ blockBelow: 'stone', facingSide: 'stone', aboveHasPower: true }),
    ).toBe(3);
  });

  it('only gravity blocks BUD', () => {
    expect(requiresBUDTrigger('sand')).toBe(true);
    expect(requiresBUDTrigger('stone')).toBe(false);
  });

  it('concrete powder BUD', () => {
    expect(requiresBUDTrigger('concrete_powder_red')).toBe(true);
  });
});
