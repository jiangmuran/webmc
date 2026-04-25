import { describe, it, expect } from 'vitest';
import { parseVanillaInstrument, InstrumentParseError } from './vanilla_instrument_parse';

describe('vanilla instrument parser', () => {
  it('parses goat horn instrument with string sound_event', () => {
    const i = parseVanillaInstrument(
      JSON.stringify({
        sound_event: 'minecraft:item.goat_horn.sound.0',
        use_duration: 7.0,
        range: 256,
        description: 'Ponder Goat Horn',
      }),
    );
    expect(i.soundEventId).toBe('webmc:item.goat_horn.sound.0');
    expect(i.useDuration).toBe(7);
    expect(i.range).toBe(256);
    expect(i.description).toBe('Ponder Goat Horn');
  });

  it('handles object form for sound_event', () => {
    const i = parseVanillaInstrument(
      JSON.stringify({
        sound_event: { sound_id: 'minecraft:item.goat_horn.sound.5', range: 16 },
        use_duration: 7.0,
        range: 256,
      }),
    );
    expect(i.soundEventId).toBe('webmc:item.goat_horn.sound.5');
  });

  it('falls back when fields missing', () => {
    const i = parseVanillaInstrument('{}');
    expect(i.soundEventId).toBe('');
    expect(i.useDuration).toBe(0);
    expect(i.range).toBe(0);
    expect(i.description).toBe('');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaInstrument('nope')).toThrow(InstrumentParseError);
  });
});
