// Buttons. Wood: 30-tick pulse; stone: 20-tick pulse; polished
// blackstone 20-tick; lever toggles.

export type ButtonMaterial = 'wood' | 'stone' | 'polished_blackstone' | 'cherry' | 'bamboo';

const PULSE_TICKS: Record<ButtonMaterial, number> = {
  wood: 30,
  cherry: 30,
  bamboo: 30,
  stone: 20,
  polished_blackstone: 20,
};

export function pulseTicks(m: ButtonMaterial): number {
  return PULSE_TICKS[m];
}

export function onPress(m: ButtonMaterial): { powered: boolean; ticksRemaining: number } {
  return { powered: true, ticksRemaining: pulseTicks(m) };
}

export function tick(s: { powered: boolean; ticksRemaining: number }): {
  powered: boolean;
  ticksRemaining: number;
} {
  if (s.ticksRemaining <= 1) return { powered: false, ticksRemaining: 0 };
  return { powered: s.powered, ticksRemaining: s.ticksRemaining - 1 };
}

// Arrows can press wood buttons.
export function pressableByArrow(m: ButtonMaterial): boolean {
  return m === 'wood' || m === 'cherry' || m === 'bamboo';
}
