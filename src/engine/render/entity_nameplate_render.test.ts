import { describe, it, expect } from 'vitest';
import {
  shouldRenderName,
  nameOpacity,
  MAX_NAME_DISTANCE,
  type NameplateInput,
} from './entity_nameplate_render';

const base: NameplateInput = {
  customName: 'Bob',
  alwaysVisible: false,
  distance: 10,
  sneakingTarget: false,
  crouchingViewer: false,
  entityType: 'mob',
};

describe('entity nameplate render', () => {
  it('named nearby visible', () => {
    expect(shouldRenderName(base)).toBe(true);
  });

  it('unnamed mob hidden', () => {
    const noName: NameplateInput = {
      alwaysVisible: false,
      distance: 10,
      sneakingTarget: false,
      crouchingViewer: false,
      entityType: 'mob',
    };
    expect(shouldRenderName(noName)).toBe(false);
  });

  it('player always shown', () => {
    expect(shouldRenderName({ ...base, entityType: 'player', customName: undefined })).toBe(true);
  });

  it('far hidden', () => {
    expect(shouldRenderName({ ...base, distance: MAX_NAME_DISTANCE + 1 })).toBe(false);
  });

  it('sneaking hides unless always', () => {
    expect(shouldRenderName({ ...base, sneakingTarget: true })).toBe(false);
    expect(shouldRenderName({ ...base, sneakingTarget: true, alwaysVisible: true })).toBe(true);
  });

  it('opaque near', () => {
    expect(nameOpacity(5)).toBe(1);
  });

  it('fades far', () => {
    expect(nameOpacity(MAX_NAME_DISTANCE)).toBeCloseTo(0);
  });
});
