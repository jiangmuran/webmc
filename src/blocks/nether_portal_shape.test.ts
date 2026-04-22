import { describe, it, expect } from 'vitest';
import { isValidFrame, portalBlocksCount, minimumSize } from './nether_portal_shape';

describe('nether portal shape', () => {
  it('4x5 valid classic', () => {
    expect(isValidFrame({ width: 4, height: 5, axis: 'x' })).toBe(true);
  });

  it('3x5 too narrow', () => {
    expect(isValidFrame({ width: 3, height: 5, axis: 'x' })).toBe(false);
  });

  it('24x5 too wide', () => {
    expect(isValidFrame({ width: 24, height: 5, axis: 'x' })).toBe(false);
  });

  it('4x4 too short', () => {
    expect(isValidFrame({ width: 4, height: 4, axis: 'x' })).toBe(false);
  });

  it('interior 2x3 = 6 portal blocks', () => {
    expect(portalBlocksCount({ width: 4, height: 5, axis: 'x' })).toBe(6);
    expect(minimumSize()).toBe(6);
  });

  it('max 21x21 interior', () => {
    expect(portalBlocksCount({ width: 23, height: 23, axis: 'x' })).toBe(441);
  });
});
