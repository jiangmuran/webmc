// SNBT serializer — inverse of parseSnbt. Renders an NbtValue tree as
// the human-readable text form used in vanilla /data commands and tag
// arguments. Keys are unquoted when they're a bare identifier
// (/^[A-Za-z_][A-Za-z0-9_]*$/), quoted otherwise.
//
// Source: minecraft.wiki "NBT format". Behavioral spec — clean-room.

import type { NbtValue } from './nbt_compound';

const BARE_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;

function quoteString(s: string): string {
  // Prefer double quotes; escape backslash and double-quote inside.
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function quoteKey(s: string): string {
  return BARE_KEY.test(s) ? s : quoteString(s);
}

function serializePayload(v: NbtValue): string {
  switch (v.type) {
    case 'byte':
      return `${String(v.value)}b`;
    case 'short':
      return `${String(v.value)}s`;
    case 'int':
      return String(v.value);
    case 'long':
      return `${v.value.toString()}L`;
    case 'float':
      return `${String(v.value)}f`;
    case 'double':
      // Suffix d so the parser doesn't misclassify whole-number doubles.
      return `${String(v.value)}d`;
    case 'string':
      return quoteString(v.value);
    case 'list': {
      return `[${v.value.map(serializePayload).join(',')}]`;
    }
    case 'compound': {
      const parts: string[] = [];
      for (const [k, val] of Object.entries(v.value)) {
        parts.push(`${quoteKey(k)}:${serializePayload(val)}`);
      }
      return `{${parts.join(',')}}`;
    }
    case 'byteArray': {
      const items: string[] = [];
      for (let i = 0; i < v.value.length; i++) items.push(`${String(v.value[i] ?? 0)}b`);
      return `[B;${items.join(',')}]`;
    }
    case 'intArray': {
      const items: string[] = [];
      for (let i = 0; i < v.value.length; i++) items.push(String(v.value[i] ?? 0));
      return `[I;${items.join(',')}]`;
    }
    case 'longArray': {
      const items: string[] = [];
      for (let i = 0; i < v.value.length; i++) items.push(`${(v.value[i] ?? 0n).toString()}L`);
      return `[L;${items.join(',')}]`;
    }
  }
}

export function serializeSnbt(v: NbtValue): string {
  return serializePayload(v);
}
