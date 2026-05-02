export interface WardenAnger {
  targetId: string;
  level: number;
}

// Wiki (minecraft.wiki/w/Warden): anger ranges 0-150. Wiki-documented
// thresholds:
//   ≥ 35: "suspect" — warden becomes aware of the target.
//   ≥ 80: "target"  — warden actively pursues, uses sonic boom when
//                     unreachable.
//
// Old RANGED_THRESHOLD = 40 didn't match the wiki's 35 suspect
// threshold. Sibling warden_anger.ts already uses
// WARDEN_ANGER_SUSPECT = 35 and WARDEN_ANGER_TARGET = 80.
export const MAX_ANGER = 150;
export const DIG_THRESHOLD = 80;
export const RANGED_THRESHOLD = 35;
export const DECAY_PER_SECOND = 1;

export function addAnger(
  angers: readonly WardenAnger[],
  targetId: string,
  amount: number,
): readonly WardenAnger[] {
  const existing = angers.find((a) => a.targetId === targetId);
  if (existing === undefined) {
    return [...angers, { targetId, level: Math.min(MAX_ANGER, amount) }];
  }
  return angers.map((a) =>
    a.targetId === targetId ? { ...a, level: Math.min(MAX_ANGER, a.level + amount) } : a,
  );
}

export function tickDecay(angers: readonly WardenAnger[]): readonly WardenAnger[] {
  return angers
    .map((a) => ({ ...a, level: Math.max(0, a.level - DECAY_PER_SECOND) }))
    .filter((a) => a.level > 0);
}

export function primaryTarget(angers: readonly WardenAnger[]): string | undefined {
  let best: WardenAnger | undefined;
  for (const a of angers) {
    if (best === undefined || a.level > best.level) best = a;
  }
  return best?.targetId;
}

export function attackMode(level: number): 'melee' | 'ranged' | 'passive' {
  if (level >= DIG_THRESHOLD) return 'melee';
  if (level >= RANGED_THRESHOLD) return 'ranged';
  return 'passive';
}
