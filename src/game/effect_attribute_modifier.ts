// Status effects modify entity attributes (speed, strength, etc.)

export type Attribute =
  | 'max_health'
  | 'movement_speed'
  | 'attack_damage'
  | 'armor'
  | 'luck'
  | 'attack_speed';

export interface Modifier {
  id: string;
  attribute: Attribute;
  operation: 'add' | 'multiply_base' | 'multiply_total';
  amount: number;
}

// Well-known effect → modifier table.
const EFFECT_MODS: Record<string, (amp: number) => Modifier[]> = {
  speed: (a) => [
    {
      id: `speed_${a}`,
      attribute: 'movement_speed',
      operation: 'multiply_total',
      amount: 0.2 * (a + 1),
    },
  ],
  slowness: (a) => [
    {
      id: `slowness_${a}`,
      attribute: 'movement_speed',
      operation: 'multiply_total',
      amount: -0.15 * (a + 1),
    },
  ],
  strength: (a) => [
    { id: `strength_${a}`, attribute: 'attack_damage', operation: 'add', amount: 3 * (a + 1) },
  ],
  weakness: (a) => [
    { id: `weakness_${a}`, attribute: 'attack_damage', operation: 'add', amount: -4 * (a + 1) },
  ],
  luck: (a) => [{ id: `luck_${a}`, attribute: 'luck', operation: 'add', amount: a + 1 }],
  haste: (a) => [
    {
      id: `haste_${a}`,
      attribute: 'attack_speed',
      operation: 'multiply_total',
      amount: 0.1 * (a + 1),
    },
  ],
};

export function modifiersFor(effectId: string, amplifier: number): Modifier[] {
  return EFFECT_MODS[effectId]?.(amplifier) ?? [];
}

export function applyModifiers(base: number, mods: Modifier[]): number {
  let value = base;
  for (const m of mods.filter((m) => m.operation === 'add')) value += m.amount;
  for (const m of mods.filter((m) => m.operation === 'multiply_base')) value += base * m.amount;
  for (const m of mods.filter((m) => m.operation === 'multiply_total')) value *= 1 + m.amount;
  return value;
}
