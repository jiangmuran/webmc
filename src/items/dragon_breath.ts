// Dragon's breath: collected from dragon fireball clouds with glass
// bottle. Used with regular potions in brewing to produce lingering.

export interface BottleFillQuery {
  insideBreathCloud: boolean;
  bottleEmpty: boolean;
}

export type FillResult = 'filled' | 'not_in_cloud' | 'bottle_not_empty';

export function fill(q: BottleFillQuery): FillResult {
  if (!q.bottleEmpty) return 'bottle_not_empty';
  if (!q.insideBreathCloud) return 'not_in_cloud';
  return 'filled';
}

// Brewing: splash potion + dragon's breath → lingering potion
export interface LingeringRecipe {
  input: 'splash_potion';
  ingredient: 'dragon_breath';
}

export function canBrew(r: { input: string; ingredient: string }): boolean {
  return r.input === 'splash_potion' && r.ingredient === 'dragon_breath';
}

export const LINGERING_CLOUD_DURATION_TICKS = 600;
