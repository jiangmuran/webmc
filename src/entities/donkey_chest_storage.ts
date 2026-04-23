export interface ChestedMount {
  hasChest: boolean;
  inventorySize: number;
  isDonkey: boolean;
  isMule: boolean;
  isLlama: boolean;
  llamaStrength: number;
}

export function maxInventorySize(m: ChestedMount): number {
  if (!m.hasChest) return 0;
  if (m.isLlama) return Math.max(3, m.llamaStrength * 3);
  if (m.isDonkey || m.isMule) return 15;
  return 0;
}

export function acceptsChest(m: ChestedMount): boolean {
  return (m.isDonkey || m.isMule || m.isLlama) && !m.hasChest;
}
