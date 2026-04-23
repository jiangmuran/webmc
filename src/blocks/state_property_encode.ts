// Block state property encode/decode. Packs arbitrary property
// dictionaries into a compact integer index per block family.

export interface PropertyDef {
  name: string;
  values: string[];
}

export interface BlockFamily {
  id: string;
  properties: PropertyDef[];
}

export function encodeIndex(fam: BlockFamily, props: Record<string, string>): number {
  let idx = 0;
  let mul = 1;
  for (const p of fam.properties) {
    const v = props[p.name];
    const pos = v === undefined ? 0 : Math.max(0, p.values.indexOf(v));
    idx += pos * mul;
    mul *= p.values.length;
  }
  return idx;
}

export function decodeIndex(fam: BlockFamily, idx: number): Record<string, string> {
  const out: Record<string, string> = {};
  let v = idx;
  for (const p of fam.properties) {
    const count = p.values.length;
    const pos = v % count;
    v = Math.floor(v / count);
    out[p.name] = p.values[pos] ?? p.values[0] ?? '';
  }
  return out;
}

export function totalStates(fam: BlockFamily): number {
  return fam.properties.reduce((s, p) => s * p.values.length, 1);
}
