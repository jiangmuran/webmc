// Potion effect application. Drinking a potion applies effects; the
// instant ones (healing, harming) resolve immediately; timed ones go
// into the player's effect list.

export type EffectId =
  | 'speed'
  | 'slowness'
  | 'haste'
  | 'mining_fatigue'
  | 'strength'
  | 'instant_health'
  | 'instant_damage'
  | 'jump_boost'
  | 'nausea'
  | 'regeneration'
  | 'resistance'
  | 'fire_resistance'
  | 'water_breathing'
  | 'invisibility'
  | 'blindness'
  | 'night_vision'
  | 'hunger'
  | 'weakness'
  | 'poison'
  | 'wither'
  | 'health_boost'
  | 'absorption'
  | 'saturation'
  | 'slow_falling';

const INSTANT = new Set<EffectId>(['instant_health', 'instant_damage', 'saturation']);

export function isInstant(e: EffectId): boolean {
  return INSTANT.has(e);
}

export interface ActiveEffect {
  id: EffectId;
  amplifier: number; // 0 = level I
  durationTicks: number;
  ambient: boolean;
  showParticles: boolean;
}

export interface PlayerEffects {
  active: Map<EffectId, ActiveEffect>;
}

export function makeEffects(): PlayerEffects {
  return { active: new Map() };
}

export function apply(
  pe: PlayerEffects,
  e: ActiveEffect,
): 'replaced' | 'upgraded' | 'merged' | 'added' {
  const cur = pe.active.get(e.id);
  if (!cur) {
    pe.active.set(e.id, { ...e });
    return 'added';
  }
  if (e.amplifier > cur.amplifier) {
    pe.active.set(e.id, { ...e });
    return 'upgraded';
  }
  if (e.amplifier === cur.amplifier) {
    cur.durationTicks = Math.max(cur.durationTicks, e.durationTicks);
    return 'merged';
  }
  // lower amplifier won't override higher one, but retained as potential revert
  return 'replaced';
}

export interface TickResult {
  instantHp: number; // +heal, -harm
  saturationDelta: number;
}

// Wiki:
//   minecraft.wiki/w/Instant_Health — heals 2 × 2^level
//   minecraft.wiki/w/Instant_Damage — damages 3 × 2^level
// Where wiki "level" = amplifier + 1, so:
//   heal   = 2 * 2^(amplifier+1) = 4 << amplifier
//   damage = 3 * 2^(amplifier+1) = 6 << amplifier
// Old formulas were linear `(amplifier+1) * 4` / `(amplifier+1) * 3`,
// matching wiki only at amp 0/1 for health (4, 8) and never for
// damage (code: 3 vs wiki 6 at level I, off by 2× from the start).
// At amp 2 the divergence is large: health code=12 wiki=16,
// damage code=9 wiki=24.
export function tickEffects(pe: PlayerEffects): TickResult {
  let instantHp = 0;
  let sat = 0;
  for (const [id, e] of pe.active) {
    if (isInstant(id)) {
      if (id === 'instant_health') instantHp += 2 * Math.pow(2, e.amplifier + 1);
      else if (id === 'instant_damage') instantHp -= 3 * Math.pow(2, e.amplifier + 1);
      else if (id === 'saturation') sat += e.amplifier + 1;
      pe.active.delete(id);
      continue;
    }
    e.durationTicks -= 1;
    if (e.durationTicks <= 0) pe.active.delete(id);
  }
  return { instantHp, saturationDelta: sat };
}
