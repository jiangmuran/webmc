import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { encodeNbt } from './nbt_encode';
import { decodeNbt, type NbtRoot } from './nbt_decode';
import type { NbtValue } from './nbt_compound';

// Exclude payloads that decode/encode might lose information on (NaN
// floats, 64-bit ints over JS safe range, surrogate code points). Those
// are corner cases worth their own targeted tests, not a property test.
const safeName = fc.string({
  minLength: 0,
  maxLength: 12,
  unit: fc.integer({ min: 0x21, max: 0x7e }).map((c) => String.fromCodePoint(c)),
});

const finiteFloat = fc
  .float({ noNaN: true, min: -1e6, max: 1e6 })
  .filter((n) => Number.isFinite(n));

const safeInt = fc.integer({ min: -100000, max: 100000 });

const safeI8 = fc.integer({ min: -128, max: 127 });
const safeI16 = fc.integer({ min: -32768, max: 32767 });
const safeI32 = fc.integer({ min: -2147483648, max: 2147483647 });
const safeI64 = fc.integer({ min: -1_000_000_000, max: 1_000_000_000 }).map((n) => BigInt(n));

// Build a primitive-only compound. (Recursive lists/compounds add
// generation explosion that's not worth it for a smoke property test.)
const arbitrary: fc.Arbitrary<NbtValue> = fc.oneof(
  safeI8.map<NbtValue>((value) => ({ type: 'byte', value })),
  safeI16.map<NbtValue>((value) => ({ type: 'short', value })),
  safeI32.map<NbtValue>((value) => ({ type: 'int', value })),
  safeI64.map<NbtValue>((value) => ({ type: 'long', value })),
  finiteFloat.map<NbtValue>((value) => ({ type: 'double', value })),
  safeName.map<NbtValue>((value) => ({ type: 'string', value })),
  fc.array(safeInt, { minLength: 0, maxLength: 8 }).map<NbtValue>((xs) => ({
    type: 'intArray',
    value: Int32Array.from(xs),
  })),
  fc
    .array(fc.integer({ min: -128, max: 127 }), { minLength: 0, maxLength: 8 })
    .map<NbtValue>((xs) => ({
      type: 'byteArray',
      value: Int8Array.from(xs),
    })),
);

describe('NBT round-trip property', () => {
  it('encodeNbt then decodeNbt returns equivalent value', () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          safeName.filter((s) => s.length > 0),
          arbitrary,
          {
            maxKeys: 6,
          },
        ),
        safeName,
        (fields, name) => {
          const root: NbtRoot = { name, value: { type: 'compound', value: fields } };
          const enc = encodeNbt(root);
          const back = decodeNbt(enc);
          expect(back.name).toBe(name);
          expect(back.value.type).toBe('compound');
          if (back.value.type !== 'compound') return;
          for (const k of Object.keys(fields)) {
            const original = fields[k];
            const decoded = back.value.value[k];
            expect(decoded?.type, `key ${k}`).toBe(original?.type);
            if (original?.type === 'intArray' && decoded?.type === 'intArray') {
              expect(Array.from(decoded.value)).toEqual(Array.from(original.value));
            } else if (original?.type === 'byteArray' && decoded?.type === 'byteArray') {
              expect(Array.from(decoded.value)).toEqual(Array.from(original.value));
            } else {
              expect(decoded).toEqual(original);
            }
          }
        },
      ),
      { numRuns: 50 },
    );
  });
});
