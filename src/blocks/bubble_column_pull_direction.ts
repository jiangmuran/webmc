export type Source = 'magma_block' | 'soul_sand';

export function pushDirection(source: Source): 'up' | 'down' {
  return source === 'magma_block' ? 'down' : 'up';
}

export function drags(source: Source, entity: 'boat' | 'player' | 'mob'): boolean {
  if (pushDirection(source) === 'down' && entity === 'boat') return true;
  return true;
}

export function drownsEntity(source: Source, entity: 'boat' | 'player' | 'mob'): boolean {
  return source === 'magma_block' && entity === 'player';
}
