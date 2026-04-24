export type CowType = 'cow' | 'mooshroom_red' | 'mooshroom_brown';

export interface CowInput {
  cowType: CowType;
  milkBucket: boolean;
}

export function useBucket(c: CowInput): { result?: string; restTicks?: number } {
  if (c.cowType === 'cow' && c.milkBucket) return { result: 'milk_bucket' };
  if (c.cowType === 'mooshroom_red' && c.milkBucket) return { result: 'milk_bucket' };
  return {};
}

export function useBowl(c: CowInput): string | undefined {
  if (c.cowType === 'mooshroom_red') return 'mushroom_stew';
  if (c.cowType === 'mooshroom_brown') return 'suspicious_stew';
  return undefined;
}

export function shearMushroom(c: CowInput): { newType?: CowType; drops: readonly string[] } {
  if (c.cowType === 'mooshroom_red')
    return {
      newType: 'cow',
      drops: ['red_mushroom', 'red_mushroom', 'red_mushroom', 'red_mushroom', 'red_mushroom'],
    };
  if (c.cowType === 'mooshroom_brown')
    return {
      newType: 'cow',
      drops: [
        'brown_mushroom',
        'brown_mushroom',
        'brown_mushroom',
        'brown_mushroom',
        'brown_mushroom',
      ],
    };
  return { drops: [] };
}
