// Status effect stack with merge-by-id (longer / higher amplifier wins).

export interface ActiveEffect {
  id: string;
  amplifier: number;
  durationTicks: number;
  isAmbient: boolean;
  showParticles: boolean;
}

export interface EffectList {
  byId: Map<string, ActiveEffect>;
}

export function makeEffects(): EffectList {
  return { byId: new Map() };
}

export function apply(list: EffectList, next: ActiveEffect): void {
  const cur = list.byId.get(next.id);
  if (!cur) {
    list.byId.set(next.id, next);
    return;
  }
  if (next.amplifier > cur.amplifier) {
    list.byId.set(next.id, {
      ...next,
      durationTicks: Math.max(next.durationTicks, cur.durationTicks),
    });
  } else if (next.amplifier === cur.amplifier && next.durationTicks > cur.durationTicks) {
    list.byId.set(next.id, next);
  }
}

export function tick(list: EffectList): void {
  for (const [id, e] of list.byId) {
    if (e.durationTicks <= 1) list.byId.delete(id);
    else list.byId.set(id, { ...e, durationTicks: e.durationTicks - 1 });
  }
}

export function has(list: EffectList, id: string): boolean {
  return list.byId.has(id);
}

export function level(list: EffectList, id: string): number {
  return (list.byId.get(id)?.amplifier ?? -1) + 1;
}
