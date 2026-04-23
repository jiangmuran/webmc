export interface DecoratedPotSlot {
  face: 'north' | 'south' | 'east' | 'west';
  sherd?: string;
}

export function brokenPotDrops(slots: readonly DecoratedPotSlot[]): readonly string[] {
  const out: string[] = ['brick', 'brick', 'brick', 'brick'];
  for (const s of slots) {
    if (s.sherd !== undefined && s.sherd !== '') {
      const idx = out.indexOf('brick');
      if (idx >= 0) out[idx] = s.sherd;
    }
  }
  return out;
}
