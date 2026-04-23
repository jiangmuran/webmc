export const MAX_FOOD = 20;
export const ICONS = 10;

export interface FoodBarState {
  food: number;
  saturation: number;
  hungerShake: boolean;
}

export function iconStates(s: FoodBarState): ('full' | 'half' | 'empty')[] {
  const icons: ('full' | 'half' | 'empty')[] = [];
  let remaining = Math.max(0, Math.min(MAX_FOOD, s.food));
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

export function shakeOnLowFood(food: number): boolean {
  return food <= 4;
}
