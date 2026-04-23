export interface Block {
  id: string;
  sticky: boolean;
}

export function isChainable(a: Block, b: Block): boolean {
  if (a.id === 'honey_block' && b.id === 'slime_block') return false;
  if (a.id === 'slime_block' && b.id === 'honey_block') return false;
  return a.sticky || b.sticky;
}

export function buildChain(
  origin: string,
  neighbors: (id: string) => Block | undefined,
  getId: (id: string) => string,
  step: (id: string) => string,
): readonly string[] {
  const chain: string[] = [origin];
  let cursor = origin;
  for (let i = 0; i < 12; i++) {
    const next = step(cursor);
    const a = neighbors(cursor);
    const b = neighbors(next);
    if (a === undefined || b === undefined) break;
    if (getId(next) === 'air') break;
    if (!isChainable(a, b)) break;
    chain.push(next);
    cursor = next;
  }
  return chain;
}
