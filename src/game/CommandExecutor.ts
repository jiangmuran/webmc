import type { GameMode } from './GameMode';

export interface CommandContext {
  playerPos: { x: number; y: number; z: number };
  setPlayerPos: (x: number, y: number, z: number) => void;
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;
  setTimeOfDay: (ticks: number) => void;
  setWeather: (w: 'clear' | 'rain' | 'thunder') => void;
  giveItem: (name: string, count: number) => boolean;
  broadcast: (line: string, color?: string) => void;
  knownGameModes: readonly GameMode[];
  knownItems: readonly string[];
  heal?: () => void;
  kill?: () => void;
  clearInventory?: () => void;
}

export function executeCommand(raw: string, ctx: CommandContext): void {
  const command = raw.startsWith('/') ? raw.slice(1) : raw;
  const tokens = command.split(/\s+/).filter((t) => t.length > 0);
  const head = tokens[0]?.toLowerCase();
  const args = tokens.slice(1);
  if (head === undefined) {
    ctx.broadcast('empty command', '#ff8080');
    return;
  }
  if (head === 'help') {
    ctx.broadcast('/gamemode <survival|creative|adventure|spectator>', '#cccccc');
    ctx.broadcast('/tp <x> <y> <z>', '#cccccc');
    ctx.broadcast('/time set <day|night|noon|midnight|ticks>', '#cccccc');
    ctx.broadcast('/weather <clear|rain|thunder>', '#cccccc');
    ctx.broadcast('/give <item> [count]', '#cccccc');
    ctx.broadcast('/heal | /kill | /clear', '#cccccc');
    return;
  }
  if (head === 'heal') {
    ctx.heal?.();
    ctx.broadcast('Healed.', '#80ff80');
    return;
  }
  if (head === 'kill') {
    ctx.kill?.();
    ctx.broadcast('RIP.', '#ff4040');
    return;
  }
  if (head === 'clear') {
    ctx.clearInventory?.();
    ctx.broadcast('Inventory cleared.', '#80ff80');
    return;
  }
  if (head === 'gamemode' || head === 'gm') {
    const m = args[0]?.toLowerCase() as GameMode | undefined;
    if (m !== undefined && (ctx.knownGameModes as readonly string[]).includes(m)) {
      ctx.setGameMode(m);
      ctx.broadcast(`Gamemode set to ${m}`, '#80ff80');
    } else {
      ctx.broadcast(`Usage: /gamemode <${ctx.knownGameModes.join('|')}>`, '#ff8080');
    }
    return;
  }
  if (head === 'tp' || head === 'teleport') {
    if (args.length < 3) {
      ctx.broadcast('Usage: /tp <x> <y> <z>', '#ff8080');
      return;
    }
    const px = parseCoord(args[0] ?? '', ctx.playerPos.x);
    const py = parseCoord(args[1] ?? '', ctx.playerPos.y);
    const pz = parseCoord(args[2] ?? '', ctx.playerPos.z);
    if (Number.isFinite(px) && Number.isFinite(py) && Number.isFinite(pz)) {
      ctx.setPlayerPos(px, py, pz);
      ctx.broadcast(`Teleported to ${px.toFixed(1)} ${py.toFixed(1)} ${pz.toFixed(1)}`, '#80ff80');
    } else {
      ctx.broadcast('Invalid coordinates', '#ff8080');
    }
    return;
  }
  if (head === 'time') {
    if (args[0]?.toLowerCase() !== 'set') {
      ctx.broadcast('Usage: /time set <day|night|noon|midnight|ticks>', '#ff8080');
      return;
    }
    const v = args[1]?.toLowerCase() ?? '';
    const map: Record<string, number> = {
      day: 1000,
      noon: 6000,
      night: 13000,
      midnight: 18000,
      sunrise: 23000,
    };
    const preset = map[v];
    const n = preset !== undefined ? preset : Number(v);
    if (Number.isFinite(n)) {
      ctx.setTimeOfDay(n);
      ctx.broadcast(`Time set to ${n}`, '#80ff80');
    } else {
      ctx.broadcast('Invalid time value', '#ff8080');
    }
    return;
  }
  if (head === 'weather') {
    const w = args[0]?.toLowerCase();
    if (w === 'clear' || w === 'rain' || w === 'thunder') {
      ctx.setWeather(w);
      ctx.broadcast(`Weather set to ${w}`, '#80ff80');
    } else {
      ctx.broadcast('Usage: /weather <clear|rain|thunder>', '#ff8080');
    }
    return;
  }
  if (head === 'give') {
    const name = args[0];
    const count = args[1] !== undefined ? Math.max(1, Math.min(64, parseInt(args[1], 10))) : 1;
    if (name === undefined || Number.isNaN(count)) {
      ctx.broadcast('Usage: /give <item> [count]', '#ff8080');
      return;
    }
    const ok = ctx.giveItem(name, count);
    if (ok) ctx.broadcast(`Gave ${count} × ${name}`, '#80ff80');
    else ctx.broadcast(`Unknown item: ${name}`, '#ff8080');
    return;
  }
  ctx.broadcast(`Unknown command: ${head}`, '#ff8080');
}

function parseCoord(tok: string, rel: number): number {
  if (tok.startsWith('~')) {
    const offset = tok.length > 1 ? Number(tok.slice(1)) : 0;
    return Number.isFinite(offset) ? rel + offset : NaN;
  }
  return Number(tok);
}
