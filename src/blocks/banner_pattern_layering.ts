export interface BannerLayer {
  pattern: string;
  color: string;
}

export const MAX_LAYERS = 6;

export function applyPattern(
  existing: readonly BannerLayer[],
  pattern: string,
  color: string,
): readonly BannerLayer[] {
  if (existing.length >= MAX_LAYERS) return existing;
  return [...existing, { pattern, color }];
}

export function copyToBanner(
  source: readonly BannerLayer[],
  target: readonly BannerLayer[],
): readonly BannerLayer[] {
  if (target.length > 0) return target;
  return source;
}

export function hashLayers(layers: readonly BannerLayer[]): string {
  return layers.map((l) => `${l.color}:${l.pattern}`).join(',');
}

export function isOminousBannerPattern(layers: readonly BannerLayer[]): boolean {
  return layers.length >= 6 && layers[0]?.pattern === 'rhombus_middle';
}
