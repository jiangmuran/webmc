export interface SwimInput {
  inWater: boolean;
  isSwimming: boolean;
  depthStriderLevel: number;
  dolphinsGrace: boolean;
  sprinting: boolean;
}

export function swimSpeedMultiplier(i: SwimInput): number {
  if (!i.inWater) return 1;
  let mult = i.isSwimming ? 1 : 0.4;
  const ds = Math.min(3, Math.max(0, i.depthStriderLevel));
  mult *= 1 + ds * 0.33;
  if (i.dolphinsGrace) mult *= 1.5;
  if (i.sprinting) mult *= 1.2;
  return mult;
}

export function swimmingActivates(verticalPitch: number, sprinting: boolean): boolean {
  return sprinting && verticalPitch < -0.2;
}
