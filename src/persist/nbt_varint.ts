// NBT-style varint encoding (LEB128 unsigned). Used in custom webmc
// chunk format for compact integer storage.

export function encodeVarint(n: number): number[] {
  if (n < 0) throw new Error('negative varint not supported here');
  const out: number[] = [];
  let v = n >>> 0;
  while (v >= 0x80) {
    out.push((v & 0x7f) | 0x80);
    v = v >>> 7;
  }
  out.push(v & 0x7f);
  return out;
}

export function decodeVarint(bytes: number[], offset = 0): { value: number; bytesRead: number } {
  let value = 0;
  let shift = 0;
  let i = offset;
  while (i < bytes.length) {
    const b = bytes[i];
    if (b === undefined) break;
    value |= (b & 0x7f) << shift;
    i++;
    if ((b & 0x80) === 0) return { value: value >>> 0, bytesRead: i - offset };
    shift += 7;
    if (shift > 35) throw new Error('varint too long');
  }
  throw new Error('truncated varint');
}

export function varintSize(n: number): number {
  return encodeVarint(n).length;
}
