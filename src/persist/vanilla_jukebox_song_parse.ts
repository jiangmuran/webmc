// Parse a vanilla jukebox_song JSON (1.21+ datapack format). Schema:
//   {
//     "sound_event": "minecraft:music_disc.13" | { "sound_id": "...", "range": 64 },
//     "description": <text-component>,
//     "length_in_seconds": 178,
//     "comparator_output": 1
//   }
//
// Source: minecraft.wiki "Jukebox song". Behavioral spec — clean-room.

import { flattenTextComponent } from './text_component';

export interface ParsedJukeboxSong {
  soundEventId: string; // webmc-namespaced
  description: string;
  lengthInSeconds: number;
  comparatorOutput: number;
}

export class JukeboxSongParseError extends Error {}

function readSoundEventId(v: unknown): string {
  if (typeof v === 'string') return `webmc:${v.replace(/^minecraft:/, '')}`;
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>;
    if (typeof o['sound_id'] === 'string')
      return `webmc:${o['sound_id'].replace(/^minecraft:/, '')}`;
  }
  return '';
}

export function parseVanillaJukeboxSong(text: string): ParsedJukeboxSong {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new JukeboxSongParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new JukeboxSongParseError('jukebox_song must be an object');
  const o = json as Record<string, unknown>;
  return {
    soundEventId: readSoundEventId(o['sound_event']),
    description: flattenTextComponent(o['description']),
    lengthInSeconds: typeof o['length_in_seconds'] === 'number' ? o['length_in_seconds'] : 0,
    comparatorOutput:
      typeof o['comparator_output'] === 'number' ? Math.trunc(o['comparator_output']) : 0,
  };
}
