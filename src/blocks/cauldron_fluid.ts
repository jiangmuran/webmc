// Cauldron fluid. Water/lava/powder-snow/ with 3 levels. Rain fills.

export type CauldronContent = 'empty' | 'water' | 'lava' | 'powder_snow';

export interface Cauldron {
  content: CauldronContent;
  level: 0 | 1 | 2 | 3;
}

export function rainFills(c: Cauldron, raining: boolean): Cauldron {
  if (!raining || (c.content !== 'water' && c.content !== 'empty')) return c;
  if (c.level >= 3) return c;
  return {
    content: 'water',
    level: Math.min(3, c.level + 1) as Cauldron['level'],
  };
}

export function addWithBucket(
  c: Cauldron,
  bucket: 'water' | 'lava' | 'powder_snow',
): Cauldron | null {
  if (c.content !== 'empty') return null;
  return { content: bucket, level: 3 };
}

export function drawWithBottle(c: Cauldron): { bottle: 'water_bottle' | null; cauldron: Cauldron } {
  if (c.content !== 'water' || c.level === 0) return { bottle: null, cauldron: c };
  return {
    bottle: 'water_bottle',
    cauldron:
      c.level === 1
        ? { content: 'empty', level: 0 }
        : { content: 'water', level: (c.level - 1) as Cauldron['level'] },
  };
}

export function washWool(c: Cauldron, color: string): { clean: boolean; cauldron: Cauldron } {
  if (c.content !== 'water' || c.level === 0) return { clean: false, cauldron: c };
  void color;
  return {
    clean: true,
    cauldron:
      c.level === 1
        ? { content: 'empty', level: 0 }
        : { content: 'water', level: (c.level - 1) as Cauldron['level'] },
  };
}
