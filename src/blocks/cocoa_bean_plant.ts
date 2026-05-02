// Cocoa beans. Plant on jungle log side; 3 growth stages; drops 2-3
// beans when mature. Fortune increases yield.

export type CocoaStage = 0 | 1 | 2;

export interface Cocoa {
  stage: CocoaStage;
  attached: 'north' | 'south' | 'east' | 'west';
}

export function makeCocoa(attached: Cocoa['attached']): Cocoa {
  return { stage: 0, attached };
}

export interface TickQuery {
  rand: () => number;
  jungleLogAttached: boolean;
}

export function randomTick(c: Cocoa, q: TickQuery): 'grew' | 'stays' | 'fell_off' {
  if (!q.jungleLogAttached) return 'fell_off';
  if (c.stage >= 2) return 'stays';
  if (q.rand() < 0.2) {
    c.stage = (c.stage + 1) as CocoaStage;
    return 'grew';
  }
  return 'stays';
}

export function beansOnBreak(c: Cocoa, _fortuneLevel: number, _rand: () => number): number {
  // Wiki (minecraft.wiki/w/Cocoa_Beans): "Fully grown cocoa pods drop
  // 3 cocoa beans. Using a tool enchanted with Fortune does not
  // increase the amount of cocoa beans dropped."
  //
  // Old code rolled 2-3 base + Fortune bonus (capped at 6). Wiki:
  // mature = exactly 3, Fortune ineffective. Sibling cocoa_grow.ts
  // already corrected; this module now matches.
  if (c.stage < 2) return 1;
  return 3;
}

// Bone meal: advances one stage.
export function boneMeal(c: Cocoa): boolean {
  if (c.stage >= 2) return false;
  c.stage = (c.stage + 1) as CocoaStage;
  return true;
}
