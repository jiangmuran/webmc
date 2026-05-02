export interface Rabbit {
  type: 'white' | 'black' | 'brown' | 'gold' | 'salt' | 'killer' | 'toast';
}

export type Difficulty = 'easy' | 'normal' | 'hard';

// Wiki (minecraft.wiki/w/Rabbit#The_Killer_Bunny): the killer bunny's
// damage scales with difficulty — Easy 5 / Normal 8 / Hard 12. Old
// flat KILLER_ATTACK_DAMAGE = 8 was Normal only; on Easy difficulty
// it dealt +60% over wiki, and on Hard it dealt only 67% of wiki.
const KILLER_DAMAGE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 5,
  normal: 8,
  hard: 12,
};

// Default constant kept for callers that don't yet thread difficulty.
export const KILLER_ATTACK_DAMAGE = KILLER_DAMAGE_BY_DIFFICULTY.normal;

export function isHostile(r: Rabbit): boolean {
  return r.type === 'killer';
}

export function attackDamage(r: Rabbit, difficulty: Difficulty = 'normal'): number {
  return isHostile(r) ? KILLER_DAMAGE_BY_DIFFICULTY[difficulty] : 0;
}

export function namedToasted(name: string, type: Rabbit['type']): Rabbit['type'] {
  return name.toLowerCase() === 'toast' ? 'toast' : type;
}
