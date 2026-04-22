import { describe, it, expect } from 'vitest';
import {
  clearName,
  isRainbowSheepName,
  isSpecialRabbitName,
  isUpsideDownName,
  renameViaTag,
} from './name_tag';

describe('name tag', () => {
  it('rename sets name + visibility', () => {
    const mob = { customName: null, customNameVisible: false };
    expect(renameViaTag(mob, 'Bob')).toBe(true);
    expect(mob.customName).toBe('Bob');
    expect(mob.customNameVisible).toBe(true);
  });

  it('refuses empty / null names', () => {
    const mob = { customName: null, customNameVisible: false };
    expect(renameViaTag(mob, '')).toBe(false);
    expect(renameViaTag(mob, null)).toBe(false);
  });

  it('clips at 40 chars', () => {
    const mob: { customName: string | null; customNameVisible: boolean } = {
      customName: null,
      customNameVisible: false,
    };
    renameViaTag(mob, 'a'.repeat(100));
    expect(mob.customName?.length).toBe(40);
  });

  it('Dinnerbone is upside-down', () => {
    expect(isUpsideDownName('Dinnerbone')).toBe(true);
    expect(isUpsideDownName('Grumm')).toBe(true);
    expect(isUpsideDownName('Bob')).toBe(false);
  });

  it('Toast + jeb_ easter eggs recognised', () => {
    expect(isSpecialRabbitName('Toast')).toBe(true);
    expect(isRainbowSheepName('jeb_')).toBe(true);
  });

  it('clearName wipes', () => {
    const mob = { customName: 'Bob', customNameVisible: true };
    clearName(mob);
    expect(mob.customName).toBeNull();
    expect(mob.customNameVisible).toBe(false);
  });
});
