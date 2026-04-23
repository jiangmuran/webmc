import { describe, it, expect } from 'vitest';
import { maxInventorySize, acceptsChest } from './donkey_chest_storage';

describe('donkey chest storage', () => {
  it('donkey with chest 15', () => {
    expect(
      maxInventorySize({
        hasChest: true,
        inventorySize: 0,
        isDonkey: true,
        isMule: false,
        isLlama: false,
        llamaStrength: 0,
      }),
    ).toBe(15);
  });

  it('llama scales with strength', () => {
    expect(
      maxInventorySize({
        hasChest: true,
        inventorySize: 0,
        isDonkey: false,
        isMule: false,
        isLlama: true,
        llamaStrength: 5,
      }),
    ).toBe(15);
  });

  it('no chest no inventory', () => {
    expect(
      maxInventorySize({
        hasChest: false,
        inventorySize: 0,
        isDonkey: true,
        isMule: false,
        isLlama: false,
        llamaStrength: 0,
      }),
    ).toBe(0);
  });

  it('accepts chest once', () => {
    expect(
      acceptsChest({
        hasChest: false,
        inventorySize: 0,
        isDonkey: true,
        isMule: false,
        isLlama: false,
        llamaStrength: 0,
      }),
    ).toBe(true);
  });

  it('double chest rejected', () => {
    expect(
      acceptsChest({
        hasChest: true,
        inventorySize: 15,
        isDonkey: true,
        isMule: false,
        isLlama: false,
        llamaStrength: 0,
      }),
    ).toBe(false);
  });
});
