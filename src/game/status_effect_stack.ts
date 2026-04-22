// Status effect stacking rules. Same effect + higher amplifier
// replaces. Same + equal amp + longer duration replaces. Else hidden.

export type EffectId =
  | 'speed'
  | 'slowness'
  | 'regeneration'
  | 'poison'
  | 'wither'
  | 'strength'
  | 'weakness'
  | 'absorption'
  | 'health_boost';

export interface Effect {
  id: EffectId;
  amplifier: number;
  durationTicks: number;
  source: 'potion' | 'beacon' | 'ambient' | 'totem';
}

export interface ActiveEffects {
  effects: Map<EffectId, Effect[]>; // stack per id
}

export function makeActive(): ActiveEffects {
  return { effects: new Map() };
}

export type AddResult = 'added' | 'upgraded' | 'hidden' | 'merged_duration';

export function addEffect(a: ActiveEffects, e: Effect): AddResult {
  const stack = a.effects.get(e.id) ?? [];
  // Look for same source+amp; merge.
  const sameExact = stack.find((s) => s.amplifier === e.amplifier && s.source === e.source);
  if (sameExact) {
    sameExact.durationTicks = Math.max(sameExact.durationTicks, e.durationTicks);
    a.effects.set(e.id, stack);
    return 'merged_duration';
  }
  stack.push(e);
  stack.sort((a, b) => b.amplifier - a.amplifier);
  a.effects.set(e.id, stack);
  return stack[0] === e ? 'upgraded' : 'added';
}

export function topEffect(a: ActiveEffects, id: EffectId): Effect | null {
  return a.effects.get(id)?.[0] ?? null;
}

export function tickEffects(a: ActiveEffects, deltaTicks: number): void {
  for (const [id, stack] of a.effects) {
    for (const e of stack) e.durationTicks -= deltaTicks;
    const alive = stack.filter((e) => e.durationTicks > 0);
    if (alive.length === 0) a.effects.delete(id);
    else a.effects.set(id, alive);
  }
}
