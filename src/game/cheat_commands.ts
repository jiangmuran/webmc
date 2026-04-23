// Cheat command parser. Accepts /gamemode, /time, /weather, /give.
// Requires cheats-enabled flag; rejects otherwise.

export type CheatCommand =
  | { kind: 'gamemode'; mode: 'survival' | 'creative' | 'adventure' | 'spectator' }
  | { kind: 'time'; value: 'day' | 'night' | number }
  | { kind: 'weather'; kind2: 'clear' | 'rain' | 'thunder' }
  | { kind: 'give'; item: string; count: number }
  | { kind: 'invalid'; reason: string };

export function parse(input: string): CheatCommand {
  const parts = input.trim().replace(/^\//, '').split(/\s+/);
  const cmd = parts[0];
  if (cmd === 'gamemode') {
    const m = parts[1];
    if (m === 'survival' || m === 'creative' || m === 'adventure' || m === 'spectator') {
      return { kind: 'gamemode', mode: m };
    }
    return { kind: 'invalid', reason: 'bad mode' };
  }
  if (cmd === 'time') {
    const v = parts[1];
    if (v === 'day' || v === 'night') return { kind: 'time', value: v };
    const n = Number(v);
    if (Number.isFinite(n)) return { kind: 'time', value: n };
    return { kind: 'invalid', reason: 'bad time' };
  }
  if (cmd === 'weather') {
    const w = parts[1];
    if (w === 'clear' || w === 'rain' || w === 'thunder') return { kind: 'weather', kind2: w };
    return { kind: 'invalid', reason: 'bad weather' };
  }
  if (cmd === 'give') {
    const item = parts[1];
    const c = Number(parts[2] ?? '1');
    if (!item) return { kind: 'invalid', reason: 'no item' };
    return { kind: 'give', item, count: Number.isFinite(c) ? c : 1 };
  }
  return { kind: 'invalid', reason: 'unknown command' };
}

export function canExecute(cheatsEnabled: boolean): boolean {
  return cheatsEnabled;
}
