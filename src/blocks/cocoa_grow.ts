// Cocoa bean pods. Placed on jungle log sides. Age 0..2; at age 2,
// breaking drops 2-3 beans (+1 per fortune level, capped ~6).

export const MAX_AGE = 2;

export interface Cocoa {
  age: number;
  facing: 'north' | 'south' | 'east' | 'west';
}

export interface PlaceQuery {
  sideBlockId: string;
  sideIsLogSide: boolean;
}

const JUNGLE_LOGS = new Set<string>([
  'webmc:jungle_log',
  'webmc:stripped_jungle_log',
  'webmc:jungle_wood',
]);

export function canPlace(q: PlaceQuery): boolean {
  return q.sideIsLogSide && JUNGLE_LOGS.has(q.sideBlockId);
}

export function tryGrow(c: Cocoa, rand: () => number): boolean {
  if (c.age >= MAX_AGE) return false;
  if (rand() < 0.2) {
    c.age += 1;
    return true;
  }
  return false;
}

export function drops(c: Cocoa, fortuneLevel: number, rand: () => number): number {
  if (c.age < MAX_AGE) return 1;
  const base = 2 + Math.floor(rand() * 2); // 2..3
  // Wiki (minecraft.wiki/w/Cocoa_Beans#Drops): fortune adds a uniform
  // 0..level bonus, not a deterministic +level. Old formula always
  // added the full fortune level (Fortune III always +3) instead of
  // the wiki's 0..3 roll. Cap remains 6 to match wiki's maximum.
  const fortuneBonus = fortuneLevel > 0 ? Math.floor(rand() * (fortuneLevel + 1)) : 0;
  return Math.min(6, base + fortuneBonus);
}

export function boneMealGrow(c: Cocoa): boolean {
  if (c.age >= MAX_AGE) return false;
  c.age += 1;
  return true;
}
