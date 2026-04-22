// Random tick crops. Wheat, carrot, potato, beetroot. Grows by 1 age
// per tick with probability gated by light + hydration + neighbors.

export interface CropQuery {
  crop: 'wheat' | 'carrot' | 'potato' | 'beetroot' | 'melon_stem' | 'pumpkin_stem' | 'nether_wart';
  age: number;
  lightAbove: number;
  hydrated: boolean;
  inRowWithSameCrop: boolean;
  rand: () => number;
}

export function maxAge(crop: CropQuery['crop']): number {
  if (crop === 'beetroot') return 3;
  if (crop === 'nether_wart') return 3;
  return 7;
}

export function growthChance(q: CropQuery): number {
  if (q.crop === 'nether_wart') return 0.1; // nether wart ignores hydration/light
  if (q.lightAbove < 9) return 0;
  let base = q.hydrated ? 0.125 : 0.05;
  if (q.inRowWithSameCrop) base *= 2; // MC "row bonus"
  return base;
}

export function randomTick(q: CropQuery): 'grew' | 'stays' {
  if (q.age >= maxAge(q.crop)) return 'stays';
  const chance = growthChance(q);
  if (q.rand() < chance) return 'grew';
  return 'stays';
}

// Bone meal advance (beetroot random 0-1, wheat/carrot/potato 2-5).
export function boneMealSteps(crop: CropQuery['crop'], rand: () => number): number {
  if (crop === 'beetroot') return Math.floor(rand() * 2);
  if (crop === 'nether_wart') return 0; // nether wart ignores bone meal
  return 2 + Math.floor(rand() * 4);
}
