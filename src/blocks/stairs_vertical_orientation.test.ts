import { describe, it, expect } from 'vitest';
import { facingFromYaw, halfFor, placementFor } from './stairs_vertical_orientation';

describe('stairs orientation', () => {
  it('yaw buckets', () => {
    expect(facingFromYaw(0)).toBe('south');
    expect(facingFromYaw(90)).toBe('east');
    expect(facingFromYaw(180)).toBe('north');
    expect(facingFromYaw(-90)).toBe('west');
  });

  it('top face = bottom half', () => {
    expect(halfFor({ yawDeg: 0, clickedFace: 'top', clickedYInBlock: 0 })).toBe('bottom');
  });

  it('bottom face = top half', () => {
    expect(halfFor({ yawDeg: 0, clickedFace: 'bottom', clickedYInBlock: 0 })).toBe('top');
  });

  it('side face by Y', () => {
    expect(halfFor({ yawDeg: 0, clickedFace: 'side', clickedYInBlock: 0.2 })).toBe('bottom');
    expect(halfFor({ yawDeg: 0, clickedFace: 'side', clickedYInBlock: 0.8 })).toBe('top');
  });

  it('placement combines', () => {
    const p = placementFor({ yawDeg: 90, clickedFace: 'top', clickedYInBlock: 0 });
    expect(p.facing).toBe('east');
    expect(p.half).toBe('bottom');
  });
});
