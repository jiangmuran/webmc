export function xorBuffers(a: Uint8Array, b: Uint8Array): Uint8Array {
  const len = Math.max(a.length, b.length);
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return out;
}

export function applyXor(base: Uint8Array, diff: Uint8Array): Uint8Array {
  return xorBuffers(base, diff);
}

export function diffSparsity(diff: Uint8Array): number {
  let zero = 0;
  for (const b of diff) {
    if (b === 0) zero++;
  }
  return diff.length === 0 ? 1 : zero / diff.length;
}

export function worthSendingDiff(diff: Uint8Array, full: Uint8Array): boolean {
  return diff.length < full.length * 0.9;
}
