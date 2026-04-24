export interface ResourcePackMeta {
  id: string;
  name: string;
  format: number;
  enabled: boolean;
  priority: number;
}

export function sortByPriority(packs: readonly ResourcePackMeta[]): readonly ResourcePackMeta[] {
  return [...packs].filter((p) => p.enabled).sort((a, b) => b.priority - a.priority);
}

export function overrideMap(packs: readonly ResourcePackMeta[]): Map<string, string> {
  const order = sortByPriority(packs);
  const map = new Map<string, string>();
  for (const p of order) {
    map.set(p.id, p.name);
  }
  return map;
}

export const VANILLA_DEFAULT_PACK: ResourcePackMeta = {
  id: 'vanilla',
  name: 'webmc default',
  format: 1,
  enabled: true,
  priority: 0,
};
