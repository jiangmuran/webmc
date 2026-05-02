import type { NbtValue } from './nbt_compound';
import type { NbtRoot } from './nbt_decode';

// Java NBT binary encoder, big-endian. Inverse of `decodeNbt` so a round
// trip preserves all 12 tag types.

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

class Writer {
  private buf = new Uint8Array(256);
  private dv = new DataView(this.buf.buffer);
  private pos = 0;
  private grow(n: number): void {
    if (this.pos + n <= this.buf.byteLength) return;
    let cap = this.buf.byteLength * 2;
    while (cap < this.pos + n) cap *= 2;
    const nb = new Uint8Array(cap);
    nb.set(this.buf);
    this.buf = nb;
    this.dv = new DataView(nb.buffer);
  }
  u8(v: number): void {
    this.grow(1);
    this.dv.setUint8(this.pos, v);
    this.pos += 1;
  }
  i8(v: number): void {
    this.grow(1);
    this.dv.setInt8(this.pos, v);
    this.pos += 1;
  }
  i16(v: number): void {
    this.grow(2);
    this.dv.setInt16(this.pos, v, false);
    this.pos += 2;
  }
  u16(v: number): void {
    this.grow(2);
    this.dv.setUint16(this.pos, v, false);
    this.pos += 2;
  }
  i32(v: number): void {
    this.grow(4);
    this.dv.setInt32(this.pos, v, false);
    this.pos += 4;
  }
  i64(v: bigint): void {
    this.grow(8);
    this.dv.setBigInt64(this.pos, v, false);
    this.pos += 8;
  }
  f32(v: number): void {
    this.grow(4);
    this.dv.setFloat32(this.pos, v, false);
    this.pos += 4;
  }
  f64(v: number): void {
    this.grow(8);
    this.dv.setFloat64(this.pos, v, false);
    this.pos += 8;
  }
  bytes(b: ArrayLike<number>): void {
    this.grow(b.length);
    for (let i = 0; i < b.length; i++) this.buf[this.pos + i] = b[i] ?? 0;
    this.pos += b.length;
  }
  finish(): Uint8Array {
    return this.buf.slice(0, this.pos);
  }
}

// Shared module-scope TextEncoder. Was a fresh instance per NBT
// string write — every key + every string tag (potentially hundreds
// per save blob) allocated a new encoder. The class itself has no
// per-call state once constructed; it's safe to share.
const SHARED_UTF8_ENCODER = new TextEncoder();
function writeUtf8(w: Writer, s: string): void {
  const enc = SHARED_UTF8_ENCODER.encode(s);
  w.u16(enc.length);
  w.bytes(enc);
}

function tagOf(v: NbtValue): number {
  switch (v.type) {
    case 'byte':
      return TAG_BYTE;
    case 'short':
      return TAG_SHORT;
    case 'int':
      return TAG_INT;
    case 'long':
      return TAG_LONG;
    case 'float':
      return TAG_FLOAT;
    case 'double':
      return TAG_DOUBLE;
    case 'byteArray':
      return TAG_BYTE_ARRAY;
    case 'string':
      return TAG_STRING;
    case 'list':
      return TAG_LIST;
    case 'compound':
      return TAG_COMPOUND;
    case 'intArray':
      return TAG_INT_ARRAY;
    case 'longArray':
      return TAG_LONG_ARRAY;
  }
}

function writePayload(w: Writer, v: NbtValue): void {
  switch (v.type) {
    case 'byte':
      w.i8(v.value);
      return;
    case 'short':
      w.i16(v.value);
      return;
    case 'int':
      w.i32(v.value);
      return;
    case 'long':
      w.i64(v.value);
      return;
    case 'float':
      w.f32(v.value);
      return;
    case 'double':
      w.f64(v.value);
      return;
    case 'string':
      writeUtf8(w, v.value);
      return;
    case 'byteArray': {
      w.i32(v.value.length);
      for (const x of v.value) w.i8(x);
      return;
    }
    case 'intArray': {
      w.i32(v.value.length);
      for (const x of v.value) w.i32(x);
      return;
    }
    case 'longArray': {
      w.i32(v.value.length);
      for (const x of v.value) w.i64(x);
      return;
    }
    case 'list': {
      // Use the first item's tag, or TAG_END for empty lists.
      const itemTag = v.value.length > 0 ? tagOf(v.value[0]!) : TAG_END;
      w.u8(itemTag);
      w.i32(v.value.length);
      for (const item of v.value) writePayload(w, item);
      return;
    }
    case 'compound': {
      for (const [key, val] of Object.entries(v.value)) {
        w.u8(tagOf(val));
        writeUtf8(w, key);
        writePayload(w, val);
      }
      w.u8(TAG_END);
      return;
    }
  }
}

export function encodeNbt(root: NbtRoot): Uint8Array {
  const w = new Writer();
  w.u8(tagOf(root.value));
  writeUtf8(w, root.name);
  writePayload(w, root.value);
  return w.finish();
}
