export interface Effect {
  id: string;
  level: number;
  durationTicks: number;
  beneficial: boolean;
}

export function drinkMilk(_current: readonly Effect[]): readonly Effect[] {
  return [];
}

export function drinkHoneyBottle(current: readonly Effect[]): readonly Effect[] {
  return current.filter((e) => e.id !== 'poison');
}
