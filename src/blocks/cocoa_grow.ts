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

export function drops(c: Cocoa, _fortuneLevel: number, _rand: () => number): number {
  // Wiki (minecraft.wiki/w/Cocoa_Beans): "Fully grown cocoa pods drop
  // 3 cocoa beans. Using a tool enchanted with Fortune does not
  // increase the amount of cocoa beans dropped."
  //
  // Old code rolled 2-3 base + a Fortune bonus (capped at 6) — TWO
  // bugs vs wiki: (1) immature drop 1 ✓ but mature should be exactly
  // 3, not 2-3; (2) Fortune was ignored per wiki, but code added a
  // 0..level bonus on top.
  if (c.age < MAX_AGE) return 1;
  return 3;
}

export function boneMealGrow(c: Cocoa): boolean {
  if (c.age >= MAX_AGE) return false;
  c.age += 1;
  return true;
}
