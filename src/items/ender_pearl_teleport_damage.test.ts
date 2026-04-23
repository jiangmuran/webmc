import { describe, it, expect } from 'vitest';
import {
  damageOnLand,
  cooldownTicks,
  spawnsEndermiteChance,
  TELEPORT_DAMAGE,
} from './ender_pearl_teleport_damage';

describe('ender pearl damage', () => {
  it('creative no damage', () => {
    expect(damageOnLand({ gamemode: 'creative', slowFalling: false, featherFallingLevel: 0 })).toBe(
      0,
    );
  });

  it('survival 5 damage', () => {
    expect(damageOnLand({ gamemode: 'survival', slowFalling: false, featherFallingLevel: 0 })).toBe(
      TELEPORT_DAMAGE,
    );
  });

  it('slow falling nullifies', () => {
    expect(damageOnLand({ gamemode: 'survival', slowFalling: true, featherFallingLevel: 0 })).toBe(
      0,
    );
  });

  it('feather falling reduces', () => {
    expect(
      damageOnLand({ gamemode: 'survival', slowFalling: false, featherFallingLevel: 4 }),
    ).toBeLessThan(TELEPORT_DAMAGE);
  });

  it('cooldown creative 0', () => {
    expect(cooldownTicks('creative')).toBe(0);
  });

  it('cooldown survival 20', () => {
    expect(cooldownTicks('survival')).toBe(20);
  });

  it('endermite chance', () => {
    expect(spawnsEndermiteChance()).toBeLessThan(0.1);
  });
});
