export function encodeVarInt(value: number): Uint8Array {
  const bytes: number[] = [];
  let v = value >>> 0;
  while (v >= 0x80) {
    bytes.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  bytes.push(v & 0x7f);
  return new Uint8Array(bytes);
}

export function decodeVarInt(
  bytes: Uint8Array,
  offset: number,
): { value: number; bytesRead: number } {
  let value = 0;
  let shift = 0;
  let read = 0;
  for (let i = offset; i < bytes.length; i++) {
    const b = bytes[i] ?? 0;
    value |= (b & 0x7f) << shift;
    read++;
    if ((b & 0x80) === 0) break;
    shift += 7;
    if (shift >= 35) throw new Error('varint too long');
  }
  return { value, bytesRead: read };
}
