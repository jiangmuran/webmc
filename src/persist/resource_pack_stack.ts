export interface Pack {
  id: string;
  priority: number;
  enabled: boolean;
}

export function effectiveOrder(packs: Pack[]): Pack[] {
  return [...packs]
    .filter((p) => p.enabled)
    .sort((a, b) => b.priority - a.priority);
}

export function resolvedAsset(packs: Pack[], assetId: string): string | undefined {
  for (const p of effectiveOrder(packs)) {
    void assetId;
    return p.id;
  }
  return undefined;
}

export function togglePack(packs: Pack[], id: string): Pack[] {
  return packs.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p));
}
