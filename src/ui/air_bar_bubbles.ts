export const MAX_AIR_TICKS = 300;
export const BUBBLES = 10;

export function bubbleIcons(airTicks: number): ('full' | 'empty' | 'pop')[] {
  const icons: ('full' | 'empty' | 'pop')[] = [];
  const frac = Math.max(0, Math.min(1, airTicks / MAX_AIR_TICKS));
  const full = Math.ceil(frac * BUBBLES);
  for (let i = 0; i < BUBBLES; i++) {
    icons.push(i < full ? 'full' : 'empty');
  }
  if (airTicks <= 0 && icons.length > 0) {
    icons[icons.length - 1] = 'pop';
  }
  return icons;
}

export function visible(airTicks: number, isSubmerged: boolean): boolean {
  return isSubmerged || airTicks < MAX_AIR_TICKS;
}
