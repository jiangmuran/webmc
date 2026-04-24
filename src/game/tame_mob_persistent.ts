export interface Tameable {
  id: string;
  tamedByUuid?: string;
  sitting: boolean;
  collar: 'red' | 'white' | 'orange' | 'green' | 'blue' | 'black';
}

export function tryTame(
  m: Tameable,
  playerUuid: string,
  rng: () => number,
  chance: number,
): { mob: Tameable; tamed: boolean } {
  if (m.tamedByUuid !== undefined) return { mob: m, tamed: false };
  if (rng() < chance) return { mob: { ...m, tamedByUuid: playerUuid }, tamed: true };
  return { mob: m, tamed: false };
}

export function toggleSit(m: Tameable, playerUuid: string): Tameable {
  if (m.tamedByUuid !== playerUuid) return m;
  return { ...m, sitting: !m.sitting };
}

export function isPersistent(m: Tameable): boolean {
  return m.tamedByUuid !== undefined;
}
