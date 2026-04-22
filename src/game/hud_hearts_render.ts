// Hearts HUD. 10 hearts per row (2 HP each). Absorption hearts yellow,
// poisoned green, wither dark, regenerating flash. Hunger shows
// saturation overlay.

export interface HeartRow {
  hp: number; // 0..20
  maxHp: number; // 20
  absorptionHp: number;
}

export type HeartKind = 'empty' | 'half' | 'full' | 'absorption_half' | 'absorption_full';

export function renderHearts(r: HeartRow): HeartKind[] {
  const out: HeartKind[] = [];
  const hpHearts = 10;
  for (let i = 0; i < hpHearts; i++) {
    const threshold = (i + 1) * 2;
    if (r.hp >= threshold) out.push('full');
    else if (r.hp >= threshold - 1) out.push('half');
    else out.push('empty');
  }
  // Absorption appended
  let abs = r.absorptionHp;
  while (abs > 0) {
    if (abs >= 2) {
      out.push('absorption_full');
      abs -= 2;
    } else {
      out.push('absorption_half');
      abs -= 1;
    }
  }
  return out;
}

// Hunger bar: 10 drumsticks, 2 hunger each.
export function renderHunger(hunger: number): ('empty' | 'half' | 'full')[] {
  const out: ('empty' | 'half' | 'full')[] = [];
  for (let i = 0; i < 10; i++) {
    const t = (i + 1) * 2;
    if (hunger >= t) out.push('full');
    else if (hunger >= t - 1) out.push('half');
    else out.push('empty');
  }
  return out;
}
