// Pressure plate triggers per wiki:
//   Wood: any entity incl. projectiles + items (most permissive).
//   Stone, Polished Blackstone: living only (mobs + players, no items).
//   Iron (heavy): weighted, signal = ceil(count/10).
//   Gold (light): weighted, signal = min(count, 15).

export type PlateKind = 'wood' | 'stone' | 'iron' | 'gold' | 'polished_blackstone';

export type EntityKind = 'player' | 'mob' | 'projectile' | 'item' | 'boat' | 'minecart';

export interface TriggerQuery {
  plate: PlateKind;
  entities: { kind: EntityKind; count: number }[];
}

export function signalStrength(q: TriggerQuery): number {
  if (q.plate === 'wood') {
    const any = q.entities.some((e) => e.count > 0);
    return any ? 15 : 0;
  }
  // Stone + polished_blackstone: living entities only (mobs + players).
  // Was treating polished_blackstone as "players only" — per wiki it
  // matches stone, both trigger on any living entity.
  if (q.plate === 'stone' || q.plate === 'polished_blackstone') {
    const living = q.entities
      .filter((e) => e.kind === 'player' || e.kind === 'mob')
      .reduce((s, e) => s + e.count, 0);
    return living > 0 ? 15 : 0;
  }
  // iron or gold: weighted
  const total = q.entities
    .filter((e) => e.kind !== 'projectile' && e.kind !== 'item')
    .reduce((s, e) => s + e.count, 0);
  if (q.plate === 'iron') {
    return Math.min(15, Math.ceil(total / 10));
  }
  return Math.min(15, total);
}
