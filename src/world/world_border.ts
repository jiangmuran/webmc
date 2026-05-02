// World border. Square area centered on a point; entities outside take
// damage per second; size can shrink/grow over a duration.

export interface WorldBorder {
  centerX: number;
  centerZ: number;
  diameter: number;
  targetDiameter: number;
  interpolationSec: number;
  elapsedSec: number;
  damagePerBlockOutside: number;
  damageBuffer: number;
}

export function makeWorldBorder(diameter = 60000000): WorldBorder {
  return {
    centerX: 0,
    centerZ: 0,
    diameter,
    targetDiameter: diameter,
    interpolationSec: 0,
    elapsedSec: 0,
    damagePerBlockOutside: 0.2,
    damageBuffer: 5,
  };
}

export function setSize(border: WorldBorder, diameter: number, overSec = 0): void {
  border.targetDiameter = diameter;
  border.interpolationSec = overSec;
  border.elapsedSec = 0;
  if (overSec === 0) border.diameter = diameter;
}

export function tickWorldBorder(border: WorldBorder, dtSec: number): void {
  if (border.interpolationSec <= 0 || border.diameter === border.targetDiameter) return;
  border.elapsedSec += dtSec;
  const t = Math.min(1, border.elapsedSec / border.interpolationSec);
  const start = border.diameter;
  border.diameter = start + (border.targetDiameter - start) * t;
  if (t >= 1) {
    border.diameter = border.targetDiameter;
    border.interpolationSec = 0;
  }
}

export interface BorderCheck {
  insideBorder: boolean;
  damagePerSec: number;
}

// Reused result. checkPosition fires per frame; the caller reads
// fields synchronously and doesn't retain the reference. Was a fresh
// {insideBorder, damagePerSec} literal per call.
const SHARED_BORDER_CHECK: BorderCheck = { insideBorder: true, damagePerSec: 0 };
export function checkPosition(border: WorldBorder, x: number, z: number): BorderCheck {
  const halfExtent = border.diameter / 2;
  const dx = Math.abs(x - border.centerX);
  const dz = Math.abs(z - border.centerZ);
  const outside = Math.max(0, Math.max(dx, dz) - halfExtent);
  if (outside <= border.damageBuffer) {
    SHARED_BORDER_CHECK.insideBorder = true;
    SHARED_BORDER_CHECK.damagePerSec = 0;
    return SHARED_BORDER_CHECK;
  }
  SHARED_BORDER_CHECK.insideBorder = false;
  SHARED_BORDER_CHECK.damagePerSec = (outside - border.damageBuffer) * border.damagePerBlockOutside;
  return SHARED_BORDER_CHECK;
}
