// Pressure plate triggers. Wood: any entity incl. projectiles. Stone:
// mobs. Polished blackstone: players only. Heavy/iron: entity count.

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
  if (q.plate === 'polished_blackstone') {
    const players = q.entities.filter((e) => e.kind === 'player').reduce((s, e) => s + e.count, 0);
    return players > 0 ? 15 : 0;
  }
  if (q.plate === 'stone') {
    const mobs = q.entities
      .filter((e) => e.kind === 'player' || e.kind === 'mob')
      .reduce((s, e) => s + e.count, 0);
    return mobs > 0 ? 15 : 0;
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
