export type CauldronContent = 'empty' | 'water' | 'lava' | 'powder_snow';

export interface Cauldron {
  content: CauldronContent;
  level: 0 | 1 | 2 | 3;
}

export const MAX_LEVEL = 3;

export function rainFills(c: Cauldron, isRaining: boolean): Cauldron {
  if (!isRaining) return c;
  if (c.content !== 'empty' && c.content !== 'water') return c;
  const newLevel = Math.min(MAX_LEVEL, c.level + 1) as 0 | 1 | 2 | 3;
  return { content: 'water', level: newLevel };
}

export function useBucket(c: Cauldron, fluid: CauldronContent): Cauldron | undefined {
  if (fluid === 'empty') return undefined;
  if (c.content !== 'empty' && c.content !== fluid) return undefined;
  return { content: fluid, level: MAX_LEVEL };
}

export function dispenseBottle(c: Cauldron): { cauldron: Cauldron; item?: string } | undefined {
  if (c.content !== 'water' || c.level <= 0) return undefined;
  const next = (c.level - 1) as 0 | 1 | 2;
  return {
    cauldron: { content: next === 0 ? 'empty' : 'water', level: next },
    item: 'water_bottle',
  };
}
