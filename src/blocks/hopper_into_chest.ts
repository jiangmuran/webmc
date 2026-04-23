export interface HopperCtx {
  hopperInventory: { id: string; count: number }[];
  targetInventory: { id: string; count: number }[];
  targetMaxStack: number;
  cooldownTicks: number;
}

export const TRANSFER_INTERVAL = 8;

export function canTransfer(c: HopperCtx): boolean {
  if (c.cooldownTicks > 0) return false;
  return c.hopperInventory.some((s) => s.count > 0);
}

export function transferOne(c: HopperCtx): HopperCtx {
  if (!canTransfer(c)) return c;
  const fromIdx = c.hopperInventory.findIndex((s) => s.count > 0);
  if (fromIdx === -1) return c;
  const from = c.hopperInventory[fromIdx];
  if (!from) return c;
  const target = [...c.targetInventory, { id: from.id, count: 1 }];
  const hop = [...c.hopperInventory];
  hop[fromIdx] = { id: from.id, count: from.count - 1 };
  return { ...c, hopperInventory: hop, targetInventory: target, cooldownTicks: TRANSFER_INTERVAL };
}
