import { describe, it, expect } from 'vitest';
import {
  damagePerTick,
  shouldTeleportAway,
  triggersOnStareBlock,
  teleportRadius,
  TELEPORT_ATTEMPT_RADIUS,
} from './enderman_water_damage';

describe('enderman water damage', () => {
  it('rain damages', () => {
    expect(damagePerTick({ inWater: false, inRain: true, hovered: false })).toBeGreaterThan(0);
  });

  it('water damages', () => {
    expect(damagePerTick({ inWater: true, inRain: false, hovered: false })).toBeGreaterThan(0);
  });

  it('dry no damage', () => {
    expect(damagePerTick({ inWater: false, inRain: false, hovered: false })).toBe(0);
  });

  it('teleport to escape water/rain', () => {
    expect(shouldTeleportAway({ inWater: true, inRain: false, hovered: false })).toBe(true);
    expect(shouldTeleportAway({ inWater: false, inRain: false, hovered: false })).toBe(false);
  });

  it('stare block triggers aggression', () => {
    expect(triggersOnStareBlock(true)).toBe(true);
  });

  it('teleport radius', () => {
    expect(teleportRadius()).toBe(TELEPORT_ATTEMPT_RADIUS);
  });
});
