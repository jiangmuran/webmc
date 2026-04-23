export type NbtValue =
  | { type: 'byte'; value: number }
  | { type: 'short'; value: number }
  | { type: 'int'; value: number }
  | { type: 'long'; value: bigint }
  | { type: 'float'; value: number }
  | { type: 'double'; value: number }
  | { type: 'string'; value: string }
  | { type: 'list'; value: NbtValue[] }
  | { type: 'compound'; value: Record<string, NbtValue> }
  | { type: 'byteArray'; value: Int8Array }
  | { type: 'intArray'; value: Int32Array }
  | { type: 'longArray'; value: BigInt64Array };

export function getByte(c: Record<string, NbtValue>, k: string): number | undefined {
  const v = c[k];
  return v?.type === 'byte' ? v.value : undefined;
}

export function getString(c: Record<string, NbtValue>, k: string): string | undefined {
  const v = c[k];
  return v?.type === 'string' ? v.value : undefined;
}

export function setInt(
  c: Record<string, NbtValue>,
  k: string,
  value: number,
): Record<string, NbtValue> {
  return { ...c, [k]: { type: 'int', value } };
}

export function shallowMerge(
  a: Record<string, NbtValue>,
  b: Record<string, NbtValue>,
): Record<string, NbtValue> {
  return { ...a, ...b };
}
