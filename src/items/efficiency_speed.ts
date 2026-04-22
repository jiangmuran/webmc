// Efficiency: mining speed boost. Multiplier = level^2 + 1 added to
// tool speed. Aquatic affinity + haste / mining fatigue multipliers
// apply elsewhere.

export const EFFICIENCY_MAX_LEVEL = 5;

export function speedBonus(level: number): number {
  if (level <= 0) return 0;
  return level * level + 1;
}

export function toolSpeedWith(base: number, efficiencyLevel: number): number {
  return base + speedBonus(efficiencyLevel);
}

export function requiresCorrectTool(block: string, tool: string): boolean {
  if (block.includes('leaves')) return true;
  if (block === 'stone' || block === 'cobblestone') return tool === 'pickaxe';
  return false;
}

// Haste amplifier 0..N → +20% per level multiplier.
export function applyHaste(speed: number, hasteLevel: number): number {
  if (hasteLevel <= 0) return speed;
  return speed * (1 + 0.2 * hasteLevel);
}

export function applyMiningFatigue(speed: number, fatigueLevel: number): number {
  if (fatigueLevel <= 0) return speed;
  const factor = [1, 0.3, 0.09, 0.0027, 0.00081][Math.min(4, fatigueLevel)] ?? 0.00081;
  return speed * factor;
}
