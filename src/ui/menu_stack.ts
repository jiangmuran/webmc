// UI menu stack. Push/pop screens; ESC pops. Pause-capable screens
// freeze world while open.

export interface MenuScreen {
  id: string;
  pausesWorld: boolean;
}

export interface MenuStack {
  screens: MenuScreen[];
}

export function makeStack(): MenuStack {
  return { screens: [] };
}

export function push(s: MenuStack, screen: MenuScreen): void {
  s.screens.push(screen);
}

export function pop(s: MenuStack): MenuScreen | null {
  return s.screens.pop() ?? null;
}

export function top(s: MenuStack): MenuScreen | null {
  return s.screens[s.screens.length - 1] ?? null;
}

export function pausesWorld(s: MenuStack): boolean {
  return s.screens.some((m) => m.pausesWorld);
}

export function clear(s: MenuStack): void {
  s.screens.length = 0;
}

export function depth(s: MenuStack): number {
  return s.screens.length;
}
