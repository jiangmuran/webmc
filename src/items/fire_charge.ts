// Fire charge. Used as blaze-rod + gunpowder crafting output. Right-click
// places fire like flint & steel. Dispensers shoot fireballs.

export interface FireChargeTarget {
  targetName: string; // block facing
  isAir: boolean;
  isIgnitable: boolean;
}

export interface FireChargeResult {
  ignited: boolean;
  becomesFireball: boolean;
}

export function useFireCharge(fromDispenser: boolean, target: FireChargeTarget): FireChargeResult {
  if (fromDispenser) {
    return { ignited: false, becomesFireball: true };
  }
  if (target.isAir || target.isIgnitable) {
    return { ignited: true, becomesFireball: false };
  }
  return { ignited: false, becomesFireball: false };
}
