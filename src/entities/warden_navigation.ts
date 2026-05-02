export interface Warden {
  x: number;
  y: number;
  z: number;
}

export interface Suspicion {
  x: number;
  y: number;
  z: number;
  anger: number;
}

// Wiki (minecraft.wiki/w/Warden) anger thresholds:
//   ≥ 35: "suspect" — warden becomes aware of the target.
//   ≥ 80: "target"  — warden actively pursues.
// Old INVESTIGATE_THRESHOLD = 40 was 5 points over the wiki suspect
// threshold. Siblings warden_anger.ts and warden_anger_decay.ts both
// already use 35 for the suspect tier; this module now agrees.
export const INVESTIGATE_THRESHOLD = 35;
export const ATTACK_THRESHOLD = 80;
export const EMERGES_RADIUS = 1.5;

export function phaseFor(s: Suspicion): 'calm' | 'investigate' | 'attack' {
  if (s.anger >= ATTACK_THRESHOLD) return 'attack';
  if (s.anger >= INVESTIGATE_THRESHOLD) return 'investigate';
  return 'calm';
}

export function moveStep(w: Warden, s: Suspicion, speed: number): Warden {
  const dx = s.x - w.x;
  const dz = s.z - w.z;
  const d = Math.hypot(dx, dz);
  if (d === 0) return w;
  const f = phaseFor(s);
  const v = f === 'attack' ? speed : f === 'investigate' ? speed * 0.5 : 0;
  return { x: w.x + (dx / d) * v, y: w.y, z: w.z + (dz / d) * v };
}
