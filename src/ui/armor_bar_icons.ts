export const MAX_ARMOR = 20;
export const ICONS = 10;

// Reused result. SurvivalHud.render fires this every frame when
// armor is visible; tests + caller read the array synchronously and
// don't keep the reference.
const ARMOR_ICONS_SCRATCH: ('full' | 'half' | 'empty')[] = new Array<'full' | 'half' | 'empty'>(
  ICONS,
).fill('empty');

export function armorIcons(points: number): ('full' | 'half' | 'empty')[] {
  const clamped = Math.max(0, Math.min(MAX_ARMOR, Math.floor(points)));
  const icons = ARMOR_ICONS_SCRATCH;
  let remaining = clamped;
  for (let i = 0; i < ICONS; i++) {
    if (remaining >= 2) {
      icons[i] = 'full';
      remaining -= 2;
    } else if (remaining === 1) {
      icons[i] = 'half';
      remaining = 0;
    } else {
      icons[i] = 'empty';
    }
  }
  return icons;
}

export function visible(points: number): boolean {
  return points > 0;
}
