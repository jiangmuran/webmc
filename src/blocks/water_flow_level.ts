export const MAX_FLOW_LEVEL = 7;
export const SOURCE_LEVEL = 0;

export interface WaterCell {
  level: number;
  isSource: boolean;
  falling: boolean;
}

export function neighborLevel(source: WaterCell, distance = 1): number {
  if (source.isSource) return 1;
  return source.level + distance;
}

export function shouldFlowTo(target: WaterCell | undefined, proposedLevel: number): boolean {
  if (proposedLevel > MAX_FLOW_LEVEL) return false;
  if (target === undefined) return true;
  return proposedLevel < target.level && !target.isSource;
}

export function fillableBySource(a: WaterCell, b: WaterCell): boolean {
  return a.isSource && b.isSource;
}

export function becomesSource(neighborSources: number, onSolid: boolean): boolean {
  return onSolid && neighborSources >= 2;
}
