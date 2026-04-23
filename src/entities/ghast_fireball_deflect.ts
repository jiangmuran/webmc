export interface Deflect {
  hitByPunch: boolean;
  hitByArrow: boolean;
  hitByTrident: boolean;
}

export function isDeflected(d: Deflect): boolean {
  return d.hitByPunch || d.hitByArrow || d.hitByTrident;
}

export function deflectsTowardAttacker(): boolean {
  return true;
}
