// Illager spell caster (Evoker / Illusioner). Fixed cooldown between
// spells + per-spell warmup duration. Spells: summon_vex, fangs, wololo,
// mirror_image, blindness.

export type Spell = 'summon_vex' | 'fangs' | 'wololo' | 'mirror_image' | 'blindness';

export interface SpellDef {
  spell: Spell;
  warmupSec: number;
  cooldownSec: number;
}

export const SPELL_DEFS: Record<Spell, SpellDef> = {
  summon_vex: { spell: 'summon_vex', warmupSec: 1, cooldownSec: 15 },
  fangs: { spell: 'fangs', warmupSec: 1, cooldownSec: 8 },
  wololo: { spell: 'wololo', warmupSec: 2, cooldownSec: 10 },
  mirror_image: { spell: 'mirror_image', warmupSec: 1.5, cooldownSec: 15 },
  blindness: { spell: 'blindness', warmupSec: 0.5, cooldownSec: 6 },
};

export interface CasterState {
  activeSpell: Spell | null;
  warmupSec: number;
  cooldownSec: number;
}

export function makeCaster(): CasterState {
  return { activeSpell: null, warmupSec: 0, cooldownSec: 0 };
}

export interface CastQuery {
  spell: Spell;
}

export interface CastResult {
  started: boolean;
}

export function beginSpell(state: CasterState, q: CastQuery): CastResult {
  if (state.activeSpell !== null) return { started: false };
  if (state.cooldownSec > 0) return { started: false };
  const def = SPELL_DEFS[q.spell];
  state.activeSpell = q.spell;
  state.warmupSec = def.warmupSec;
  return { started: true };
}

export interface TickCtx {
  dtSec: number;
}

export interface SpellTickResult {
  fired: Spell | null;
}

export function tickCaster(state: CasterState, ctx: TickCtx): SpellTickResult {
  state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
  if (state.activeSpell === null) return { fired: null };
  state.warmupSec -= ctx.dtSec;
  if (state.warmupSec > 0) return { fired: null };
  const spell = state.activeSpell;
  state.cooldownSec = SPELL_DEFS[spell].cooldownSec;
  state.activeSpell = null;
  return { fired: spell };
}
