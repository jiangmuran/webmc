import { describe, it, expect } from 'vitest';
import {
  shouldRender,
  anchorY,
  opacityForDistance,
  MAX_NAMETAG_DISTANCE,
} from './entity_nametag_billboard';

const base = {
  entityY: 64,
  headHeight: 1.8,
  cameraDistance: 10,
  alwaysVisible: false,
  isPlayer: false,
};

describe('entity nametag billboard', () => {
  it('close renders', () => {
    expect(shouldRender(base)).toBe(true);
  });

  it('far hides', () => {
    expect(shouldRender({ ...base, cameraDistance: MAX_NAMETAG_DISTANCE + 10 })).toBe(false);
  });

  it('always-visible ignores distance', () => {
    expect(shouldRender({ ...base, cameraDistance: 10000, alwaysVisible: true })).toBe(true);
  });

  it('anchor above head', () => {
    expect(anchorY(base)).toBeGreaterThan(base.entityY + base.headHeight);
  });

  it('opacity fades', () => {
    expect(opacityForDistance({ ...base, cameraDistance: 0 })).toBe(1);
    expect(opacityForDistance({ ...base, cameraDistance: MAX_NAMETAG_DISTANCE })).toBe(0);
  });
});
