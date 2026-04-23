import { describe, it, expect } from 'vitest';
import { canTransfer, transferOne, TRANSFER_INTERVAL } from './hopper_into_chest';

describe('hopper into chest', () => {
  const ctx = {
    hopperInventory: [{ id: 'stone', count: 5 }],
    targetInventory: [],
    targetMaxStack: 64,
    cooldownTicks: 0,
  };

  it('transfers when idle', () => {
    expect(canTransfer(ctx)).toBe(true);
  });

  it('cooldown blocks', () => {
    expect(canTransfer({ ...ctx, cooldownTicks: 5 })).toBe(false);
  });

  it('moves one item', () => {
    const after = transferOne(ctx);
    expect(after.hopperInventory[0]?.count).toBe(4);
    expect(after.targetInventory).toHaveLength(1);
    expect(after.cooldownTicks).toBe(TRANSFER_INTERVAL);
  });

  it('empty hopper no transfer', () => {
    const after = transferOne({ ...ctx, hopperInventory: [{ id: 'stone', count: 0 }] });
    expect(after.targetInventory).toHaveLength(0);
  });
});
