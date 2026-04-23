export interface PlayerInv {
  hotbar: (string | null)[];
  main: (string | null)[];
  armor: (string | null)[];
  offhand: string | null;
}

export function serialize(inv: PlayerInv): string {
  return JSON.stringify(inv);
}

export function deserialize(raw: string): PlayerInv | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return undefined;
    const obj = parsed as Record<string, unknown>;
    const h = obj['hotbar'];
    const m = obj['main'];
    const a = obj['armor'];
    if (!Array.isArray(h) || !Array.isArray(m) || !Array.isArray(a)) return undefined;
    return {
      hotbar: h as (string | null)[],
      main: m as (string | null)[],
      armor: a as (string | null)[],
      offhand: (obj['offhand'] as string | null | undefined) ?? null,
    };
  } catch {
    return undefined;
  }
}
