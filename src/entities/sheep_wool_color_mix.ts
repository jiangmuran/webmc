export type Color =
  | 'white'
  | 'orange'
  | 'magenta'
  | 'light_blue'
  | 'yellow'
  | 'lime'
  | 'pink'
  | 'gray'
  | 'light_gray'
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'brown'
  | 'green'
  | 'red'
  | 'black';

const MIXES: Record<string, Color> = {
  'blue|yellow': 'green',
  'red|yellow': 'orange',
  'red|white': 'pink',
  'blue|red': 'purple',
  'blue|white': 'light_blue',
  'green|white': 'lime',
  'black|white': 'gray',
  'gray|white': 'light_gray',
};

function canonical(a: Color, b: Color): string {
  return [a, b].sort().join('|');
}

export function mixedOffspring(a: Color, b: Color): Color {
  if (a === b) return a;
  return MIXES[canonical(a, b)] ?? a;
}
