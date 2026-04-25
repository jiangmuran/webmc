import type { NbtValue } from './nbt_compound';
import type { NbtRoot } from './nbt_decode';
import { encodeSection, type SectionEncodeInput } from './anvil_section_encode';

// Build a chunk-root NBT from a list of sections. The chunk format
// holds many other fields (Heightmaps, BlockEntities, Entities, Structures);
// for export we only emit "sections" + a "DataVersion" marker so that
// parseChunkSections + extractChunkFromRegion round-trip.
//
// Source: minecraft.wiki "Chunk format". Behavioral spec — clean-room.

export interface ChunkEncodeInput {
  sections: SectionEncodeInput[];
  // Optional integer DataVersion. Vanilla uses one int per release; we
  // pass it through as-is so external tooling can detect the version.
  dataVersion: number;
  // Optional integer xPos / zPos. Not validated.
  xPos?: number;
  zPos?: number;
  // Optional integer yPos (lowest section Y). Vanilla 1.18+.
  yPos?: number;
}

export function encodeChunkRoot(input: ChunkEncodeInput): NbtRoot {
  const sections: NbtValue[] = input.sections.map(encodeSection);
  const fields: Record<string, NbtValue> = {
    DataVersion: { type: 'int', value: Math.trunc(input.dataVersion) },
    sections: { type: 'list', value: sections },
  };
  if (input.xPos !== undefined) fields['xPos'] = { type: 'int', value: Math.trunc(input.xPos) };
  if (input.zPos !== undefined) fields['zPos'] = { type: 'int', value: Math.trunc(input.zPos) };
  if (input.yPos !== undefined) fields['yPos'] = { type: 'int', value: Math.trunc(input.yPos) };
  return { name: '', value: { type: 'compound', value: fields } };
}
