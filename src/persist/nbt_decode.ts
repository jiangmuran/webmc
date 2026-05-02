import type { NbtValue } from './nbt_compound';

// Minimal NBT binary decoder (Java edition uncompressed, big-endian).
// Source: NBT format spec on minecraft.wiki — clean-room safe.
//
// Tag IDs:
//   0 END, 1 BYTE, 2 SHORT, 3 INT, 4 LONG, 5 FLOAT, 6 DOUBLE,
//   7 BYTE_ARRAY, 8 STRING, 9 LIST, 10 COMPOUND, 11 INT_ARRAY, 12 LONG_ARRAY

const TAG_END = 0;
const TAG_BYTE = 1;
const TAG_SHORT = 2;
const TAG_INT = 3;
const TAG_LONG = 4;
const TAG_FLOAT = 5;
const TAG_DOUBLE = 6;
const TAG_BYTE_ARRAY = 7;
const TAG_STRING = 8;
const TAG_LIST = 9;
const TAG_COMPOUND = 10;
const TAG_INT_ARRAY = 11;
const TAG_LONG_ARRAY = 12;

class Cursor {
  pos = 0;
  constructor(public readonly dv: DataView) {}
  remaining(): number {
    return this.dv.byteLength - this.pos;
  }
  readU8(): number {
    if (this.pos >= this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getUint8(this.pos);
    this.pos += 1;
    return v;
  }
  readI8(): number {
    if (this.pos >= this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getInt8(this.pos);
    this.pos += 1;
    return v;
  }
  readI16(): number {
    if (this.pos + 2 > this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getInt16(this.pos, false);
    this.pos += 2;
    return v;
  }
  readU16(): number {
    if (this.pos + 2 > this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getUint16(this.pos, false);
    this.pos += 2;
    return v;
  }
  readI32(): number {
    if (this.pos + 4 > this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getInt32(this.pos, false);
    this.pos += 4;
    return v;
  }
  readF32(): number {
    if (this.pos + 4 > this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getFloat32(this.pos, false);
    this.pos += 4;
    return v;
  }
  readF64(): number {
    if (this.pos + 8 > this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getFloat64(this.pos, false);
    this.pos += 8;
    return v;
  }
  readI64(): bigint {
    if (this.pos + 8 > this.dv.byteLength) throw new Error('NBT: EOF');
    const v = this.dv.getBigInt64(this.pos, false);
    this.pos += 8;
    return v;
  }
  readBytes(n: number): Uint8Array {
    if (this.pos + n > this.dv.byteLength) throw new Error('NBT: EOF');
    const out = new Uint8Array(this.dv.buffer, this.dv.byteOffset + this.pos, n);
    this.pos += n;
    return out;
  }
}

// Shared module-scope decoder. NBT decode walks every key + every
// string tag in a structure; an inbound chunk-NBT can hit hundreds of
// strings, each previously allocating a fresh TextDecoder for nothing.
const SHARED_UTF8_DECODER = new TextDecoder('utf-8', { fatal: false });
function readModifiedUtf8(c: Cursor): string {
  const len = c.readU16();
  const bytes = c.readBytes(len);
  // Java's "modified UTF-8" differs from real UTF-8 in NUL handling and
  // surrogate pairs. For ASCII (which dominates Minecraft NBT), they
  // match — accept that approximation here.
  return SHARED_UTF8_DECODER.decode(bytes);
}

function readPayload(c: Cursor, tag: number): NbtValue {
  switch (tag) {
    case TAG_BYTE:
      return { type: 'byte', value: c.readI8() };
    case TAG_SHORT:
      return { type: 'short', value: c.readI16() };
    case TAG_INT:
      return { type: 'int', value: c.readI32() };
    case TAG_LONG:
      return { type: 'long', value: c.readI64() };
    case TAG_FLOAT:
      return { type: 'float', value: c.readF32() };
    case TAG_DOUBLE:
      return { type: 'double', value: c.readF64() };
    case TAG_STRING:
      return { type: 'string', value: readModifiedUtf8(c) };
    case TAG_BYTE_ARRAY: {
      const n = c.readI32();
      const out = new Int8Array(n);
      for (let i = 0; i < n; i++) out[i] = c.readI8();
      return { type: 'byteArray', value: out };
    }
    case TAG_INT_ARRAY: {
      const n = c.readI32();
      const out = new Int32Array(n);
      for (let i = 0; i < n; i++) out[i] = c.readI32();
      return { type: 'intArray', value: out };
    }
    case TAG_LONG_ARRAY: {
      const n = c.readI32();
      const out = new BigInt64Array(n);
      for (let i = 0; i < n; i++) out[i] = c.readI64();
      return { type: 'longArray', value: out };
    }
    case TAG_LIST: {
      const itemTag = c.readU8();
      const n = c.readI32();
      const items: NbtValue[] = [];
      for (let i = 0; i < n; i++) items.push(readPayload(c, itemTag));
      return { type: 'list', value: items };
    }
    case TAG_COMPOUND: {
      const fields: Record<string, NbtValue> = {};
      while (true) {
        const t = c.readU8();
        if (t === TAG_END) break;
        const name = readModifiedUtf8(c);
        fields[name] = readPayload(c, t);
      }
      return { type: 'compound', value: fields };
    }
    default:
      throw new Error(`NBT: unknown tag ${String(tag)}`);
  }
}

export interface NbtRoot {
  name: string;
  value: NbtValue;
}

export function decodeNbt(bytes: Uint8Array): NbtRoot {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const c = new Cursor(dv);
  const tag = c.readU8();
  if (tag === TAG_END) return { name: '', value: { type: 'compound', value: {} } };
  const name = readModifiedUtf8(c);
  const value = readPayload(c, tag);
  return { name, value };
}
