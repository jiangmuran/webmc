export interface Rabbit {
  type: 'white' | 'black' | 'brown' | 'gold' | 'salt' | 'killer' | 'toast';
}

export const KILLER_ATTACK_DAMAGE = 8;

export function isHostile(r: Rabbit): boolean {
  return r.type === 'killer';
}

export function attackDamage(r: Rabbit): number {
  return isHostile(r) ? KILLER_ATTACK_DAMAGE : 0;
}

export function namedToasted(name: string, type: Rabbit['type']): Rabbit['type'] {
  return name.toLowerCase() === 'toast' ? 'toast' : type;
}
