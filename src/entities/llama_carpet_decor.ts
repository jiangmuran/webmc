// Llama carpet decoration. Applies a colored carpet to the llama's back.

export type CarpetColor =
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

export function decorate(_current: CarpetColor | null, carpet: CarpetColor): CarpetColor {
  return carpet;
}

export function undress(): null {
  return null;
}

export function canDecorate(currentHealth: number): boolean {
  return currentHealth > 0;
}

// Decorated llama in a caravan inherits the leader's carpet style? No.
export function spreadsToCaravan(): boolean {
  return false;
}
