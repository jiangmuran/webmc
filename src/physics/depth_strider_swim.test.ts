import { describe, it, expect } from 'vitest';
import { swimSpeed, cancelsCurrentDrag, DEPTH_STRIDER_CAP } from './depth_strider_swim';

describe('depth strider swim', () => {
  it('higher level faster', () => {
    expect(swimSpeed(0.1, 3)).toBeGreaterThan(swimSpeed(0.1, 0));
  });

  it('level caps', () => {
    expect(swimSpeed(0.1, DEPTH_STRIDER_CAP + 10)).toBe(swimSpeed(0.1, DEPTH_STRIDER_CAP));
  });

  it('level 3 cancels drag', () => {
    expect(cancelsCurrentDrag(3)).toBe(true);
    expect(cancelsCurrentDrag(1)).toBe(false);
  });
});
