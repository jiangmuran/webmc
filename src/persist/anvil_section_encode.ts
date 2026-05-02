import type { NbtValue } from './nbt_compound';

// Encode a section back to the NBT shape parseSection expects:
//   { Y, block_states: { palette: LIST<COMPOUND>, data: LONG_ARRAY (omitted if palette.length===1) } }
// Indices are NOT cross-long; bits = max(4, ceil(log2(palette.length))).
//
// Source: minecraft.wiki "Chunk format". Behavioral spec — clean-room safe.

const SECTION_BLOCKS = 16 * 16 * 16;

export function packIndices(indices: Uint16Array, paletteLen: number): BigInt64Array {
  const bits = Math.max(4, Math.ceil(Math.log2(Math.max(2, paletteLen))));
  const perLong = Math.floor(64 / bits);
  const longCount = Math.ceil(SECTION_BLOCKS / perLong);
  const out = new BigInt64Array(longCount);
  let idx = 0;
  for (let i = 0; i < longCount && idx < SECTION_BLOCKS; i++) {
    let word = 0n;
    for (let j = 0; j < perLong && idx < SECTION_BLOCKS; j++) {
      const v = BigInt(indices[idx++] ?? 0);
      word |= v << BigInt(j * bits);
    }
    out[i] = word;
  }
  return out;
}

export interface SectionEncodeInput {
  y: number;
  paletteNames: readonly string[];
  // length = SECTION_BLOCKS, values = palette index
  indices: Uint16Array;
}

export function encodeSection(input: SectionEncodeInput): NbtValue {
  const palette: NbtValue[] = input.paletteNames.map((name) => ({
    type: 'compound',
    value: { Name: { type: 'string', value: name } },
  }));
  const blockStates: Record<string, NbtValue> = {
    palette: { type: 'list', value: palette },
  };
  if (input.paletteNames.length > 1) {
    const packed = packIndices(input.indices, input.paletteNames.length);
    blockStates['data'] = { type: 'longArray', value: packed };
  }
  return {
    type: 'compound',
    value: {
      Y: { type: 'int', value: input.y },
      block_states: { type: 'compound', value: blockStates },
    },
  };
}
