// Per-structure sub-seed derivation. A given world seed + "structure
// kind" + chunk coords should produce a deterministic sub-seed that
// different systems can use independently without desyncing. Pattern:
//   sub_seed = world_seed XOR hash(kind) XOR hash_chunk(cx, cz)

export interface SubSeedQuery {
  worldSeed: bigint;
  kind: string;
  cx: number;
  cz: number;
}

function hashString(s: string): bigint {
  let h = 0xcbf29ce484222325n;
  for (let i = 0; i < s.length; i++) {
    h ^= BigInt(s.charCodeAt(i));
    h = BigInt.asUintN(64, h * 0x100000001b3n);
  }
  return BigInt.asIntN(64, h);
}

function hashChunk(cx: number, cz: number): bigint {
  const a = BigInt(cx) * 0x4f9939f508n;
  const b = BigInt(cz) * 0x1ef1565bd5n;
  return BigInt.asIntN(64, a ^ b);
}

export function subSeed(q: SubSeedQuery): bigint {
  return BigInt.asIntN(64, q.worldSeed ^ hashString(q.kind) ^ hashChunk(q.cx, q.cz));
}

// Deterministic rng from a sub-seed (xorshift64).
export function makeSubRng(seed: bigint): () => number {
  let state = BigInt.asUintN(64, seed === 0n ? 1n : seed);
  return () => {
    state ^= BigInt.asUintN(64, state << 13n);
    state ^= state >> 7n;
    state ^= BigInt.asUintN(64, state << 17n);
    state = BigInt.asUintN(64, state);
    return Number(state & 0xffff_ffffn) / 0x1_0000_0000;
  };
}

// Structure placement: given world seed + chunk, does this kind anchor
// here? Evaluates sub-seeded rng against a probability.
export interface AnchorQuery {
  worldSeed: bigint;
  kind: string;
  cx: number;
  cz: number;
  probability: number;
}

export function anchorsAt(q: AnchorQuery): boolean {
  const rng = makeSubRng(subSeed(q));
  return rng() < q.probability;
}
