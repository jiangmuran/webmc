// Number keys in inventory swap the hovered slot with the matching
// hotbar slot; F key moves into offhand.

export type HotkeyAction =
  | { kind: 'swap_hotbar'; hotbarIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 }
  | { kind: 'swap_offhand' }
  | { kind: 'drop_hovered'; wholeStack: boolean }
  | { kind: 'pickup_whole_stack' }
  | { kind: 'ignore' };

export function interpret(key: string, mods: { ctrl: boolean }): HotkeyAction {
  if (/^Digit[1-9]$/.test(key)) {
    const idx = (Number(key.slice(5)) - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    return { kind: 'swap_hotbar', hotbarIndex: idx };
  }
  if (key === 'KeyF') return { kind: 'swap_offhand' };
  if (key === 'KeyQ') return { kind: 'drop_hovered', wholeStack: mods.ctrl };
  if (key === 'KeyA' && mods.ctrl) return { kind: 'pickup_whole_stack' };
  return { kind: 'ignore' };
}
