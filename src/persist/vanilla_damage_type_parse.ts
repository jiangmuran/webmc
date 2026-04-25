// Parse a vanilla damage_type JSON (1.19.4+ datapack format). Schema:
//   {
//     "message_id": "<key for death message>",
//     "scaling": "never" | "when_caused_by_living_non_player" | "always",
//     "exhaustion": <float>,
//     "effects": "hurt" | "thorns" | "drowning" | "burning" | "poking" | "freezing"
//   }
//
// Source: minecraft.wiki "Damage type". Behavioral spec — clean-room.

export type DamageScaling = 'never' | 'when_caused_by_living_non_player' | 'always';

export type DamageEffectKind = 'hurt' | 'thorns' | 'drowning' | 'burning' | 'poking' | 'freezing';

export interface ParsedDamageType {
  messageId: string;
  scaling: DamageScaling;
  exhaustion: number;
  effects: DamageEffectKind | null;
  deathMessageType: 'default' | 'fall_variants' | 'intentional_game_design';
}

export class DamageTypeParseError extends Error {}

const SCALINGS: ReadonlyArray<DamageScaling> = [
  'never',
  'when_caused_by_living_non_player',
  'always',
];
const EFFECT_KINDS: ReadonlyArray<DamageEffectKind> = [
  'hurt',
  'thorns',
  'drowning',
  'burning',
  'poking',
  'freezing',
];

function asScaling(v: unknown): DamageScaling {
  return typeof v === 'string' && (SCALINGS as readonly string[]).includes(v)
    ? (v as DamageScaling)
    : 'when_caused_by_living_non_player';
}

function asEffect(v: unknown): DamageEffectKind | null {
  if (typeof v !== 'string') return null;
  return (EFFECT_KINDS as readonly string[]).includes(v) ? (v as DamageEffectKind) : null;
}

function asDeathMessageType(v: unknown): ParsedDamageType['deathMessageType'] {
  if (v === 'fall_variants' || v === 'intentional_game_design') return v;
  return 'default';
}

export function parseVanillaDamageType(text: string): ParsedDamageType {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new DamageTypeParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new DamageTypeParseError('damage_type must be an object');
  const o = json as Record<string, unknown>;
  return {
    messageId: typeof o['message_id'] === 'string' ? o['message_id'] : '',
    scaling: asScaling(o['scaling']),
    exhaustion: typeof o['exhaustion'] === 'number' ? o['exhaustion'] : 0,
    effects: asEffect(o['effects']),
    deathMessageType: asDeathMessageType(o['death_message_type']),
  };
}
