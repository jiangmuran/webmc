import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  type AnyMsg,
  type BlockEdit,
  MSG_BLOCK_EDIT,
  MSG_CHAT,
  MSG_HELLO,
  MSG_PING,
  MSG_PONG,
  Reader,
  Writer,
  decode,
  encode,
} from './codec';

describe('Writer/Reader primitives', () => {
  it('round-trips u8/u16/u32/i32/f32/varuint/string/bytes', () => {
    const w = new Writer();
    w.u8(0x7f);
    w.u16(0xbeef);
    w.u32(0xdeadbeef);
    w.i32(-42);
    w.f32(1.5);
    w.varuint(0);
    w.varuint(127);
    w.varuint(128);
    w.varuint(0x0fffffff);
    w.string('hello 世界');
    w.bytes(new Uint8Array([1, 2, 3, 4, 5]));
    const r = new Reader(w.finish());
    expect(r.u8()).toBe(0x7f);
    expect(r.u16()).toBe(0xbeef);
    expect(r.u32()).toBe(0xdeadbeef);
    expect(r.i32()).toBe(-42);
    expect(r.f32()).toBe(1.5);
    expect(r.varuint()).toBe(0);
    expect(r.varuint()).toBe(127);
    expect(r.varuint()).toBe(128);
    expect(r.varuint()).toBe(0x0fffffff);
    expect(r.string()).toBe('hello 世界');
    expect(Array.from(r.readBytes(5))).toEqual([1, 2, 3, 4, 5]);
  });

  it('throws on truncated messages', () => {
    const r = new Reader(new Uint8Array([1]));
    expect(() => {
      r.u32();
    }).toThrow(/truncated/);
  });
});

describe('message round-trip', () => {
  it('HELLO', () => {
    const msg: AnyMsg = {
      tag: MSG_HELLO,
      protoVer: 7,
      playerIdHigh: 0xcafebabe,
      playerIdLow: 0x12345678,
      name: 'mc-ref-lover',
    };
    const bytes = encode(msg);
    const decoded = decode(bytes);
    expect(decoded).toEqual(msg);
  });

  it('CHAT with multi-byte utf-8', () => {
    const msg: AnyMsg = { tag: MSG_CHAT, text: '你好 webmc' };
    expect(decode(encode(msg))).toEqual(msg);
  });

  it('BLOCK_EDIT batch', () => {
    const edits: BlockEdit[] = Array.from({ length: 10 }, (_, i) => ({
      x: i * 7 - 20,
      y: 40 + i,
      z: i === 0 ? 0 : i * -3,
      block: i * 23,
      meta: i & 7,
    }));
    const msg: AnyMsg = { tag: MSG_BLOCK_EDIT, tick: 12345, edits };
    expect(decode(encode(msg))).toEqual(msg);
  });

  it('PING / PONG nonce round-trip', () => {
    const p: AnyMsg = { tag: MSG_PING, nonce: 0x12345678 };
    expect(decode(encode(p))).toEqual(p);
    const q: AnyMsg = { tag: MSG_PONG, nonce: 0xffffffff };
    expect(decode(encode(q))).toEqual(q);
  });

  it('rejects unknown tag', () => {
    expect(() => decode(new Uint8Array([0x99]))).toThrow(/unknown tag/);
  });

  it('rejects pathologically large block-edit count', () => {
    const w = new Writer();
    w.u8(MSG_BLOCK_EDIT).u32(0).varuint(999999);
    expect(() => decode(w.finish())).toThrow(/exceeds cap/);
  });

  it('property: any valid HELLO survives round-trip', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 0xffff }),
        fc.integer({ min: 0, max: 0x7fff_ffff }),
        fc.integer({ min: 0, max: 0x7fff_ffff }),
        fc.string({ maxLength: 32 }),
        (protoVer, hi, lo, name) => {
          const msg: AnyMsg = {
            tag: MSG_HELLO,
            protoVer,
            playerIdHigh: hi,
            playerIdLow: lo,
            name,
          };
          expect(decode(encode(msg))).toEqual(msg);
        },
      ),
      { numRuns: 50 },
    );
  });
});
