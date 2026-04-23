export interface UseCtx {
  waterBelow: boolean;
  topFaceClicked: boolean;
  airAboveWater: boolean;
}

export function canPlace(c: UseCtx): boolean {
  return c.waterBelow && c.topFaceClicked && c.airAboveWater;
}

export function damagesBoatOnImpact(): boolean {
  return true;
}

export function breakDropsSelf(): boolean {
  return true;
}
