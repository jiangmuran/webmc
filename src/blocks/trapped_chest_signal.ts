// Trapped chest. Emits redstone signal 0..15 based on the number of
// open viewers (clamped at 15). Normal chest emits nothing.

export interface ChestViewers {
  count: number;
}

export function trappedChestSignal(v: ChestViewers): number {
  return Math.max(0, Math.min(15, v.count));
}

// "Strong" power also propagates into the block directly below, up to
// the same value.
export function strongPowerBelow(sig: number): number {
  return sig;
}

// Normal chests don't emit.
export function normalChestSignal(): number {
  return 0;
}
