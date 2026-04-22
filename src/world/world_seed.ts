// World seed parsing. MC accepts either a numeric string (interpreted
// as signed 64-bit) or an arbitrary string (hashed to 64 bits). "0" or
// empty is treated as random. Presenting the seed back for copy/paste
// uses the same signed-64-bit representation.

export interface ParsedSeed {
  asBigInt: bigint;
  originalInput: string;
  generatedRandomly: boolean;
}

// Deterministic string-to-seed hash (FNV-1a 64). Avoids native Math.random
// so that a given string always seeds the same world.
const FNV_PRIME = 1099511628211n;
const FNV_OFFSET = 14695981039346656037n;

export function stringToSeed(s: string): bigint {
  let hash = FNV_OFFSET;
  for (let i = 0; i < s.length; i++) {
    hash ^= BigInt(s.charCodeAt(i));
    hash = BigInt.asUintN(64, hash * FNV_PRIME);
  }
  return BigInt.asIntN(64, hash);
}

export interface ParseQuery {
  input: string;
  randomFallback: () => bigint;
}

export function parseSeed(q: ParseQuery): ParsedSeed {
  const trimmed = q.input.trim();
  if (trimmed === '' || trimmed === '0') {
    return {
      asBigInt: q.randomFallback(),
      originalInput: trimmed,
      generatedRandomly: true,
    };
  }
  // Numeric?
  if (/^-?\d+$/.test(trimmed)) {
    try {
      const n = BigInt.asIntN(64, BigInt(trimmed));
      return { asBigInt: n, originalInput: trimmed, generatedRandomly: false };
    } catch {
      // fall through to string hash
    }
  }
  return {
    asBigInt: stringToSeed(trimmed),
    originalInput: trimmed,
    generatedRandomly: false,
  };
}

export function formatSeed(seed: bigint): string {
  return seed.toString();
}

// Deterministic random from a seed — used for per-chunk RNG, feature
// placement, etc. Uses xorshift64.
export function makeRng(seed: bigint): () => number {
  let state = BigInt.asUintN(64, seed === 0n ? 1n : seed);
  return () => {
    state ^= BigInt.asUintN(64, state << 13n);
    state ^= state >> 7n;
    state ^= BigInt.asUintN(64, state << 17n);
    state = BigInt.asUintN(64, state);
    return Number(state & 0xffff_ffffn) / 0x1_0000_0000;
  };
}
