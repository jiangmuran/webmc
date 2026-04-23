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
    if (!Array.isArray(obj.hotbar) || !Array.isArray(obj.main) || !Array.isArray(obj.armor)) {
      return undefined;
    }
    return {
      hotbar: obj.hotbar as (string | null)[],
      main: obj.main as (string | null)[],
      armor: obj.armor as (string | null)[],
      offhand: (obj.offhand as string | null | undefined) ?? null,
    };
  } catch {
    return undefined;
  }
}
