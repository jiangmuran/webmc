import { describe, it, expect } from 'vitest';
import { trappedChestSignal, strongPowerBelow, normalChestSignal } from './trapped_chest_signal';

describe('trapped chest', () => {
  it('signal matches viewers, clamped 15', () => {
    expect(trappedChestSignal({ count: 0 })).toBe(0);
    expect(trappedChestSignal({ count: 3 })).toBe(3);
    expect(trappedChestSignal({ count: 99 })).toBe(15);
  });

  it('strong power propagates below', () => {
    expect(strongPowerBelow(5)).toBe(5);
  });

  it('normal chest silent', () => {
    expect(normalChestSignal()).toBe(0);
  });
});
