export type Parent = 'horse' | 'donkey' | 'mule';

export interface Pair {
  a: Parent;
  b: Parent;
}

export function offspring(p: Pair): 'horse' | 'donkey' | 'mule' | undefined {
  if (p.a === 'horse' && p.b === 'horse') return 'horse';
  if (p.a === 'donkey' && p.b === 'donkey') return 'donkey';
  if ((p.a === 'horse' && p.b === 'donkey') || (p.a === 'donkey' && p.b === 'horse')) {
    return 'mule';
  }
  return undefined;
}

export function muleIsSterile(): boolean {
  return true;
}
