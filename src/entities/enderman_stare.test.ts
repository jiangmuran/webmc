import { describe, it, expect } from 'vitest';
import {
  ENDERMAN_MAX_HEALTH,
  isPickable,
  makeEnderman,
  playerIsStaring,
  shouldTeleportEnv,
} from './enderman_stare';

describe('enderman', () => {
  it('starts at max HP, not angry', () => {
    const e = makeEnderman(1, { x: 0, y: 0, z: 0 });
    expect(e.health).toBe(ENDERMAN_MAX_HEALTH);
    expect(e.angry).toBe(false);
  });

  it('staring directly aggros', () => {
    const e = makeEnderman(1, { x: 0, y: 0, z: 5 });
    const looking = playerIsStaring(e, {
      eyePos: { x: 0, y: 2.55, z: 0 },
      look: { x: 0, y: 0, z: 1 },
      wearingPumpkin: false,
    });
    expect(looking).toBe(true);
  });

  it('looking away does not aggro', () => {
    const e = makeEnderman(1, { x: 0, y: 0, z: 5 });
    const looking = playerIsStaring(e, {
      eyePos: { x: 0, y: 2.55, z: 0 },
      look: { x: 1, y: 0, z: 0 },
      wearingPumpkin: false,
    });
    expect(looking).toBe(false);
  });

  it('pumpkin bypasses stare', () => {
    const e = makeEnderman(1, { x: 0, y: 0, z: 5 });
    const looking = playerIsStaring(e, {
      eyePos: { x: 0, y: 2.55, z: 0 },
      look: { x: 0, y: 0, z: 1 },
      wearingPumpkin: true,
    });
    expect(looking).toBe(false);
  });

  it('water triggers teleport', () => {
    expect(
      shouldTeleportEnv({
        inWater: true,
        inRain: false,
        inSunlight: false,
        projectileHit: false,
      }),
    ).toBe(true);
  });

  it('grass block is pickable', () => {
    expect(isPickable('webmc:grass_block')).toBe(true);
    expect(isPickable('webmc:stone')).toBe(false);
  });
});
