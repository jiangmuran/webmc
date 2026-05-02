// Parse a vanilla instrument JSON (1.19+ datapack format, used by Goat
// Horn). Schema:
//   {
//     "sound_event": "minecraft:item.goat_horn.sound.0" | { "sound_id": ..., "range": ... },
//     "use_duration": 7.0,
//     "range": 256,
//     "description": <text-component>
//   }
//
// Source: minecraft.wiki "Instrument". Behavioral spec — clean-room.

import { flattenTextComponent } from './text_component';

export interface ParsedInstrument {
  soundEventId: string; // webmc-namespaced
  useDuration: number;
  range: number;
  description: string;
}

export class InstrumentParseError extends Error {}

function readSoundEventId(v: unknown): string {
  if (typeof v === 'string') return `webmc:${v.replace(/^minecraft:/, '')}`;
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>;
    if (typeof o['sound_id'] === 'string')
      return `webmc:${o['sound_id'].replace(/^minecraft:/, '')}`;
    if (typeof o['sound_event'] === 'string')
      return `webmc:${o['sound_event'].replace(/^minecraft:/, '')}`;
  }
  return '';
}

export function parseVanillaInstrument(text: string): ParsedInstrument {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new InstrumentParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new InstrumentParseError('instrument must be an object');
  const o = json as Record<string, unknown>;
  return {
    soundEventId: readSoundEventId(o['sound_event']),
    useDuration: typeof o['use_duration'] === 'number' ? o['use_duration'] : 0,
    range: typeof o['range'] === 'number' ? o['range'] : 0,
    description: flattenTextComponent(o['description']),
  };
}
