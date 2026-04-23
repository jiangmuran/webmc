export interface Recipe {
  blazePowder: number;
  enderPearl: number;
}

export function canCraft(r: Recipe): boolean {
  return r.blazePowder >= 1 && r.enderPearl >= 1;
}

export function resultCount(): number {
  return 1;
}

export function usableOnEndPortalFrame(): boolean {
  return true;
}

export function eyesNeededToActivatePortal(): number {
  return 12;
}
