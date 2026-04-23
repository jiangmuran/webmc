export function stringToSeed(s: string): number {
  const trimmed = s.trim();
  if (trimmed === '') return Date.now() & 0x7fffffff;
  const asInt = Number(trimmed);
  if (Number.isFinite(asInt) && Number.isInteger(asInt)) return asInt | 0;
  let h = 0;
  for (let i = 0; i < trimmed.length; i++) {
    h = (Math.imul(31, h) + trimmed.charCodeAt(i)) | 0;
  }
  return h;
}

export function levelsToLong(seed: number): { hi: number; lo: number } {
  return { hi: (seed >> 31) & 0xffffffff, lo: seed & 0xffffffff };
}
