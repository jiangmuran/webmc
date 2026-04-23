export const MAX_ARMOR = 20;
export const ICONS = 10;

export function armorIcons(points: number): ('full' | 'half' | 'empty')[] {
  const clamped = Math.max(0, Math.min(MAX_ARMOR, Math.floor(points)));
  const icons: ('full' | 'half' | 'empty')[] = [];
  let remaining = clamped;
  for (let i = 0; i < ICONS; i++) {
    if (remaining >= 2) {
      icons.push('full');
      remaining -= 2;
    } else if (remaining === 1) {
      icons.push('half');
      remaining = 0;
    } else {
      icons.push('empty');
    }
  }
  return icons;
}

export function visible(points: number): boolean {
  return points > 0;
}
