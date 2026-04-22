// World seed parsing. Accept integer string directly, or hash a
// string to a 64-bit seed (Java's String.hashCode → int32 → BigInt).

export function parseSeed(input: string): bigint {
  const trimmed = input.trim();
  if (trimmed.length === 0) return BigInt(Math.floor(Math.random() * 2 ** 31));
  if (/^-?\d+$/.test(trimmed)) {
    try {
      return BigInt(trimmed);
    } catch {
      // fall through
    }
  }
  return javaStringHash(trimmed);
}

// Equivalent to Java String.hashCode() returning int32, promoted to bigint.
export function javaStringHash(s: string): bigint {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return BigInt(h);
}

export interface DecoratedSeed {
  worldSeed: bigint;
  displaySeed: string;
}

export function decorateSeed(input: string): DecoratedSeed {
  const seed = parseSeed(input);
  return { worldSeed: seed, displaySeed: seed.toString() };
}
