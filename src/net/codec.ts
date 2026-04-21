// Bit-packed binary codec for webmc's multiplayer protocol.
// Little-endian throughout. Varints are LEB128. Strings are u16 length + UTF-8.

export const MSG_HELLO = 0x01;
export const MSG_WELCOME = 0x02;
export const MSG_INPUT = 0x10;
export const MSG_STATE_DELTA = 0x11;
export const MSG_BLOCK_EDIT = 0x20;
export const MSG_CHUNK_FULL = 0x21;
export const MSG_CHUNK_DELTA = 0x22;
export const MSG_CHAT = 0x30;
export const MSG_INVENTORY = 0x40;
export const MSG_PING = 0xf0;
export const MSG_PONG = 0xf1;

export type MsgTag =
  | typeof MSG_HELLO
  | typeof MSG_WELCOME
  | typeof MSG_INPUT
  | typeof MSG_STATE_DELTA
  | typeof MSG_BLOCK_EDIT
  | typeof MSG_CHUNK_FULL
  | typeof MSG_CHUNK_DELTA
  | typeof MSG_CHAT
  | typeof MSG_INVENTORY
  | typeof MSG_PING
  | typeof MSG_PONG;

const INITIAL_CAPACITY = 64;

export class Writer {
  private buf: Uint8Array;
  private view: DataView;
  private offset = 0;

  constructor(capacity = INITIAL_CAPACITY) {
    this.buf = new Uint8Array(Math.max(capacity, 16));
    this.view = new DataView(this.buf.buffer);
  }

  private grow(extra: number): void {
    if (this.offset + extra <= this.buf.length) return;
    let cap = this.buf.length;
    while (cap < this.offset + extra) cap *= 2;
    const next = new Uint8Array(cap);
    next.set(this.buf);
    this.buf = next;
    this.view = new DataView(this.buf.buffer);
  }

  u8(v: number): this {
    this.grow(1);
    this.view.setUint8(this.offset, v & 0xff);
    this.offset += 1;
    return this;
  }

  u16(v: number): this {
    this.grow(2);
    this.view.setUint16(this.offset, v & 0xffff, true);
    this.offset += 2;
    return this;
  }

  u32(v: number): this {
    this.grow(4);
    this.view.setUint32(this.offset, v >>> 0, true);
    this.offset += 4;
    return this;
  }

  i32(v: number): this {
    this.grow(4);
    this.view.setInt32(this.offset, v | 0, true);
    this.offset += 4;
    return this;
  }

  f32(v: number): this {
    this.grow(4);
    this.view.setFloat32(this.offset, v, true);
    this.offset += 4;
    return this;
  }

  varuint(v: number): this {
    let n = v >>> 0;
    while (n >= 0x80) {
      this.u8((n & 0x7f) | 0x80);
      n >>>= 7;
    }
    this.u8(n & 0x7f);
    return this;
  }

  string(s: string): this {
    const bytes = new TextEncoder().encode(s);
    if (bytes.length > 0xffff) throw new Error('string too long for codec');
    this.u16(bytes.length);
    this.bytes(bytes);
    return this;
  }

  bytes(src: Uint8Array): this {
    this.grow(src.length);
    this.buf.set(src, this.offset);
    this.offset += src.length;
    return this;
  }

  finish(): Uint8Array {
    return this.buf.subarray(0, this.offset);
  }
}

export class Reader {
  private view: DataView;
  private offset = 0;

  private readonly source: Uint8Array;

  constructor(bytes: Uint8Array) {
    this.source = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  get bytes(): Uint8Array {
    return this.source;
  }

  get remaining(): number {
    return this.source.length - this.offset;
  }

  private require(n: number): void {
    if (this.offset + n > this.source.length) {
      throw new Error(
        `codec: truncated message (need ${n.toString()}, have ${this.remaining.toString()})`,
      );
    }
  }

  u8(): number {
    this.require(1);
    const v = this.view.getUint8(this.offset);
    this.offset += 1;
    return v;
  }

  u16(): number {
    this.require(2);
    const v = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return v;
  }

  u32(): number {
    this.require(4);
    const v = this.view.getUint32(this.offset, true) >>> 0;
    this.offset += 4;
    return v;
  }

  i32(): number {
    this.require(4);
    const v = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return v;
  }

  f32(): number {
    this.require(4);
    const v = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return v;
  }

  varuint(): number {
    let result = 0;
    let shift = 0;
    for (let i = 0; i < 5; i++) {
      const byte = this.u8();
      result |= (byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) return result >>> 0;
      shift += 7;
    }
    throw new Error('codec: varuint overflow');
  }

  string(): string {
    const len = this.u16();
    this.require(len);
    const slice = this.source.subarray(this.offset, this.offset + len);
    this.offset += len;
    return new TextDecoder().decode(slice);
  }

  readBytes(n: number): Uint8Array {
    this.require(n);
    const out = this.source.subarray(this.offset, this.offset + n);
    this.offset += n;
    return out;
  }
}

export interface HelloMsg {
  tag: typeof MSG_HELLO;
  protoVer: number;
  playerIdHigh: number;
  playerIdLow: number;
  name: string;
}

export interface ChatMsg {
  tag: typeof MSG_CHAT;
  text: string;
}

export interface BlockEdit {
  x: number;
  y: number;
  z: number;
  block: number;
  meta: number;
}

export interface BlockEditMsg {
  tag: typeof MSG_BLOCK_EDIT;
  tick: number;
  edits: BlockEdit[];
}

export interface PingMsg {
  tag: typeof MSG_PING;
  nonce: number;
}

export interface PongMsg {
  tag: typeof MSG_PONG;
  nonce: number;
}

export type AnyMsg = HelloMsg | ChatMsg | BlockEditMsg | PingMsg | PongMsg;

export function encode(msg: AnyMsg): Uint8Array {
  const w = new Writer();
  w.u8(msg.tag);
  switch (msg.tag) {
    case MSG_HELLO:
      w.u32(msg.protoVer);
      w.u32(msg.playerIdHigh);
      w.u32(msg.playerIdLow);
      w.string(msg.name);
      break;
    case MSG_CHAT:
      w.string(msg.text);
      break;
    case MSG_BLOCK_EDIT:
      w.u32(msg.tick);
      w.varuint(msg.edits.length);
      for (const e of msg.edits) {
        w.i32(e.x);
        w.i32(e.y);
        w.i32(e.z);
        w.u16(e.block);
        w.u8(e.meta);
      }
      break;
    case MSG_PING:
    case MSG_PONG:
      w.u32(msg.nonce);
      break;
  }
  return w.finish();
}

export function decode(bytes: Uint8Array): AnyMsg {
  const r = new Reader(bytes);
  const tag = r.u8();
  switch (tag) {
    case MSG_HELLO:
      return {
        tag: MSG_HELLO,
        protoVer: r.u32(),
        playerIdHigh: r.u32(),
        playerIdLow: r.u32(),
        name: r.string(),
      };
    case MSG_CHAT:
      return { tag: MSG_CHAT, text: r.string() };
    case MSG_BLOCK_EDIT: {
      const tick = r.u32();
      const count = r.varuint();
      if (count > 4096) throw new Error(`codec: block-edit count ${count.toString()} exceeds cap`);
      const edits: BlockEdit[] = [];
      for (let i = 0; i < count; i++) {
        edits.push({
          x: r.i32(),
          y: r.i32(),
          z: r.i32(),
          block: r.u16(),
          meta: r.u8(),
        });
      }
      return { tag: MSG_BLOCK_EDIT, tick, edits };
    }
    case MSG_PING:
      return { tag: MSG_PING, nonce: r.u32() };
    case MSG_PONG:
      return { tag: MSG_PONG, nonce: r.u32() };
    default:
      throw new Error(`codec: unknown tag 0x${tag.toString(16)}`);
  }
}
