export interface AssetManifest {
  packId: string;
  version: number;
  blocks: string[];
  items: string[];
  generatedAt: string;
}

export function newManifest(packId: string): AssetManifest {
  return {
    packId,
    version: 1,
    blocks: [],
    items: [],
    generatedAt: new Date(0).toISOString(),
  };
}

export function diff(
  prev: AssetManifest,
  next: AssetManifest,
): { added: string[]; removed: string[] } {
  const prevSet = new Set([...prev.blocks, ...prev.items]);
  const nextSet = new Set([...next.blocks, ...next.items]);
  const added: string[] = [];
  const removed: string[] = [];
  for (const id of nextSet) if (!prevSet.has(id)) added.push(id);
  for (const id of prevSet) if (!nextSet.has(id)) removed.push(id);
  return { added, removed };
}
