import { describe, it, expect } from 'vitest';
import { parseVanillaDamageType, DamageTypeParseError } from './vanilla_damage_type_parse';

describe('vanilla damage_type parser', () => {
  it('parses a typical drown damage_type', () => {
    const d = parseVanillaDamageType(
      JSON.stringify({
        message_id: 'drown',
        scaling: 'when_caused_by_living_non_player',
        exhaustion: 0,
        effects: 'drowning',
      }),
    );
    expect(d.messageId).toBe('drown');
    expect(d.scaling).toBe('when_caused_by_living_non_player');
    expect(d.exhaustion).toBe(0);
    expect(d.effects).toBe('drowning');
    expect(d.deathMessageType).toBe('default');
  });

  it('clamps unknown scaling to default', () => {
    const d = parseVanillaDamageType(JSON.stringify({ scaling: 'wat' }));
    expect(d.scaling).toBe('when_caused_by_living_non_player');
  });

  it('rejects unknown effect strings as null', () => {
    const d = parseVanillaDamageType(JSON.stringify({ effects: 'tickle' }));
    expect(d.effects).toBeNull();
  });

  it('honors fall_variants death_message_type', () => {
    const d = parseVanillaDamageType(JSON.stringify({ death_message_type: 'fall_variants' }));
    expect(d.deathMessageType).toBe('fall_variants');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaDamageType('nope')).toThrow(DamageTypeParseError);
  });
});
