// Concrete powder → concrete when touching water on any side (not
// counting flowing water above). Otherwise behaves like sand (falls).

export type Side = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface PowderQuery {
  neighborWater: Record<Side, boolean>;
  powderColor: string;
}

export interface FormResult {
  converted: boolean;
  newBlockId: string;
}

export function tryFormConcrete(q: PowderQuery): FormResult {
  const anySide =
    q.neighborWater.north ||
    q.neighborWater.south ||
    q.neighborWater.east ||
    q.neighborWater.west ||
    q.neighborWater.down;
  if (!anySide) return { converted: false, newBlockId: `webmc:${q.powderColor}_concrete_powder` };
  return { converted: true, newBlockId: `webmc:${q.powderColor}_concrete` };
}

// Falling powder entity: if it lands next to water, convert in mid-landing.
export function landingConversion(landedNextToWater: boolean, color: string): string {
  return landedNextToWater ? `webmc:${color}_concrete` : `webmc:${color}_concrete_powder`;
}
