import { describe, it, expect } from 'vitest';
import {
  targetFov,
  canTargetEnderDragon,
  SPYGLASS_FOV,
  SPYGLASS_USE_TICKS_TO_FULL_ZOOM,
} from './spyglass_zoom_fov';

describe('spyglass zoom fov', () => {
  it('inactive uses base FOV', () => {
    expect(targetFov({ ticksHeld: 999, active: false }, 70)).toBe(70);
  });

  it('full use zooms to 5', () => {
    expect(targetFov({ ticksHeld: SPYGLASS_USE_TICKS_TO_FULL_ZOOM, active: true }, 70)).toBe(
      SPYGLASS_FOV,
    );
  });

  it('partial in between', () => {
    const fov = targetFov({ ticksHeld: SPYGLASS_USE_TICKS_TO_FULL_ZOOM / 2, active: true }, 70);
    expect(fov).toBeLessThan(70);
    expect(fov).toBeGreaterThan(SPYGLASS_FOV);
  });

  it('dragon targetable when zoomed', () => {
    expect(canTargetEnderDragon(SPYGLASS_USE_TICKS_TO_FULL_ZOOM)).toBe(true);
  });

  it('no dragon target partial', () => {
    expect(canTargetEnderDragon(5)).toBe(false);
  });
});
