// Wind charge crafting. Breeze rod → 4 wind charges at crafting table.

export const WIND_CHARGE_YIELD = 4;

export function canCraft(breezeRodCount: number): boolean {
  return breezeRodCount >= 1;
}

export function yieldCount(): number {
  return WIND_CHARGE_YIELD;
}

export function stackSize(): number {
  return 64;
}

// Dispenser throws wind charge.
export function dispenserThrows(): boolean {
  return true;
}
