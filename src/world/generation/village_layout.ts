export type VillageBiome = 'plains' | 'savanna' | 'desert' | 'taiga' | 'snowy';

export interface VillagePart {
  type: 'house' | 'farm' | 'path' | 'well' | 'temple' | 'lamp' | 'gathering';
  biomeSuffix: VillageBiome;
}

export function biomeTheme(b: string): VillageBiome | undefined {
  const known: VillageBiome[] = ['plains', 'savanna', 'desert', 'taiga', 'snowy'];
  return known.find((v) => b === v || b === `${v}_plains`);
}

export function hasWell(parts: VillagePart[]): boolean {
  return parts.some((p) => p.type === 'well');
}

export function jobSites(parts: VillagePart[]): number {
  return parts.filter((p) => p.type === 'temple' || p.type === 'gathering').length;
}
