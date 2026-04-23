// Break speed formula. Returns ticks to break a block given tool speed,
// hardness, and whether the tool is correct.

export interface BreakCtx {
  hardness: number;
  correctTool: boolean;
  toolSpeed: number; // base tool speed
  onGround: boolean;
  underwater: boolean;
  hasAquaAffinity: boolean;
  hasteLevel: number;
  fatigueLevel: number;
  efficiencyBonus: number;
}

export function breakSpeedPerTick(c: BreakCtx): number {
  if (c.hardness < 0) return 0;
  let speed = c.toolSpeed + c.efficiencyBonus;
  if (!c.correctTool) speed = 1;
  if (!c.onGround) speed /= 5;
  if (c.underwater && !c.hasAquaAffinity) speed /= 5;
  if (c.hasteLevel > 0) speed *= 1 + 0.2 * c.hasteLevel;
  if (c.fatigueLevel > 0) speed *= Math.pow(0.3, c.fatigueLevel);
  const divisor = c.correctTool ? 30 : 100;
  return speed / (c.hardness * divisor);
}

export function ticksToBreak(c: BreakCtx): number {
  if (c.hardness <= 0) return c.hardness < 0 ? Infinity : 0;
  const rate = breakSpeedPerTick(c);
  if (rate <= 0) return Infinity;
  return Math.ceil(1 / rate);
}
