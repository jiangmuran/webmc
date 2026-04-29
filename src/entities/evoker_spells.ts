// Evoker spell casting. Attacks with one of 3 spells picked per turn:
// summon vex (3), summon fangs (line), or wololo (sheep → red). Each
// has a cooldown; can't double-cast within window.

export type Spell = 'summon_vex' | 'fangs_line' | 'wololo';

export interface EvokerState {
  lastCastMs: Record<Spell, number>;
  nextPickMs: number;
}

// Wiki (minecraft.wiki/w/Evoker): every evoker spell has a 100-tick
// (5s) base cooldown. Some spells extend that by their cast animation
// (vex summon ~340 ticks ≈ 17s). Old wololo cooldown was 10s — kept
// inconsistent with the standalone evoker_wool_wololo module.
export const SPELL_COOLDOWN_MS: Record<Spell, number> = {
  summon_vex: 17_000,
  fangs_line: 5_000,
  wololo: 5_000,
};

export function makeEvoker(): EvokerState {
  return {
    lastCastMs: { summon_vex: -Infinity, fangs_line: -Infinity, wololo: -Infinity },
    nextPickMs: 0,
  };
}

export function canCast(s: EvokerState, spell: Spell, nowMs: number): boolean {
  return nowMs - s.lastCastMs[spell] >= SPELL_COOLDOWN_MS[spell];
}

export interface PickQuery {
  nowMs: number;
  rand: () => number;
  sheepNearby: boolean;
  enemyNearby: boolean;
  vexCount: number;
}

export function pickSpell(s: EvokerState, q: PickQuery): Spell | null {
  if (q.nowMs < s.nextPickMs) return null;
  const candidates: Spell[] = [];
  if (q.sheepNearby && canCast(s, 'wololo', q.nowMs)) candidates.push('wololo');
  if (q.enemyNearby && canCast(s, 'fangs_line', q.nowMs)) candidates.push('fangs_line');
  if (q.vexCount < 3 && canCast(s, 'summon_vex', q.nowMs)) candidates.push('summon_vex');
  if (candidates.length === 0) return null;
  const choice = candidates[Math.floor(q.rand() * candidates.length)];
  if (!choice) return null;
  s.lastCastMs[choice] = q.nowMs;
  s.nextPickMs = q.nowMs + 500;
  return choice;
}
