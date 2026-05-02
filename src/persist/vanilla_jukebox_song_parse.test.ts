import { describe, it, expect } from 'vitest';
import { parseVanillaJukeboxSong, JukeboxSongParseError } from './vanilla_jukebox_song_parse';

describe('vanilla jukebox_song parser', () => {
  it('parses a typical music disc song', () => {
    const s = parseVanillaJukeboxSong(
      JSON.stringify({
        sound_event: 'minecraft:music_disc.13',
        description: { translate: 'item.minecraft.music_disc_13.desc' },
        length_in_seconds: 178,
        comparator_output: 1,
      }),
    );
    expect(s.soundEventId).toBe('webmc:music_disc.13');
    expect(s.description).toBe('item.minecraft.music_disc_13.desc');
    expect(s.lengthInSeconds).toBe(178);
    expect(s.comparatorOutput).toBe(1);
  });

  it('handles object form for sound_event', () => {
    const s = parseVanillaJukeboxSong(
      JSON.stringify({
        sound_event: { sound_id: 'minecraft:music_disc.creator', range: 16 },
      }),
    );
    expect(s.soundEventId).toBe('webmc:music_disc.creator');
  });

  it('falls back when fields missing', () => {
    const s = parseVanillaJukeboxSong('{}');
    expect(s.soundEventId).toBe('');
    expect(s.lengthInSeconds).toBe(0);
    expect(s.comparatorOutput).toBe(0);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaJukeboxSong('nope')).toThrow(JukeboxSongParseError);
  });
});
