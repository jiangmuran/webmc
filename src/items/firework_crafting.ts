// Firework rocket crafting. Paper + 1-3 gunpowder + 0-7 firework
// stars. Gunpowder count sets flight duration (1..3). Stars add
// effects.

export interface FireworkIngredients {
  gunpowder: number;
  stars: FireworkStar[];
}

export interface FireworkStar {
  shape: 'small_ball' | 'large_ball' | 'star' | 'creeper' | 'burst';
  colors: string[];
  fadeColors: string[];
  trail: boolean;
  twinkle: boolean;
}

export interface FireworkRocket {
  flightDuration: 1 | 2 | 3;
  stars: FireworkStar[];
}

export function craftRocket(ing: FireworkIngredients): FireworkRocket | null {
  if (ing.gunpowder < 1 || ing.gunpowder > 3) return null;
  if (ing.stars.length > 7) return null;
  return {
    flightDuration: ing.gunpowder as 1 | 2 | 3,
    stars: ing.stars,
  };
}

export function flightTimeTicks(r: FireworkRocket): number {
  // MC: avg ~ 10 + duration * 10 + rand(0..6)
  return 10 + r.flightDuration * 10;
}

export function explosionDamage(r: FireworkRocket, distance: number): number {
  if (distance > 5) return 0;
  const base = 5 + r.stars.length * 2;
  return Math.floor(base * (1 - distance / 5));
}
