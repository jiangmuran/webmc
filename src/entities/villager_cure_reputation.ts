// Curing a zombie villager grants massive major_positive gossip.

export const MAJOR_POSITIVE_CURE = 20;
export const MAJOR_POSITIVE_HERO = 20;
export const MAJOR_NEGATIVE_ATTACK = 5;
export const MINOR_NEGATIVE_HURT_VILLAGER = 2;

export interface ReputationEvent {
  kind: 'cure' | 'hero_of_village' | 'kill_villager' | 'hurt_villager' | 'trade';
  amount: number;
}

export function eventAmount(kind: ReputationEvent['kind']): number {
  switch (kind) {
    case 'cure':
      return MAJOR_POSITIVE_CURE;
    case 'hero_of_village':
      return MAJOR_POSITIVE_HERO;
    case 'kill_villager':
      return MAJOR_NEGATIVE_ATTACK;
    case 'hurt_villager':
      return MINOR_NEGATIVE_HURT_VILLAGER;
    case 'trade':
      return 2;
  }
}

export function isPositive(kind: ReputationEvent['kind']): boolean {
  return kind === 'cure' || kind === 'hero_of_village' || kind === 'trade';
}
