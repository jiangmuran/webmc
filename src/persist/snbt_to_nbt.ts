// Bridge between the existing SNBT parser (snbt_parse.ts uses its own
// SnbtValue type) and the rest of the persist layer (decodeNbt /
// encodeNbt operate on NbtValue). The two type shapes are 1:1 except
// for the discriminant key (`kind` vs `type`); we convert.

import type { SnbtValue } from './snbt_parse';
import type { NbtValue } from './nbt_compound';

export function snbtValueToNbtValue(v: SnbtValue): NbtValue {
  switch (v.kind) {
    case 'byte':
      return { type: 'byte', value: v.value };
    case 'short':
      return { type: 'short', value: v.value };
    case 'int':
      return { type: 'int', value: v.value };
    case 'long':
      return { type: 'long', value: v.value };
    case 'float':
      return { type: 'float', value: v.value };
    case 'double':
      return { type: 'double', value: v.value };
    case 'string':
      return { type: 'string', value: v.value };
    case 'list':
      return { type: 'list', value: v.items.map(snbtValueToNbtValue) };
    case 'compound': {
      const fields: Record<string, NbtValue> = {};
      for (const [k, val] of Object.entries(v.entries)) fields[k] = snbtValueToNbtValue(val);
      return { type: 'compound', value: fields };
    }
  }
}
