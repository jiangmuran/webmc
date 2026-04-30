// Warden detection/scan. The warden has wide-range "vibration" sense
// and short-range sniff. Players increase anger with every sensed
// vibration; 80+ anger triggers ranged sonic attack.

export interface Anger {
  byEntity: Map<string, number>;
}

// Wiki (minecraft.wiki/w/Warden) anger thresholds:
//   ≥ 35: "suspect" — warden notices the target.
//   ≥ 80: "target"  — warden actively pursues, sonic boom available.
// Old MELEE_THRESHOLD = 40 was 5 over the wiki suspect threshold.
// Sibling warden modules (warden_anger.ts, warden_anger_decay.ts,
// warden_navigation.ts) all use 35; this module now agrees.
export const MAX_ANGER = 150;
export const SONIC_THRESHOLD = 80;
export const MELEE_THRESHOLD = 35;

export function bumpAnger(a: Anger, id: string, amount: number): number {
  const cur = a.byEntity.get(id) ?? 0;
  const next = Math.min(MAX_ANGER, cur + amount);
  a.byEntity.set(id, next);
  return next;
}

export function highestAngerTarget(a: Anger): { id: string; anger: number } | null {
  let best: { id: string; anger: number } | null = null;
  for (const [id, anger] of a.byEntity) {
    if (!best || anger > best.anger) best = { id, anger };
  }
  return best;
}

export type Attack = 'idle' | 'melee' | 'sonic';

export function currentAttack(a: Anger): { attack: Attack; targetId: string | null } {
  const top = highestAngerTarget(a);
  if (!top) return { attack: 'idle', targetId: null };
  if (top.anger >= SONIC_THRESHOLD) return { attack: 'sonic', targetId: top.id };
  if (top.anger >= MELEE_THRESHOLD) return { attack: 'melee', targetId: top.id };
  return { attack: 'idle', targetId: null };
}

// Per-second anger decay.
export const ANGER_DECAY_PER_SEC = 1;

export function decayAnger(a: Anger, seconds: number): void {
  for (const [id, v] of a.byEntity) {
    const dec = v - ANGER_DECAY_PER_SEC * seconds;
    if (dec <= 0) a.byEntity.delete(id);
    else a.byEntity.set(id, dec);
  }
}
